"use client";

import {
  BrainCircuit,
  AlertTriangle,
} from "lucide-react";

export default function AiPredictionsCard({
  predictions,
}: {
  predictions: string[];
}) {

  return (

    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">

      {/* HEADER */}

      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">

          <BrainCircuit className="w-7 h-7 text-orange-500" />

        </div>

        <div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            AI Predictions
          </h2>

          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Forecasted business risks & trends
          </p>

        </div>
      </div>

      {/* LIST */}

      <div className="mt-6 space-y-4">

        {predictions.map(
          (
            prediction,
            index
          ) => (

            <div
              key={index}
              className="flex gap-3 rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 p-4"
            >

              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />

              <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                {prediction}
              </p>

            </div>
          )
        )}
      </div>
    </div>
  );
}