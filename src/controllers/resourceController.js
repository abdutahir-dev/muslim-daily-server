import { quotesDb } from '../db/connection.js';

export const getRandomQuote = async (req, res) => {
    try {
        const quote = await quotesDb.get(`
      SELECT 
          words._id as id,
          words.Wisdom AS arabic_txt, 
          words.enWisdom AS english_txt, 
          source.artitle AS source, 
          topic.artitle AS topic
      FROM words
      INNER JOIN source ON words.Source = source._id
      INNER JOIN topic ON words.Topic = topic._id
      WHERE words.enWisdom IS NOT NULL AND words.enWisdom != ''
      ORDER BY RANDOM() LIMIT 1
    `);
        res.json(quote);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch quote' });
    }
};
