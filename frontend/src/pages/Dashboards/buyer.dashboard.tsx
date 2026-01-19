import BuyerSidebar from "../../components/BuyerSidebar";

function BuyerDashboardLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="flex">
      <BuyerSidebar buyerName={user.full_name || user.email} />

      <main className="flex-1 p-8 bg-gray-50">
        {/* Buyer dashboard content */}
      </main>
    </div>
  );
}

export default BuyerDashboardLayout;
