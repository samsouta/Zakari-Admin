import { useAddProductMutation, useDeleteProductMutation, useEditProductMutation, useGetProductsQuery, useGetProductsWithIdQuery } from "../../services/api/productApi";
import { useEffect, useState } from "react";
import { FormProps, ProductData } from "../../types/productType";
import { productFilterItems } from "../../data/FilterItems";
import Badge from "../../components/ui/badge/Badge";
import { PlusCircleIcon, Settings2, Trash2 } from "lucide-react";
import { AddProductModal } from "./AddProductModal";
import Cookies from "js-cookie";
import { EditProductModal } from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";

export default function ProductTable() {
    const token = Cookies.get("token");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
    const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string | boolean>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<FormProps | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { data: allProducts, isLoading } = useGetProductsQuery();
    const [addProduct, { isLoading: isAddProductLoading }] = useAddProductMutation();
    const [editProduct, { isLoading: isEditProductLoading }] = useEditProductMutation()
    const [deleteProduct, { isLoading: isDeleteProductLoading }] = useDeleteProductMutation()
    const { data: getProductWithId } = useGetProductsWithIdQuery(selectedProduct)
    const [error, setError] = useState<string | null>(null);

    /**
     * @UseEffect setup editingProduct
     */
    useEffect(() => {
        if (!isEditModalOpen) return;
        if (!getProductWithId?.data) return;

        const product = getProductWithId.data;

        const transformedProduct: FormProps = {
            service_id: product.service_id,
            game_id: product.game_id,
            name: product.name,
            description: product.description,
            img_url: product.img_url,
            preview_img: product.preview_img,
            price: parseFloat(product.price), // convert string to number
            fake_price: parseFloat(product.fake_price), // convert string to number
            is_popular: product.is_popular,
            data: {
                rank: product.data.rank || "",
                skin_count: Number(product.data.skin_count) || 0,
                hero_count: Number(product.data.hero_count) || 0,
                amount: product.data.amount || 0,
            },
            credentials: {
                email: product.credentials?.email || "",
                email_password: product.credentials?.email_password || "",
                game_password: product.credentials?.game_password || "",
            },
        };

        setEditingProduct(transformedProduct);
    }, [isEditModalOpen, getProductWithId?.data]);


    /**
     * @filtering and searching products
     */
    useEffect(() => {
        let result = allProducts?.data || [];

        // Apply filter first
        if (selectedFilter !== 'all') {
            result = result.filter((product: ProductData) => {
                if (typeof selectedFilter === 'boolean') {
                    return product.is_sold === selectedFilter;
                }
                return product?.service?.name?.toLowerCase().replace(/\s+/g, '-') === selectedFilter;
            });
        }

        // Apply search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter((product: ProductData) => {
                // Search by product name
                const nameMatch = product.name?.toLowerCase().includes(query);

                // Search by product ID (convert to string for search)
                const idMatch = product.id?.toString().toLowerCase().includes(query);

                return nameMatch || idMatch;
            });
        }

        setFilteredProducts(result);
    }, [selectedFilter, allProducts, searchQuery]);

    // Function to clear search
    const clearSearch = () => {
        setSearchQuery('');
    };

    // Function to get search results count for display
    const getSearchResultsText = () => {
        if (!searchQuery.trim()) return null;

        const count = filteredProducts.length;
        if (count === 0) {
            return `No products found for "${searchQuery}"`;
        }
        return `Found ${count} product${count !== 1 ? 's' : ''} for "${searchQuery}"`;
    };

    /**
     * @function handleAddProductSubmit
     * @description Handles the submission of the add product form.
     */
    const handleAddProductSubmit = async (formData: FormProps) => {
        if (!formData) {
            return;
        }
        try {
            const res = await addProduct({
                token: token || "",
                formData: formData,
            }).unwrap();

            if (res?.success) {
                setIsAddModalOpen(false);
                setError(null);
            } else {
                setError(res?.message);
            }
        } catch (error) {
            console.error("Error adding product:", error);
            setError("Failed to add product. Please try again.");
        }

        // Reset modal state
        setIsAddModalOpen(false);
    };

    /**
     * @Edit Product 
     */
    const handleEditProductSubmit = async (formData: FormProps) => {
        if (!formData && !selectedProduct) {
            return;
        }

        try {
            const res = await editProduct({
                token: token || "",
                formData: formData,
                id: Number(selectedProduct)
            }).unwrap();

            if (res?.success) {
                setIsEditModalOpen(false);
                setError(null);
            } else {
                setError(res?.message);
                console.log(res?.message)
            }
        } catch (error) {
            console.error("Error adding product:", error);
            setError("Failed to add product. Please try again.");
        }

        // Reset modal state
        setIsEditModalOpen(false);
    }

    /**
     * @Delete product 
     */
    const handleDeleteProduct = async () => {
        if (!selectedProduct) {
            return;
        }

        try {
            const res = await deleteProduct({
                token: token || "",
                id: Number(selectedProduct)
            }).unwrap();

            if (res?.success) {
                setIsDeleteModalOpen(false);
                console.log(res?.message)
            } else {
                console.log(res?.message)
            }
        } catch (error) {
            console.error("Error adding product:", error);
        }

        // Reset modal state
        setIsDeleteModalOpen(false);
    }


    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-3 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 sm:mb-0">
                        Product Management
                    </h3>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-72 mb-4 sm:mb-0">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or ID..."
                            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        />
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                title="Clear search"
                            >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full md:flex-row md:items-center">
                    {/* Filter Dropdown */}
                    <div className="relative flex-1 min-w-[200px]">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="w-full inline-flex justify-between items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750"
                        >
                            <div className="flex items-center gap-2 truncate">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                <span className="truncate">
                                    {selectedFilter === 'all' ? 'All Products' :
                                        productFilterItems.find(item => item.value === selectedFilter)?.label || 'Filter Products'}
                                </span>
                            </div>
                            <svg className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isFilterOpen && (
                            <div className="absolute left-0 right-0 mt-2 w-full z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                                <div className="p-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                    {productFilterItems?.map((item) => (
                                        <button
                                            key={item.label}
                                            onClick={() => {
                                                setSelectedFilter(item.value);
                                                setIsFilterOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors
                                                ${selectedFilter === item.value
                                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            <span className="truncate flex-1 text-left">{item.label}</span>
                                            {selectedFilter === item.value && (
                                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Add Product Button */}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="
                            flex-shrink-0 inline-flex justify-center items-center gap-2 
                            px-4 sm:px-6 py-2.5 
                            text-sm font-medium
                            text-white
                            bg-gradient-to-r from-blue-500 to-blue-600
                            hover:from-blue-600 hover:to-blue-700
                            dark:from-blue-600 dark:to-blue-700
                            dark:hover:from-blue-700 dark:hover:to-blue-800
                            rounded-lg
                            shadow-sm hover:shadow-md
                            outline-none
                            focus:ring-2 focus:ring-blue-500/30 
                            focus:shadow-lg
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                            transition-all duration-200 
                            transform hover:-translate-y-0.5
                            active:translate-y-0 active:shadow-sm
                            w-full sm:w-auto
                            min-w-[140px]
                        "
                    >
                        <PlusCircleIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">Add Product</span>
                    </button>
                </div>

                {/* Search Results Info */}
                {searchQuery && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{getSearchResultsText()}</span>
                    </div>
                )}
            </div>

            {/* Scrollable table wrapper */}
            <div className="w-full overflow-x-auto rounded-lg border text-black dark:text-white dark:border-gray-700">
                <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    <table className="min-w-[700px] w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold">PID</th>
                                <th className="px-4 py-3 text-left font-semibold">Product</th>
                                <th className="px-4 py-3 text-left font-semibold">Category</th>
                                <th className="px-4 py-3 text-left font-semibold">Price</th>
                                <th className="px-4 py-3 text-left font-semibold">Status</th>
                                <th className="px-4 py-3 text-left font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span>Loading products...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <span>
                                                {searchQuery.trim() || selectedFilter !== 'all'
                                                    ? 'No products found matching your criteria'
                                                    : 'No products available'
                                                }
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product?.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                                            <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                {product?.id}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-start gap-3">
                                                <img
                                                    src={product?.img_url}
                                                    alt={product?.name}
                                                    className="h-[50px] w-[50px] rounded-md object-cover shrink-0"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-white">
                                                        {product?.name}
                                                    </p>
                                                    <div className="flex gap-1 mt-1">
                                                        {product?.service?.name === "account" ? (
                                                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                                                {product?.data?.rank && (
                                                                    <span className="px-2.5 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-sm hover:shadow-md transition-all">
                                                                        <span className="font-semibold">Rate:</span>
                                                                        <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full">
                                                                            {product.data.rank}
                                                                        </span>
                                                                    </span>
                                                                )}
                                                                {product?.data?.hero_count && (
                                                                    <span className="px-2.5 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full shadow-sm hover:shadow-md transition-all">
                                                                        <span className="font-semibold">Hero:</span>
                                                                        <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full">
                                                                            {product.data.hero_count}
                                                                        </span>
                                                                    </span>
                                                                )}
                                                                {product?.data?.skin_count && (
                                                                    <span className="px-2.5 py-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full shadow-sm hover:shadow-md transition-all">
                                                                        <span className="font-semibold">Skin:</span>
                                                                        <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full">
                                                                            {product.data.skin_count}
                                                                        </span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span>💎</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                                        {new Date(product?.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                                            <span className="capitalize">{product?.service?.name}</span>
                                        </td>
                                        <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                                            <span className="font-semibold">MMK {Math.floor(Number(product?.price))}</span>
                                        </td>
                                        <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                                            <Badge
                                                size="sm"
                                                color={
                                                    product?.is_sold === true
                                                        ? "error"
                                                        : "success"
                                                }
                                            >
                                                {product?.is_sold === true ? "Sold" : "Available"}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => {
                                                        setSelectedProduct(product?.id || null);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="p-1.5 text-gray-500 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                                    title="Edit product"
                                                >
                                                    <Settings2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedProduct(product?.id || null);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="p-1.5 text-red-500 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                                    title="Delete product"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add product modal box */}
            <AddProductModal
                error={error}
                isLoading={isAddProductLoading}
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddProductSubmit}
            />

            {/* Edit product modal box  */}
            <EditProductModal
                error={error}
                product={editingProduct}
                isLoading={isEditProductLoading}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleEditProductSubmit}
            />

            {/* Delete product modal */}
            <DeleteProductModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteProduct}
                isDeleting={isDeleteProductLoading}
                title="Delete Product"
                message={`Are you sure you want to delete? This action cannot be undone.`}
            />


        </div>
    );
}