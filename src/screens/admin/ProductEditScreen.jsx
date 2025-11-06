// src/screens/admin/ProductEditScreen.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChevronLeft } from 'lucide-react';

import {
    useGetProductDetailsQuery,
    useUpdateProductMutation,
    useUploadProductImageMutation
} from '../../slices/productApiSlice';

// Placeholder components
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

const ProductEditScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [description, setDescription] = useState('');

    // RTK Query hooks
    const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
    const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
    const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation(); // <-- NEW HOOK

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];

        if (!file) {
            toast.error('Please select an image file');
            return;
        }

        const formData = new FormData();
        // The key 'image' must match what's expected by multer in uploadMiddleware.js
        formData.append('image', file);

        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image); // Set the image state to the returned path (/uploads/filename.ext)
            e.target.value = null;
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setStock(product.stock);
            setDescription(product.description);
        }
    }, [product]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const updatedProduct = {
            productId,
            name,
            price,
            image,
            brand,
            category,
            stock,
            description,
        };

        try {
            await updateProduct(updatedProduct).unwrap();
            toast.success('Product updated successfully');
            refetch(); // Refetch data to ensure UI is consistent
            navigate('/admin/productlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };


    return (
        <div className="py-6">
            <Link to='/admin/productlist' className="text-indigo-600 hover:text-indigo-800 flex items-center mb-6">
                <ChevronLeft className="w-5 h-5 mr-1" />
                Go Back
            </Link>

            <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Product</h1>

                {loadingUpdate && <Loader />}

                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error.data.message}</Message>
                ) : (
                    <form onSubmit={submitHandler} className="space-y-6">
                        {/* Input fields for product details */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                id="name"
                                type="text"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                id="price"
                                type="number"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                            />
                        </div>

                        {/* ... Add Brand, Category, Stock, Description, and Image fields in a similar manner ... */}

                        <div>
                            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                            <input
                                id="brand"
                                type="text"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                                placeholder="Enter brand"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Count In Stock</label>
                            <input
                                id="stock"
                                type="number"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                                placeholder="Enter stock count"
                                value={stock}
                                onChange={(e) => setStock(Number(e.target.value))}
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            <input
                                id="category"
                                type="text"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                                placeholder="Enter category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                id="description"
                                rows="4"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input
                                id="image"
                                type="text"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                                placeholder="Enter image URL"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            />
                        </div>
                        {image && (
                            <div className="mt-4">
                                <img
                                    src={
                                        image.startsWith('http')
                                            ? image
                                            : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${image}`
                                    }
                                    alt="Product Preview"
                                    className="w-32 h-32 object-cover rounded-md border border-gray-300"
                                />
                                <p className="mt-1 text-xs text-gray-500">New Image Preview (Path: {image})</p>
                            </div>
                        )}
                        <div>
                            <label htmlFor="image-file" className="block text-sm font-medium text-gray-700">Upload Image File</label>
                            <input
                                id="image-file"
                                type="file"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                                onChange={uploadFileHandler} // <-- Call the new handler
                            />
                            {loadingUpload && <Loader />}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loadingUpdate}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loadingUpdate ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                            Update Product
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProductEditScreen;