import PageMeta from "../../components/common/PageMeta"
import WalletManagement from "../../components/payments/WalletManagement"

export const Payments = () => {
  return (
    <>
      <PageMeta
        title=" zakari | payments"
        description="This is zakari payments dashboard"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <WalletManagement />
        </div>
      </div>
    </>
  )
}
