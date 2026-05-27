import { number } from "zod/mini";

export type ParsedSMS = {
    amount: number;
    type: "income" | "expense";

    provider:
    | "mpesa"
    | "yas"
    | "halopesa"
    | "airtel money"

    rawText: string;
};

export function parseMobileMoneySMS(
    text: string
): ParsedSMS | null {
    const lower =
        text.toLowerCase();

    let provider:
        | "mpesa"
        | "yas"
        | "halopesa"
        | "airtel money"
        | null = null;
    if (
        lower.includes("mpesa") ||
        lower.includes("m-pesa")
    ) {
        provider = "mpesa";
    }

    if (
        lower.includes("airtel")
    ) {
        provider = "airtel money";
    }

    if (lower.includes("yas")) {
        provider = "yas";
    }

    if (lower.includes("halopesa")) {
        provider = "halopesa";
    }
    const amountMatch =
        text.match(
            /(?:TZS|Tsh)\s?([\d,]+)/i
        );
    if (!amountMatch) {
        return null;
    }

    const amount = Number(
        amountMatch[1].replace(
            /,/g,
            ""
        )
    );

    let type:
        | "income"
        | "expense" = "expense";

    if (
        lower.includes("umepokea") ||
        lower.includes("received") ||
        lower.includes("umelipwa")
    ) {
        type = "income"
    }
    return {
        amount,
        type,
        provider:
            provider ||
            "mpesa",

        rawText: text,
    };

}