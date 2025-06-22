const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config'); // Import the config file

const app = express();
const PORT = process.env.PORT || 5001; // Using 5001 to avoid conflict with React's default 3000

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON body data

// --- Database Connection ---
const MONGO_URI = config.MONGO_URI;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully.'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// --- Environment Variables ---
const API_BASE_URL = 'https://api.spoonacular.com/recipes';

// Spoonacular API Key
const SPOONACULAR_API_KEY = config.SPOONACULAR_API_KEY;

// --- Routes ---
app.use('/api/auth', require('./routes/auth'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Backend is running!' });
});

// Proxy endpoint for searching recipes by ingredients
app.get('/api/recipes', async (req, res) => {
    const { ingredients } = req.query;

    if (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === "YOUR_SPOONACULAR_API_KEY_GOES_HERE") {
        return res.status(500).json({ error: 'Spoonacular API key is not configured on the server.' });
    }

    if (!ingredients) {
        return res.status(400).json({ error: 'Ingredients query parameter is required.' });
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/findByIngredients`, {
            params: {
                ingredients,
                number: 12,
                ranking: 1,
                ignorePantry: true,
                apiKey: SPOONACULAR_API_KEY,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching from Spoonacular API:', error.message);
        res.status(500).json({ error: 'Failed to fetch recipes from Spoonacular.' });
    }
});

// Proxy endpoint for searching recipes by cuisine
app.get('/api/recipes/cuisine', async (req, res) => {
    const { cuisine } = req.query;

    if (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === "YOUR_SPOONACULAR_API_KEY_GOES_HERE") {
        return res.status(500).json({ error: 'Spoonacular API key is not configured on the server.' });
    }

    if (!cuisine) {
        return res.status(400).json({ error: 'Cuisine query parameter is required.' });
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/complexSearch`, {
            params: {
                cuisine,
                number: 12,
                apiKey: SPOONACULAR_API_KEY,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching from Spoonacular API:', error.message);
        res.status(500).json({ error: 'Failed to fetch recipes from Spoonacular.' });
    }
});

// Proxy endpoint for getting recipe details by ID
app.get('/api/recipes/:id', async (req, res) => {
    const { id } = req.params;

    if (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === "YOUR_SPOONACULAR_API_KEY_GOES_HERE") {
        return res.status(500).json({ error: 'Spoonacular API key is not configured on the server.' });
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/${id}/information`, {
            params: {
                apiKey: SPOONACULAR_API_KEY,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching from Spoonacular API:', error.message);
        res.status(500).json({ error: 'Failed to fetch recipe details from Spoonacular.' });
    }
});

// --- Server Initialization ---
app.listen(PORT, () => {
    console.log(`✅ Backend server is running on http://localhost:${PORT}`);
}); 