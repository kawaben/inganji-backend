const jwt = require('jsonwebtoken');
const request = require('supertest');
const { app, db } = require('../server');

describe('Product API Endpoints', () => {
    const newProduct = {
        name: 'Test Product',
        price: 19.99,
        description: 'Test Description',
        stock: 10,
    };

    let token;
    let productId; // To store the ID of a test product

    beforeAll(async () => {
        // Generate a token
        token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Insert a product into the database for `GET /api/products/:id` test
        const [result] = await db.query(
            'INSERT INTO products (name, price, description, stock) VALUES (?, ?, ?, ?)',
            [newProduct.name, newProduct.price, newProduct.description, newProduct.stock]
        );
        productId = result.insertId; // Save the inserted product ID
    });

    afterAll(async () => {
        // Clean up the test database
        await db.query('DELETE FROM products WHERE id = ?', [productId]);
        db.end();
    });

    it('should create a new product', async () => {
        const response = await request(app)
            .post('/api/products')
            .send(newProduct)
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json');
    
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Product created successfully');
        expect(response.body).toHaveProperty('productId');
    }, 10000); // Increase timeout to 10 seconds
    

    it('should return a list of products', async () => {
        const response = await request(app).get('/api/products');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return a single product', async () => {
        const response = await request(app).get(`/api/products/${productId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', productId);
        expect(response.body).toHaveProperty('name', newProduct.name);
    });

    jest.setTimeout(10000); // 10 seconds for all tests in this file

    router.post('/upload', (req, res) => {
        upload.single('image')(req, res, (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
          }
          res.status(200).json({ filePath: `uploads/${req.file.filename}` });
        });
      });
      
});
