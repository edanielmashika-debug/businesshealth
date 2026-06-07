"use client";

import {
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function AiRecommendationsCard({
  recommendations,
}: {
  recommendations: string[];
}) {

  return (

    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">

      {/* HEADER */}

      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">

          <Sparkles className="w-7 h-7 text-blue-600" />

        </div>

        <div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            AI Recommendations
          </h2>

          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Smart actions for business growth
          </p>

        </div>
      </div>

      {/* LIST */}

      <div className="mt-6 space-y-4">

        {recommendations.map(
          (
            recommendation,
            index
          ) => (

            <div
              key={index}
              className="flex gap-3 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 p-4"
            >

              <ChevronRight className="w-5 h-5 text-blue-600 mt-0.5" />

              <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                {recommendation}
              </p>

            </div>
          )
        )}
      </div>
    </div>
  );
}