import Badge from "../ui/badge/Badge";
import { useConfirmOrderMutation, useGetOrdersQuery } from "../../services/api/productApi";
import { useEffect, useRef, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useGetGameListQuery } from "../../services/api/gameApi";

type ServiceType = {
  id: number;
  name: string;
}

export default function RecentOrders() {
  const token = Cookies.get("token");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isGameFilterOpen, setIsGameFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmOrder, { isLoading: confirmLoading }] = useConfirmOrderMutation();
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedGameType, setSelectedGameType] = useState<string>('');
  const [gameTypeFilter, setGameTypeFilter] = useState<string[]>([]);
  const [serviceFilter, setServiceFilter] = useState<ServiceType[]>([]);
  const [isMetaOpen, setIsMetaOpen] = useState<number | null>(null);
  const metaPopupRef = useRef<HTMLDivElement | null>(null);
  
  const { data: orders, isLoading: isLoadingOrders } = useGetOrdersQuery({
    token: token || "",
    service_id: selectedServiceId || undefined,
    game_slug: selectedGameType || undefined
  });
  const { data: games } = useGetGameListQuery()


  // Filter orders based on search query
  const filteredOrders = useMemo(() => {
    if (!orders?.orders || !searchQuery.trim()) {
      return orders?.orders || [];
    }

    const query = searchQuery.toLowerCase().trim();
    
    return orders.orders.filter((order) => {
      // Search by order ID
      const orderIdMatch = order.id.toString().includes(query);
      
      // Search by product name (order name)
      const productNameMatch = order.product?.name?.toLowerCase().includes(query);
      
      // Search by username
      const usernameMatch = order.user?.username?.toLowerCase().includes(query);
      
      // Search by game name
      const gameNameMatch = order.product?.game?.name?.toLowerCase().includes(query);
      
      // Search by product type/category
      const categoryMatch = order.product?.product_type?.toLowerCase().includes(query);

      return orderIdMatch || productNameMatch || usernameMatch || gameNameMatch || categoryMatch;
    });
  }, [orders?.orders, searchQuery]);

  /**
   * @filtering Order by game & service
   * Fetch and setup filters from games API
   */
  useEffect(() => {
    if (games?.data) {
      const gameSlugs = games.data.map((game) => game.slug);
      setGameTypeFilter(gameSlugs);

      // Extract unique services from games
      const uniqueServicesMap = new Map();

      games.data.forEach((game) => {
        const service = game?.service;
        if (service && !uniqueServicesMap.has(service.id)) {
          uniqueServicesMap.set(service.id, {
            id: service.id,
            name: service.name
          });
        }
      });

      setServiceFilter(Array.from(uniqueServicesMap.values()));
    }
  }, [games]);

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

  /**
   * Clear search query
   */
  const clearSearch = () => {
    setSearchQuery('');
  };

  /**
   * Reset all filters including search
   */
  const resetAllFilters = () => {
    setSelectedServiceId(null);
    setSelectedGameType("");
    setSearchQuery('');
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-3 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 sm:mb-0">
            Recent Orders
          </h3>
          
          {/* Search Input */}
          <div className="relative w-full sm:w-72 mb-4 sm:mb-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, name, username..."
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
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full md:flex-row md:flex-wrap lg:flex-nowrap">
          {/* Service Filter Dropdown */}
          <div className="relative flex-1 min-w-[200px]">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full inline-flex justify-between items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750"
            >
              <div className="flex items-center gap-2 truncate">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="truncate">{selectedServiceId ? serviceFilter.find(s => s.id === selectedServiceId)?.name : 'Filter by Service'}</span>
              </div>
              <svg className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Service Filter Dropdown Menu */}
            {isFilterOpen && (
              <div className="absolute left-0 right-0 mt-2 w-full z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                <div className="p-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                  {serviceFilter?.map((item) => (
                    <button
                      key={item?.id}
                      onClick={() => {
                        setSelectedServiceId(item?.id);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors
                        ${selectedServiceId === item.id
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                      <span className="truncate flex-1 text-left">{item?.name}</span>
                      {selectedServiceId === item.id && (
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

          {/* Game Filter Dropdown */}
          <div className="relative flex-1 min-w-[200px]">
            <button
              onClick={() => setIsGameFilterOpen(!isGameFilterOpen)}
              className="w-full inline-flex justify-between items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750"
            >
              <div className="flex items-center gap-2 truncate">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <span className="truncate">{selectedGameType ? selectedGameType : 'Filter by Game'}</span>
              </div>
              <svg className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isGameFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Game Filter Dropdown Menu */}
            {isGameFilterOpen && (
              <div className="absolute left-0 right-0 mt-2 w-full z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                <div className="p-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                  {gameTypeFilter?.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSelectedGameType(item);
                        setIsGameFilterOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors
                        ${selectedGameType === item
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                      <span className="truncate flex-1 text-left">{item}</span>
                      {selectedGameType === item && (
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

          {/* Reset Filters Button */}
          <button
            onClick={resetAllFilters}
            className="flex-shrink-0 w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-sm hover:from-red-600 hover:to-red-700 focus:ring-2 focus:ring-red-500/30 transition-all duration-200 active:scale-95 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800"
          >
            <svg 
              className="w-4 h-4 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            <span>Reset All</span>
          </button>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              {filteredOrders.length === 0 
                ? `No results found for "${searchQuery}"`
                : `Found ${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''} for "${searchQuery}"`
              }
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
                <th className="px-4 py-3 text-left font-semibold">Order</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Price</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
                <th className="px-4 py-3 text-left font-semibold">Meta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoadingOrders ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders?.length ? (
                filteredOrders?.map((order) => (
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
                          <div className="flex gap-1 mt-1">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                                <span className="font-medium text-gray-600 dark:text-gray-300">User:</span>
                                <span className="ml-1 text-gray-500 dark:text-gray-400">{order.user?.username}({order.user_id})</span>
                              </span>
                              <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                                <span className="font-medium text-gray-600 dark:text-gray-300">PID:</span>
                                <span className="ml-1 text-gray-500 dark:text-gray-400">{order?.product_id}</span>
                              </span>
                               <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                                <span className="font-medium text-gray-600 dark:text-gray-300">C:</span>
                                <span className="ml-1 text-gray-500 dark:text-gray-400">{order?.product?.game?.name}</span>
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
                                <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                  <span className="font-medium">Fill Amount:</span>
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
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    {searchQuery ? `No orders found matching "${searchQuery}"` : "No orders found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}