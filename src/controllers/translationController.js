import * as translationService from '../services/translationService.js';

export async function getOverview(req, res) {
  try {
    const pairs = translationService.getSupportedPairs();
    res.json({
      service: 'Trilingual Translation Service (Arabic, Amharic, English)',
      version: '1.0.0',
      description: 'Production translation engine supporting Arabic (العربية), Amharic (አማርኛ), and English with automatic language detection, high-accuracy lexical lookup, and contextual AI neural translation.',
      supportedLanguages: ['ar', 'am', 'en'],
      languagePairs: pairs,
      endpoints: {
        translate: 'POST /translation/translate (or /dictionary/translate)',
        detect: 'POST /translation/detect (or /dictionary/detect)',
        pairs: 'GET /translation/pairs'
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve translation overview', message: err.message });
  }
}

export async function translate(req, res) {
  try {
    const { text, sourceLang, targetLang, mode } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing text parameter',
        message: 'Request body must include a non-empty "text" string to translate.'
      });
    }

    const result = await translationService.translateText({
      text,
      sourceLang,
      targetLang,
      mode
    });

    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Translation error', message: err.message });
  }
}

export async function detect(req, res) {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing text parameter',
        message: 'Request body must include a "text" string for language detection.'
      });
    }

    const result = translationService.detectLanguage(text);
    res.json({
      success: true,
      detection: result,
      ...result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Detection error', message: err.message });
  }
}

export async function getPairs(req, res) {
  try {
    const pairs = translationService.getSupportedPairs();
    res.json({
      success: true,
      supported_languages: ['ar', 'am', 'en'],
      pairs,
      total: pairs.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch translation pairs', message: err.message });
  }
}
