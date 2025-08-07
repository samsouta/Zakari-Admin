import Badge from "../ui/badge/Badge";
import { useConfirmOrderMutation, useGetAllOrdersQuery } from "../../services/api/productApi";
import { useEffect, useRef, useState } from "react";
import { OrderType } from "../../types/productType";
import { filterItems } from "../../data/FilterItems";
import Cookies from "js-cookie";

export default function RecentOrders() {
  const token = Cookies.get("token");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { data: allOrders, isLoading } = useGetAllOrdersQuery(token || "");
  const [confirmOrder, { isLoading: confirmLoading }] = useConfirmOrderMutation();
  const [filteredProducts, setFilteredProducts] = useState<OrderType[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | boolean>("all");
  const [isMetaOpen, setIsMetaOpen] = useState<number | null>(null);
  const metaPopupRef = useRef<HTMLDivElement | null>(null);



  /**
   *  Close on outside click
   * */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        metaPopupRef.current &&
        !metaPopupRef.current.contains(event.target as Node)
      ) {
        setIsMetaOpen(null);
      }
    };

    if (isMetaOpen !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMetaOpen]);

  /**
   * @filtering Order by status
   */
  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredProducts(allOrders?.orders || []);
    } else {
      const result = allOrders?.orders?.filter((order: OrderType) => {
        if (typeof selectedFilter === "boolean") {
          return order?.product?.is_sold === selectedFilter;
        }
        return order?.product?.product_type === selectedFilter;
      });
      setFilteredProducts(result || []);
    }
  }, [selectedFilter, allOrders]);

  /**
   * @confirmOrder
   * Handle confirm order
   */

  const handleConfirmOrder = async (order_id: number) => {
    try {
      const response = await confirmOrder({ token: token || "", order_id }).unwrap();
      if (response?.success) {
        console.log('confirm order success', response);
      }
    } catch (error) {
      console.error("Failed to confirm order", error);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-10">Loading...</div>
    );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-3 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recent Orders
        </h3>
        <div className="relative">
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
                {filterItems?.map((item) => (
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
        </div>
      </div>

      {/* Scrollable table wrapper */}
      <div className="w-full overflow-x-auto rounded-lg border text-black dark:text-white dark:border-gray-700">
        <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <table className="min-w-[700px] w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">OID</th>
                <th className="px-4 py-3 text-left font-semibold">Order</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Price</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
                <th className="px-4 py-3 text-left font-semibold">Meta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                    {order.id}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={order?.product?.img_url}
                        alt={order?.product?.name}
                        className="h-[50px] w-[50px] rounded-md object-cover shrink-0"
                      />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {order.product?.name}
                        </p>
                        <div className="flex  gap-1 mt-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                              <span className="font-medium text-gray-600 dark:text-gray-300">User:</span>
                              <span className="ml-1 text-gray-500 dark:text-gray-400">{order.user?.username}</span>
                            </span>
                            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                              <span className="font-medium text-gray-600 dark:text-gray-300">UID:</span>
                              <span className="ml-1 text-gray-500 dark:text-gray-400">{order.user_id}</span>
                            </span>
                            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                              <span className="font-medium text-gray-600 dark:text-gray-300">PID:</span>
                              <span className="ml-1 text-gray-500 dark:text-gray-400">{order?.product_id}</span>
                            </span>
                          </div>

                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
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
                    {order.product?.product_type}
                  </td>
                  <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                    MMK {Math.floor(Number(order.product?.price))}
                  </td>
                  <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                    <Badge
                      size="sm"
                      color={
                        order.payment_status === "pending"
                          ? "warning"
                          : "success"
                      }
                    >
                      {order.payment_status === "pending" ? "Pending" : "Paid"}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    {order?.payment_status === "pending" ? (
                      <button
                        disabled={confirmLoading}
                        className="w-full px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none dark:bg-green-500 dark:hover:bg-green-600"
                        onClick={() => handleConfirmOrder(order?.id)}
                      >
                        {confirmLoading ? "loading..." : "Confirm"}
                      </button>
                    ) : (
                      <span className="text-green-600">Confirmed</span>
                    )}
                  </td>
                  <td className="px-4 py-4 relative">
                    {order?.product?.product_type === "coin" && (
                      <>
                        <button
                          onClick={() => {
                            setIsMetaOpen(isMetaOpen === order.id ? null : order.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                          aria-label="View order information"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Info
                        </button>

                        {isMetaOpen === order.id && (
                          <div
                            ref={metaPopupRef}
                            className="absolute right-0 top-0 mt-2 w-64 z-50 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg transform origin-top-right transition-all"
                            role="tooltip"
                          >
                            <div className="p-4 space-y-3">
                              <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                <span className="font-medium">Game ID:</span>
                                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                  {order?.meta?.game_uid || 'N/A'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                <span className="font-medium">Server ID:</span>
                                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                  {order?.meta?.server_id || 'N/A'}
                                </span>
                              </div>

                              {/* //Diamond Amount */}
                              <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                <span className="font-medium"> Fill Amount:</span>
                                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                  {order?.product?.data?.amount || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
