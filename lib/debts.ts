import { supabase } from "./supabase";
export async function getDebts() {
    const { data, error }
        = await supabase
            .from("debts")
            .select("*")
            .order("created_at", {
                ascending: false,
            });

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}

export async function createDebt(
    debt: {
        name: string;
        amount: number;
        status: string;
    }
) {
    const {
        data: { user },
    } =
        await supabase.auth.getUser();

    if (!user) return;
    const { error } =
        await supabase
            .from("debts")
            .insert({
                user_id: user.id,
                name: debt.name,
                amount: debt.amount,
                status: debt.status,
            });

    if (error) {
        console.error(error);
    }
}

export async function updateDebtStatus(
    id: string,
    status: "pending" | "paid"
) {
    const { error } =
        await supabase
            .from("debts")
            .update({
                status,
            })
            .eq("id", id);

    if (error) {
        console.error(error);
    }
}

export async function deleteDebtFromDB(
    id: string
) {
    const { error } =
        await supabase
            .from("debts")
            .delete()
            .eq("id", id);

    if (error) {
        console.error(error);
    }
}