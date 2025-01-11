const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const multer = require("multer");
const path = require("path");


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// POST /allproducts: Add a new product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Validate input
    if (!name || !price || !description || !image_url) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Insert product into database
    await db.query(
      "INSERT INTO products (name, price, description, image_url) VALUES (?, ?, ?, ?)",
      [name, price, description, image_url]
    );

    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;




// Get all products
router.get('/', async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products');
        if (!products || products.length === 0) {
            return res.status(404).json({ error: 'No products found' });
        }
        res.status(200).json(products);
        console.log('Fetching all products...');
    } catch (error) {
        console.error('Error fetching products with query SELECT * FROM products:', error);
        res.status(500).json({ error: 'Server error' });
    }
});




module.exports = router;
