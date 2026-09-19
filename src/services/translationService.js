import { detectScript, normalizeArabic, normalizeAmharic, lookupWord } from './dictionaryService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFilePath = path.join(__dirname, '..', '..', 'data', 'dictionary.json');

let cachedEntries = [];
try {
  if (fs.existsSync(dataFilePath)) {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    cachedEntries = JSON.parse(raw);
  }
} catch (err) {
  console.warn('[translationService] Failed to load data/dictionary.json:', err.message);
}

// Lazy loaded Gemini AI client
let genAIClient = null;

async function getGeminiClient() {
  if (genAIClient) return genAIClient;
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;

  try {
    const { GoogleGenAI } = await import('@google/genai');
    genAIClient = new GoogleGenAI({ apiKey });
    return genAIClient;
  } catch (err) {
    console.warn('[translationService] @google/genai initialization error:', err.message);
    return null;
  }
}

/**
 * Detects the language of a given text string
 */
export function detectLanguage(text) {
  if (!text || typeof text !== 'string') {
    return { language: 'en', languageName: 'English', script: 'latin', scriptLabel: 'Latin', confidence: 0.5 };
  }

  const str = text.trim();
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/g;
  const ethiopicRegex = /[\u1200-\u137F\u1380-\u139F\u2D80-\u2DDF]/g;
  const latinRegex = /[a-zA-Z]/g;

  const arMatches = (str.match(arabicRegex) || []).length;
  const amMatches = (str.match(ethiopicRegex) || []).length;
  const enMatches = (str.match(latinRegex) || []).length;

  const total = arMatches + amMatches + enMatches || 1;

  if (arMatches > amMatches && arMatches > enMatches) {
    return {
      language: 'ar',
      languageName: 'Arabic (العربية)',
      script: 'arabic',
      scriptLabel: 'Arabic (العربية)',
      confidence: Number((arMatches / total).toFixed(2))
    };
  }

  if (amMatches > arMatches && amMatches > enMatches) {
    return {
      language: 'am',
      languageName: 'Amharic (አማርኛ)',
      script: 'ethiopic',
      scriptLabel: 'Ge’ez (Ethiopic)',
      confidence: Number((amMatches / total).toFixed(2))
    };
  }

  return {
    language: 'en',
    languageName: 'English',
    script: 'latin',
    scriptLabel: 'Latin',
    confidence: Number(Math.max(enMatches / total, 0.7).toFixed(2))
  };
}

const commonPhrases = [
  {
    ar: 'السَّلَامُ عَلَيْكُمْ',
    ar_clean: 'السلام عليكم',
    am: 'ሰላም ለእናንተ ይሁን',
    en: 'Peace be upon you'
  },
  {
    ar: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
    ar_clean: 'السلام عليكم ورحمة الله وبركاته',
    am: 'የአላህ ሰላም፣ እዝነትና በረከት በእናንተ ላይ ይሁን',
    en: 'May the peace, mercy, and blessings of Allah be upon you'
  },
  {
    ar: 'وَعَلَيْكُمُ السَّلَامُ',
    ar_clean: 'وعليكم السلام',
    am: 'በእናንተም ላይ ሰላም ይሁን',
    en: 'And unto you peace'
  },
  {
    ar: 'صَبَاحُ الْخَيْرِ',
    ar_clean: 'صباح الخير',
    am: 'እንደምን አደራችሁ',
    en: 'Good morning'
  },
  {
    ar: 'مَسَاءُ الْخَيْرِ',
    ar_clean: 'مساء الخير',
    am: 'እንደምን አመሻችሁ',
    en: 'Good evening'
  },
  {
    ar: 'شُكْرًا',
    ar_clean: 'شكرا',
    am: 'አመሰግናለሁ',
    en: 'Thank you'
  },
  {
    ar: 'عَفْوًا',
    ar_clean: 'عفوا',
    am: 'ምንም አይደለም',
    en: 'You are welcome'
  },
  {
    ar: 'أَهْلًا وَسَهْلًا',
    ar_clean: 'اهلا وسهلا',
    am: 'እንኳን ደህና መጣችሁ',
    en: 'Welcome'
  },
  {
    ar: 'مَعَ السَّلَامَةِ',
    ar_clean: 'مع السلامة',
    am: 'ደህና ሁኑ',
    en: 'Goodbye / Go with peace'
  },
  {
    ar: 'الْحَمْدُ لِلَّهِ',
    ar_clean: 'الحمد لله',
    am: 'ምስጋና ለአላህ የተገባ ነው',
    en: 'All praise is due to Allah'
  },
  {
    ar: 'إِنْ شَاءَ اللَّهُ',
    ar_clean: 'ان شاء الله',
    am: 'አላህ ከሻ',
    en: 'God willing / If Allah wills'
  },
  {
    ar: 'بِسْمِ اللَّهِ',
    ar_clean: 'بسم الله',
    am: 'በአላህ ስም',
    en: 'In the name of Allah'
  },
  {
    ar: 'بَارَكَ اللَّهُ فِيكَ',
    ar_clean: 'بارك الله فيك',
    am: 'አላህ ይባርክህ',
    en: 'May Allah bless you'
  },
  {
    ar: 'جَزَاكَ اللَّهُ خَيْرًا',
    ar_clean: 'جزاك الله خيرا',
    am: 'አላህ መልካሙን ይክፈልህ',
    en: 'May Allah reward you with good'
  }
];

/**
 * Translates a single term or phrase using dictionary lexicon
 */
function translateViaLexicon(text, src, tgt) {
  const cleanInput = text.trim();
  const lowerInput = cleanInput.toLowerCase();
  const normAr = normalizeArabic(cleanInput);
  const normAm = normalizeAmharic(cleanInput);

  // 0. Check common conversational / greeting phrases
  for (const phrase of commonPhrases) {
    if (src === 'ar') {
      if (phrase.ar === cleanInput || normalizeArabic(phrase.ar_clean || phrase.ar) === normAr) {
        return { translatedText: phrase[tgt], matchType: 'common_phrase', item: phrase };
      }
    } else if (src === 'am') {
      if (phrase.am === cleanInput || normalizeAmharic(phrase.am) === normAm) {
        return { translatedText: phrase[tgt], matchType: 'common_phrase', item: phrase };
      }
    } else if (src === 'en') {
      if (phrase.en.toLowerCase() === lowerInput || phrase.en.toLowerCase().includes(lowerInput)) {
        return { translatedText: phrase[tgt], matchType: 'common_phrase', item: phrase };
      }
    }
  }

  // 1. Direct whole-phrase / word match in dictionary
  for (const item of cachedEntries) {
    // Check examples first for whole sentence translations!
    if (item.examples && Array.isArray(item.examples)) {
      for (const ex of item.examples) {
        if (src === 'ar' && (ex.ar === cleanInput || normalizeArabic(ex.ar) === normAr)) {
          return { translatedText: ex[tgt], matchType: 'exact_example', item };
        }
        if (src === 'am' && (ex.am === cleanInput || normalizeAmharic(ex.am) === normAm)) {
          return { translatedText: ex[tgt], matchType: 'exact_example', item };
        }
        if (src === 'en' && ex.en.toLowerCase() === lowerInput) {
          return { translatedText: ex[tgt], matchType: 'exact_example', item };
        }
      }
    }

    // Check headwords
    if (src === 'ar') {
      if (item.word_ar === cleanInput || normalizeArabic(item.word_ar_clean || item.word_ar) === normAr) {
        const trans = tgt === 'am' ? item.word_am : item.word_en;
        return { translatedText: trans, matchType: 'exact_headword', item };
      }
    } else if (src === 'am') {
      if (item.word_am === cleanInput || normalizeAmharic(item.word_am) === normAm) {
        const trans = tgt === 'ar' ? item.word_ar : item.word_en;
        return { translatedText: trans, matchType: 'exact_headword', item };
      }
    } else if (src === 'en') {
      const enTokens = item.word_en.toLowerCase().split(/[\s/]+/);
      if (item.word_en.toLowerCase() === lowerInput || enTokens.includes(lowerInput)) {
        const trans = tgt === 'ar' ? item.word_ar : item.word_am;
        return { translatedText: trans, matchType: 'exact_headword', item };
      }
    }
  }

  // 2. Tokenized word-by-word alignment for multi-word phrases
  const tokens = cleanInput.split(/[\s,،؛፡]+/).filter(Boolean);
  if (tokens.length > 1) {
    const translatedTokens = [];
    const alignedTokens = [];

    for (const token of tokens) {
      const tokenLower = token.toLowerCase();
      const tokenNormAr = normalizeArabic(token);
      const tokenNormAm = normalizeAmharic(token);

      let foundTrans = null;
      let matchedItem = null;

      for (const item of cachedEntries) {
        if (src === 'ar') {
          if (item.word_ar === token || normalizeArabic(item.word_ar_clean || item.word_ar) === tokenNormAr) {
            foundTrans = tgt === 'am' ? item.word_am.split('/')[0].trim() : item.word_en.split('/')[0].trim();
            matchedItem = item;
            break;
          }
        } else if (src === 'am') {
          if (item.word_am === token || normalizeAmharic(item.word_am) === tokenNormAm) {
            foundTrans = tgt === 'ar' ? item.word_ar : item.word_en.split('/')[0].trim();
            matchedItem = item;
            break;
          }
        } else if (src === 'en') {
          const enTokens = item.word_en.toLowerCase().split(/[\s/]+/);
          if (enTokens.includes(tokenLower) || item.word_en.toLowerCase() === tokenLower) {
            foundTrans = tgt === 'ar' ? item.word_ar : item.word_am.split('/')[0].trim();
            matchedItem = item;
            break;
          }
        }
      }

      if (foundTrans) {
        translatedTokens.push(foundTrans);
        alignedTokens.push({
          sourceToken: token,
          targetToken: foundTrans,
          partOfSpeech: matchedItem?.part_of_speech || 'noun',
          entryId: matchedItem?.id
        });
      } else {
        translatedTokens.push(token); // Passthrough untranslated
      }
    }

    if (alignedTokens.length > 0) {
      return {
        translatedText: translatedTokens.join(' '),
        matchType: 'composite_tokens',
        alignedTokens
      };
    }
  }

  return null;
}

/**
 * Translates text via Gemini AI when API key is configured
 */
async function translateViaGemini(text, src, tgt) {
  const ai = await getGeminiClient();
  if (!ai) return null;

  const langNames = {
    ar: 'Arabic',
    am: 'Amharic',
    en: 'English'
  };

  const srcName = langNames[src] || src;
  const tgtName = langNames[tgt] || tgt;

  const systemInstruction = `You are an expert trilingual translator specializing in Arabic, Amharic (Ethiopian Ge'ez script), and English, with deep knowledge of cultural, theological, and literary nuances.
Translate the user input text from ${srcName} to ${tgtName}.
Output ONLY the clean, fluent, and accurate translation without quotation marks, conversational filler, or explanations.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text }]
        }
      ],
      config: {
        systemInstruction,
        temperature: 0.2
      }
    });

    const result = response.text ? response.text.trim() : null;
    return result;
  } catch (err) {
    console.warn('[translationService] Gemini translation error, falling back to lexicon:', err.message);
    return null;
  }
}

/**
 * Main translation endpoint function
 */
export async function translateText(options = {}) {
  const { text, sourceLang, targetLang, mode = 'auto' } = options;

  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new Error('Text to translate is required and cannot be empty.');
  }

  const cleanText = text.trim();

  // 1. Resolve source language
  let src = sourceLang;
  if (!src || src === 'auto') {
    const detection = detectLanguage(cleanText);
    src = detection.language;
  }

  // 2. Resolve target language (default opposite of source)
  let tgt = targetLang;
  if (!tgt) {
    tgt = src === 'en' ? 'ar' : 'en';
  }

  // Handle same source and target language gracefully
  if (src === tgt) {
    return {
      originalText: cleanText,
      translatedText: cleanText,
      sourceLanguage: src,
      targetLanguage: tgt,
      engine: 'identical',
      matchDetails: null,
      timestamp: new Date().toISOString()
    };
  }

  const supported = ['ar', 'am', 'en'];
  if (!supported.includes(src)) {
    throw new Error(`Unsupported source language '${src}'. Supported languages are: ar (Arabic), am (Amharic), en (English).`);
  }
  if (!supported.includes(tgt)) {
    throw new Error(`Unsupported target language '${tgt}'. Supported languages are: ar (Arabic), am (Amharic), en (English).`);
  }

  // 3. Execution strategy
  let translatedText = '';
  let engine = 'lexicon';
  let matchDetails = null;

  // Try AI if requested or in auto mode with multi-word sentence
  const isMultiWord = cleanText.split(/\s+/).length > 2;
  const shouldTryAI = (mode === 'ai' || (mode === 'auto' && isMultiWord)) && (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);

  if (shouldTryAI) {
    const aiResult = await translateViaGemini(cleanText, src, tgt);
    if (aiResult) {
      translatedText = aiResult;
      engine = 'gemini-ai (gemini-3.8-flash)';
    }
  }

  // If not translated yet, use high-precision lexicon
  if (!translatedText) {
    const lexResult = translateViaLexicon(cleanText, src, tgt);
    if (lexResult) {
      translatedText = lexResult.translatedText;
      engine = 'trilingual-lexicon';
      matchDetails = {
        matchType: lexResult.matchType,
        alignedTokens: lexResult.alignedTokens,
        lexiconEntry: lexResult.item ? {
          id: lexResult.item.id,
          partOfSpeech: lexResult.item.part_of_speech,
          category: lexResult.item.category,
          transliteration: tgt === 'ar' ? lexResult.item.transliteration_ar : lexResult.item.transliteration_am
        } : null
      };
    } else {
      // Fallback: If AI is available and wasn't run yet, try AI now
      if (mode !== 'lexicon' && (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)) {
        const aiFallback = await translateViaGemini(cleanText, src, tgt);
        if (aiFallback) {
          translatedText = aiFallback;
          engine = 'gemini-ai (gemini-3.8-flash)';
        }
      }

      if (!translatedText) {
        // Last-resort fallback message indicating partial coverage
        translatedText = cleanText;
        engine = 'untranslated-fallback';
      }
    }
  }

  return {
    originalText: cleanText,
    translatedText,
    sourceLanguage: src,
    targetLanguage: tgt,
    engine,
    matchDetails,
    timestamp: new Date().toISOString()
  };
}

/**
 * Returns supported translation language pairs
 */
export function getSupportedPairs() {
  return [
    { from: 'ar', to: 'en', source: 'ar', target: 'en', label: 'Arabic to English (العربية ➔ English)' },
    { from: 'ar', to: 'am', source: 'ar', target: 'am', label: 'Arabic to Amharic (العربية ➔ አማርኛ)' },
    { from: 'en', to: 'ar', source: 'en', target: 'ar', label: 'English to Arabic (English ➔ العربية)' },
    { from: 'en', to: 'am', source: 'en', target: 'am', label: 'English to Amharic (English ➔ አማርኛ)' },
    { from: 'am', to: 'en', source: 'am', target: 'en', label: 'Amharic to English (አማርኛ ➔ English)' },
    { from: 'am', to: 'ar', source: 'am', target: 'ar', label: 'Amharic to Arabic (አማርኛ ➔ العربية)' }
  ];
}
