import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Invoice {
  id: string;
  number?: string;
  customer: {
    name?: string;
    phone?: string;
    address?: string;
  };
  items?: { name: string; quantity: number; rate: number; amount: number }[];
  total: number;
  status?: string;
  paymentMethod?: string;
  createdAt?: string;
}

interface PaymentRecord {
  id: string;
  invoiceId: string;
  method: string;
  amount: number;
  date: string;
}

export default function Payments() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const toast = useToast();
  const { t } = useI18n();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pavilo_invoices");
      if (raw) setInvoices(JSON.parse(raw));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleMethodChange = (invoiceId: string, newMethod: string) => {
    const updated = invoices.map((inv) =>
      inv.id === invoiceId ? { ...inv, paymentMethod: newMethod } : inv
    );
    setInvoices(updated);
  };

  const markPaid = (inv: Invoice) => {
    try {
      const payments: PaymentRecord[] = JSON.parse(
        localStorage.getItem("pavilo_payments") || "[]"
      );
      const record: PaymentRecord = {
        id: Date.now().toString(),
        invoiceId: inv.id,
        method: inv.paymentMethod || "Cash",
        amount: inv.total,
        date: new Date().toISOString(),
      };
      payments.push(record);
      localStorage.setItem("pavilo_payments", JSON.stringify(payments));

      const updatedInvoices = invoices.map((i) =>
        i.id === inv.id
          ? { ...i, status: "Paid", paymentMethod: inv.paymentMethod || "Cash" }
          : i
      );
      setInvoices(updatedInvoices);
      localStorage.setItem("pavilo_invoices", JSON.stringify(updatedInvoices));

      toast.toast({ title: "✅ Payment recorded successfully" });
    } catch (e) {
      console.error(e);
      toast.toast({ title: "❌ Failed to record payment" });
    }
  };

  const deletePayment = (inv: Invoice) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    const updated = invoices.filter((i) => i.id !== inv.id);
    setInvoices(updated);
    localStorage.setItem("pavilo_invoices", JSON.stringify(updated));
    toast.toast({ title: "🗑️ Invoice deleted" });
  };

  const previewInvoice = (inv: Invoice) => {
    const win = window.open("", "_blank", "width=800,height=600");
    if (!win) return;

    const itemRows =
      inv.items
        ?.map(
          (it) =>
            `<tr><td>${it.name}</td><td>${it.quantity}</td><td>₹${it.rate.toFixed(
              2
            )}</td><td>₹${it.amount.toFixed(2)}</td></tr>`
        )
        .join("") || "";

    const html = `
      <html>
        <head>
          <title>Invoice #${inv.number || inv.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background: #f9f9f9; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <h2>Pavilo Billing Buddy</h2>
          <h3>Invoice #${inv.number || inv.id}</h3>
          <p><strong>Date:</strong> ${new Date(
            inv.createdAt || ""
          ).toLocaleDateString()}</p>
          <p><strong>Customer:</strong> ${inv.customer?.name || "Walk-in"}<br/>
             <strong>Phone:</strong> ${inv.customer?.phone || "N/A"}<br/>
             <strong>Address:</strong> ${inv.customer?.address || ""}</p>

          <table>
            <thead>
              <tr><th>Product</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>

          <h3 style="text-align:right;">Total: ₹${inv.total.toFixed(2)}</h3>
          <p style="text-align:right;">Payment: ${
            inv.paymentMethod || "N/A"
          }</p>
          <div class="footer">Pavilo — All Rights Reserved © 2025</div>
        </body>
      </html>`;
    win.document.write(html);
    win.document.close();
    win.print();
  };

  const downloadPDF = (inv: Invoice) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Pavilo Billing Buddy", 14, 20);
    doc.setFontSize(12);
    doc.text(`Invoice #: ${inv.number || inv.id}`, 14, 30);
    doc.text(`Date: ${new Date(inv.createdAt || "").toLocaleDateString()}`, 14, 37);
    doc.text(`Customer: ${inv.customer?.name || "Walk-in"}`, 14, 44);
    doc.text(`Phone: ${inv.customer?.phone || "N/A"}`, 14, 51);

    const rows =
      inv.items?.map((it) => [it.name, it.quantity, it.rate, it.amount]) || [];
    (doc as any).autoTable({
      startY: 60,
      head: [["Product", "Qty", "Rate", "Amount"]],
      body: rows,
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Total: ₹${inv.total.toFixed(2)}`, 150, finalY);
    doc.text(`Payment Method: ${inv.paymentMethod || "N/A"}`, 14, finalY + 10);
    doc.text("© Pavilo — All Rights Reserved 2025", 60, finalY + 20);
    doc.save(`Invoice_${inv.number || inv.id}.pdf`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("payments") || "Payments"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No invoices found.
              </div>
            )}
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex flex-col md:flex-row md:items-center justify-between border p-3 rounded-lg shadow-sm bg-white"
              >
                <div>
                  <div className="font-semibold">
                    {inv.number || inv.id} — {inv.customer?.name || "Walk-in"}
                  </div>
                  <div className="text-sm text-gray-600">
                    Phone: {inv.customer?.phone || "N/A"}
                  </div>
                  <div className="text-sm">Total: ₹{inv.total.toFixed(2)}</div>
                  <div className="text-sm">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        inv.status === "Paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {inv.status || "Unpaid"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3 md:mt-0">
                  {inv.status !== "Paid" && (
                    <>
                      <select
                        value={inv.paymentMethod || "Cash"}
                        onChange={(e) =>
                          handleMethodChange(inv.id, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                        <option value="UPI">UPI</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                      <Button size="sm" onClick={() => markPaid(inv)}>
                        Mark Paid
                      </Button>
                    </>
                  )}

                  <Button size="sm" variant="outline" onClick={() => previewInvoice(inv)}>
                    Preview
                  </Button>

                  <Button size="sm" variant="outline" onClick={() => downloadPDF(inv)}>
                    Download PDF
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deletePayment(inv)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
