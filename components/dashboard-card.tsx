type DashboardCardProps = {
    title: string;
    amount: string;
};

export default function DashboardCard({
    title,
    amount,
}: DashboardCardProps) {
    return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 text-white shadow-lg">
            <h3 className="text-sm text-gray-800">
                {title}
            </h3>

            <p className="text-3xl font-bold mt-2" text-black>
                {amount}
            </p>
        </div>
    );
}