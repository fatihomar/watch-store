const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
    try {
        const featuredProducts = await Product.findAll({ where: { featured: true }, limit: 3 });
        res.render('index', { title: 'Home', featuredProducts });
    } catch (err) {
        console.error(err);
        res.render('index', { title: 'Home', featuredProducts: [] });
    }
});

router.get('/favorites', (req, res) => {
    res.render('favorites', { title: 'Favorilerim' });
});

router.get('/cart', (req, res) => {
    res.render('cart', { title: 'Sepetim' });
});

const { Country, State, City } = require('country-state-city');

// Location API
router.get('/api/countries', (req, res) => {
    const countries = Country.getAllCountries().map(c => ({
        name: c.name,
        isoCode: c.isoCode,
        flag: c.flag
    }));
    res.json(countries);
});

router.get('/api/states/:countryCode', (req, res) => {
    const { countryCode } = req.params;
    const states = State.getStatesOfCountry(countryCode).map(s => ({
        name: s.name,
        isoCode: s.isoCode
    }));
    res.json(states);
});

const Order = require('../models/Order');

router.get('/checkout', (req, res) => {
    res.render('checkout', { title: 'Ödeme' });
});

router.post('/checkout', async (req, res) => {
    try {
        const { firstName, lastName, email, address, country, state, zip, cartItems, totalAmount } = req.body;

        // Basic validation
        if (!cartItems || !totalAmount) {
            return res.status(400).json({ error: 'Sepet boş veya geçersiz.' });
        }


        // Check Stock First
        let insufficientStockItems = [];
        for (const item of cartItems) {
            const product = await Product.findByPk(item.id);
            if (!product || product.stock < item.qty) {
                insufficientStockItems.push(product ? product.name : 'Unknown Product');
            }
        }

        if (insufficientStockItems.length > 0) {
            return res.status(400).json({ error: `Stok yetersiz: ${insufficientStockItems.join(', ')}` });
        }

        const newOrder = await Order.create({
            customerName: `${firstName} ${lastName}`,
            customerEmail: email,
            customerAddress: `${address}, ${state}, ${country}, ${zip}`,
            totalAmount: parseFloat(totalAmount),
            items: JSON.stringify(cartItems),
            status: 'Pending'
        });

        // Decrement Stock
        for (const item of cartItems) {
            const product = await Product.findByPk(item.id);
            if (product) {
                await product.decrement('stock', { by: item.qty });
            }
        }

        res.json({ success: true, orderId: newOrder.id });
    } catch (err) {
        console.error('Checkout Error:', err);
        res.status(500).json({ error: 'Sipariş oluşturulurken bir hata oluştu.' });
    }
});

router.get('/order-success/:id', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.redirect('/');
        res.render('order-success', { title: 'Siparişiniz Alındı', order });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

// Admin Login - Get
router.get('/admin/login', (req, res) => {
    res.render('login', { title: 'Yönetici Girişi', error: null });
});

// Admin Login - Post
router.post('/admin/login', (req, res) => {
    let { username, password } = req.body;
    console.log('Login Attempt:', { username, password }); // Debug log

    if (!username || !password) {
        return res.render('login', { title: 'Yönetici Girişi', error: 'Lütfen tüm alanları doldurun!' });
    }

    // Normalize input
    username = username.trim().toLowerCase();
    password = password.trim();

    // Simple authentication check
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'fatih123';

    if (username === adminUser && password === adminPass) {
        console.log('Login Successful');
        req.session.user = 'admin'; // Set session user
        res.redirect('/admin/dashboard');
    } else {
        console.log('Login Failed');
        res.render('login', { title: 'Yönetici Girişi', error: 'Hatalı kullanıcı adı veya şifre!' });
    }
});

// Admin Orders
router.get('/admin/orders', async (req, res) => {
    if (req.session.user !== 'admin') {
        return res.redirect('/admin/login');
    }
    try {
        const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
        res.render('admin-orders', { title: 'Sipariş Yönetimi', orders });
    } catch (err) {
        console.error(err);
        res.redirect('/admin/dashboard');
    }
});

// Update Order Status
router.post('/admin/orders/:id/status', async (req, res) => {
    if (req.session.user !== 'admin') {
        return res.status(403).send('Unauthorized');
    }
    try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.id);
        if (order) {
            order.status = status;
            await order.save();
        }
        res.redirect('/admin/orders');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/orders');
    }
});

// Admin Dashboard
router.get('/admin/dashboard', async (req, res) => {
    // Auth Check
    if (req.session.user !== 'admin') {
        return res.redirect('/admin/login');
    }

    try {
        const products = await Product.findAll({ order: [['id', 'DESC']] }); // Newest first
        res.render('dashboard', { title: 'Satıcı Merkezi', products });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// Admin Logout
router.get('/admin/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
