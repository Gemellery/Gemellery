import { useState } from "react";
import { X } from "lucide-react";
import type { ReportType } from "../../pages/Admin/ReportsPage";

interface Props {
    reportType: ReportType;
    onClose: () => void;
}

function ReportModal({ reportType, onClose }: Props) {

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [loading, setLoading] = useState(false);

    const [summary, setSummary] = useState<{
        totalOrders: number;
        totalSales: number;
    } | null>(null);

    const [rows, setRows] = useState<any[]>([]);

    const generateReport = async () => {

        if (!startDate || !endDate) {
            alert("Please select a date range");
            return;
        }

        try {

            setLoading(true);

            const res = await fetch(
                `http://localhost:5001/api/admin/reports/sales?startDate=${startDate}&endDate=${endDate}`
            );

            const data = await res.json();

            setSummary({
                totalOrders: data.totalOrders,
                totalSales: data.totalSales
            });

            setRows(data.sales);

        } catch (err) {

            console.error(err);
            alert("Failed to load report");

        } finally {

            setLoading(false);

        }

    };

    const exportCSV = () => {

        window.open(
            `http://localhost:5001/api/admin/reports/sales/csv?startDate=${startDate}&endDate=${endDate}`
        );

    };

    const formatTitle = (type: string) => {
        return type.replace("_", " ").toUpperCase();
    };

    return (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg max-h-[85vh] flex flex-col">

                <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-lg font-semibold">
                        {formatTitle(reportType)} REPORT
                    </h2>

                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-500" />
                    </button>

                </div>

                <div className="p-6 space-y-4 overflow-y-auto">

                    {/* Date filter */}

                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label className="text-sm text-gray-600">
                                Start Date
                            </label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) =>
                                    setStartDate(e.target.value)
                                }
                                className="w-full border rounded-lg p-2 mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">
                                End Date
                            </label>

                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) =>
                                    setEndDate(e.target.value)
                                }
                                className="w-full border rounded-lg p-2 mt-1"
                            />
                        </div>

                    </div>

                    {/* Generate */}

                    <button
                        onClick={generateReport}
                        className="w-full bg-black text-white py-2 rounded-lg">
                        Generate Report
                    </button>

                    {loading && (
                        <div className="text-center text-gray-500">
                            Loading report...
                        </div>
                    )}

                    {/* Summary */}

                    {summary && (

                        <div className="grid grid-cols-2 gap-4 mt-6">

                            <div className="border rounded-lg p-4">
                                <p className="text-sm text-gray-500">
                                    Total Orders
                                </p>
                                <p className="text-xl font-semibold">
                                    {summary.totalOrders}
                                </p>
                            </div>

                            <div className="border rounded-lg p-4">
                                <p className="text-sm text-gray-500">
                                    Total Sales
                                </p>
                                <p className="text-xl font-semibold">
                                    ${summary.totalSales}
                                </p>
                            </div>

                        </div>

                    )}

                    {/* Export CSV */}

                    {summary && (

                        <div className="flex gap-3 mt-4">

                            <button
                                onClick={exportCSV}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                            >
                                Export CSV
                            </button>

                        </div>

                    )}

                    {/* Table */}

                    {rows.length > 0 && (

                        <div className="mt-6 overflow-x-auto">

                            <h3 className="font-semibold mb-3">
                                Sales Details
                            </h3>

                            <table className="w-full text-sm border rounded-lg">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="p-3 text-left">Order</th>
                                        <th className="p-3 text-left">Date</th>
                                        <th className="p-3 text-left">Seller</th>
                                        <th className="p-3 text-left">Gem</th>
                                        <th className="p-3 text-left">Qty</th>
                                        <th className="p-3 text-left">Price</th>
                                        <th className="p-3 text-left">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, index) => (

                                        <tr key={index} className="border-t">

                                            <td className="p-3">
                                                {row.order_id}
                                            </td>

                                            <td className="p-3">
                                                {new Date(row.order_date).toLocaleDateString()}
                                            </td>

                                            <td className="p-3">
                                                {row.seller || "N/A"}
                                            </td>

                                            <td className="p-3">
                                                {row.gem_name || "N/A"}
                                            </td>

                                            <td className="p-3">
                                                {row.quantity ?? "-"}
                                            </td>

                                            <td className="p-3">
                                                {row.price ? `$${row.price}` : "-"}
                                            </td>

                                            <td className="p-3 font-medium">
                                                ${row.total}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}

export default ReportModal;