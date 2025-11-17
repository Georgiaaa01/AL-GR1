// client/src/pages/EditProductPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CreateEditProductForm from '../components/CreateEditProductForm';
import { getProductById, updateProduct } from '../api/product.routes';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await getProductById(id);

                if (response?.success || response?.data) {
                    setProduct(response.data || response);
                } else {
                    setError(response?.message || 'Failed to load product');
                    toast.error('Failed to load product');
                    setTimeout(() => navigate('/products'), 2000);
                }
            } catch (err) {
                setError(err.message || 'An error occurred while fetching the product');
                toast.error('An error occurred while fetching the product');
                setTimeout(() => navigate('/products'), 2000);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, navigate]);

    const handleSubmit = async (formData) => {
        try {
            const response = await updateProduct(id, formData);

            if (response?.success) {
                toast.success('Product updated successfully!');
                navigate('/products');
            } else {
                toast.error(response?.message || 'Failed to update product');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred while updating the product');
            throw error;
        }
    };

    if (loading && !product) {
        return <LoadingSpinner />;
    }

    if (error && !product) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-pink-50 via-rose-100 to-purple-100 flex items-center justify-center">
                <div className="bg-white/90 rounded-2xl shadow-xl px-8 py-10 text-center">
                    <p className="text-rose-500 font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-100 to-purple-100 px-4 py-12">
            <div className="w-full max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-6 sm:p-8 mb-10">
                <h1 className="text-2xl font-bold text-pink-700 mb-4">Edit Product</h1>
                <CreateEditProductForm product={product} onSubmit={handleSubmit} isLoading={loading} />
            </div>
        </div>
    );

}
