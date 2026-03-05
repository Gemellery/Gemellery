import { useEffect, useState } from "react";

interface Order {
    order_id: number;
    buyer_id: number;
    seller_id: number;
    total_amount: number;
    order_status: string;
    created_at: string;
}

function AdminRecentOrdersAndApprovals() {

    const [orders, setOrders] = useState<Order[]>([]);
    const [pendingSellers, setPendingSellers] = useState(0);
    const [pendingGems, setPendingGems] = useState(0);

    useEffect(() => {

        fetch("http://localhost:5001/api/admin/recent-orders")
            .then(res => res.json())
            .then(data => setOrders(data));

        fetch("http://localhost:5001/api/admin/pending-approvals")
            .then(res => res.json())
            .then(data => {
                setPendingSellers(data.pendingSellers);
                setPendingGems(data.pendingGems);
            });

    }, []);

    return (
        <div className="space-y-8 mt-8">

            {/* Recent orders */}

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">

                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Recent Orders
                </h2>

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="text-left text-gray-500 border-b">

                            <tr>
                                <th className="pb-2">Order ID</th>
                                <th className="pb-2">Buyer</th>
                                <th className="pb-2">Seller</th>
                                <th className="pb-2">Amount</th>
                                <th className="pb-2">Status</th>
                                <th className="pb-2">Date</th>
                            </tr>

                        </thead>

                        <tbody>

                            {orders.map(order => (

                                <tr key={order.order_id} className="border-b">

                                    <td className="py-2">#{order.order_id}</td>

                                    <td>{order.buyer_id}</td>

                                    <td>{order.seller_id}</td>

                                    <td className="font-bold">LKR {order.total_amount}</td>

                                    <td>{order.order_status}</td>

                                    <td>
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* Pending approvals */}

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">

                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Pending Approvals
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">

                        <p className="text-sm text-gray-600">
                            Sellers awaiting verification
                        </p>

                        <p className="text-2xl font-semibold mt-2">
                            {pendingSellers}
                        </p>

                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">

                        <p className="text-sm text-gray-600">
                            Gems awaiting approval
                        </p>

                        <p className="text-2xl font-semibold mt-2">
                            {pendingGems}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminRecentOrdersAndApprovals;