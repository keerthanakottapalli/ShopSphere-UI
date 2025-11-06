// src/screens/admin/ProductListScreen.jsx

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Trash, Edit, Plus, X } from 'lucide-react';

import {
    useGetProductsQuery,
    useCreateProductMutation,
    useDeleteProductMutation,
} from '../../slices/productApiSlice';
import Paginate from '../../components/Paginate';

// Placeholder components (ensure these are available or use your existing ones)
const Loader = () => (
    <div className="flex justify-center items-center py-5">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
);

const Message = ({ variant = 'info', children }) => {
    const baseClasses = 'p-3 rounded-md text-sm my-4';
    let colorClasses = variant === 'danger' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700';
    return <div className={`${baseClasses} ${colorClasses}`}>{children}</div>;
};


const ProductListScreen = () => {
    const navigate = useNavigate();
    const { pageNumber } = useParams();


    // RTK Query Hooks
    const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNumber });

    // Then you would set 'products' to the data.products
    const products = data?.products || [];
    const page = data?.page;
    const pages = data?.pages;

    console.log('Fetched Products:', products);

    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

    // Handlers
    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id).unwrap();
                toast.success('Product deleted successfully');
                // Refetch is automatically handled by the invalidatesTags: ['Product']
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm('Create a sample product?')) {
            try {
                const res = await createProduct().unwrap();
                // Navigate to the newly created product's edit page
                navigate(`/admin/product/${res._id}/edit`);
                toast.success('Sample product created. Please edit details.');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <div className="py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                <button
                    onClick={createProductHandler}
                    disabled={loadingCreate}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${loadingCreate ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                >
                    {loadingCreate ? (
                        <Loader />
                    ) : (
                        <><Plus className="w-5 h-5" /> <span>Create Product</span></>
                    )}
                </button>
            </div>

            {loadingDelete && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error?.data?.message || error.error}</Message>
            ) : (
                <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRICE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CATEGORY</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BRAND</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STOCK</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product._id.substring(18)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        {/* Edit Button (links to a new admin route we will define next) */}
                                        <button
                                            onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                                            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-100 transition-colors"
                                            title="Edit Product"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => deleteHandler(product._id)}
                                            disabled={loadingDelete}
                                            className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50"
                                            title="Delete Product"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Paginate
                pages={pages}
                page={page}
                isAdmin={true}
            />
        </div>
    );
};

export default ProductListScreen;