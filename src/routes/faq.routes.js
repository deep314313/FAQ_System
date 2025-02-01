const express = require('express');
const { body } = require('express-validator');
const faqController = require('../controllers/faq.controller');
const { validateRequest } = require('../middleware/validator');

const router = express.Router();

// Validation middleware
const faqValidation = [
    body('question').trim().notEmpty().withMessage('Question is required'),
    body('answer').trim().notEmpty().withMessage('Answer is required'),
    validateRequest
];

// Routes
router.post('/', faqValidation, faqController.create);
router.get('/', faqController.getAll);
router.put('/:id', faqValidation, faqController.update);
router.delete('/:id', faqController.delete);

module.exports = router;
