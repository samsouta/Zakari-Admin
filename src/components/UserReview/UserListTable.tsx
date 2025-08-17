import { useEffect, useState } from "react";
import { User, Users, Search } from "lucide-react";
import { useGetAllUserQuery } from "../../services/api/authApi";
import Cookies from "js-cookie";
import { UserType } from "../../types/authTypes";




const UserListTable = () => {
    const token = Cookies.get("token");
    const { data: userData, isLoading } = useGetAllUserQuery(token || '');
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);

    /**
     * Filter users based on search query
     */
    useEffect(() => {
        let result = userData?.data || [];

        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase();
            result = result.filter(
                (user) =>
                    user?.username?.toLowerCase().includes(query) ||
                    user?.id?.toString().includes(query) ||
                    user?.phone_number?.includes(query)
            );
        }
        setFilteredUsers(result);
    }, [userData?.data, searchTerm]);

    // Reset search input
    const clearSearch = () => setSearchTerm("");

    /**
     * Check if user account was created within the last 7 days
     */
    const isNewUser = (createdAt: string): boolean => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return new Date(createdAt) > sevenDaysAgo;
    };

    /**
     * Format phone number for better display
     */
    const formatPhoneNumber = (phone: string): string => {
        // Basic formatting - adjust based on your needs
        if (phone.length === 10) {
            return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    };

    if (isLoading) {
        return (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-3 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Users className="w-5 h-5 animate-pulse" />
                        <span>Loading users...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-3 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">User Management List</h3>
                <div className="relative flex flex-wrap gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            className="w-full pl-9 pr-8 py-1.5 text-sm rounded-md border dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white"
                            placeholder="Search by name, ID, or phone"
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
            </div>

            <div className="w-full overflow-x-auto rounded-lg border text-black dark:text-white dark:border-gray-700">
                <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    <table className="min-w-[800px] w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold">ID</th>
                                <th className="px-4 py-3 text-left font-semibold">Name</th>
                                <th className="px-4 py-3 text-left font-semibold">Phone Number</th>
                                <th className="px-4 py-3 text-left font-semibold">Created Date</th>
                                <th className="px-4 py-3 text-left font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                                            <span>
                                                {searchTerm ? "No users found matching your search." : "No users found."}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-4 py-4 font-medium">{user.id}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{user.username}</span>
                                                    {user.username && (
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            @{user.username}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="font-mono text-sm">
                                                {formatPhoneNumber(user.phone_number)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                {new Date(user?.created_at).toLocaleString("en-US", {
                                                    dateStyle: "short",
                                                    timeStyle: "short",
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                {isNewUser(user.created_at) && (
                                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                                                        New
                                                    </span>
                                                )}
                                                {user?.is_banned ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full transition-all hover:bg-red-200 dark:hover:bg-red-900/40">
                                                        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                                        </svg>
                                                        Banned
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full transition-all hover:bg-green-200 dark:hover:bg-green-900/40">
                                                        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                        </svg>
                                                        Active
                                                    </span>
                                                )}
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
                    <Users className="w-4 h-4" />
                    <span>Total: {filteredUsers.length} users</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>
                        New Users: {filteredUsers.filter(user => isNewUser(user.created_at)).length}
                    </span>
                </div>
                {searchTerm && (
                    <div className="flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        <span>Filtered results for: "{searchTerm}"</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserListTable;