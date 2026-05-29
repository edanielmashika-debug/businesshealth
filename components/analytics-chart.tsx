"use client"
 import{
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
 } from "recharts";

 import { useDashboardStats } from "@/hooks/use-dashboard-stats";

 export default function AnalyticsChart() {
    const{
        income, 
        expense,
    } = useDashboardStats();

    const data =  [
        {
            name: "Income",
            value: income,
        },

        {
            name: "Expenses",
            value: expense,
        },
    ];

    return(
        <div className="border rounded-2x1 p-5 ocean-general">
            <h2 className="text-x1 font-bold mb-4">
                Analytics
            </h2>
            <div className="h-[300px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  >
                    <PieChart>
                        <Pie
                          data={data}
                          dataKey="value"
                          outerRadius={100}
                          label
                          >
                            <Cell fill="#57f18f"/>
                            <Cell fill="#f55555"/>
                          </Pie>

                          <Tooltip/>
                    </PieChart>
                  </ResponsiveContainer>

            </div>
        </div>
    )
 }