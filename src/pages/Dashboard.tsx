import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertTriangle, CheckCircle, Wrench, Search, Eye, QrCode, LayoutDashboard,
  Activity, Clock, TrendingUp, Filter, ArrowUpDown, BarChart3, MapPin,
  Trash2, PlusCircle, HelpCircle, FileText, User, History as HistoryIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import LoadingScreen from "@/components/LoadingScreen";
import StatCard from "@/components/StatCard";
import PoleDrawer from "@/components/PoleDrawer";
import QRGenerator from "@/components/QRGenerator";
import { AddPoleModal } from "@/components/AddPoleModal";
import { usePoles, type Pole } from "@/context/PoleContext";
import { format } from "date-fns";
import ugLogo from "@/assets/ug-logo.png";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const { poles, loading, deletePole, repairs } = usePoles();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedPole, setSelectedPole] = useState<Pole | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("id");

  // Get active tab from URL or default to "dashboard"
  const activeTab = searchParams.get("tab") || "dashboard";

  const handleTabChange = (val: string) => {
    setSearchParams({ tab: val });
  };

  const activeFaults = poles.filter((p) => p.status === "Defective").length;
  const operational = poles.filter((p) => p.status === "Operational").length;
  const totalReports = poles.reduce((sum, p) => sum + p.reports.length, 0);
  const totalRepairs = repairs.length;
  const criticalFaults = poles.filter((p) => p.daysOutage >= 5).length;
  const avgOutage = activeFaults > 0 ? Math.round(poles.filter(p => p.status === "Defective").reduce((s, p) => s + p.daysOutage, 0) / activeFaults) : 0;
  const healthPercent = poles.length > 0 ? Math.round((operational / poles.length) * 100) : 0;

  // Fault type breakdown for chart
  const faultTypeData = useMemo(() => {
    const map: Record<string, number> = {};
    poles.forEach(p => p.reports.forEach(r => { map[r.faultType] = (map[r.faultType] || 0) + 1; }));
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [poles]);

  // Zone breakdown
  const zoneData = useMemo(() => {
    const zones: Record<string, { total: number; defective: number }> = {};
    poles.forEach(p => {
      if (!zones[p.zone]) zones[p.zone] = { total: 0, defective: 0 };
      zones[p.zone].total++;
      if (p.status === "Defective") zones[p.zone].defective++;
    });
    return Object.entries(zones).map(([zone, data]) => ({
      zone: zone.length > 12 ? zone.slice(0, 12) + "…" : zone,
      defective: data.defective,
      operational: data.total - data.defective
    }));
  }, [poles]);

  const filtered = useMemo(() => {
    let result = poles.filter(
      (p) =>
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.zone.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== "all") {
      result = result.filter(p => p.status === statusFilter);
    }
    result.sort((a, b) => {
      if (sortBy === "id") return a.id.localeCompare(b.id);
      if (sortBy === "zone") return a.zone.localeCompare(b.zone);
      if (sortBy === "status") return a.status.localeCompare(b.status);
      if (sortBy === "outage") return b.daysOutage - a.daysOutage;
      if (sortBy === "reports") return b.reports.length - a.reports.length;
      return 0;
    });
    return result;
  }, [poles, search, statusFilter, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={ugLogo} alt="UG Logo" className="w-9 h-9 object-contain" />
            <div>
              <h1 className="text-xl font-display font-bold">Campus Glow</h1>
              <p className="text-xs opacity-75">University of Ghana — Streetlight Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs opacity-75 mr-2">
              <Clock className="w-3.5 h-3.5" />
              {format(new Date(), "MMM d, yyyy h:mm a")}
            </div>
            <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-full gap-2 px-3 h-8 text-xs font-bold">
              <Link to="/faq">
                <HelpCircle className="w-3.5 h-3.5" />
                Support
              </Link>
            </Button>
            <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground text-xs whitespace-nowrap">
              Admin Portal
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {loading ? (
          <LoadingScreen message="Syncing with Supabase..." />
        ) : (
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="dashboard">
                  <LayoutDashboard className="w-4 h-4 mr-1.5" /> Dashboard
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart3 className="w-4 h-4 mr-1.5" /> Analytics
                </TabsTrigger>
                <TabsTrigger value="qr">
                  <QrCode className="w-4 h-4 mr-1.5" /> QR Management
                </TabsTrigger>
                <TabsTrigger value="maintenance">
                  <HistoryIcon className="w-4 h-4 mr-1.5" /> Maintenance
                </TabsTrigger>
              </TabsList>

              <AddPoleModal />
            </div>

            <TabsContent value="dashboard" className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard title="Active Faults" value={activeFaults} icon={AlertTriangle} variant="destructive" subtitle={`${criticalFaults} critical`} />
                <StatCard title="Operational" value={operational} icon={CheckCircle} variant="success" subtitle={`${healthPercent}% health`} />
                <StatCard title="Total Poles" value={poles.length} icon={Activity} variant="default" subtitle="All zones" />
                <StatCard title="Total Reports" value={totalReports} icon={TrendingUp} variant="warning" subtitle="All time" />
                <StatCard title="Total Repairs" value={totalRepairs} icon={Wrench} variant="default" subtitle="Completed fixes" />
              </div>

              {/* System Health Bar */}
              <div className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">System Health</p>
                  <span className={`text-sm font-bold ${healthPercent >= 80 ? "text-success" : healthPercent >= 50 ? "text-warning" : "text-destructive"}`}>{healthPercent}%</span>
                </div>
                <Progress value={healthPercent} className="h-2.5" />
                <p className="text-xs text-muted-foreground mt-1.5">{operational} of {poles.length} poles operational</p>
              </div>

              {/* Table */}
              <div className="rounded-xl border bg-card">
                <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center gap-3">
                  <h2 className="font-display font-semibold text-foreground">All Streetlights</h2>
                  <div className="flex flex-col sm:flex-row sm:ml-auto gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-60">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by ID or zone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <Filter className="w-3.5 h-3.5 mr-1.5" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Operational">Operational</SelectItem>
                        <SelectItem value="Defective">Defective</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full sm:w-40">
                        <ArrowUpDown className="w-3.5 h-3.5 mr-1.5" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">Sort by ID</SelectItem>
                        <SelectItem value="zone">Sort by Zone</SelectItem>
                        <SelectItem value="status">Sort by Status</SelectItem>
                        <SelectItem value="outage">Sort by Outage</SelectItem>
                        <SelectItem value="reports">Sort by Reports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="px-4 py-2 border-b bg-muted/30">
                  <p className="text-xs text-muted-foreground">Showing {filtered.length} of {poles.length} poles</p>
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pole ID</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Outage</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reports</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Inspected</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((pole) => (
                        <tr key={pole.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-mono font-semibold text-sm text-foreground">{pole.id}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pole.zone}</span>
                          </td>
                          <td className="px-4 py-3">
                            {pole.status === "Operational" ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                                <span className="w-2 h-2 rounded-full bg-success pulse-green" />
                                Operational
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive">
                                <span className="w-2 h-2 rounded-full bg-destructive glow-red" />
                                Defective
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {pole.daysOutage > 0 ? (
                              <span className={`font-medium ${pole.daysOutage >= 5 ? "text-destructive" : "text-warning"}`}>
                                {pole.daysOutage}d
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={pole.reports.length > 0 ? "secondary" : "outline"} className="text-xs">
                              {pole.reports.length}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {format(new Date(pole.lastInspected), "MMM d")}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setSelectedPole(pole); setDrawerOpen(true); }}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  if (confirm(`Delete pole ${pole.id}?`)) {
                                    deletePole(pole.id).then(() => toast.success("Pole deleted"));
                                  }
                                }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden divide-y">
                  {filtered.map((pole) => (
                    <div key={pole.id} className="p-4 space-y-2 active:bg-muted/30" onClick={() => { setSelectedPole(pole); setDrawerOpen(true); }}>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-semibold text-sm text-foreground">{pole.id}</span>
                        {pole.status === "Operational" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                            <span className="w-2 h-2 rounded-full bg-success pulse-green" /> Operational
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                            <span className="w-2 h-2 rounded-full bg-destructive glow-red" /> Defective
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{pole.zone}</p>
                        {pole.reports.length > 0 && <Badge variant="secondary" className="text-xs">{pole.reports.length} report{pole.reports.length !== 1 ? "s" : ""}</Badge>}
                      </div>
                      {pole.daysOutage > 0 && <p className="text-xs text-destructive font-medium">{pole.daysOutage} day{pole.daysOutage !== 1 ? "s" : ""} outage</p>}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Pie Chart */}
                <div className="rounded-xl border bg-card p-5">
                  <h3 className="font-display font-semibold text-foreground mb-4">Status Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Operational", value: operational },
                            { name: "Defective", value: activeFaults },
                          ]}
                          cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                          dataKey="value" paddingAngle={4}
                        >
                          <Cell fill="hsl(142, 71%, 35%)" />
                          <Cell fill="hsl(0, 72%, 51%)" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-2">
                    <span className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded-sm bg-success" /> Operational</span>
                    <span className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded-sm bg-destructive" /> Defective</span>
                  </div>
                </div>

                {/* Fault Types Bar Chart */}
                <div className="rounded-xl border bg-card p-5">
                  <h3 className="font-display font-semibold text-foreground mb-4">Fault Types</h3>
                  {faultTypeData.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={faultTypeData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                          <XAxis type="number" allowDecimals={false} />
                          <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="value" fill="hsl(215, 56%, 23%)" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-10 text-center">No reports yet</p>
                  )}
                </div>

                {/* Zone Health Overview */}
                <div className="rounded-xl border bg-card p-5 lg:col-span-2">
                  <h3 className="font-display font-semibold text-foreground mb-4">Zone Health</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={zoneData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                        <XAxis dataKey="zone" tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="operational" stackId="a" fill="hsl(142, 71%, 35%)" name="Operational" />
                        <Bar dataKey="defective" stackId="a" fill="hsl(0, 72%, 51%)" name="Defective" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Active Reports */}
                <div className="rounded-xl border bg-card p-5 lg:col-span-2">
                  <h3 className="font-display font-semibold text-foreground mb-4">Recent Fault Reports</h3>
                  <div className="space-y-3">
                    {poles.flatMap(p => p.reports.map(r => ({ ...r, zone: p.zone }))).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5).map((r) => (
                      <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                        <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{r.faultType} — <span className="font-mono">{r.poleId}</span></p>
                          <p className="text-xs text-muted-foreground">{r.zone} • {format(new Date(r.timestamp), "MMM d, h:mm a")}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-xs">{r.severity}</Badge>
                      </div>
                    ))}
                    {totalReports === 0 && <p className="text-sm text-muted-foreground text-center py-6">No reports yet</p>}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="qr">
              <QRGenerator />
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-6">
              <div className="rounded-xl border bg-card">
                <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center gap-3">
                  <h2 className="font-display font-semibold text-foreground">Maintenance Reports</h2>
                  <div className="flex flex-col sm:ml-auto gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-60">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search pole or tech..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Technician</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pole ID</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fault Category</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Documentation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {repairs.length > 0 ? (
                        repairs.filter((r) =>
                          r.poleId.toLowerCase().includes(search.toLowerCase()) ||
                          r.techName.toLowerCase().includes(search.toLowerCase()) ||
                          r.faultCategory.toLowerCase().includes(search.toLowerCase())
                        ).map((repair) => (
                          <tr key={repair.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 text-xs">
                              {format(new Date(repair.timestamp), "MMM dd, yyyy")}
                              <br />
                              <span className="text-muted-foreground">{format(new Date(repair.timestamp), "h:mm a")}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                  {repair.techName.split(' ').map((n) => n[0]).join('')}
                                </div>
                                <span className="text-sm font-medium">{repair.techName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-mono font-semibold text-sm">{repair.poleId}</td>
                            <td className="px-4 py-3">
                              <Badge variant="outline">{repair.faultCategory}</Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs font-bold gap-2"
                                  onClick={() => {
                                    const win = window.open("", "_blank");
                                    if (win) {
                                      win.document.write(`
                                      <html>
                                        <head><title>Receipt - ${repair.poleId}</title></head>
                                        <body style="margin:0; background:#0f172a; display:flex; flex-direction:column; align-items:center; color:white; font-family:sans-serif; padding:40px;">
                                          <h1 style="margin-bottom:10px;">Maintenance Receipt: ${repair.poleId}</h1>
                                          <p style="color:rgba(255,255,255,0.6); margin-bottom:30px;">Digitally signed by administrator for University of Ghana</p>
                                          
                                          <div style="display:grid; grid-template-columns:1fr 1fr; gap:30px; width:100%; max-width:1100px;">
                                            <div style="background:rgba(255,255,255,0.03); padding:20px; border-radius:20px; border:1px solid rgba(255,255,255,0.1);">
                                              <p style="font-weight:bold; letter-spacing:2px; font-size:12px; color:rgba(255,255,255,0.4);">BEFORE REPAIR</p>
                                              <img src="${repair.beforePhotoUrl}" style="width:100%; height:400px; object-fit:cover; border-radius:12px; margin-top:10px;"/>
                                            </div>
                                            <div style="background:rgba(255,255,255,0.03); padding:20px; border-radius:20px; border:1px solid rgba(255,255,255,0.1);">
                                              <p style="font-weight:bold; letter-spacing:2px; font-size:12px; color:rgba(255,255,255,0.4);">AFTER REPAIR</p>
                                              <img src="${repair.afterPhotoUrl}" style="width:100%; height:400px; object-fit:cover; border-radius:12px; margin-top:10px;"/>
                                            </div>
                                          </div>

                                          <div style="margin-top:40px; width:100%; max-width:1100px; display:grid; grid-template-columns:1fr 1fr; gap:40px;">
                                            <div style="background:rgba(255,255,255,0.05); padding:30px; border-radius:20px;">
                                              <h3 style="margin-top:0; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:15px;">Repair Details</h3>
                                              <p><b>Pole ID:</b> ${repair.poleId}</p>
                                              <p><b>Fixed By:</b> ${repair.techName}</p>
                                              <p><b>Category:</b> ${repair.faultCategory}</p>
                                              <p><b>Date:</b> ${new Date(repair.timestamp).toLocaleString()}</p>
                                            </div>
                                            <div style="background:rgba(255,255,255,0.05); padding:30px; border-radius:20px;">
                                              <h3 style="margin-top:0; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:15px;">Work Notes</h3>
                                              <p style="line-height:1.6; color:rgba(255,255,255,0.8);">${repair.workNotes || "No specific notes recorded for this action."}</p>
                                            </div>
                                          </div>
                                        </body>
                                      </html>
                                    `);
                                      win.document.close();
                                    }
                                  }}
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  View Evidence
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:bg-destructive/10"
                                  onClick={async () => {
                                    if (confirm("Permanently delete this maintenance record?")) {
                                      const { error } = await supabase.from("repairs").delete().eq("id", repair.id);
                                      if (error) toast.error("Failed to delete record");
                                      else toast.success("Record removed");
                                    }
                                  }}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))) : null}
                    </tbody>
                  </table>
                  {repairs.length === 0 && (
                    <div className="py-20 text-center">
                      <p className="text-muted-foreground text-sm">No maintenance records found.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      <PoleDrawer pole={selectedPole} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
};

export default Dashboard;
