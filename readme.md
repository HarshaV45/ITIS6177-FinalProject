# Translator API

This is a RESTful API for text translation, transliteration, language detection, sentence breaking, and dictionary lookup. The API interacts with a third-party translation service, and it is built using Node.js, Express, and Axios.

---

## Table of Contents

1. [Getting Started](#getting-started)  
2. [Environment Variables](#environment-variables)  
3. [API Endpoints](#api-endpoints)  
    - [GET /languages](#get-languages)
    - [POST /translate](#post-translate)
    - [POST /transliterate](#post-transliterate)
    - [POST /detect](#post-detect)
    - [POST /breaksentence](#post-breaksentence)
    - [POST /dictionarylookup](#post-dictionarylookup)
4. [Error Handling](#error-handling)  
5. [Example Requests](#example-requests)  

---

## Getting Started

### Prerequisites

- Node.js (v16 or later)  
- npm or yarn  
- A valid subscription to a translation service API (e.g., Microsoft Translator Text API)  

### Installation

1. Clone the repository:  
   ```bash
   git clone https://github.com/HarshaV45/ITIS6177-FinalProject.git
   cd ITIS6177-FinalProject
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Configure environment variables (see [Environment Variables](#environment-variables)).

4. Start the server:  
   ```bash
   npm start
   ```

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

| Variable           | Description                              |
|--------------------|------------------------------------------|
| `PORT`             | Port for the server to run (default: 3000) |
| `TRANSLATOR_KEY`   | API subscription key                    |
| `TRANSLATOR_ENDPOINT` | Base endpoint for the translation API |
| `TRANSLATOR_LOCATION` | Region for the translation API         |

---

## API Endpoints

### **GET /languages**

Retrieves a list of supported languages for translation.

**Response**  
- **200 OK**: A JSON object mapping language codes to language names.  
- **500 Internal Server Error**: If the request to the translation service fails.

**Example Response**  
```json
{
  "en": "English",
  "es": "Spanish",
  "fr": "French"
}
```

---

### **POST /translate**

Translates text into the specified target language.

**Request Body**  
```json
{
  "text": "Hello, world!",
  "targetLanguage": "es",
  "sourceLanguage": "en"
}
```

**Response**  
- **200 OK**: A JSON object containing the translated text.  
- **400 Bad Request**: If validation fails for input fields.  
- **500 Internal Server Error**: If the translation request fails.

**Example Response**  
```json
{
  "translatedText": "Hola, mundo!"
}
```

---

### **POST /transliterate**

Transliterates text from one script to another.

**Request Body**  
```json
{
  "text": "こんにちは",
  "language": "ja",
  "fromScript": "jpan",
  "toScript": "latn"
}
```

**Response**  
- **200 OK**: A JSON object containing the transliterated text.  
- **400 Bad Request**: If validation fails.  
- **500 Internal Server Error**: If the transliteration request fails.

**Example Response**  
```json
{
  "transliteratedText": "Konnichiwa"
}
```

---

### **POST /detect**

Detects the language of a given text.

**Request Body**  
```json
{
  "text": "Bonjour le monde"
}
```

**Response**  
- **200 OK**: A JSON object containing the detected language code.  
- **400 Bad Request**: If validation fails.  
- **500 Internal Server Error**: If the detection request fails.

**Example Response**  
```json
{
  "detectedLanguage": "fr"
}
```

---

### **POST /breaksentence**

Breaks a text into sentences.

**Request Body**  
```json
{
  "text": "This is sentence one. This is sentence two.",
  "language": "en"
}
```

**Response**  
- **200 OK**: A JSON object containing the lengths of each sentence.  
- **400 Bad Request**: If validation fails.  
- **500 Internal Server Error**: If the request fails.

**Example Response**  
```json
{
  "sentences": [20, 20]
}
```

---

### **POST /dictionarylookup**

Looks up dictionary entries for a word.

**Request Body**  
```json
{
  "text": "hello",
  "language": "en"
}
```

**Response**  
- **200 OK**: A JSON object containing dictionary translations.  
- **400 Bad Request**: If validation fails.  
- **500 Internal Server Error**: If the request fails.

**Example Response**  
```json
{
  "dictionaryEntries": [
    {
      "normalizedTarget": "hola",
      "displayTarget": "hola",
      "posTag": "noun"
    }
  ]
}
```

---

## Error Handling

The API returns structured error responses for all endpoints.

**Error Response Format**  
```json
{
  "error": "Description of the error"
}
```

- **400 Bad Request**: Input validation errors.  
- **500 Internal Server Error**: API errors or unexpected failures.  

---

## Example Requests

### Using cURL

#### Translate Text  
```bash
curl -X POST http://localhost:3000/translate \
-H "Content-Type: application/json" \
-d '{
  "text": "Hello",
  "targetLanguage": "es",
  "sourceLanguage": "en"
}'
```

#### Detect Language  
```bash
curl -X POST http://localhost:3000/detect \
-H "Content-Type: application/json" \
-d '{
  "text": "Hola"
}'
```

---

## Notes

- Ensure your `.env` file is properly configured with valid credentials.  
- Input text is sanitized to remove HTML tags and trim whitespace.  

---