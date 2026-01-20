const express = require('express');
const sequelize = require('./config/database');
const path = require('path');
const methodOverride = require('method-override');
const app = express();
const Product = require('./models/Product');




// Database Connection Strategy
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to SQLite Database');

        // Sync models
        await sequelize.sync();
        console.log('✅ Database Synced');

        // Check if DB is empty and seed if needed
        const count = await Product.count();
        if (count === 0) {
            console.log('🌱 Database is empty. Seeding...');
            const seedDB = require('./seed');
            await seedDB();
        } else {
            console.log(`ℹ️ Database has ${count} products.`);
        }

    } catch (err) {
        console.error('❌ Database connection failed:', err);
    }
};

connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
const session = require('express-session');
app.use(session({
    secret: 'saat_secret_key_123', // In production, use env variable
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Global Variables Middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user;
    next();
});

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const productRoutes = require('./routes/products');
const indexRoutes = require('./routes/index');

// Manual Seed Route for Debugging
app.get('/seed-manual', async (req, res) => {
    try {
        console.log('Manual seed triggered');
        const seedDB = require('./seed');
        await seedDB();
        const Product = require('./models/Product');
        const count = await Product.count();
        res.send(`Seeded successfully! Total products: ${count}`);
    } catch (err) {
        console.error(err);
        res.status(500).send(`Seed failed: ${err.message}`);
    }
});

app.use('/products', productRoutes);
app.use('/', indexRoutes);

// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    // Auto-open browser only in development
    if (process.env.NODE_ENV !== 'production') {
        require('child_process').exec(`start http://localhost:${PORT}`);
    }
});
