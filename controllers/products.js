const db = require('../config/db');

const getAllProducts = (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch products' });
        res.json(results);
    });
};

const deleteProduct = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to delete product' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    });
};

module.exports = { getAllProducts, deleteProduct };
