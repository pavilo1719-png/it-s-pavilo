import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  rate: number;
  unit?: string;
  stock?: number;
}

interface BillingItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  rate: number;
  unit?: string;
  amount: number;
}

export default function BillingForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<BillingItem[]>([
    { id: Date.now().toString(), productId: '', name: '', quantity: 1, rate: 0, amount: 0 }
  ]);
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', address: '' });
  const [status, setStatus] = useState("Pending");
  const [gstRate, setGstRate] = useState(18);
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = () => {
    try {
      const raw = localStorage.getItem('pavilo_products');
      if (raw) {
        setProducts(JSON.parse(raw));
        return;
      }
    } catch (e) { console.error(e); }

    const sampleProducts: Product[] = [
      { id: '1', name: 'Basmati Rice', rate: 100, unit: 'kg', stock: 50 },
      { id: '2', name: 'Wheat Flour', rate: 45, unit: 'kg', stock: 30 },
      { id: '3', name: 'Sugar', rate: 40, unit: 'kg', stock: 25 },
    ];
    setProducts(sampleProducts);
    localStorage.setItem('pavilo_products', JSON.stringify(sampleProducts));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), productId: '', name: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, patch: Partial<BillingItem>) => {
    const updated = items.map(it =>
      it.id === id ? { ...it, ...patch, amount: (patch.quantity ?? it.quantity) * (patch.rate ?? it.rate) } : it
    );
    setItems(updated);
  };

  const subtotal = items.reduce((s, it) => s + (it.amount || 0), 0);
  const gst = subtotal * (gstRate / 100);
  const total = subtotal + gst;

  const handleGenerate = () => {
    const invoice = {
      id: Date.now().toString(),
      customer,
      items,
      subtotal,
      gst,
      total,
      gstRate,
      status,
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('pavilo_invoices') || '[]');
      existing.push(invoice);
      localStorage.setItem('pavilo_invoices', JSON.stringify(existing));
      toast({ title: "Invoice Created", description: "Invoice saved successfully!" });
      handlePrint();
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Failed to save invoice" });
    }
  };

  const handlePrint = () => {
    if (!invoiceRef.current) return;
    const printContents = invoiceRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Invoice</h1>
          <p className="text-muted-foreground">Generate and print invoices easily</p>
        </div>
        <Badge variant="secondary" className="text-sm">Invoice #{String(Date.now()).slice(-6)}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Section */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
            <CardDescription>Enter customer information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
              <Label>Phone</Label>
              <Input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
              <Label>Email</Label>
              <Input value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
              <Label>Address</Label>
              <Textarea value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
            </div>

            <Separator className="my-4" />
            <Label>Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded px-2 py-2"
            >
              <option value="Pending">Pending</option>
              <option value="Received">Received</option>
            </select>

            <Separator className="my-4" />
            <Label>GST %</Label>
            <Input
              type="number"
              value={gstRate}
              onChange={(e) => setGstRate(Number(e.target.value))}
            />
          </CardContent>
        </Card>

        {/* Items + Invoice */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Invoice Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Label className="text-xs">Product</Label>
                    <select
                      className="w-full border rounded px-2 py-2"
                      value={item.productId}
                      onChange={(e) => {
                        const pid = e.target.value;
                        const prod = products.find(p => p.id === pid);
                        updateItem(item.id, { productId: pid, name: prod?.name || '', rate: prod?.rate || 0, unit: prod?.unit });
                      }}
                    >
                      <option value="">-- Select --</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} - ₹{p.rate}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Qty</Label>
                    <Input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })} />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Rate</Label>
                    <Input type="number" value={item.rate} onChange={(e) => updateItem(item.id, { rate: Number(e.target.value) })} />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Amount</Label>
                    <div className="h-10 px-3 py-2 bg-accent rounded-md text-sm flex items-center font-medium">
                      ₹{item.amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} disabled={items.length === 1}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addItem} className="w-full gap-2"><Plus className="h-4 w-4" /> Add Item</Button>

              <Separator className="my-4" />

              {/* PRINTABLE SECTION */}
              <div ref={invoiceRef} className="print:p-4 print:bg-white print:text-black">
                <h2 className="text-2xl font-bold text-center mb-4">Pavilo Billing</h2>
                <p><strong>Customer Name:</strong> {customer.name}</p>
                <p><strong>Phone:</strong> {customer.phone}</p>
                <Separator className="my-2" />
                <table className="w-full border-collapse border text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2">Product</th>
                      <th className="border p-2">Qty</th>
                      <th className="border p-2">Rate</th>
                      <th className="border p-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, i) => (
                      <tr key={i}>
                        <td className="border p-2">{it.name}</td>
                        <td className="border p-2">{it.quantity}</td>
                        <td className="border p-2">₹{it.rate.toFixed(2)}</td>
                        <td className="border p-2">₹{it.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-right mt-4 space-y-1">
                  <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
                  <p>GST ({gstRate}%): ₹{gst.toFixed(2)}</p>
                  <p className="font-bold text-lg">Total: ₹{total.toFixed(2)}</p>
                  <p>Status: <span className={status === "Received" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{status}</span></p>
                </div>
                <Separator className="my-4" />
                <p className="text-center text-sm text-muted-foreground">© 2025 Pavilo — All Rights Reserved</p>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 print:hidden">
                <Button variant="default" className="flex-1 gap-2" onClick={handleGenerate}>
                  <Printer className="h-4 w-4" /> Generate & Print
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
