import {
  ArrowUpIcon,
  BoxIconLine,
} from "../../icons";
import { useGetProductsQuery } from "../../services/api/productApi";

import Badge from "../ui/badge/Badge";
import cookie from 'js-cookie';

export default function ProductMetrics() {
  const token = cookie.get('token');
  const { data: products } = useGetProductsQuery();






  return (
    <div className="grid grid-cols-1 gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6 p-2 sm:p-4">

      {/* <!-- Total Products Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03] transition-all duration-300">
        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-5 sm:size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-4 sm:mt-5">
          <div className="w-full">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Total Products
            </span>
            <h4 className="mt-1 sm:mt-2 font-bold text-gray-800 text-base sm:text-title-sm dark:text-white/90">
              {products?.data?.length}
            </h4>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Available: {products?.data?.filter((product) => !product.is_sold).length}
              </span>
              <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                Sold out: {products?.data?.filter((product) => product.is_sold).length}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Total Products Metric Item End --> */}

      {/* <!-- Popular Products Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03] transition-all duration-300">
        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-5 sm:size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-4 sm:mt-5">
          <div>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Popular Products
            </span>
            <h4 className="mt-1 sm:mt-2 font-bold text-gray-800 text-base sm:text-title-sm dark:text-white/90">
              125
            </h4>
            <p className="text-[10px] sm:text-xs mt-1 text-gray-500 dark:text-gray-400">
              Increased from last month
            </p>
          </div>
          <Badge color="success" className="scale-90 sm:scale-100">
            <ArrowUpIcon className="mr-1" />
            12%
          </Badge>
        </div>
      </div>
      {/* <!-- Popular Products Metric Item End --> */}
    </div>
  );
}
