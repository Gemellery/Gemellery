import {
    getSalesDetails,
    getSellerPerformance,
    getUserActivity,
    getOrderStatus,
    getSellerRatings
} from "../services/report.service";

import {
    exportSalesCSV,
    exportSellerPerformanceCSV,
    exportUserActivityCSV,
    exportOrderStatusCSV,
    exportSellerRatingsCSV
} from "../utils/csv.export";

/* SALES REPORT */

export const salesReport = async (req: any, res: any) => {
    const { startDate, endDate } = req.query;

    const rows = await getSalesDetails(startDate, endDate);

    const totalSales = rows.reduce(
        (sum: number, item: any) => sum + Number(item.total),
        0
    );

    res.json({
        totalOrders: rows.length,
        totalSales,
        sales: rows
    });
};

export const salesCSV = async (req: any, res: any) => {
    const { startDate, endDate } = req.query;

    const rows = await getSalesDetails(startDate, endDate);

    const csv = exportSalesCSV(rows);

    const filename = `Sales_Report_${startDate}_to_${endDate}.csv`;

    res.header("Content-Type", "text/csv");
    res.attachment(filename);

    return res.send(csv);
};


/* SELLER PERFORMANCE */

export const sellerPerformanceReport = async (req: any, res: any) => {

    const rows = await getSellerPerformance();

    res.json({
        totalSellers: rows.length,
        sellers: rows
    });
};

export const sellerPerformanceCSV = async (req: any, res: any) => {

    const rows = await getSellerPerformance();

    const csv = exportSellerPerformanceCSV(rows);

    res.header("Content-Type", "text/csv");
    res.attachment("Seller_Performance_Report.csv");

    return res.send(csv);
};


/* USER ACTIVITY */

export const userActivityReport = async (req: any, res: any) => {

    const rows = await getUserActivity();

    res.json({
        totalUsers: rows.length,
        users: rows
    });
};

export const userActivityCSV = async (req: any, res: any) => {

    const rows = await getUserActivity();

    const csv = exportUserActivityCSV(rows);

    res.header("Content-Type", "text/csv");
    res.attachment("User_Activity_Report.csv");

    return res.send(csv);
};


/* ORDER STATUS */

export const orderStatusReport = async (req: any, res: any) => {

    const rows = await getOrderStatus();

    res.json({
        orders: rows
    });
};

export const orderStatusCSV = async (req: any, res: any) => {

    const rows = await getOrderStatus();

    const csv = exportOrderStatusCSV(rows);

    res.header("Content-Type", "text/csv");
    res.attachment("Order_Status_Report.csv");

    return res.send(csv);
};


/* SELLER RATINGS */

export const sellerRatingsReport = async (req: any, res: any) => {

    const rows = await getSellerRatings();

    res.json({
        sellers: rows
    });
};

export const sellerRatingsCSV = async (req: any, res: any) => {

    const rows = await getSellerRatings();

    const csv = exportSellerRatingsCSV(rows);

    res.header("Content-Type", "text/csv");
    res.attachment("Seller_Ratings_Report.csv");

    return res.send(csv);
};