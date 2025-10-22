export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center justify-center p-8 bg-background">
        <div className="flex items-center gap-4 mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m15.5 15.5-7-7"/><path d="m8.5 15.5 7-7"/></svg>
          <h1 className="text-4xl font-headline font-bold">NexusLearn Lite</h1>
        </div>
        {children}
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>Built by JD Vinod</p>
        <p>For support, contact nexuslearnlite@gmail.com</p>
      </footer>
    </div>
  );
}
