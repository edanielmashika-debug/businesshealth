import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

export function generateSalesPDF(
  sales: any[]
) {

  const doc =
    new jsPDF();

  doc.setFontSize(20);

  doc.text(
    "BusinessHealth Sales Report",
    14,
    20
  );

  autoTable(doc, {
    startY: 30,

    head: [[
      "Product",
      "Quantity",
      "Revenue",
      "Profit",
    ]],

    body: sales.map(
      (sale) => [
        sale.productName,

        sale.quantity,

        `TZS ${sale.total}`,

        `TZS ${sale.profit}`,
      ]
    ),
  });

  doc.save(
    "sales-report.pdf"
  );
}