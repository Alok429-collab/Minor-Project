import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
// You can set MONGODB_URI in a .env file, otherwise it defaults to local MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/central_museum';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB (central_museum database)'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Please ensure MongoDB is running locally, or provide a MONGODB_URI in a .env file.');
  });

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy',
});

// Define Visitor Schema and Model
const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ticketsCount: { type: Number, required: true },
  visitDate: { type: String, required: true },
  paymentStatus: { type: String, default: 'Completed' },
  createdAt: { type: Date, default: Date.now }
});

const Visitor = mongoose.model('Visitor', visitorSchema);

// Razorpay create order endpoint
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // amount in smallest currency unit (cents)
      currency: "USD",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// API Route to book a ticket and save visitor
app.post('/api/book-ticket', async (req, res) => {
  try {
    const { name, ticketsCount, visitDate, paymentId } = req.body;
    
    // Create new visitor record
    const newVisitor = new Visitor({
      name,
      ticketsCount,
      visitDate,
      paymentStatus: paymentId ? `Completed (${paymentId})` : 'Completed'
    });
    
    await newVisitor.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Ticket booked successfully!', 
      visitor: newVisitor 
    });
  } catch (error) {
    console.error('Error saving visitor:', error);
    res.status(500).json({ success: false, message: 'Server error saving ticket.' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  });
}

export default app;
