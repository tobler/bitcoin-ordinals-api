import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import CreateOrdinalPage from "@/pages/create-ordinal";
import CreateCollectionPage from "@/pages/create-collection";
import DocumentationPage from "@/pages/documentation";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import { useState } from "react";

function Router() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans text-gray-900">
      <Sidebar open={sidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/create-ordinal" component={CreateOrdinalPage} />
            <Route path="/create-collection" component={CreateCollectionPage} />
            <Route path="/docs/:section?" component={DocumentationPage} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
