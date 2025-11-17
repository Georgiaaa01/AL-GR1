// server/database/models/Order.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../server');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',   // pending | shipped | delivered etc.
    },
    payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'cash_on_delivery', // doar ramburs la noi
    },
}, {
    tableName: 'orders',
});

module.exports = Order;
