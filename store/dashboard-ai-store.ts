import { create } from "zustand";

interface DashboardAIState {
  recommendation: string;
  prediction: string;
  weeklySummary: string;
  businessInsight: string;

  loading: boolean;

  fetchInsights: () => Promise<void>;
}

export const useDashboardAIStore =
  create<DashboardAIState>((set) => ({
    recommendation: "",

    prediction: "",

    weeklySummary: "",

    businessInsight: "",

    loading: false,

    fetchInsights: async () => {
      try {
        set({
          loading: true,
        });

        const res =
          await fetch(
            "/api/dashboard-ai"
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