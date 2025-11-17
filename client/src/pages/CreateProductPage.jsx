// client/src/pages/CreateProductPage.jsx
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CreateEditProductForm from '../components/CreateEditProductForm';
import { createProduct } from '../api/product.routes';

export default function CreateProductPage() {
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            const response = await createProduct(formData);

            if (response?.success) {
                toast.success('Product created successfully!');
                navigate('/products');
            } else {
                toast.error(response?.message || 'Failed to create product');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred while creating the product');
            throw error;
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-pink-50 via-rose-100 to-purple-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-3xl bg-white/90 rounded-3xl shadow-2xl p-6 sm:p-8">
                <h1 className="text-2xl font-bold text-pink-700 mb-4">Create Product</h1>
                <CreateEditProductForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
}
