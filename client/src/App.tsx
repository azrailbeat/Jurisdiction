import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Documents from "@/pages/Documents";
import Versions from "@/pages/Versions";
import KnowledgeGraph from "@/pages/KnowledgeGraph";
import Verification from "@/pages/Verification";
import Terminology from "@/pages/Terminology";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import AppShell from "@/components/layout/AppShell";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/documents" component={Documents} />
      <Route path="/versions" component={Versions} />
      <Route path="/knowledge-graph" component={KnowledgeGraph} />
      <Route path="/verification" component={Verification} />
      <Route path="/terminology" component={Terminology} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppShell>
          <Router />
        </AppShell>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
