import { Parser } from "json2csv";


export const exportSalesCSV = (data: any[]) => {

    const fields = [
        { label: "Order ID", value: "order_id" },
        { label: "Date", value: "order_date" },
        { label: "Seller", value: "seller" },
        { label: "Gem", value: "gem_name" },
        { label: "Quantity", value: "quantity" },
        { label: "Price", value: "price" },
        { label: "Total", value: "total" }
    ];

    const parser = new Parser({ fields });

    return parser.parse(data);
};


export const exportSellerPerformanceCSV = (data: any[]) => {

    const fields = [
        { label: "Seller ID", value: "seller_id" },
        { label: "Business Name", value: "business_name" },
        { label: "Total Orders", value: "total_orders" },
        { label: "Total Revenue", value: "total_revenue" }
    ];

    const parser = new Parser({ fields });

    return parser.parse(data);
};


export const exportUserActivityCSV = (data: any[]) => {

    const fields = [
        { label: "User ID", value: "user_id" },
        { label: "Name", value: "full_name" },
        { label: "Email", value: "email" },
        { label: "Registered Date", value: "created_at" }
    ];

    const parser = new Parser({ fields });

    return parser.parse(data);
};


export const exportOrderStatusCSV = (data: any[]) => {

    const fields = [
        { label: "Order Status", value: "status" },
        { label: "Total Orders", value: "total_orders" }
    ];

    const parser = new Parser({ fields });

    return parser.parse(data);
};


export const exportSellerRatingsCSV = (data: any[]) => {

    const fields = [
        { label: "Seller ID", value: "seller_id" },
        { label: "Business Name", value: "business_name" },
        { label: "Average Rating", value: "average_rating" },
        { label: "Total Reviews", value: "total_reviews" }
    ];

    const parser = new Parser({ fields });

    return parser.parse(data);
};