require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json());

app.post('/api/scout', async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const googleResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!googleResponse.ok) throw new Error("Google API failed");

    const data = await googleResponse.json();
    const aiText = data.candidates[0].content.parts[0].text;

    res.json({ text: aiText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch AI insight' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));