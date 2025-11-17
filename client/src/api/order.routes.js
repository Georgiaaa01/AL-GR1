// client/src/api/order.routes.js
import axiosAuth from "../axios/axiosAuth";

export const placeOrder = async () => {
    try {
        const response = await axiosAuth.post("orders");
        return response.data;
    } catch (error) {
        console.error("Error placing order:", error);
        return error.response?.data;
    }
};

export const fetchOrders = async () => {
    try {
        const response = await axiosAuth.get("orders");
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        return error.response?.data;
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await axiosAuth.put(`orders/${orderId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        return error.response?.data;
    }
};
