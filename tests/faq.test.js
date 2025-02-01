const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const FAQ = require('../src/models/faq.model');

chai.use(chaiHttp);
const expect = chai.expect;

describe('FAQ API', () => {
    beforeEach(async () => {
        await FAQ.deleteMany({});
    });

    describe('POST /api/faqs', () => {
        it('should create a new FAQ', async () => {
            const faq = {
                question: 'Test Question?',
                answer: 'Test Answer'
            };

            const res = await chai
                .request(app)
                .post('/api/faqs')
                .send(faq);

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('question', faq.question);
            expect(res.body).to.have.property('answer', faq.answer);
        });
    });

    describe('GET /api/faqs', () => {
        it('should get all FAQs in English', async () => {
            const res = await chai
                .request(app)
                .get('/api/faqs');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
        });

        it('should get all FAQs in Hindi', async () => {
            const res = await chai
                .request(app)
                .get('/api/faqs?lang=hi');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
        });
    });
});
