import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

function AdminInsightsSection() {
    //Top Gems
    const gemCategoryData = [
        { name: "Sapphire", count: 120 },
        { name: "Ruby", count: 75 },
        { name: "Emerald", count: 60 },
        { name: "Topaz", count: 40 },
        { name: "Amethyst", count: 30 },
    ];

    //Seller Growth
    const sellerGrowthData = [
        { month: "Jan", sellers: 10 },
        { month: "Feb", sellers: 18 },
        { month: "Mar", sellers: 25 },
        { month: "Apr", sellers: 32 },
        { month: "May", sellers: 45 },
        { month: "Jun", sellers: 60 },
    ];

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

            {/* LEFT SIDE*/}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Top Gem Categories
                </h2>

                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={gemCategoryData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="name" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip />
                            <Bar
                                dataKey="count"
                                fill="#1e3a8a"
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* RIGHT SIDE*/}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Seller Growth (Monthly)
                </h2>

                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sellerGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="month" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="sellers"
                                stroke="#059669"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}

export default AdminInsightsSection;