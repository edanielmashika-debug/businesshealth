import { create } from "zustand";

interface DashboardAIState {
  recommendation: string;
  prediction: string;
  weeklySummary: string;
  businessInsight: string;

  loading: boolean;

  fetchInsights: (
  businessData: any
) => Promise<void>;
}

export const useDashboardAIStore =
  create<DashboardAIState>((set) => ({
    recommendation: "",

    prediction: "",

    weeklySummary: "",

    businessInsight: "",

    loading: false,

    fetchInsights: async (businessData) => {
      try {
        set({
          loading: true,
        });

const res =
  await fetch(
    "/api/ai-chat",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

body: JSON.stringify({

  dashboard: true,

  businessData,
}),
    }
  );

        if (!res.ok) {
          throw new Error(
            "Failed to fetch AI insights"
          );
        }

        const data =
          await res.json();

        set({
          recommendation:
            data.recommendation || "",

          prediction:
            data.prediction || "",

          weeklySummary:
            data.weeklySummary || "",

          businessInsight:
            data.businessInsight || "",

          loading: false,
        });
      } catch (error) {
        console.error(error);

        set({
          loading: false,
        });
      }
    },
  }));