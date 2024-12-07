require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());

// Environment Variables
const apiKey = process.env.TRANSLATOR_KEY;
const apiEndpoint = process.env.TRANSLATOR_ENDPOINT;
const apiRegion = process.env.TRANSLATOR_LOCATION;

// Utility function for sanitizing input to remove HTML tags and trim whitespace
const sanitizeInput = (input) => input.trim().replace(/<[^>]*>/g, '');

// Constructs headers for API requests
const apiHeaders = () => ({
    'Ocp-Apim-Subscription-Key': apiKey,
    'Ocp-Apim-Subscription-Region': apiRegion,
    'Content-type': 'application/json'
});

// GET /languages - Retrieves supported languages
app.get('/languages', async (req, res) => {
    const apiRoute = '/languages?api-version=3.0';
    const apiUrl = apiEndpoint + apiRoute;

    try {
        // Fetch supported languages from API
        const response = await axios.get(apiUrl, { headers: apiHeaders() });
        const supportedLanguages = response.data.translation;

        // Map language codes to their names
        Object.keys(supportedLanguages).forEach(key => {
            supportedLanguages[key] = supportedLanguages[key].name;
        });

        res.json(supportedLanguages);
    } catch (error) {
        console.error('Languages Retrieval Error:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data.error.message || error.message });
    }
});

// POST /translate - Translates text
app.post('/translate', [
    body('text').isString().withMessage('Text must be a string').notEmpty().withMessage('Text is required'),
    body('targetLanguage').isAlpha().withMessage('Target language must be a valid language code')
        .isLength({ min: 2, max: 5 }).withMessage('Target language code length is invalid'),
    body('sourceLanguage').optional().isAlpha().withMessage('Source language must be a valid language code')
        .isLength({ min: 2, max: 5 }).withMessage('Source language code length is invalid')
], async (req, res) => {
    // Validate request body
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
    }

    // Extract and sanitize input fields
    const { text, targetLanguage, sourceLanguage = 'en' } = req.body;
    const sanitizedText = sanitizeInput(text);
    const sanitizedSourceLang = sanitizeInput(sourceLanguage);
    const sanitizedTargetLang = sanitizeInput(targetLanguage);

    // Construct API endpoint URL
    const apiRoute = `/translate?api-version=3.0&from=${sanitizedSourceLang}&to=${sanitizedTargetLang}`;
    const apiUrl = apiEndpoint + apiRoute;

    try {
        // Make API request to perform translation
        const response = await axios.post(apiUrl, [{ text: sanitizedText }], { headers: apiHeaders() });
        const translatedText = response.data[0].translations[0].text;
        res.json({ translatedText });
    } catch (error) {
        console.error('Translation Error:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data.error.message || error.message });
    }
});

// POST /transliterate - Transliterate text
app.post('/transliterate', [
    body('text').isString().withMessage('Text must be a string').notEmpty().withMessage('Text is required'),
    body('language').isAlpha().withMessage('Language code must be valid').isLength({ min: 2, max: 5 }).withMessage('Language code length is invalid'),
    body('fromScript').isString().withMessage('Source script is required'),
    body('toScript').isString().withMessage('Target script is required')
], async (req, res) => {
    // Validate request body
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
    }

    const { text, language, fromScript, toScript } = req.body;
    const apiRoute = `/transliterate?api-version=3.0&language=${language}&fromScript=${fromScript}&toScript=${toScript}`;
    const apiUrl = apiEndpoint + apiRoute;

    try {
        // Make API request for transliteration
        const response = await axios.post(apiUrl, [{ text }], { headers: apiHeaders() });
        const transliteratedText = response.data[0].text;
        res.json({ transliteratedText });
    } catch (error) {
        console.error('Transliteration Error:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data.error.message || error.message });
    }
});

// POST /detect - Detects language
app.post('/detect', body('text').isString().withMessage('Text must be a string').notEmpty().withMessage('Text is required'), async (req, res) => {
    // Validate request body
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
    }

    // Sanitize input text
    const sanitizedText = sanitizeInput(req.body.text);
    const apiRoute = '/detect?api-version=3.0';
    const apiUrl = apiEndpoint + apiRoute;

    try {
        // Make API request to detect language
        const response = await axios.post(apiUrl, [{ text: sanitizedText }], { headers: apiHeaders() });
        const detectedLanguage = response.data[0].language;
        res.json({ detectedLanguage });
    } catch (error) {
        console.error('Detection Error:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data.error.message || error.message });
    }
});

// POST /breaksentence - Breaks text into sentences
app.post('/breaksentence', [
    body('text').isString().withMessage('Text must be a string').notEmpty().withMessage('Text is required'),
    body('language').isAlpha().withMessage('Language code must be valid').isLength({ min: 2, max: 5 }).withMessage('Language code length is invalid')
], async (req, res) => {
    // Validate request body
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
    }

    const { text, language } = req.body;
    const apiRoute = `/breaksentence?api-version=3.0`;
    const apiUrl = apiEndpoint + apiRoute;

    try {
        // Make API request to break text into sentences
        const response = await axios.post(apiUrl, [{ text }], { headers: apiHeaders() });
        const sentences = response.data[0].sentLen;
        res.json({ sentences });
    } catch (error) {
        console.error('Sentence Breaking Error:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data.error.message || error.message });
    }
});

// POST /dictionarylookup - Looks up dictionary entries
app.post('/dictionarylookup', [
    body('text').isString().withMessage('Text must be a string').notEmpty().withMessage('Text is required'),
    body('language').isAlpha().withMessage('Language code must be valid').isLength({ min: 2, max: 5 }).withMessage('Language code length is invalid')
], async (req, res) => {
    // Validate request body
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
    }

    const { text, language } = req.body;
    const fallbackLanguage = language === 'en' ? 'es' : language;
    const apiRoute = `/dictionary/lookup?api-version=3.0&from=${language}&to=${fallbackLanguage}`;
    const apiUrl = apiEndpoint + apiRoute;

    try {
        // Make API request to look up dictionary entries
        const response = await axios.post(apiUrl, [{ text }], { headers: apiHeaders() });
        const dictionaryEntries = response.data[0].translations;
        res.json({ dictionaryEntries });
    } catch (error) {
        console.error('Dictionary Lookup Error:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data.error.message || error.message });
    }
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({ error: 'Invalid route, Please use endpoints like (/languages), (/translate) ..' });
});

// Start server
const serverPort = process.env.PORT || 3000;
app.listen(serverPort, () => console.log(`Server running on port ${serverPort}`));
