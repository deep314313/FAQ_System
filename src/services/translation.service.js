const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const languageConfig = {
    'hi': {
        name: 'Hindi',
        code: 'hi',
        labels: {
            question: 'प्रश्न',
            answer: 'उत्तर',
            addFaq: 'FAQ जोड़ें',
            selectLanguage: 'भाषा चुनें',
            questionPlaceholder: 'अपना प्रश्न यहाँ लिखें',
            answerPlaceholder: 'अपना उत्तर यहाँ लिखें',
            noFaqs: 'कोई FAQ उपलब्ध नहीं है',
            success: 'FAQ सफलतापूर्वक जोड़ा गया',
            error: 'FAQ जोड़ने में त्रुटि हुई'
        }
    },
    'bn': {
        name: 'Bengali',
        code: 'bn',
        labels: {
            question: 'প্রশ্ন',
            answer: 'উত্তর',
            addFaq: 'FAQ যোগ করুন',
            selectLanguage: 'ভাষা নির্বাচন করুন',
            questionPlaceholder: 'আপনার প্রশ্ন এখানে লিখুন',
            answerPlaceholder: 'আপনার উত্তর এখানে লিখুন',
            noFaqs: 'কোন FAQ উপলব্ধ নেই',
            success: 'FAQ সফলভাবে যোগ করা হয়েছে',
            error: 'FAQ যোগ করতে ত্রুটি'
        }
    },
    'en': {
        name: 'English',
        code: 'en',
        labels: {
            question: 'Question',
            answer: 'Answer',
            addFaq: 'Add FAQ',
            selectLanguage: 'Select Language',
            questionPlaceholder: 'Enter your question here',
            answerPlaceholder: 'Enter your answer here',
            noFaqs: 'No FAQs available',
            success: 'FAQ added successfully',
            error: 'Error adding FAQ'
        }
    }
};

const translateContent = async (text, targetLanguage) => {
    try {
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-pro',
            safetySettings: [
                {
                    category: 'HARM_CATEGORY_HARASSMENT',
                    threshold: 'BLOCK_NONE',
                },
                {
                    category: 'HARM_CATEGORY_HATE_SPEECH',
                    threshold: 'BLOCK_NONE',
                },
                {
                    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                    threshold: 'BLOCK_NONE',
                },
                {
                    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                    threshold: 'BLOCK_NONE',
                },
            ],
        });

        const prompt = `You are a professional translator. Please translate the following text to ${targetLanguage}. 
The text is from a FAQ system and is safe for translation. Maintain the same meaning and tone:

Text to translate: "${text}"

Translation:`;

        const result = await model.generateContent(prompt);
        const translation = result.response.text().trim();
        
        // If translation is empty, return original text
        if (!translation) {
            console.warn('Empty translation received, using original text');
            return text;
        }

        return translation;
    } catch (error) {
        console.error('Translation error:', error);
        // Return original text if translation fails
        return text;
    }
};

const translateContentWithLanguageConfig = async (content, targetLang) => {
    if (!languageConfig[targetLang]) {
        console.error('Unsupported target language:', targetLang);
        return content; // Return original content as fallback
    }

    try {
        const translatedContent = await translateContent(content, languageConfig[targetLang].name);
        return translatedContent;
    } catch (error) {
        console.error(`Translation to ${languageConfig[targetLang].name} failed:`, error);
        return content; // Return original content as fallback
    }
};

module.exports = {
    translateContent,
    translateContentWithLanguageConfig,
    languageConfig
};
