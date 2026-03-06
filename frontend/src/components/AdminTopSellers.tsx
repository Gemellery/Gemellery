import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

interface Seller {
    seller_id: number;
    business_name: string;
    total_sales: number;
    orders: number;
}

function AdminTopSellers() {

    const [sellers, setSellers] = useState<Seller[]>([]);

    useEffect(() => {

        fetch("http://localhost:5001/api/admin/top-sellers")
            .then(res => res.json())
            .then(data => setSellers(data))
            .catch(err => console.error(err));

    }, []);

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">

            <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                    Top Sellers
                </h2>
            </div>

            <div className="space-y-4">

                {sellers.map((seller, index) => (

                    <div
                        key={seller.seller_id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >

                        <div className="flex items-center gap-3">

                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                                {index + 1}
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    {seller.business_name}
                                </p>
                                <p className="text-sm font-medium text-gray-800">
                                    Seller #{seller.seller_id}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {seller.orders} orders
                                </p>
                            </div>

                        </div>

                        <p className="text-sm font-semibold text-gray-800">
                            LKR {seller.total_sales.toLocaleString()}
                        </p>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default AdminTopSellers;