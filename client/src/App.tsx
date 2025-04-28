import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import pages
import Home from "@/pages/Home";
import ListItem from "@/pages/ListItem";
import ItemDetail from "@/pages/ItemDetail";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import RepairGuides from "@/pages/RepairGuides";
import ImpactMap from "@/pages/ImpactMap";
import NotFound from "@/pages/not-found";

// Import components
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

function Router() {
  return (
    <>
      <AppHeader />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/list-item" component={ListItem} />
        <Route path="/item/:id" component={ItemDetail} />
        <Route path="/messages" component={Messages} />
        <Route path="/profile" component={Profile} />
        <Route path="/repair-guides" component={RepairGuides} />
        <Route path="/impact-map" component={ImpactMap} />
        <Route component={NotFound} />
      </Switch>
      <AppFooter />
    </>
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
