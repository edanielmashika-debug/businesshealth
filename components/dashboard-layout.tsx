import Navbar from "./navbar";
import Sidebar from "./sidebar";


export default function DashboardLayout(
    {children,}:{children: React.ReactNode}
)
{
    return(
        <main className="flex">
            <Sidebar/>
            <div className="flex-1">
                <Navbar/>

                <section className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-sky-500/10">
                    {children}
                </section>
            </div>
        </main>
    );
}