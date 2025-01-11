const express = require('express');
const path = require('path');
const productRoutes = require('./routes/products');
const allproductRoutes = require('./routes/allproducts');
const newProduct = require('./routes/newProduct');

const cors = require('cors');

const app = express();
const PORT = 5000;

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; font-src 'self' data:;");
    next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/allproducts', allproductRoutes); // Adjusted in `allproducts` route file
app.use("/allproducts", productRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Test route
app.get('/', (req, res) => {
    res.send('API is working!');
});
