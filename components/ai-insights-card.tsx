"use client";

import {
  Sparkles,
  Brain,
} from "lucide-react";

export default function AiInsightsCard({
  insights,
}: {
  insights: string[];
}) {

  return (

    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-blue-500/20 overflow-hidden relative">

      {/* GLOW */}

      <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full" />

      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/20 blur-3xl rounded-full" />

      {/* HEADER */}

      <div className="flex items-center gap-4 relative z-10">

        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">

          <Brain className="w-7 h-7 text-cyan-400" />

        </div>

        <div>

          <h2 className="text-2xl font-bold">
            AI Business Insights
          </h2>

          <p className="text-sm text-blue-100/70 mt-1">
            Smart recommendations for your business
          </p>

        </div>
      </div>

      {/* INSIGHTS */}

      <div className="mt-6 space-y-4 relative z-10">

        {insights.map(
          (
            insight,
            index
          ) => (

            <div
              key={index}
              className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
            >

              <div className="mt-0.5">

                <Sparkles className="w-5 h-5 text-cyan-400" />

              </div>

              <p className="text-sm leading-relaxed text-blue-50">
                {insight}
              </p>

            </div>
          )
        )}
      </div>
    </div>
  );
}