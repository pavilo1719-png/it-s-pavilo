import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Package, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  rate: number;
  unit: string;
  stock: number;
  category?: string;
}

export function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name:'', rate:'', unit:'', stock:'', category:'' });
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  useEffect(()=>{ loadProducts(); }, []);

  const loadProducts = () => {
    try {
      const raw = localStorage.getItem('pavilo_products');
      if (raw) { setProducts(JSON.parse(raw)); return; }
    } catch(e){ console.error(e); }
    const sampleProducts: Product[] = [
      { id: '1', name: 'Basmati Rice', rate: 100, unit: 'kg', stock: 50, category: 'Grains' },
      { id: '2', name: 'Wheat Flour', rate: 45, unit: 'kg', stock: 30, category: 'Grains' },
      { id: '3', name: 'Sugar', rate: 40, unit: 'kg', stock: 25, category: 'Grocery' },
    ];
    setProducts(sampleProducts);
    try{ localStorage.setItem('pavilo_products', JSON.stringify(sampleProducts)); }catch(e){}
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    const productData: Product = { id: editingProduct?.id || Date.now().toString(), name: formData.name, rate: Number(formData.rate), unit: formData.unit, stock: Number(formData.stock), category: formData.category };
    if (editingProduct) {
      const updated = products.map(p=> p.id===editingProduct.id ? productData : p);
      setProducts(updated);
      localStorage.setItem('pavilo_products', JSON.stringify(updated));
      toast({ title: 'Product updated successfully!' });
    } else {
      const updated = [...products, productData];
      setProducts(updated);
      localStorage.setItem('pavilo_products', JSON.stringify(updated));
      toast({ title: 'Product added successfully!' });
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({ name:'', rate:'', unit:'', stock:'', category:'' });
  };

  const handleEdit = (p:Product) => { setEditingProduct(p); setFormData({ name:p.name, rate:String(p.rate), unit:p.unit, stock:String(p.stock), category:p.category||'' }); setIsDialogOpen(true); };
  const handleDelete = (id:string) => { const updated = products.filter(p=>p.id!==id); setProducts(updated); localStorage.setItem('pavilo_products', JSON.stringify(updated)); toast({ title: 'Product deleted successfully!' }); };

  const filtered = products.filter(p=> p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Manage your product inventory and pricing</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" />Add Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle><DialogDescription>{editingProduct ? 'Update product details' : 'Add a new product to your inventory'}</DialogDescription></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2"><Label htmlFor="name">Product Name *</Label><Input id="name" placeholder="e.g., Basmati Rice" value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} required /></div>
                <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="rate">Rate</Label><Input id="rate" value={formData.rate} onChange={(e)=>setFormData({...formData, rate:e.target.value})} /></div><div className="space-y-2"><Label htmlFor="unit">Unit</Label><Input id="unit" value={formData.unit} onChange={(e)=>setFormData({...formData, unit:e.target.value})} /></div></div>
                <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="stock">Stock</Label><Input id="stock" value={formData.stock} onChange={(e)=>setFormData({...formData, stock:e.target.value})} /></div><div className="space-y-2"><Label htmlFor="category">Category</Label><Input id="category" value={formData.category} onChange={(e)=>setFormData({...formData, category:e.target.value})} /></div></div>
                <div className="flex justify-end gap-2"><Button type="submit">Save Product</Button></div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />Product Inventory</CardTitle><CardDescription>Total Products: {products.length}</CardDescription></div>
            <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search products..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="pl-10 w-64" /></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border"><Table><TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Rate</TableHead><TableHead>Stock</TableHead><TableHead>Category</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody>{filtered.map(p=> (<TableRow key={p.id}><TableCell><div className="font-medium">{p.name}</div></TableCell><TableCell>₹{p.rate}</TableCell><TableCell>{p.stock} {p.unit}</TableCell><TableCell>{p.category}</TableCell><TableCell><div className="flex gap-2"><Button variant="ghost" onClick={()=>handleEdit(p)}><Edit className="h-4 w-4" /></Button><Button variant="ghost" onClick={()=>handleDelete(p.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>))}</TableBody></Table></div>
        </CardContent>
      </Card>
    </div>
  );
}
