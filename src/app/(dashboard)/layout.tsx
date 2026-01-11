import { SidebarProvider  } from "@/components/ui/sidebar";
import { DashBoradSidebar } from "@/modules/dashborad/ui/components/dashborad-sidebar";
 interface Props {
    children: React.ReactNode;
 }

import { Children } from "react"

const Layout = ({ children }: Props) => {
    return (
        <div>
            <SidebarProvider>
               <DashBoradSidebar />
                <main className="flex flex-col h-screen w-screen bg-muted">
            {children}
            </main>
            </SidebarProvider>
        </div>
    )
}
export default Layout;