const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { Op } = require('sequelize');

const path = require('path');
const multer = require('multer');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed!'));
    }
});

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.session.user === 'admin') {
        return next();
    }
    res.redirect('/admin/login');
};

// Batch fetch products by IDs
router.post('/batch', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ error: 'Invalid IDs' });
        }
        const products = await Product.findAll({
            where: {
                id: ids
            }
        });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Quick Add (Template)
router.post('/quick', isLoggedIn, async (req, res) => {
    try {
        const newProduct = await Product.create({
            name: "Yeni Taslak Saat",
            brand: "Taslak Marka",
            category: "Classic",
            price: 0,
            image: "/images/placeholder.jpg", // Default placeholder
            description: "Bu otomatik oluşturulmuş bir taslak üründür. Lütfen detayları düzenleyin.",
            featured: false,
            specs: { mechanism: 'Otomatik', caseSize: '40mm', material: 'Paslanmaz Çelik', waterResistance: '10 ATM' }
        });
        res.redirect(`/products/${newProduct.id}/edit`);
    } catch (err) {
        console.error(err);
        res.redirect('/admin/dashboard');
    }
});

// Product Index - Show all products or filter by category/gender
router.get('/', async (req, res) => {
    try {
        const { category, gender } = req.query;
        let whereClause = {};
        let title = 'Koleksiyon';

        if (category) {
            whereClause.category = category;
            title = `${category} Saatler`;
        }

        if (gender) {
            whereClause.gender = gender;
            title = gender === 'Men' ? 'Erkek Saatleri' : (gender === 'Women' ? 'Kadın Saatleri' : 'Koleksiyon');
        }

        // Search Query
        const { q } = req.query;
        if (q) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${q}%` } }, // Case insensitive usually depends on DB collation
                { brand: { [Op.like]: `%${q}%` } },
                { description: { [Op.like]: `%${q}%` } }
            ];
            title = `"${q}" için arama sonuçları`;
        }

        const products = await Product.findAll({ where: whereClause });
        res.render('shop', {
            title,
            products,
            currentCategory: category || '',
            currentGender: gender || '',
            searchQuery: q || ''
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// New Product Form
router.get('/new', isLoggedIn, (req, res) => {
    res.render('new', { title: 'Add New Watch' });
});

// Create Product
router.post('/', isLoggedIn, upload.single('image'), async (req, res) => {
    try {
        let productData = req.body;

        // Handle Image Upload
        if (req.file) {
            productData.image = `/uploads/${req.file.filename}`;
        } else if (req.body.image_url && req.body.image_url.trim() !== '') {
            productData.image = req.body.image_url.trim();
        } else {
            // Use placeholder if no image uploaded
            productData.image = '/images/placeholder.jpg';
        }

        await Product.create(productData);
        res.redirect('/products');
    } catch (err) {
        console.error(err);
        res.render('new', { title: 'Add New Watch', error: err.message });
    }
});

// Show Product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.redirect('/products');

        const relatedProducts = await Product.findAll({
            where: {
                category: product.category,
                id: { [Op.ne]: product.id }
            },
            limit: 4
        });

        // Sequelize instance needs .toJSON() or just access properties. 
        // The view expects product object.
        res.render('product', { title: product.name, product, relatedProducts });
    } catch (err) {
        console.error(err);
        res.redirect('/products');
    }
});

// Edit Product Form
router.get('/:id/edit', isLoggedIn, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        res.render('edit', { title: 'Edit Watch', product });
    } catch (err) {
        console.error(err);
        res.redirect('/products');
    }
});

// Update Product
router.put('/:id', isLoggedIn, upload.single('image'), async (req, res) => {
    try {
        let updateData = req.body;

        // Handle Image Upload
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        } else if (req.body.image_url && req.body.image_url.trim() !== '') {
            updateData.image = req.body.image_url.trim();
        }
        // If no file uploaded AND no URL provided, standard behavior is to NOT update the 'image' field 

        await Product.update(updateData, {
            where: { id: req.params.id }
        });
        res.redirect(`/products/${req.params.id}`);
    } catch (err) {
        console.error(err);
        res.redirect('/products');
    }
});

// Delete Product
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        await Product.destroy({
            where: { id: req.params.id }
        });
        res.redirect('/products');
    } catch (err) {
        console.error(err);
        res.redirect('/products');
    }
});

// Add Review
router.post('/:id/review', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.redirect('/products');

        const { rating, comment, user } = req.body;
        const newReview = {
            rating: parseInt(rating),
            comment,
            user: user || 'Misafir Kullanıcı',
            date: new Date()
        };

        // Getter returns parsed array, modify it
        const currentReviews = product.reviews || [];
        currentReviews.push(newReview);

        // Setter stringifies it
        product.reviews = currentReviews;

        await product.save();
        res.redirect(`/products/${product.id}`);
    } catch (err) {
        console.error(err);
        res.redirect('/products');
    }
});

module.exports = router;
