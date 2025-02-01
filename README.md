# Multilingual FAQ Management System

A comprehensive FAQ management system that automatically handles translations between English, Hindi, and Bengali. The system allows content creators to write FAQs in English and automatically generates high-quality translations in Hindi and Bengali using Google's Gemini AI technology.

## Project Overview

This FAQ management system is designed to serve multilingual audiences efficiently. When a content creator adds a new FAQ in English, the system automatically generates translations in Hindi and Bengali, ensuring consistent information across all supported languages.

### Key Features

#### 1. Multilingual Support
- Primary content creation in English
- Automatic translation to Hindi and Bengali
- Language-specific content delivery
- Seamless language switching in the UI

#### 2. Smart Translation System
- Powered by Google's Gemini AI
- Context-aware translations
- Maintains formatting and structure
- Fallback to English when translations are unavailable

#### 3. User Interface
- Clean and intuitive design
- Language selection dropdown
- Real-time content updates
- Responsive layout for all devices

#### 4. Content Management
- Create, read, update, and delete FAQs
- Bulk content operations
- Active/Inactive status management
- Automatic timestamp tracking

#### 5. API Integration
- RESTful API architecture
- Secure endpoint implementation
- Comprehensive error handling
- Rate limiting and request validation

## Technical Architecture

### Backend Components
1. **Express.js Server**
   - RESTful API endpoints
   - Middleware for authentication and validation
   - Error handling and logging

2. **MongoDB Database**
   - Efficient document storage
   - Language-specific content mapping
   - Indexing for quick retrieval

3. **Translation Service**
   - Integration with Gemini AI
   - Queue management for translations
   - Error recovery mechanisms

### Frontend Components
1. **HTML/CSS/JavaScript**
   - Dynamic content loading
   - Language switching functionality
   - Form validation and submission
   - Error handling and user feedback

## API Documentation

### FAQ Endpoints

#### Create FAQ
```http
POST /api/faqs
Content-Type: application/json

{
    "question": "What is your return policy?",
    "answer": "Our return policy allows returns within 30 days of purchase."
}
```

#### Get FAQs
```http
GET /api/faqs?lang=en
GET /api/faqs?lang=hi
GET /api/faqs?lang=bn
```

#### Update FAQ
```http
PUT /api/faqs/:id
Content-Type: application/json

{
    "question": "Updated question",
    "answer": "Updated answer"
}
```

#### Delete FAQ
```http
DELETE /api/faqs/:id
```

### Response Format
```json
{
    "id": "12345",
    "question": "What is your return policy?",
    "answer": "Our return policy allows returns within 30 days of purchase.",
    "createdAt": "2024-02-01T10:00:00.000Z",
    "updatedAt": "2024-02-01T10:00:00.000Z"
}
```

## Project Structure

```
src/
├── controllers/        # Request handlers
├── models/            # Database models
├── services/          # Business logic
├── routes/            # API routes
├── middleware/        # Custom middleware
└── config/           # Configuration files

public/
├── index.html        # Main HTML file
├── css/             # Stylesheets
└── js/              # Frontend JavaScript

```

## Error Handling

The system implements comprehensive error handling:

1. **Validation Errors**
   - Missing required fields
   - Invalid input formats
   - Language code validation

2. **Translation Errors**
   - API failures
   - Timeout handling
   - Fallback mechanisms

3. **Database Errors**
   - Connection issues
   - Query failures
   - Duplicate entries

## Security Measures

1. **Input Validation**
   - Request payload validation
   - Query parameter sanitization
   - Content type verification

2. **Headers Security**
   - CORS configuration
   - Content Security Policy
   - XSS protection

3. **Rate Limiting**
   - Request rate monitoring
   - IP-based restrictions
   - Burst handling

## License

This project is licensed under the MIT License - see the LICENSE file for details.
