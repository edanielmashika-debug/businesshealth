
type DashboardCardProps = {
  title: string;
  amount: string;
  icon?: React.ReactNode;
};

export default function DashboardCard({
  title,
  amount,
  icon,
}: DashboardCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

      {/* GLOW */}

      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-400">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            {amount}
          </h2>
        </div>

        {icon && (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
            {icon}
          </div>
        )}
      </div>

      {/* BOTTOM LINE */}

      <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/5">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
      </div>
    </div>
  );
}

