import PageMeta from "../../components/common/PageMeta"
import { GameTable } from "../../components/productManagement/GameTable"
import ProductMetrics from "../../components/productManagement/ProductMetrics"
import ProductTable from "../../components/productManagement/ProductTable"
import { ServiceTable } from "../../components/productManagement/ServiceTable"

export const ProductManagement = () => {
  return (
    <>
      <PageMeta
        title=" Zakari | Product management "
        description="this is zakari product management page "
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6 ">
        <div className="col-span-12 space-y-6 ">
          <ProductMetrics />
        </div>

        <div className="col-span-12  ">
          <ProductTable />
        </div>

        <div className="col-span-12 space-y-6  ">
          <ServiceTable />
        </div>

         <div className="col-span-12 space-y-6 mb-32 ">
          <GameTable />
        </div>
      </div>
    </>
  )
}
