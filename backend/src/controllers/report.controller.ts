import { getSalesDetails } from "../services/report.service";
import { exportSalesCSV } from "../utils/csv.export";

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
