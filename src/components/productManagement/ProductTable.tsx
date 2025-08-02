import { useGetProductsQuery } from "../../services/api/productApi";
import { useEffect, useState } from "react";
import { ProductData } from "../../types/productType";
import { productFilterItems } from "../../data/FilterItems";
// import Cookies from "js-cookie";
import { PlusIcon } from "../../icons";
import Badge from "../../components/ui/badge/Badge";
import { Settings2, Trash2 } from "lucide-react";
import { AddProductModal } from "./AddProductModal";

export default function ProductTable() {
    // const token = Cookies.get("token");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { data: allProducts, isLoading } = useGetProductsQuery();
    const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string | boolean>('all');
    const [isAddModalOpen , setIsAddModalOpen] = useState(false);

    /**
     * @filtering products
     */
    useEffect(() => {
        if (selectedFilter === 'all') {
            setFilteredProducts(allProducts?.data || []);
        } else {
            const result = allProducts?.data.filter((product: ProductData) => {
                if (typeof selectedFilter === 'boolean') {
                    return product.is_sold === selectedFilter; // Assuming is_sold is boolean
                }
                return product.product_type === selectedFilter;
            });
            setFilteredProducts(result || []);
        }
    }, [selectedFilter, allProducts]);


    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-3 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            {/* Header */}
            <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Product Management
                </h3>
                <div className="relative flex gap-1">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="inline-flex justify-center items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                    >
                        <span>Filter</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isFilterOpen && (
                        <div className="absolute right-0 mt-2 w-52 z-50 text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
                            <ul className="p-2 space-y-1 text-sm">
                                {productFilterItems?.map((item) => (
                                    <li key={item.label}>
                                        <button
                                            onClick={() => {
                                                setSelectedFilter(item.value);
                                                setIsFilterOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedFilter === item.value
                                                ? "bg-gray-200 dark:bg-gray-700 font-semibold"
                                                : ""
                                                }`}
                                        >
                                            {item.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                    onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex justify-center items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                    >
                        <span>Add Product</span>
                        <PlusIcon />
                    </button>
                </div>
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
                                    <td colSpan={7} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredProducts.map((product) => (
                                <tr key={product?.id}>
                                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                                        {product?.id}
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
                                                    {product?.product_type === "account" ? (
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
                                        {product?.product_type}
                                    </td>
                                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                                        MMK {Math.floor(Number(product?.price))}
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
                                            <button className="p-1.5 text-gray-500 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                                <Settings2 className="w-5 h-5" />
                                            </button>
                                            <button className="p-1.5 text-red-500 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* // add product modal box  */}
            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={(formData) => {
                    console.log("Submitted:", formData);
                    // call API here
                }}
            />

        </div>
    );
}
