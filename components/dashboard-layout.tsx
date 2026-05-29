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

                <section className="p-6 pt-20 md:pt-6">
                    {children}
                </section>
            </div>
        </main>
    );
}