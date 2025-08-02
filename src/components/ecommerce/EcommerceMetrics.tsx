import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import { useGetAllUserQuery } from "../../services/api/authApi";
import { useGetAllOrdersQuery } from "../../services/api/productApi";
import Badge from "../ui/badge/Badge";
import cookie from 'js-cookie';

export default function EcommerceMetrics() {
  const token = cookie.get('token');
  const { data: users } = useGetAllUserQuery(token || '');
  const { data: orders } = useGetAllOrdersQuery(token || '');

  /**
   * @Calculation
   * User Count and Order Count
   */
  const userCount = users?.data?.length || 0;
  const todayCount = users?.today_count || 0;
  const yesterdayCount = users?.yesterday_count || 0;

  // Calculate difference
  const diff = todayCount - yesterdayCount;
  const percentChange = yesterdayCount
    ? ((diff / yesterdayCount) * 100).toFixed(2)
    : '0.00';

  const isIncrease = diff > 0;
  const isSame = diff === 0;
  // end of user +++++++++

  const orderCount = orders?.orders?.length || 0;
  const todayOrders = orders?.today_count || 0;
  const yesterdayOrders = orders?.yesterday_count || 0;

  // Calculate difference
  const diffOrder = todayOrders - yesterdayOrders;
  const percentChangeOrder = yesterdayOrders
    ? ((diffOrder / yesterdayOrders) * 100).toFixed(2)
    : '0.00';

  const isIncreaseOrder = diffOrder > 0;
  const isSameOrder = diffOrder === 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {userCount}
            </h4>
            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
              {isSame
                ? 'No change from yesterday'
                : `${diff > 0 ? '+' : ''}${diff} users ${diff > 0 ? 'added' : 'lost'} today`}
            </p>
          </div>
          <Badge color={isIncrease ? 'success' : 'error'}>
            {!isSame && (isIncrease ? <ArrowUpIcon className="mr-1" /> : <ArrowDownIcon className="mr-1" />)}
            {percentChange}%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {orderCount}
            </h4>
            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
              {isSame
                ? 'No change from yesterday'
                : `${diffOrder > 0 ? '+' : ''}${diffOrder} orders ${diffOrder > 0 ? 'added' : 'lost'} today`}
            </p>
          </div>

          <Badge color={isIncreaseOrder ? 'success' : 'error'}>
            {!isSameOrder && (isIncreaseOrder ? <ArrowUpIcon className="mr-1" /> : <ArrowDownIcon className="mr-1" />)}
            {percentChangeOrder}%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
