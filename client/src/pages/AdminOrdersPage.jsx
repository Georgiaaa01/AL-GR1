// client/src/pages/AdminOrdersPage.jsx
import { useEffect, useState } from "react";
import { fetchOrders, updateOrderStatus } from "../api/order.routes";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "sonner";

const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing order" },
    { value: "canceled", label: "Canceled order" },
    { value: "shipped", label: "Order shipped" },
];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

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

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setUpdatingId(orderId);
            const response = await updateOrderStatus(orderId, newStatus);

            if (response?.success) {
                setOrders((prev) =>
                    prev.map((o) =>
                        o.id === orderId ? { ...o, status: newStatus } : o
                    )
                );
                toast.success("Order status updated");
            } else {
                toast.error(response?.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Error updating status");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return <LoadingSpinner />;

    if (!orders.length) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 flex items-center justify-center">
                <div className="bg-white/90 rounded-2xl shadow-xl px-8 py-10 text-center">
                    <p className="text-gray-600 font-semibold">No orders have been placed yet 💼</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white/90 rounded-2xl shadow-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-pink-700 mb-6">All Orders</h2>

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
                                    {order.User && (
                                        <p className="text-xs mt-1 text-gray-600">
                                            Customer:{" "}
                                            <span className="font-semibold">
                                                {order.User.name}
                                            </span>{" "}
                                            <span className="text-gray-400">&lt;{order.User.email}&gt;</span>
                                        </p>
                                    )}
                                </div>

                                <div className="text-right space-y-1">
                                    <p className="text-sm font-semibold text-purple-700">
                                        Total: ${order.total_price?.toFixed(2)}
                                    </p>

                                    {/* Dropdown pentru status */}
                                    <div className="flex items-center justify-end gap-2">
                                        <span className="text-xs text-gray-500">Status:</span>
                                        <select
                                            value={order.status}
                                            disabled={updatingId === order.id}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="text-xs rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                        >
                                            {statusOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <p className="text-xs text-gray-500">
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
