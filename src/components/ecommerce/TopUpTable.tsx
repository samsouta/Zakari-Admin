import Badge from "../ui/badge/Badge";
import { useEffect, useRef, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useGetTopUpOrdersQuery, useUpdateTopUpMutation } from "../../services/api/productApi";


const TopUpTable = () => {
    const token = Cookies.get("token");
    const [searchQuery, setSearchQuery] = useState('');
    const [confirmTopUp, { isLoading: confirmLoading }] = useUpdateTopUpMutation();
    const [isPreviewOpen, setIsPreviewOpen] = useState<number | null>(null);
    const previewPopupRef = useRef<HTMLDivElement | null>(null);

    const { data: topUps, isLoading: isLoadingTopUps } = useGetTopUpOrdersQuery(token || '');

    // Filter top-ups based on search query
    const filteredTopUps = useMemo(() => {
        if (!topUps?.data || !searchQuery.trim()) {
            return topUps?.data || [];
        }

        const query = searchQuery.toLowerCase().trim();
        return topUps?.data.filter((topup) => {
            // Search by top-up ID
            const topupIdMatch = topup.id.toString().includes(query);

            // Search by username
            const usernameMatch = topup.user?.username?.toLowerCase().includes(query);

            // Search by payment method
            const paymentMethodMatch = topup.payment_method?.toLowerCase().includes(query);


            return topupIdMatch || usernameMatch || paymentMethodMatch;
        });
    }, [topUps?.data, searchQuery]);

    /**
     * Close meta popup on outside click
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                previewPopupRef.current &&
                !previewPopupRef.current.contains(event.target as Node)
            ) {
                setIsPreviewOpen(null);
            }
        };

        if (isPreviewOpen !== null) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isPreviewOpen]);

    /**
     * Handle confirm top-up
     */
    const handleConfirmTopUp = async (orderId: number) => {
        try {
            const response = await confirmTopUp({
                token: token || "",
                order_id: orderId
            }).unwrap();

            if (response?.success) {
                console.log('confirm top-up success', response);
            }
        } catch (error) {
            console.error("Failed to confirm top-up", error);
        }
    };

    /**
     * Clear search query
     */
    const clearSearch = () => {
        setSearchQuery('');
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-3 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 sm:mb-0">
                        Top-Up Requests Orders
                    </h3>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-72">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by ID, username, payment method..."
                            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        />
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Results Info */}
                {searchQuery && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>
                            {filteredTopUps.length === 0
                                ? `No results found for "${searchQuery}"`
                                : `Found ${filteredTopUps.length} top-up${filteredTopUps.length !== 1 ? 's' : ''
                                } for "${searchQuery}"`}
                        </span>
                    </div>
                )}
            </div>

            {/* Scrollable table wrapper */}
            <div className="w-full overflow-x-auto rounded-lg border text-black dark:text-white dark:border-gray-700">
                <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    <table className="min-w-[700px] w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold">OID</th>
                                <th className="px-4 py-3 text-left font-semibold">User</th>
                                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                                <th className="px-4 py-3 text-left font-semibold">Payment Method</th>
                                <th className="px-4 py-3 text-left font-semibold">Status</th>
                                <th className="px-4 py-3 text-left font-semibold">Action</th>
                                <th className="px-4 py-3 text-left font-semibold">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {isLoadingTopUps ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                                        Loading top-ups...
                                    </td>
                                </tr>
                            ) : filteredTopUps?.length ? (
                                filteredTopUps?.map((topup) => (
                                    <tr key={topup.id}>
                                        <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                                            {topup.id}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-start gap-3">
                                                <div className="h-[50px] w-[50px] rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                                    {topup.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-800 dark:text-white truncate">
                                                        {topup.user?.username || 'Unknown User'}
                                                    </p>
                                                    <div className="flex gap-1 mt-1">
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded whitespace-nowrap">
                                                                <span className="font-medium text-gray-600 dark:text-gray-300">UID:</span>
                                                                <span className="ml-1 text-gray-500 dark:text-gray-400">{topup.user_id}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                                        {new Date(topup.created_at).toLocaleDateString('en-US', {
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
                                            <span className="font-semibold text-green-600 dark:text-green-400">
                                                MMK {Math.floor(Number(topup.amount))}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-xs font-medium whitespace-nowrap">
                                                {topup.payment_method || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                                            <Badge
                                                size="sm"
                                                color={
                                                    topup.status === "pending" ? "warning" :
                                                        topup.status === "confirmed" ? "success" : "error"
                                                }
                                            >
                                                {topup.status === "pending" ? "Pending" :
                                                    topup.status === "confirmed" ? "Completed" : "Failed"}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-4">
                                            {topup?.status === "pending" ? (
                                                <button
                                                    disabled={confirmLoading}
                                                    className="w-full px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none dark:bg-green-500 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    onClick={() => handleConfirmTopUp(topup?.id)}
                                                >
                                                    {confirmLoading ? "Loading..." : "Confirm"}
                                                </button>
                                            ) : (
                                                <span className={`text-sm font-medium ${topup.status === "confirmed" ? "text-green-600" : "text-red-600"
                                                    }`}>
                                                    {topup.status === "confirmed" ? "Confirmed" : "Failed"}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 relative">
                                            <button
                                                onClick={() => {
                                                    setIsPreviewOpen(isPreviewOpen === topup.id ? null : topup.id);
                                                }}
                                                className="group relative inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out
                                                    bg-gradient-to-r from-blue-500 to-purple-600 text-white
                                                    hover:from-blue-600 hover:to-purple-700
                                                    active:scale-95
                                                    focus:outline-none focus:ring-2 focus:ring-blue-500/30
                                                    disabled:opacity-70 disabled:cursor-not-allowed
                                                    shadow-md hover:shadow-lg
                                                    dark:from-blue-400 dark:to-purple-500
                                                    dark:hover:from-blue-500 dark:hover:to-purple-600
                                                    sm:px-5"
                                                aria-label="View payment screenshot"
                                            >
                                                <svg
                                                    className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                <span className="hidden sm:inline">View Receipt</span>
                                                <span className="sm:hidden">View</span>
                                            </button>

                                            {isPreviewOpen === topup?.id && (
                                                <div
                                                    ref={previewPopupRef}
                                                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 sm:p-6"
                                                    role="dialog"
                                                    aria-modal="true"
                                                >
                                                    <div className="relative w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl">
                                                        {/* Close button */}
                                                        <button
                                                            onClick={() => setIsPreviewOpen(null)}
                                                            className="absolute -top-3 -right-3 p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 z-50"
                                                            aria-label="Close preview"
                                                        >
                                                            <svg
                                                                className="w-5 h-5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="2.5"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M6 18L18 6M6 6l12 12"
                                                                />
                                                            </svg>
                                                            <span className="sr-only">Close preview</span>
                                                        </button>

                                                        {/* Image container */}
                                                        <div className="p-4">
                                                            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                                                                {topup.upload?.url ? (
                                                                    <img
                                                                        src={`${import.meta.env.VITE_DOMAIN_URL}${topup.upload?.url}`}
                                                                        alt={`Payment receipt for order ${topup.id}`}
                                                                        className="w-full h-full object-contain"
                                                                        loading="lazy"
                                                                    />

                                                                ) : (
                                                                    <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-700">
                                                                        <p className="text-gray-500 dark:text-gray-400">No receipt available</p>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Download button */}
                                                            {topup.upload?.url && (
                                                                <a
                                                                    href={`${import.meta.env.VITE_DOMAIN_URL}${topup.upload.url}`}
                                                                    download={topup.upload.original_name || `receipt-${topup.id}.png`}
                                                                    className="mt-4 inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                                                >
                                                                    Download
                                                                </a>
                                                            )}
                                                        </div>

                                                        {/* Order details */}
                                                        <div className="px-4 pb-4">
                                                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                                                <p>Order ID: {topup.id}</p>
                                                                <p>Amount: MMK {Math.floor(Number(topup.amount))}</p>
                                                                <p>Payment Method: {topup.payment_method}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                                        {searchQuery
                                            ? `No top-ups found matching "${searchQuery}"`
                                            : "No top-ups found."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TopUpTable;