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

    if (!googleResponse.ok) {
  const errorText = await googleResponse.text();
  console.error("Google API Error Details:", errorText); // This prints the true error
  throw new Error("Google API failed");
}

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


// Add this new endpoint for football news proxying
app.get('/api/news', async (req, res) => {
    try {
        // NewsAPI allows server-to-server requests completely free
        const newsResponse = await fetch(`https://newsapi.org/v2/everything?q=football&language=en&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`);
        
        if (!newsResponse.ok) {
            throw new Error(`NewsAPI responded with status ${newsResponse.status}`);
        }

        const data = await newsResponse.json();
        res.json(data);
    } catch (error) {
        console.error("News Proxy Error:", error.message);
        res.status(500).json({ error: "Failed to fetch football news via proxy server" });
    }
});