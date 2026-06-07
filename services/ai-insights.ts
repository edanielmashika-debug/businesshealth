export function generateInsights({
  totalRevenue,
  totalExpenses,
  lowStockCount,
  pendingDebts,
  totalProducts,
}: {
  totalRevenue: number;
  totalExpenses: number;
  lowStockCount: number;
  pendingDebts: number;
  totalProducts: number;
}) {

  const insights: string[] = [];

  /*
    PROFIT
  */

  const profit =
    totalRevenue -
    totalExpenses;

  if (profit > 0) {

    insights.push(
      `Your estimated profit is TZS ${profit.toLocaleString()}.`
    );
  }

  /*
    EXPENSE WARNING
  */

  if (
    totalExpenses >
    totalRevenue * 0.7
  ) {

    insights.push(
      "Expenses are consuming most of your revenue."
    );
  }

  /*
    STRONG SALES
  */

  if (
    totalRevenue >
    totalExpenses * 2
  ) {

    insights.push(
      "Sales performance looks very strong this period."
    );
  }

  /*
    LOW STOCK
  */

  if (
    lowStockCount > 0
  ) {

    insights.push(
      `${lowStockCount} products may need restocking soon.`
    );
  }

  /*
    PENDING DEBTS
  */

  if (
    pendingDebts > 0
  ) {

    insights.push(
      `${pendingDebts} debts are still pending collection.`
    );
  }

  /*
    EMPTY INVENTORY
  */

  if (
    totalProducts === 0
  ) {

    insights.push(
      "Your inventory is currently empty."
    );
  }

  /*
    NO SALES
  */

  if (
    totalRevenue === 0
  ) {

    insights.push(
      "No sales have been recorded yet."
    );
  }

  /*
    HEALTHY STATE
  */

  if (
    insights.length === 0
  ) {

    insights.push(
      "Business performance looks healthy today."
    );
  }

  return insights;
}