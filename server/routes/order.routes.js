// server/routes/order.routes.js
const express = require('express');
const { Order, OrderItem, CartItem, Product, User } = require('../database/models');
const { verifyToken } = require('../utils/token.js');

const router = express.Router();

// helper: doar user normal, nu admin
const allowOnlyUser = (req, res, next) => {
    if (req.userRole !== 'user') {
        return res.status(403).json({
            success: false,
            message: 'Only customers can place orders',
            data: {},
        });
    }
    next();
};

// helper: doar admin
const allowOnlyAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Only admin can access this resource',
            data: {},
        });
    }
    next();
};

/**
 * POST /orders
 * Creează o comandă din produsele din coșul userului logat
 * Plata: cash_on_delivery (ramburs)
 */
router.post('/', verifyToken, allowOnlyUser, async (req, res) => {
    try {
        const userId = req.userId;

        const cartItems = await CartItem.findAll({
            where: { user_id: userId },
            include: [{ model: Product }],
        });

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Your cart is empty',
                data: {},
            });
        }

        const total = cartItems.reduce((sum, item) => {
            const price = item.Product.price;
            return sum + price * item.quantity;
        }, 0);

        const order = await Order.create({
            user_id: userId,
            total_price: total,
            status: 'pending',
            payment_method: 'cash_on_delivery',
        });

        const orderItemsPayload = cartItems.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.Product.price,
        }));

        const createdItems = await OrderItem.bulkCreate(orderItemsPayload);

        await CartItem.destroy({ where: { user_id: userId } });

        return res.status(201).json({
            success: true,
            message: 'Order created successfully (cash on delivery)',
            data: {
                order,
                items: createdItems,
            },
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create order',
            data: {},
        });
    }
});

/**
 * GET /orders
 * - admin: toate comenzile cu user + items
 * - user: doar comenzile lui
 */
router.get('/', verifyToken, async (req, res) => {
    try {
        const isAdmin = req.userRole === 'admin';
        const whereClause = isAdmin ? {} : { user_id: req.userId };

        const orders = await Order.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email'],
                },
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Product,
                        },
                    ],
                },
            ],
        });

        return res.status(200).json({
            success: true,
            message: 'Orders fetched successfully',
            data: orders,
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            data: {},
        });
    }
});

/**
 * PUT /orders/:id/status
 * Doar adminul poate schimba statusul comenzii
 * body: { status: 'pending' | 'processing' | 'canceled' | 'shipped' }
 */
router.put('/:id/status', verifyToken, allowOnlyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ['pending', 'processing', 'canceled', 'shipped'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value',
                data: {},
            });
        }

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
                data: {},
            });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order,
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            data: {},
        });
    }
});

module.exports = router;
