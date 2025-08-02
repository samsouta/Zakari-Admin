import BlockListTable from "../../components/block-list/BlockListTable"
import PageMeta from "../../components/common/PageMeta"

export const BlockList = () => {
  return (
    <>
      <PageMeta
        title=" zakari | block list"
        description="This is zakari block list page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <BlockListTable />
        </div>
      </div>
    </>
  )
}
