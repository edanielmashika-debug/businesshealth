import Papa from "papaparse";

import { Transaction } from "@/types/transaction";

export function exportTransactions(
  transactions: Transaction[]
) {
  const csv =
    Papa.unparse(
      transactions
    );

  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.setAttribute(
    "download",
    "transactions.csv"
  );

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );
}