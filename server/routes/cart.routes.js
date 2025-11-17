// server/routes/cart.routes.js
const express = require('express');
const { CartItem, Product } = require('../database/models');
const { verifyToken } = require('../utils/token.js');

const router = express.Router();

// Doar user normal are voie în coș (nu admin)
const allowOnlyUser = (req, res, next) => {
    if (req.userRole !== 'user') {
        return res
            .status(403)
            .json({ success: false, message: 'Only customers can access the cart', data: {} });
    }
    next();
};

// =======================
//  GET /cart
// =======================
// Preluare coș pentru userul logat
router.get('/', verifyToken, allowOnlyUser, async (req, res) => {
    try {
        const userId = req.userId;

        const items = await CartItem.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Product,
                },
            ],
        });

        res.status(200).json({
            success: true,
            message: 'Cart loaded successfully',
            data: items,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error loading cart',
            data: error.message,
        });
    }
});

// =======================
//  POST /cart
// =======================
// Adăugare produs în coș
router.post('/', verifyToken, allowOnlyUser, async (req, res) => {
    try {
        const userId = req.userId;
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'productId and quantity are required',
                data: {},
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1',
                data: {},
            });
        }

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
                data: {},
            });
        }

        // Vedem dacă produsul există deja în coș
        let cartItem = await CartItem.findOne({
            where: { user_id: userId, product_id: productId },
        });

        if (!cartItem) {
            // creăm un item nou
            cartItem = await CartItem.create({
                user_id: userId,
                product_id: productId,
                quantity,
            });
        } else {
            // adunăm la cantitatea existentă
            cartItem.quantity = cartItem.quantity + quantity;
            await cartItem.save();
        }

        res.status(201).json({
            success: true,
            message: 'Product added to cart',
            data: cartItem,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding product to cart',
            data: error.message,
        });
    }
});

// =======================
//  PUT /cart/:id
// =======================
// Actualizare cantitate pentru un item din coș
router.put('/:id', verifyToken, allowOnlyUser, async (req, res) => {
    try {
        const userId = req.userId;
        const id = req.params.id;
        const { quantity } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Cart item id is not valid',
                data: {},
            });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1',
                data: {},
            });
        }

        const cartItem = await CartItem.findOne({
            where: { id, user_id: userId },
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found',
                data: {},
            });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({
            success: true,
            message: 'Cart item updated successfully',
            data: cartItem,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating cart item',
            data: error.message,
        });
    }
});

// =======================
//  DELETE /cart/:id
// =======================
// Ștergere un item din coș
router.delete('/:id', verifyToken, allowOnlyUser, async (req, res) => {
    try {
        const userId = req.userId;
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Cart item id is not valid',
                data: {},
            });
        }

        const cartItem = await CartItem.findOne({
            where: { id, user_id: userId },
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found',
                data: {},
            });
        }

        await cartItem.destroy();

        res.status(200).json({
            success: true,
            message: 'Cart item deleted successfully',
            data: {},
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting cart item',
            data: error.message,
        });
    }
});

// =======================
//  DELETE /cart
// =======================
// Golire completă coș
router.delete('/', verifyToken, allowOnlyUser, async (req, res) => {
    try {
        const userId = req.userId;

        await CartItem.destroy({
            where: { user_id: userId },
        });

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            data: {},
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error clearing cart',
            data: error.message,
        });
    }
});

module.exports = router;
