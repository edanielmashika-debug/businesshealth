export function generatePredictions({
  totalRevenue,
  totalExpenses,
  lowStockCount,
  pendingDebts,
}: {
  totalRevenue: number;
  totalExpenses: number;
  lowStockCount: number;
  pendingDebts: number;
}) {

  const predictions: string[] = [];

  /*
    CASHFLOW RISK
  */

  if (
    totalExpenses >
    totalRevenue
  ) {

    predictions.push(
      "Your business may face cashflow pressure if expenses continue rising."
    );
  }

  /*
    LOW STOCK
  */

  if (
    lowStockCount >= 3
  ) {

    predictions.push(
      "Several products may go out of stock soon."
    );
  }

  /*
    DEBT RISK
  */

  if (
    pendingDebts >= 5
  ) {

    predictions.push(
      "Pending debts are increasing and could affect revenue collection."
    );
  }

  /*
    HEALTHY
  */

  if (
    predictions.length === 0
  ) {

    predictions.push(
      "Business trends currently look stable."
    );
  }

  return predictions;
}