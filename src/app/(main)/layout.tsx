import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
            {children}
          </main>
          <footer className="text-center p-4 text-muted-foreground text-sm">
            <p>Built by JD Vinod</p>
            <p>For support, contact nexuslearnlite@gmail.com</p>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
