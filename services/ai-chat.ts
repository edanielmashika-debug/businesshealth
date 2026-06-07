type Product = {
  name: string;
  stock: number;
  buyPrice: number;
  sellPrice: number;
};

type Debt = {
  amount: number;
  status: "paid" | "pending";
};

type Expense = {
  amount: number;
};

type Sale = {
  total: number;
};

export function generateAIResponse({
  message,
  products,
  debts,
  expenses,
  sales,
}: {
  message: string;
  products: Product[];
  debts: Debt[];
  expenses: Expense[];
  sales: Sale[];
}) {

  const lower =
    message.toLowerCase();

  /*
    TOTALS
  */

  const totalRevenue =
    sales.reduce(
      (sum, sale) =>
        sum + sale.total,
      0
    );

  const totalExpenses =
    expenses.reduce(
      (sum, expense) =>
        sum + expense.amount,
      0
    );

  const pendingDebt =
    debts
      .filter(
        (debt) =>
          debt.status === "pending"
      )
      .reduce(
        (sum, debt) =>
          sum + debt.amount,
        0
      );

  /*
    PROFIT
  */

  const profit =
    totalRevenue -
    totalExpenses;

  /*
    MOST PROFITABLE PRODUCT
  */

  const bestProduct =
    [...products].sort(
      (a, b) =>
        (
          b.sellPrice -
          b.buyPrice
        ) -
        (
          a.sellPrice -
          a.buyPrice
        )
    )[0];

  /*
    QUESTIONS
  */

  if (
    lower.includes("profit")
  ) {

    return `Your estimated profit is TZS ${profit.toLocaleString()}.`;
  }

  if (
    lower.includes("expense")
  ) {

    return `Your total expenses are TZS ${totalExpenses.toLocaleString()}.`;
  }

  if (
    lower.includes("revenue") ||
    lower.includes("sales")
  ) {

    return `Your total sales revenue is TZS ${totalRevenue.toLocaleString()}.`;
  }

  if (
    lower.includes("debt")
  ) {

    return `Pending debts currently total TZS ${pendingDebt.toLocaleString()}.`;
  }

  if (
    lower.includes("product")
  ) {

    if (!bestProduct) {

      return "No products found.";
    }

    return `${bestProduct.name} currently has one of the highest profit margins.`;
  }

  if (
    lower.includes("stock")
  ) {

    const lowStock =
      products.filter(
        (product) =>
          product.stock <= 5
      );

    if (
      lowStock.length === 0
    ) {

      return "All products have healthy stock levels.";
    }

    return `${lowStock[0].name} is running low on stock.`;
  }

  /*
    DEFAULT
  */

  return "I can help analyze your sales, expenses, debts, profits, and inventory.";
}