import SellerSidebar from "../../components/SellerSidebar";

function SellerDashboardLayout() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
        <div className="flex">
            <SellerSidebar sellerName={user.full_name || user.email} />

            <main className="flex-1 p-8 bg-gray-50">
                {/* Dashboard content here */}
            </main>
        </div>
    );
}

export default SellerDashboardLayout;
