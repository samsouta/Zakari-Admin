import PageMeta from "../../components/common/PageMeta"
import ProductMetrics from "../../components/productManagement/ProductMetrics"
import ProductTable from "../../components/productManagement/ProductTable"

export const ProductManagement = () => {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 ">
          <ProductMetrics />
        </div>

        <div className="col-span-12 ">
          <ProductTable />
        </div>

        
      </div>
    </>
  )
}
