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
    PROFITABILITY
  */

  if (
    totalExpenses >
    totalRevenue * 0.7
  ) {

    insights.push(
      "Your expenses are unusually high compared to revenue."
    );
  }

  if (
    totalRevenue >
    totalExpenses * 2
  ) {

    insights.push(
      "Your business is generating strong profit margins."
    );
  }

  /*
    INVENTORY
  */

  if (lowStockCount > 0) {

    insights.push(
      `${lowStockCount} products are running low on stock.`
    );
  }

  if (totalProducts === 0) {

    insights.push(
      "You have not added inventory products yet."
    );
  }

  /*
    DEBTS
  */

  if (pendingDebts > 0) {

    insights.push(
      `${pendingDebts} customer debts are still pending.`
    );
  }

  /*
    CASHFLOW
  */

  if (
    totalRevenue === 0 &&
    totalExpenses > 0
  ) {

    insights.push(
      "Your business currently has expenses but no recorded sales."
    );
  }

  /*
    EMPTY STATE
  */

  if (
    insights.length === 0
  ) {

    insights.push(
      "Your business performance looks healthy today."
    );
  }

  return insights;
}