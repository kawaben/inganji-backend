const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const upload = require('../middleware/upload'); // Upload middleware

// Upload product image
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        const [product] = await db.query('SELECT id FROM products WHERE id = ?', [productId]);
        if (!product || product.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const imagePath = `/uploads/${req.file.filename}`;
        await db.query('INSERT INTO product_images (product_id, image_path) VALUES (?, ?)', [productId, imagePath]);

        res.status(200).json({ message: 'Image uploaded successfully', imagePath });
    } catch (error) {
        console.error('Error during image upload:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add product colors
router.post('/:id/colors', async (req, res) => {
    const { id } = req.params;
    const { colors } = req.body;

    try {
        const values = colors.map(color => [id, color.color_name, color.color_code]);
        const sql = 'INSERT INTO product_colors (product_id, color_name, color_code) VALUES ?';
        await db.query(sql, [values]);

        res.status(201).json({ message: 'Colors added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// get all products




// Get product details
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [product] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        if (!product || product.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const [images] = await db.query('SELECT image_path FROM product_images WHERE product_id = ?', [id]);
        const [colors] = await db.query('SELECT color_name, color_code FROM product_colors WHERE product_id = ?', [id]);
        const [sizes] = await db.query('SELECT size FROM product_sizes WHERE product_id = ?', [id]);

        res.json({
            ...product[0],
            images: images.map(img => img.image_path),
            colors,
            sizes: sizes.map(size => size.size),
        });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).send('Server error');
    }
});

// Get all products


router.get('/test', (req, res) => {
    res.status(200).json({ message: 'API is working!' });
});

module.exports = router;
