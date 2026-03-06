import { Parser } from "json2csv";

export const exportSalesCSV = (data: any[]) => {

    const fields = [
        {
            label: "Order ID",
            value: "order_id"
        },
        {
            label: "Date",
            value: "order_date"
        },
        {
            label: "Seller",
            value: "seller"
        },
        {
            label: "Gem",
            value: "gem_name"
        },
        {
            label: "Quantity",
            value: "quantity"
        },
        {
            label: "Price",
            value: "price"
        },
        {
            label: "Total",
            value: "total"
        }
    ];

    const parser = new Parser({ fields });

    return parser.parse(data);
};