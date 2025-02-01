const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, { _id: false });

const faqSchema = new mongoose.Schema({
    translations: {
        en: {
            type: translationSchema,
            required: true
        },
        hi: {
            type: translationSchema,
            required: false
        },
        bn: {
            type: translationSchema,
            required: false
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Method to get translated content
faqSchema.methods.getTranslation = function(lang = 'en') {
    return this.translations[lang] || this.translations.en;
};

const FAQ = mongoose.model('FAQ', faqSchema);

module.exports = FAQ;
