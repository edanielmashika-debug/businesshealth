import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

export function generateSalesPDF(
  sales: any[]
) {

  const doc =
    new jsPDF();

  doc.setFontSize(20);

  doc.text(
    "Biashara Nova ripoti ya mauzo",
    14,
    20
  );

  autoTable(doc, {
    startY: 30,

    head: [[
      "Bidhaa",
      "Idadi",
      "Mapato",
      "Faida",
      "Tarehe",
    ]],

    body: sales.map(
      (sale) => [
        sale.productName,

        sale.quantity,

        `TZS ${sale.total}`,

        `TZS ${sale.profit}`,

        new Date(sale.createdAt).toLocaleDateString(),
      ]
    ),
  });

  doc.save(
    "sales-report.pdf"
  );
}