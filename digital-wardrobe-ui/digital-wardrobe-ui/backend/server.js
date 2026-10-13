const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/database');
const clothingRoutes = require('./routes/clothingRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Closetly backend is running!',
  });
});

// Clothing API routes
app.use('/api/clothing', clothingRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Closetly server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start Closetly backend:', error.message);
    process.exit(1);
  }
};

startServer();
