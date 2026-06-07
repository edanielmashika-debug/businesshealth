type Product = {
  name: string;
  stock: number;
  buyPrice: number;
  sellPrice: number;
};

type Debt = {
  status: "pending" | "paid";
  amount: number;
};

export function generateRecommendations({
  products,
  debts,
  totalRevenue,
  totalExpenses,
}: {
  products: Product[];
  debts: Debt[];
  totalRevenue: number;
  totalExpenses: number;
}) {

  const recommendations: string[] = [];

  /*
    LOW STOCK
  */

  const lowStockProducts =
    products.filter(
      (product) =>
        product.stock <= 5
    );

  if (
    lowStockProducts.length > 0
  ) {

    recommendations.push(
      `Restock ${lowStockProducts[0].name} soon to avoid stock shortages.`
    );
  }

  /*
    PROFIT MARGIN
  */

  const profitableProducts =
    products.filter(
      (product) =>
        (
          product.sellPrice -
          product.buyPrice
        ) > 5000
    );

  if (
    profitableProducts.length > 0
  ) {

    recommendations.push(
      `Focus marketing on ${profitableProducts[0].name} because it has strong profit margins.`
    );
  }

  /*
    EXPENSE CONTROL
  */

  if (
    totalExpenses >
    totalRevenue * 0.7
  ) {

    recommendations.push(
      "Expenses are consuming most revenue. Consider reducing operational costs."
    );
  }

  /*
    DEBT COLLECTION
  */

  const pendingDebts =
    debts.filter(
      (debt) =>
        debt.status === "pending"
    );

  if (
    pendingDebts.length >= 3
  ) {

    recommendations.push(
      "Follow up on pending debts to improve cashflow."
    );
  }

  /*
    DEFAULT
  */

  if (
    recommendations.length === 0
  ) {

    recommendations.push(
      "Business performance looks healthy this week."
    );
  }

  return recommendations;
}