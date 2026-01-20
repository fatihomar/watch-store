const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING, // Luxury, Sport, Classic, Smart
        defaultValue: 'Classic'
    },
    gender: {
        type: DataTypes.STRING, // Men, Women, Unisex
        defaultValue: 'Unisex'
    },
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    specs: {
        type: DataTypes.TEXT, // Storing JSON string
        defaultValue: '{}',
        get() {
            try {
                const rawValue = this.getDataValue('specs');
                return rawValue ? JSON.parse(rawValue) : { mechanism: 'Otomatik', caseSize: '40mm', material: 'Paslanmaz Çelik', waterResistance: '10 ATM' };
            } catch (e) {
                return {};
            }
        },
        set(value) {
            this.setDataValue('specs', JSON.stringify(value));
        }
    },
    reviews: {
        type: DataTypes.TEXT, // Storing JSON string array
        defaultValue: '[]',
        get() {
            try {
                const rawValue = this.getDataValue('reviews');
                return rawValue ? JSON.parse(rawValue) : [];
            } catch (e) {
                return [];
            }
        },
        set(value) {
            this.setDataValue('reviews', JSON.stringify(value));
        }
    },
    averageRating: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.getAverageRating();
        }
    }
}, {
    timestamps: true
});

// Helper for average rating logic
Product.prototype.getAverageRating = function () {
    const reviews = this.reviews;
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
};

module.exports = Product;

