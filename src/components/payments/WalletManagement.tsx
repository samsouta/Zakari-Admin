import { useState, useEffect } from 'react';
import { Search, Plus, Check, AlertTriangle } from 'lucide-react';
import { useGetUsersQuery, useUpdateWalletMutation } from '../../services/api/authApi';
import Cookies from 'js-cookie';
import { UserType } from '../../types/authTypes';
import { MessageModal } from '../ui/alert/MessageModal';

const WalletManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateType, setUpdateType] = useState<'add' | 'subtract'>('add');
    const [updateAmount, setUpdateAmount] = useState('');
    const [updateReason, setUpdateReason] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [pendingUpdate, setPendingUpdate] = useState<{
        type: 'add' | 'subtract';
        amount: number;
        reason: string;
        newBalance: number;
    } | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const token = Cookies.get('token');
    const [updateWallet, { isLoading }] = useUpdateWalletMutation();

    const { data: userData } = useGetUsersQuery(token || '');
    const [users, setUsers] = useState<UserType[]>([]);

    useEffect(() => {
        if (userData?.data) {
            setUsers(userData.data);
        }

    }, [userData]);

    const filteredUsers = users.filter(
        (user) =>
            !user?.is_admin &&
            (user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user?.phone_number.includes(searchQuery))
    );

    const validateUpdate = () => {
        const newErrors: { [key: string]: string } = {};
        const amount = parseFloat(updateAmount);

        if (!updateAmount || isNaN(amount) || amount <= 0) {
            newErrors.amount = 'Please enter a valid amount greater than 0';
        }

        if (!updateReason.trim()) {
            newErrors.reason = 'Please provide a reason for this transaction';
        }

        if (
            updateType === 'subtract' &&
            selectedUser &&
            amount > Number(selectedUser.wallet_amount)
        ) {
            newErrors.amount = 'Cannot subtract more than current balance';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdateWallet = () => {
        if (!validateUpdate() || !selectedUser) return;
        const amount = parseFloat(updateAmount);
        const current = Number(selectedUser.wallet_amount);
        const newBalance = updateType === 'add' ? current + amount : current - amount;

        setPendingUpdate({
            type: updateType,
            amount,
            reason: updateReason,
            newBalance,
        });

        setShowUpdateModal(false);
        setShowConfirmModal(true);
    };

    const confirmUpdate = async () => {
        if (!selectedUser || !pendingUpdate) return;

        try {
            const response = await updateWallet({
                token: token || '',
                userId: selectedUser.id,
                walletAmount: Number(updateAmount),
            }).unwrap();

            if (response?.success) {
                setMessageContent('Wallet updated successfully!');
                setShowMessageModal(true);
            } else {
                setErrors({
                    wallet: response?.message || 'Failed to update wallet'
                })
                setMessageContent(response?.message || 'Failed to update wallet');
                setShowMessageModal(true);

            }
        } catch (err) {
            console.error('Failed to update wallet:', err);
            setMessageContent('Something went wrong while updating wallet.');
            setShowMessageModal(true);
        }

        // Reset all states
        setUpdateAmount('');
        setUpdateReason('');
        setPendingUpdate(null);
        setErrors({});
        setShowConfirmModal(false);
    };

    return (
        <>
            <div className="flex h-screen text-black dark:text-white">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="shadow-sm border-b h-16 flex items-center justify-between px-6">
                        <h2 className="text-xl font-semibold">Wallet Management</h2>
                    </header>

                    <div className="border-b px-6 py-4">
                        <div className="max-w-md relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by username or phone number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Search Results */}
                            <div className="rounded-lg shadow">
                                <div className="px-6 py-4 border-b">
                                    <h3 className="text-lg font-semibold">Search Results</h3>
                                </div>
                                <div className="p-6">
                                    {searchQuery === '' ? (
                                        <p className="text-gray-500 text-center py-8">Enter a username or phone number to search</p>
                                    ) : filteredUsers.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No users found</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {filteredUsers.map((user) => (
                                                <div
                                                    key={user.id}
                                                    onClick={() => setSelectedUser(user)}
                                                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedUser?.id === user.id ? 'border-blue-500' : 'border-gray-200'
                                                        }`}
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <img
                                                            src="https://ik.imagekit.io/deceuior6/PHOTO/11f98e8b-2b04-4239-ac6e-b439764155ef.webp?updatedAt=1752902895690"
                                                            alt={user.username}
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                        <div className="flex-1">
                                                            <h4 className="font-medium">{user.username}</h4>
                                                            <p className="text-sm text-gray-500">{user?.phone_number}</p>
                                                            <p className="text-sm font-medium text-green-600">
                                                                MMK{Math.floor(Number(user?.wallet_amount))}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* User Detail Section */}
                            <div className="rounded-lg shadow">
                                <div className="px-6 py-4 border-b">
                                    <h3 className="text-lg font-semibold">User Details</h3>
                                </div>
                                <div className="p-6">
                                    {!selectedUser ? (
                                        <p className="text-gray-500 text-center py-8">Select a user to view details</p>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src="https://ik.imagekit.io/deceuior6/PHOTO/11f98e8b-2b04-4239-ac6e-b439764155ef.webp?updatedAt=1752902895690"
                                                    alt={selectedUser.username}
                                                    className="w-16 h-16 rounded-full object-cover"
                                                />
                                                <div>
                                                    <h4 className="text-xl font-semibold">{selectedUser.username}</h4>
                                                    <p className="text-gray-600">{selectedUser.phone_number}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {selectedUser.email || <span className="italic text-gray-400">No email provided</span>}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="rounded-lg p-4 bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Current Balance</span>
                                                    <span className="lg:text-2xl text-md font-bold text-green-600">
                                                        MMK{Math.floor(Number(selectedUser.wallet_amount))}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => {
                                                        setUpdateType('add');
                                                        setShowUpdateModal(true);
                                                    }}
                                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    <span>Add Funds</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Update Modal */}
                {showUpdateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="rounded-lg bg-white dark:bg-gray-800 max-w-md w-full">
                            <div className="px-6 py-4 border-b">
                                <h3 className="text-lg font-semibold">{updateType === 'add' ? 'Add Funds' : 'Subtract Funds'}</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={updateAmount}
                                        onChange={(e) => setUpdateAmount(e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg ${errors.amount ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter amount..."
                                    />
                                    {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Reason</label>
                                    <textarea
                                        value={updateReason}
                                        onChange={(e) => setUpdateReason(e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg ${errors.reason ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        rows={3}
                                        placeholder="Enter reason for this transaction..."
                                    />
                                    {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t flex justify-end gap-2">
                                <button
                                    onClick={() => {
                                        setShowUpdateModal(false);
                                        setUpdateAmount('');
                                        setUpdateReason('');
                                        setErrors({});
                                    }}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateWallet}
                                    disabled={isLoading}
                                    className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isLoading ? 'Processing...' : 'Continue'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirm Modal */}
                {showConfirmModal && pendingUpdate && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
                            <div className="px-6 py-4 border-b flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                                <h3 className="text-lg font-semibold">Confirm Transaction</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-sm  mb-2">User: <strong>{selectedUser.username}</strong></p>
                                <p className="text-sm ">
                                    Amount: {updateType === 'add' ? '+' : '-'} MMK {pendingUpdate.amount.toFixed(2)}
                                </p>
                                <p className="text-sm ">New Balance: MMK {pendingUpdate.newBalance.toFixed(2)}</p>
                                <p className="text-sm  mt-2">Reason: <span className="italic">{pendingUpdate.reason}</span></p>
                            </div>
                            <div className="px-6 py-4 border-t flex justify-end gap-2">
                                <button
                                    onClick={() => {
                                        setShowConfirmModal(false);
                                        setPendingUpdate(null);
                                    }}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmUpdate}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Message Modal */}
            {showMessageModal && (
                <MessageModal
                    message={messageContent}
                    onClose={() => setShowMessageModal(false)}
                />
            )}

        </>
    );
};

export default WalletManagement;
