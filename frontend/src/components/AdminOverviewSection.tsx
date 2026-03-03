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

const data = [
    { month: "Jan", orders: 30 },
    { month: "Feb", orders: 45 },
    { month: "Mar", orders: 60 },
    { month: "Apr", orders: 40 },
    { month: "May", orders: 75 },
    { month: "Jun", orders: 90 },
];

function AdminOverviewSection() {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

            {/* LEFT SIDE */}
            <div className="xl:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Monthly Orders Overview
                </h2>

                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
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

                <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-semibold mt-2 text-gray-900">
                            $24,500
                        </p>
                        <p className="text-sm text-green-600 mt-1">
                            +12% from last month
                        </p>
                    </div>

                    <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                </div>

                <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Active Users Today</p>
                        <p className="text-2xl font-semibold mt-2 text-gray-900">
                            182
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                            35 new signups
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