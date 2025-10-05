import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, TrendingDown, DollarSign, FileText, 
  Package, Users, AlertCircle, Plus 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Invoice {
  id: string;
  customer: { name?: string };
  total: number;
  status?: string;
  date?: string;
}

interface Product {
  id: string;
  name: string;
  stock?: number;
  minStock?: number;
  rate: number;
}

export function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const invRaw = localStorage.getItem("pavilo_invoices");
      const prodRaw = localStorage.getItem("pavilo_products");
      if (invRaw) {
        const inv = JSON.parse(invRaw);
        setInvoices(inv);
        const uniqueCustomers = Array.from(new Set(inv.map((i: Invoice) => i.customer?.name || "Walk-in")));
        setCustomers(uniqueCustomers);
      }
      if (prodRaw) setProducts(JSON.parse(prodRaw));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Dynamic Stats
  const totalSales = invoices.reduce((sum, i) => sum + (i.total || 0), 0);
  const paidInvoices = invoices.filter((i) => i.status === "Paid").length;
  const unpaidInvoices = invoices.filter((i) => i.status !== "Paid").length;

  const lowStockItems = products.filter(
    (p) => typeof p.stock === "number" && typeof p.minStock === "number" && p.stock <= p.minStock
  );

  const stats = [
    {
      title: "Total Sales",
      value: `₹${totalSales.toFixed(2)}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-success",
    },
    {
      title: "Invoices",
      value: `${invoices.length}`,
      change: "+8.2%",
      trend: "up",
      icon: FileText,
      color: "text-primary",
    },
    {
      title: "Products",
      value: `${products.length}`,
      change: "-2.1%",
      trend: "down",
      icon: Package,
      color: "text-accent",
    },
    {
      title: "Customers",
      value: `${customers.length}`,
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "text-success",
    },
  ];

  // Sort invoices by newest
  const recentInvoices = [...invoices].reverse().slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
        </div>
        <Button variant="gradient" className="gap-2" onClick={() => navigate("/app")}>
          <Plus className="h-4 w-4" />
          New Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;

          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendIcon
                    className={`h-3 w-3 ${stat.trend === "up" ? "text-success" : "text-destructive"}`}
                  />
                  <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
                    {stat.change}
                  </span>
                  <span>from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Your latest billing activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentInvoices.length === 0 && (
              <p className="text-muted-foreground">No recent invoices found.</p>
            )}
            {recentInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div>
                  <p className="font-medium">INV-{invoice.id.slice(-5)}</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.customer?.name || "Walk-in"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{invoice.total.toFixed(2)}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      invoice.status === "Paid"
                        ? "bg-success/10 text-success"
                        : invoice.status === "Pending"
                        ? "bg-accent/10 text-accent"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {invoice.status || "Unpaid"}
                  </span>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={() => navigate("/app")}>
              View All Invoices
            </Button>
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-accent" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>Items running low in inventory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockItems.length === 0 && (
              <p className="text-muted-foreground">All stock levels are good.</p>
            )}
            {lowStockItems.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">
                    {item.stock ?? 0}/{item.minStock ?? 10}
                  </span>
                </div>
                <Progress
                  value={((item.stock ?? 0) / (item.minStock ?? 10)) * 100}
                  className="h-2"
                />
              </div>
            ))}
            <Button variant="accent" className="w-full" onClick={() => navigate("/inventory")}>
              Manage Inventory
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
