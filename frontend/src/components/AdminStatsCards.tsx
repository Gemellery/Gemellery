import {
  Users,
  Gem,
  Clock,
  Package,
} from "lucide-react";

interface AdminStatsCardsProps {
  totalUsers: number;
  totalGems: number;
  pendingVerifications: number;
  pendingGemApprovals: number;
  totalOrders: number;
}

function AdminStatsCards({
  totalUsers,
  totalGems,
  pendingVerifications,
  pendingGemApprovals,
  totalOrders,
}: AdminStatsCardsProps) {
  const cards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Gems",
      value: totalGems,
      icon: Gem,
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Pending Seller Verifications",
      value: pendingVerifications,
      icon: Clock,
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Pending Gem Approvals",
      value: pendingGemApprovals,
      icon: Clock,
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: Package,
      bg: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="bg-white p-5 rounded-xl border border-gray-200 
            shadow-sm hover:shadow-md transition-all duration-200
            flex flex-col justify-between min-h-[120px]"
          >
            <div className="flex items-start justify-between">

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <p className="text-3xl font-semibold text-gray-900">
                  {card.value}
                </p>
              </div>

              <div
                className={`w-12 h-12 rounded-lg ${card.bg} 
                flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AdminStatsCards;