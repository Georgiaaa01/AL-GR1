// server/database/models/OrderItem.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../server');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    price: {
        // prețul per bucată la momentul comenzii
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    tableName: 'order_items',
});

module.exports = OrderItem;
