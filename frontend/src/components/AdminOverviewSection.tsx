import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { DollarSign, Activity } from "lucide-react";

interface MonthlyOrders {
    month: string;
    orders: number;
}

function AdminOverviewSection() {

    const [chartData, setChartData] = useState<MonthlyOrders[]>([]);
    const [revenue, setRevenue] = useState<number>(0);
    const [ordersToday, setOrdersToday] = useState<number>(0);

    useEffect(() => {

        fetch("http://localhost:5001/api/admin/monthly-orders")
            .then(res => res.json())
            .then(data => setChartData(data))
            .catch(err => console.error("Chart error:", err));

        fetch("http://localhost:5001/api/admin/total-revenue")
            .then(res => res.json())
            .then(data => setRevenue(data.revenue))
            .catch(err => console.error("Revenue error:", err));

        fetch("http://localhost:5001/api/admin/orders-today")
            .then(res => res.json())
            .then(data => setOrdersToday(data.todayOrders))
            .catch(err => console.error("Orders today error:", err));

    }, []);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

            {/* LEFT SIDE */}
            <div className="xl:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">

                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Monthly Orders Overview
                </h2>

                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />

                            <XAxis dataKey="month" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip />

                            <Line
                                type="monotone"
                                dataKey="orders"
                                stroke="#d4af37"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-6">

                {/* TOTAL REVENUE */}
                <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">

                    <div>
                        <p className="text-sm text-gray-500">
                            Total Sales
                        </p>

                        <p className="text-2xl font-semibold mt-2 text-gray-900">
                            LKR {revenue.toLocaleString()}
                        </p>

                        <p className="text-sm text-green-600 mt-1">
                            Total value of completed orders
                        </p>
                    </div>

                    <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                    </div>

                </div>

                {/* ORDERS TODAY */}
                <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">

                    <div>
                        <p className="text-sm text-gray-500">
                            Orders Today
                        </p>

                        <p className="text-2xl font-semibold mt-2 text-gray-900">
                            {ordersToday}
                        </p>

                        <p className="text-sm text-blue-600 mt-1">
                            New orders placed today
                        </p>
                    </div>

                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-blue-600" />
                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminOverviewSection;