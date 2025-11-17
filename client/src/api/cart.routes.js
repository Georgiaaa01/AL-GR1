// client/src/api/cart.routes.js
import axiosAuth from "../axios/axiosAuth";

// GET /cart – ia toate item-ele din coșul userului logat
export const fetchCart = async () => {
    try {
        const response = await axiosAuth.get('cart');
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        return error.response?.data;
    }
};

// POST /cart – adaugă un produs în coș
export const addToCart = async (productId, quantity = 1) => {
    try {
        const response = await axiosAuth.post('cart', {
            productId,
            quantity,
        });
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        return error.response?.data;
    }
};

// PUT /cart/:id – actualizează cantitatea unui item
export const updateCartItem = async (cartItemId, quantity) => {
    try {
        const response = await axiosAuth.put(`cart/${cartItemId}`, {
            quantity,
        });
        return response.data;
    } catch (error) {
        console.error("Error updating cart item:", error);
        return error.response?.data;
    }
};

// DELETE /cart/:id – șterge un item din coș
export const deleteCartItem = async (cartItemId) => {
    try {
        const response = await axiosAuth.delete(`cart/${cartItemId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting cart item:", error);
        return error.response?.data;
    }
};

// DELETE /cart – golește coșul complet
export const clearCart = async () => {
    try {
        const response = await axiosAuth.delete('cart');
        return response.data;
    } catch (error) {
        console.error("Error clearing cart:", error);
        return error.response?.data;
    }
};
