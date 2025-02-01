const FAQ = require('../models/faq.model');
const { translateContent } = require('../services/translation.service');

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'hi', 'bn'];

// Create a new FAQ
exports.create = async (req, res) => {
    try {
        const { question, answer } = req.body;

        if (!question || !answer) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Question and answer are required'
            });
        }

        // Create FAQ with English content first
        const faq = new FAQ({
            translations: {
                en: { question, answer }
            }
        });

        // Translate to Hindi and Bengali
        try {
            // Hindi translation
            const [hiQuestion, hiAnswer] = await Promise.all([
                translateContent(question, 'Hindi'),
                translateContent(answer, 'Hindi')
            ]);
            
            if (hiQuestion && hiAnswer) {
                faq.translations.hi = { question: hiQuestion, answer: hiAnswer };
            }

            // Bengali translation
            const [bnQuestion, bnAnswer] = await Promise.all([
                translateContent(question, 'Bengali'),
                translateContent(answer, 'Bengali')
            ]);
            
            if (bnQuestion && bnAnswer) {
                faq.translations.bn = { question: bnQuestion, answer: bnAnswer };
            }
        } catch (error) {
            console.error('Translation error:', error);
            // Continue with saving English version
        }

        const savedFaq = await faq.save();
        res.status(201).json(savedFaq);
    } catch (error) {
        console.error('Error creating FAQ:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
};

// Get all FAQs
exports.getAll = async (req, res) => {
    try {
        const lang = req.query.lang || 'en';
        const faqs = await FAQ.find({ isActive: true });
        
        // Format FAQs for the requested language
        const formattedFaqs = faqs.map(faq => {
            const translation = faq.translations[lang] || faq.translations.en;
            return {
                id: faq._id,
                question: translation ? translation.question : '',
                answer: translation ? translation.answer : '',
                createdAt: faq.createdAt
            };
        });

        res.json(formattedFaqs);
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
};

// Update FAQ
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer } = req.body;
        
        if (!question || !answer) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Question and answer are required'
            });
        }

        const faq = await FAQ.findById(id);
        if (!faq) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'FAQ not found'
            });
        }

        // Update English content
        faq.translations = {
            ...faq.translations,
            en: { question, answer }
        };

        // Update translations
        try {
            // Hindi translation
            const [hiQuestion, hiAnswer] = await Promise.all([
                translateContent(question, 'Hindi'),
                translateContent(answer, 'Hindi')
            ]);
            
            if (hiQuestion && hiAnswer) {
                faq.translations.hi = { question: hiQuestion, answer: hiAnswer };
            }

            // Bengali translation
            const [bnQuestion, bnAnswer] = await Promise.all([
                translateContent(question, 'Bengali'),
                translateContent(answer, 'Bengali')
            ]);
            
            if (bnQuestion && bnAnswer) {
                faq.translations.bn = { question: bnQuestion, answer: bnAnswer };
            }
        } catch (error) {
            console.error('Translation error:', error);
            // Continue with saving English version
        }

        const updatedFaq = await faq.save();
        res.json(updatedFaq);
    } catch (error) {
        console.error('Error updating FAQ:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
};

// Delete FAQ
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        
        const faq = await FAQ.findById(id);
        if (!faq) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'FAQ not found'
            });
        }
        
        faq.isActive = false;
        await faq.save();
        
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
};

module.exports = {
    create: exports.create,
    getAll: exports.getAll,
    update: exports.update,
    delete: exports.delete
};
