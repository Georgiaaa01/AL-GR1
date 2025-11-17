// client/src/pages/CartPage.jsx
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCart, deleteCartItem, clearCart, updateCartItem } from '../api/cart.routes';
import { placeOrder } from '../api/order.routes';
import { toast } from 'sonner';
import LoadingSpinner from '../components/LoadingSpinner';
import { setCartState, clearCartState } from '../store/slices/cartSlice';

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clearing, setClearing] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const dispatch = useDispatch();

    const loadCart = async () => {
        try {
            setLoading(true);
            const response = await fetchCart();

            if (response?.data && Array.isArray(response.data)) {
                setCart(response.data);
                dispatch(setCartState(response.data));
            } else {
                toast.error(response?.message || 'Could not load cart items.');
            }
        } catch {
            toast.error('Error loading cart.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await deleteCartItem(id);
            if (response?.success) {
                toast.success('Item removed from cart.');
                loadCart();
            } else {
                toast.error(response?.message || 'Could not remove item.');
            }
        } catch {
            toast.error('Error removing item.');
        }
    };

    const handleClear = async () => {
        try {
            setClearing(true);
            const response = await clearCart();
            if (response?.success) {
                toast.success('Cart cleared.');
                loadCart();
            } else {
                toast.error(response?.message || 'Could not clear cart.');
            }
        } catch {
            toast.error('Error clearing cart.');
        } finally {
            setClearing(false);
        }
    };

    const handlePlaceOrder = async () => {
        try {
            const response = await placeOrder();

            if (response?.success) {
                toast.success('Order placed successfully!');
                // golește coșul în Redux
                dispatch(clearCartState());
            } else {
                toast.error(response?.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Error placing order');
        }
    };

    const changeQuantity = async (item, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            setUpdatingId(item.id);
            const response = await updateCartItem(item.id, newQuantity);
            if (response?.success) {
                loadCart();
            } else {
                toast.error(response?.message || 'Could not update quantity.');
            }
        } catch {
            toast.error('Error updating quantity.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleIncrease = (item) => changeQuantity(item, item.quantity + 1);
    const handleDecrease = (item) => changeQuantity(item, item.quantity - 1);

    if (loading) return <LoadingSpinner />;

    if (!cart.length) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 flex items-center justify-center">
                <div className="bg-white/90 rounded-2xl shadow-xl px-8 py-10 text-center">
                    <p className="text-gray-600 font-semibold">Your cart is empty 💔</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white/90 rounded-2xl shadow-xl p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-pink-700">Your Cart</h2>
                    <button
                        onClick={handleClear}
                        disabled={clearing}
                        className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow disabled:opacity-50"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="space-y-4">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center p-4 sm:p-5 border border-pink-100 rounded-2xl shadow-sm bg-white hover:border-pink-300 transition"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.Product?.image || 'https://via.placeholder.com/80'}
                                    alt={item.Product?.name || 'Product'}
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow"
                                />

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {item.Product?.name || 'Product'}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        ${item.Product?.price}
                                    </p>

                                    <div className="mt-3 flex items-center gap-2">
                                        <button
                                            onClick={() => handleDecrease(item)}
                                            disabled={updatingId === item.id || item.quantity <= 1}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-50 text-pink-700 hover:bg-pink-100 disabled:opacity-40"
                                        >
                                            -
                                        </button>
                                        <span className="min-w-[2rem] text-center font-semibold text-gray-800">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleIncrease(item)}
                                            disabled={updatingId === item.id}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-40"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDelete(item.id)}
                                className="ml-4 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex flex-col gap-3">
                    <button
                        onClick={handlePlaceOrder}
                        className="w-full sm:w-auto inline-flex justify-center rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-pink-700 transition"
                    >
                        Place Order
                    </button>

                    <div className="text-xs text-rose-600 max-w-xl">
                        <p>
                            Please note that online payment is not available at the moment. We can only accept cash payment at delivery. Thank you for understanding!💌
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
