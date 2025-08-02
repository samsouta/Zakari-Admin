import { useEffect, useState } from "react";
import { Undo2, Ban } from "lucide-react";
import Badge from "../../components/ui/badge/Badge";
import { useBlockUserMutation, useGetAllUserQuery } from "../../services/api/authApi";
import Cookies from "js-cookie";
import { UserType } from "../../types/authTypes";
import BlockMessage from "../ui/alert/BlockMessage";



export default function BlockListTable() {
  const token = Cookies.get("token");
  const { data: userData ,refetch } = useGetAllUserQuery(token || "");
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [blockUser , {isLoading}] = useBlockUserMutation();

  /**
   * @function
   * Get All User
   */
  useEffect(() => {
    if (userData?.data) {
      setUsers(userData.data);
    }
  }, [userData]);

  /**
   * @function
   * Handle Block List
   */
  const handleUnblock = async (id: number) => {
    if (!id) return;
    try {
      const res = await blockUser({ token: token || "", userId: id, reason: "", isBanned: false }).unwrap();
      if (res?.success) {
        await refetch();
        console.log('Unblock user success');
      }
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleBlock = (id: number) => {
    setSelectedUserId(id);
    setShowModal(true);
  };
  const handleBlockConfirm = async (reason: string) => {
    if (!selectedUserId) return;

    try {
      const res = await blockUser({ token: token || "", userId: selectedUserId, reason: reason, isBanned: true }).unwrap();
      if (res?.success) {
        await refetch();
        console.log('Block user success');
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  /**
   * @function
   * Filter Users
   */
  const filteredUsers = users.filter((user) => {
    // Skip admin accounts
    if (user?.is_admin) return false;
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_number.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "blocked" && user?.is_banned) ||
      (filterStatus === "unblocked" && !user?.is_banned);
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-3 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">User Blocklist</h3>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              className="px-3 py-1.5 text-sm rounded-md border dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white"
              placeholder="Search username or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-2 py-1.5 text-sm rounded-md border dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="blocked">Blocked</option>
              <option value="unblocked">Unblocked</option>
            </select>
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-lg border text-black dark:text-white dark:border-gray-700">
          <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <table className="min-w-[600px] w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">UID</th>
                  <th className="px-4 py-3 text-left font-semibold">Username</th>
                  <th className="px-4 py-3 text-left font-semibold">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold">Reason</th>
                  <th className="px-4 py-3 text-left font-semibold">Banned At</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-4">{user.id}</td>
                      <td className="px-4 py-4">{user.username}</td>
                      <td className="px-4 py-4">{user?.phone_number}</td>
                      <td className="px-4 py-4">{user?.ban_reason || '-'}</td>
                      <td className="px-4 py-4">
                        {user?.banned_at ? new Date(user.banned_at).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }) : '-'}
                      </td>
                      <td className="px-4 py-4">
                        <Badge size="sm" color={user?.is_banned ? "error" : "success"}>
                          {user?.is_banned ? "Blocked" : "Active"}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 space-x-2">
                        {user?.is_banned ? (
                          <button
                            disabled={isLoading}
                            className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md"
                            onClick={() => handleUnblock(user.id)}
                          >
                            <Undo2 className="w-4 h-4" />
                            {isLoading ? "Loading..." : "Unblock"}
                          </button>
                        ) : (
                          <button
                            className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
                            onClick={() => handleBlock(user.id)}
                          >
                            <Ban className="w-4 h-4" />
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>


      {/* Block Message Modal ++++++++++++ */}
      <BlockMessage
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleBlockConfirm}
        title="Why are you blocking this user?"
        placeholder="Enter reason for ban"
        confirmText={isLoading ? "Loading..." : "Block"}
        isLoading={isLoading}
      />
    </>
  );
}
