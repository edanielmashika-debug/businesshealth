type DashboardCardProps = {
    title: string;
    amount: string;
};

export default function DashboardCard({
    title, 
    amount,
}: DashboardCardProps){
    return(
        <div className="border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm text-gray-500">
           {title}
          </h3>

          <p className="text-3xl font-bold mt-2">
            {amount}
          </p>
        </div>
    );
}