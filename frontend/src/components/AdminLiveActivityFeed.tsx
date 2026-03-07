import {
    UserPlus,
    Gem,
    CheckCircle,
    Package,
    AlertTriangle,
} from "lucide-react";

interface ActivityItem {
    id: number;
    type: "seller" | "gem" | "approval" | "order" | "warning";
    message: string;
    time: string;
}

function AdminLiveActivityFeed() {

    const activities: ActivityItem[] = [
        {
            id: 1,
            type: "seller",
            message: "New seller registered: Lanka Gems",
            time: "5 mins ago",
        },
        {
            id: 2,
            type: "gem",
            message: "New Sapphire listed by BlueStar Exports",
            time: "12 mins ago",
        },
        {
            id: 3,
            type: "approval",
            message: "Admin approved seller: Ruby House",
            time: "25 mins ago",
        },
        {
            id: 4,
            type: "order",
            message: "Order #1023 marked as shipped",
            time: "1 hour ago",
        },
        {
            id: 5,
            type: "warning",
            message: "Gem certificate mismatch detected",
            time: "2 hours ago",
        },
    ];

    const getIcon = (type: ActivityItem["type"]) => {
        switch (type) {
            case "seller":
                return <UserPlus className="w-4 h-4 text-blue-600" />;
            case "gem":
                return <Gem className="w-4 h-4 text-purple-600" />;
            case "approval":
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case "order":
                return <Package className="w-4 h-4 text-gray-700" />;
            case "warning":
                return <AlertTriangle className="w-4 h-4 text-red-600" />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    Live Activity Feed
                </h2>
                <span className="text-xs text-gray-500">Real-time updates</span>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0"
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            {getIcon(activity.type)}
                        </div>

                        <div className="flex-1">
                            <p className="text-sm text-gray-800">
                                {activity.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {activity.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminLiveActivityFeed;