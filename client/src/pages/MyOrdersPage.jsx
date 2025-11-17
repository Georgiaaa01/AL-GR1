// client/src/pages/MyOrdersPage.jsx
import { useEffect, useState } from "react";
import { fetchOrders } from "../api/order.routes";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "sonner";

const getStatusMessage = (status) => {
    switch (status) {
        case "pending":
            return "We’ve received your order! Sit tight while we get everything ready for you 💗";
        case "processing":
            return "Your order is being processed. Please be patient 💕";
        case "canceled":
            return "Oops! It seems the items you ordered are no longer in stock... or maybe the administrator was playing with the buttons again 😅";
        case "shipped":
            return "Your package is on its way and will arrive soon ✨";
        default:
            return "";
    }
};

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true);
                const response = await fetchOrders();

                if (response?.success && Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    toast.error(response?.message || "Could not load orders");
                }
            } catch (error) {
                console.error("Error loading orders:", error);
                toast.error("Error loading orders");
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    if (loading) return <LoadingSpinner />;

    if (!orders.length) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 flex items-center justify-center">
                <div className="bg-white/90 rounded-2xl shadow-xl px-8 py-10 text-center">
                    <p className="text-gray-600 font-semibold">You don't have any orders yet 💌</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white/90 rounded-2xl shadow-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-pink-700 mb-6">My Orders</h2>

                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="border border-pink-100 rounded-2xl p-4 sm:p-5 bg-white shadow-sm"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                <div>
                                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-purple-700">
                                        Total: ${order.total_price?.toFixed(2)}
                                    </p>
                                    <p className="text-xs mt-1">
                                        Status:{" "}
                                        <span className="font-semibold capitalize text-pink-600">
                                            {order.status}
                                        </span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {getStatusMessage(order.status)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Payment:{" "}
                                        {order.payment_method === "cash_on_delivery"
                                            ? "Cash on delivery"
                                            : order.payment_method}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 border-t border-pink-100 pt-3">
                                <p className="text-xs font-semibold text-gray-500 mb-2">
                                    Items in this order:
                                </p>
                                <ul className="space-y-1 text-sm">
                                    {order.OrderItems?.map((item) => (
                                        <li key={item.id} className="flex justify-between">
                                            <span className="text-gray-700">
                                                {item.Product?.name || "Product"}{" "}
                                                <span className="text-xs text-gray-400">
                                                    x {item.quantity}
                                                </span>
                                            </span>
                                            <span className="text-gray-800">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
