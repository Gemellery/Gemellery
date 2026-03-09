import { useEffect, useState } from "react";
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

interface GemCategory {
    name: string;
    count: number;
}

interface SellerGrowth {
    month: string;
    sellers: number;
}

function AdminInsightsSection() {

    const [gemCategoryData, setGemCategoryData] = useState<GemCategory[]>([]);
    const [sellerGrowthData, setSellerGrowthData] = useState<SellerGrowth[]>([]);

    useEffect(() => {

        fetch("http://localhost:5001/api/admin/top-gem-categories")
            .then(res => res.json())
            .then(data => setGemCategoryData(data))
            .catch(err => console.error("Gem categories error:", err));

        fetch("http://localhost:5001/api/admin/seller-growth")
            .then(res => res.json())
            .then(data => setSellerGrowthData(data))
            .catch(err => console.error("Seller growth error:", err));

    }, []);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

            {/* Top Gems */}
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
                            <Bar dataKey="count" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>

            {/* Seller Growth */}
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