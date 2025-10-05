import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Globe, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";

export function Settings() {
  const toast = useToast();
  const { t, lang, setLang, darkMode, setDarkMode } = useI18n();

  const [businessSettings, setBusinessSettings] = useState(()=>{
    try{ const raw = localStorage.getItem('pavilo_business_settings'); if(raw) return JSON.parse(raw); }catch(e){}
    return { businessName:'Pavilo Store', ownerName:'Owner Name', phone:'', email:'', address:'' };
  });

  const handleBusinessSave = () => {
    try{ localStorage.setItem('pavilo_business_settings', JSON.stringify(businessSettings)); }catch(e){}
    toast({ title: 'Business settings saved successfully!' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <SettingsIcon className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">{t('settings') || 'Settings'}</h1>
          <p className="text-muted-foreground">Manage application settings</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Business Information</CardTitle><CardDescription>Basic company details</CardDescription></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="businessName">Business Name</Label><Input id="businessName" value={businessSettings.businessName} onChange={(e)=>setBusinessSettings({...businessSettings, businessName: e.target.value})} /></div>
            <div className="space-y-2"><Label htmlFor="ownerName">Owner Name</Label><Input id="ownerName" value={businessSettings.ownerName} onChange={(e)=>setBusinessSettings({...businessSettings, ownerName: e.target.value})} /></div>
            <div className="space-y-2"><Label htmlFor="phone">Phone Number *</Label><Input id="phone" value={businessSettings.phone} onChange={(e)=>setBusinessSettings({...businessSettings, phone: e.target.value})} /></div>
            <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" value={businessSettings.email} onChange={(e)=>setBusinessSettings({...businessSettings, email: e.target.value})} /></div>
            <div className="space-y-2 col-span-2"><Label htmlFor="address">Address</Label><Textarea id="address" value={businessSettings.address} onChange={(e)=>setBusinessSettings({...businessSettings, address: e.target.value})} /></div>
            <div className="col-span-2"><Button onClick={handleBusinessSave} className="w-full">{t('save') || 'Save Business Information'}</Button></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>App Preferences</CardTitle><CardDescription>Theme and language</CardDescription></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="space-y-2"><Label>Language</Label>
              <select value={lang} onChange={(e)=>setLang(e.target.value as any)} className="w-full border rounded px-2 py-2">
                <option value="en">English</option>
                <option value="gu">ગુજરાતી</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>
            <div className="space-y-2"><Label>Dark Mode</Label>
              <div className="flex items-center gap-2"><Switch checked={darkMode} onCheckedChange={(v)=>setDarkMode(!!v)} /><span>{darkMode ? 'On' : 'Off'}</span></div>
            </div>
            <div className="col-span-2"><Button className="w-full" onClick={()=>{ try{ const raw = localStorage.getItem('pavilo_app_settings'); const s = raw?JSON.parse(raw):{}; s.language = lang; s.darkMode = darkMode; localStorage.setItem('pavilo_app_settings', JSON.stringify(s)); toast({ title: 'App settings saved' }) }catch(e){console.error(e)} }}>{t('save') || 'Save App Preferences'}</Button></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
