import { useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { useDeleteUserReviewMutation, useGetUserReviewsQuery } from "../../services/api/authApi";
import { ReviewType } from "../../types/authTypes";
import Cookies from "js-cookie";


export default function ReviewTable() {
    const token = Cookies.get("token");
    const { data: reviewData, refetch } = useGetUserReviewsQuery();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredReviews, setFilteredReviews] = useState<ReviewType[]>([]);
    const [deleteUserReview, { isLoading: isDeleting }] = useDeleteUserReviewMutation();

    /**
     * @filter Search query 
     */
    useEffect(() => {
        let result = reviewData?.data || [];

        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase();
            result = result.filter(
                (comment) =>
                    comment?.user?.username?.toLowerCase().includes(query) ||
                    comment?.comment?.toString().includes(query)
            );
        }
        setFilteredReviews(result)
    }, [reviewData?.data, searchTerm]);
    // reset serach input 
    const clearSearch = () => setSearchTerm("");

    /**
     * @function
     * Handle Delete Review
     */
    const handleDeleteReview = async (id: number) => {

        try {
            const res = await deleteUserReview({
                token: token || '',
                reviewId: Number(id)
            }).unwrap();
            if (res?.success) {
                await refetch();
                console.log('Delete review success');
            }
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };





    /**
     * @function
     * Render Star Rating
     */
    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                            }`}
                    />
                ))}
                <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                    ({rating})
                </span>
            </div>
        );
    };

    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-3 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">User Reviews</h3>
                    <div className="relative flex flex-wrap gap-2 w-full sm:w-auto">
                        <input
                            type="text"
                            className="w-full sm:w-[300px] px-3 py-1.5 text-sm rounded-md border dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white pr-8"
                            placeholder="Search user, product, or comment"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
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

                <div className="w-full overflow-x-auto rounded-lg border text-black dark:text-white dark:border-gray-700">
                    <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                        <table className="min-w-[800px] w-full text-sm">
                            <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">ID</th>
                                    <th className="px-4 py-3 text-left font-semibold">User</th>
                                    <th className="px-4 py-3 text-left font-semibold">Rating</th>
                                    <th className="px-4 py-3 text-left font-semibold">Comment</th>
                                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredReviews.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <Star className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                                                <span>No reviews found.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReviews.map((review) => (
                                        <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-4 py-4 font-medium">{review.id}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{review?.user?.username}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        UID: {review.user_id}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                {renderStars(review.rating)}
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="max-w-[200px]">
                                                    <p className="truncate text-gray-700 dark:text-gray-300" title={review.comment}>
                                                        {review.comment || "No comment"}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                    {new Date(review.created_at).toLocaleString("en-US", {
                                                        dateStyle: "short",
                                                        timeStyle: "short",
                                                    })}
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        disabled={isDeleting}
                                                        className="flex items-center gap-1 px-2 py-1 text-xs text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-300 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-md transition-colors"
                                                        onClick={() => handleDeleteReview(review.id)}
                                                        title="Delete review"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        <span className="hidden sm:inline">
                                                            {isDeleting ? "..." : "Delete"} 
                                                        </span>
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

                {/* Summary Stats */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">

                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span>
                            Avg Rating: {filteredReviews.length > 0
                                ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1)
                                : "0.0"
                            }
                        </span>
                    </div>
                    <div>
                        <span>Total: {filteredReviews.length} reviews</span>
                    </div>
                </div>
            </div>
        </>
    );
}