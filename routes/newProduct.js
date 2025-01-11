const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../db/connection");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Add a new product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !price || !description || !image) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Insert into the database
    const query = "INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)";
    const values = [name, price, description, image];

    await db.query(query, values);
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
