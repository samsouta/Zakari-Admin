import PageMeta from "../../components/common/PageMeta"
import ReviewTable from "../../components/UserReview/ReviewTable"
import UserListTable from "../../components/UserReview/UserListTable"

const UserReview = () => {
  return (
    <>
      <PageMeta
        title=" zakari | review "
        description="This is zakari review page "
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">

        <div className="col-span-12 mb-28">
          <ReviewTable />
        </div>

         <div className="col-span-12 mb-28">
          <UserListTable />
        </div>

      </div>
    </>
  )
}

export default UserReview