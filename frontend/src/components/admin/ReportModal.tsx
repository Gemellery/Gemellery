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
    const [summary, setSummary] = useState<any>(null);
    const [rows, setRows] = useState<any[]>([]);

    const BASE_URL = "http://localhost:5001/api/admin/reports";

    const ENDPOINTS: Record<ReportType, string> = {
        sales: "sales",
        seller_performance: "seller-performance",
        user_activity: "user-activity",
        order_status: "order-status",
        seller_ratings: "seller-ratings",
    };

    const generateReport = async () => {

        try {

            if (reportType === "sales" && (!startDate || !endDate)) {
                alert("Please select a date range");
                return;
            }

            setLoading(true);

            let url = `${BASE_URL}/${ENDPOINTS[reportType]}`;

            if (reportType === "sales") {
                url += `?startDate=${startDate}&endDate=${endDate}`;
            }

            const res = await fetch(url);
            const data = await res.json();

            /* SALES REPORT */

            if (reportType === "sales") {
                setSummary({
                    totalOrders: data.totalOrders,
                    totalSales: data.totalSales,
                });

                setRows(data.sales || []);
            }

            /* OTHER REPORTS */

            else {
                setSummary(null);

                if (data.sellers) setRows(data.sellers);
                else if (data.users) setRows(data.users);
                else if (data.orders) setRows(data.orders);
                else setRows([]);
            }

        } catch (err) {

            console.error(err);
            alert("Failed to load report");

        } finally {

            setLoading(false);

        }

    };

    const exportCSV = () => {

        let url = `${BASE_URL}/${ENDPOINTS[reportType]}/csv`;

        if (reportType === "sales") {
            url += `?startDate=${startDate}&endDate=${endDate}`;
        }

        window.open(url);

    };

    const formatTitle = (type: string) =>
        type.replace("_", " ").toUpperCase();

    const renderTableHeader = () => {

        if (reportType === "sales") {
            return (
                <tr>
                    <th className="p-3 text-left">Order</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Seller</th>
                    <th className="p-3 text-left">Gem</th>
                    <th className="p-3 text-left">Qty</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Total</th>
                </tr>
            );
        }

        return (
            <tr>
                {Object.keys(rows[0] || {}).map((key) => (
                    <th key={key} className="p-3 text-left capitalize">
                        {key.replace("_", " ")}
                    </th>
                ))}
            </tr>
        );
    };

    const renderTableRows = () => {

        if (reportType === "sales") {
            return rows.map((row, index) => (
                <tr key={index} className="border-t">

                    <td className="p-3">{row.order_id}</td>

                    <td className="p-3">
                        {new Date(row.order_date).toLocaleDateString()}
                    </td>

                    <td className="p-3">{row.seller || "N/A"}</td>

                    <td className="p-3">{row.gem_name || "N/A"}</td>

                    <td className="p-3">{row.quantity ?? "-"}</td>

                    <td className="p-3">
                        {row.price ? `$${row.price}` : "-"}
                    </td>

                    <td className="p-3 font-medium">${row.total}</td>

                </tr>
            ));
        }

        return rows.map((row, i) => (
            <tr key={i} className="border-t">
                {Object.values(row).map((val: any, j) => (
                    <td key={j} className="p-3">
                        {val ?? "-"}
                    </td>
                ))}
            </tr>
        ));
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg max-h-[85vh] flex flex-col">

                {/* Header */}

                <div className="flex justify-between items-center p-5 border-b">

                    <h2 className="text-lg font-semibold">
                        {formatTitle(reportType)} REPORT
                    </h2>

                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-500" />
                    </button>

                </div>

                <div className="p-6 space-y-4 overflow-y-auto">

                    {/* Date Filter only for sales */}

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
                        className="w-full bg-black text-white py-2 rounded-lg"
                    >
                        Generate Report
                    </button>

                    {loading && (
                        <div className="text-center text-gray-500">
                            Loading report...
                        </div>
                    )}

                    {/* Sales Summary */}

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

                    {/* CSV Export */}

                    {rows.length > 0 && (

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

                            <table className="w-full text-sm border rounded-lg">

                                <thead className="bg-gray-50 sticky top-0">
                                    {renderTableHeader()}
                                </thead>

                                <tbody>
                                    {renderTableRows()}
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