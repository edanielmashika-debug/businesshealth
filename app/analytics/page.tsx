"use client";

import DashboardLayout from "/Users/Emmanuel Daniel/businesshealth/components/dashboard-layout";

import AnalyticsChart from "/Users/Emmanuel Daniel/businesshealth/components/analytics-chart";

import CategoryChart from "/Users/Emmanuel Daniel/businesshealth/components/category-chart";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Analytics
          </h1>

          <p className="text-gray-500 mt-1">
            Business insights and trends
          </p>
        </div>

        <AnalyticsChart />

        <CategoryChart />
      </div>
    </DashboardLayout>
  );
}