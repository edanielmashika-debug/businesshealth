import { create } from "zustand";

import { supabase } from "../lib/supabase";

export interface CustomerDebt {
id: string;

customer_name: string;

phone?: string;

amount: number;

paid_amount: number;

status:
| "unpaid"
| "partial"
| "paid";

due_date?: string;

notes?: string;

created_at: string;
}

interface CustomerDebtStore {
debts: CustomerDebt[];

loading: boolean;

fetchDebts: () => Promise<void>;

addDebt: (
debt: CustomerDebt
) => Promise<void>;

updateDebt: (
id: string,
updates: Partial<CustomerDebt>
) => Promise<void>;

deleteDebt: (
id: string
) => Promise<void>;

recordPayment: (
id: string,
amount: number
) => Promise<void>;

syncDebts: () => Promise<() => void>;
}

export const useCustomerDebtStore =
create<CustomerDebtStore>(
(set, get) => ({
debts: [],


  loading: false,

  fetchDebts: async () => {
    set({
      loading: true,
    });

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      set({
        debts: [],
        loading: false,
      });

      return;
    }

    const {
      data,
      error,
    } = await supabase
      .from(
        "customer_debts"
      )
      .select("*")
      .eq(
        "user_id",
        user.id
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (!error && data) {
      set({
        debts:
          data as CustomerDebt[],
      });
    }

    set({
      loading: false,
    });
  },

  addDebt: async (
    debt
  ) => {
    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) return;

    const {
      error,
    } = await supabase
      .from(
        "customer_debts"
      )
      .insert({
        ...debt,
        user_id:
          user.id,
      });

    if (!error) {
      await get().fetchDebts();
    }
  },

  updateDebt: async (
    id,
    updates
  ) => {
    const {
      error,
    } = await supabase
      .from(
        "customer_debts"
      )
      .update(updates)
      .eq(
        "id",
        id
      );

    if (!error) {
      await get().fetchDebts();
    }
  },

  deleteDebt: async (
    id
  ) => {
    const {
      error,
    } = await supabase
      .from(
        "customer_debts"
      )
      .delete()
      .eq(
        "id",
        id
      );

    if (!error) {
      set({
        debts:
          get().debts.filter(
            (
              debt
            ) =>
              debt.id !==
              id
          ),
      });
    }
  },

  recordPayment:
    async (
      id,
      paymentAmount
    ) => {
      const debt =
        get().debts.find(
          (
            item
          ) =>
            item.id ===
            id
        );

      if (!debt)
        return;

      const newPaidAmount =
        debt.paid_amount +
        paymentAmount;

      let status:
        | "unpaid"
        | "partial"
        | "paid" =
        "unpaid";

      if (
        newPaidAmount >=
        debt.amount
      ) {
        status =
          "paid";
      } else if (
        newPaidAmount > 0
      ) {
        status =
          "partial";
      }

      const {
        error,
      } = await supabase
        .from(
          "customer_debts"
        )
        .update({
          paid_amount:
            newPaidAmount,

          status,
        })
        .eq(
          "id",
          id
        );

      if (!error) {
        await get().fetchDebts();
      }
    },

  syncDebts: async () => {
    await get().fetchDebts();

    const channel =
      supabase
        .channel(
          "customer-debts"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema:
              "public",
            table:
              "customer_debts",
          },
          async () => {
            await get().fetchDebts();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  },
})
);
