import { FileChartColumn, Gem, Package, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminQuickActions() {

    const navigate = useNavigate();

    const actions = [
        {
            title: "Approve Sellers",
            icon: <Users className="w-5 h-5 text-blue-600" />,
            route: "/admin/verify-sellers",
            color: "bg-blue-50"
        },
        {
            title: "Review Gems",
            icon: <Gem className="w-5 h-5 text-purple-600" />,
            route: "/admin/manage-gems",
            color: "bg-purple-50"
        },
        {
            title: "Manage Orders",
            icon: <Package className="w-5 h-5 text-green-600" />,
            route: "/admin/manage-orders",
            color: "bg-green-50"
        },
        {
            title: "Reports",
            icon: <FileChartColumn className="w-5 h-5 text-orange-600" />,
            route: "/admin/reports",
            color: "bg-orange-50"
        }
    ];

    return (

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">

            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {actions.map((action, index) => (

                    <button
                        key={index}
                        onClick={() => navigate(action.route)}
                        className={`${action.color} p-4 rounded-lg flex flex-col items-center justify-center gap-2 hover:shadow transition`}
                    >

                        {action.icon}

                        <p className="text-sm font-medium text-gray-700">
                            {action.title}
                        </p>

                    </button>

                ))}

            </div>

        </div>

    );
}

export default AdminQuickActions;