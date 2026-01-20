const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerEmail: {
        type: DataTypes.STRING,
        allowNull: true
    },
    customerAddress: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING, // 'Pending', 'Shipped', 'Delivered', 'Cancelled'
        defaultValue: 'Pending'
    },
    items: {
        type: DataTypes.TEXT, // Using JSON string to store cart items snapshot
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Order;
