import { useState } from "react";
import { AlertTriangle, CheckCircle, Wrench, Search, Eye, QrCode, LayoutDashboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "@/components/StatCard";
import PoleDrawer from "@/components/PoleDrawer";
import QRGenerator from "@/components/QRGenerator";
import { usePoles, type Pole } from "@/context/PoleContext";
import ugLogo from "@/assets/ug-logo.png";

const Dashboard = () => {
  const { poles } = usePoles();
  const [search, setSearch] = useState("");
  const [selectedPole, setSelectedPole] = useState<Pole | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeFaults = poles.filter((p) => p.status === "Defective").length;
  const operational = poles.filter((p) => p.status === "Operational").length;
  const repairsThisWeek = 4; // mock

  const filtered = poles.filter(
    (p) =>
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.zone.toLowerCase().includes(search.toLowerCase())
  );

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
          <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground text-xs">
            Admin Portal
          </Badge>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <Tabs defaultValue="dashboard">
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">
              <LayoutDashboard className="w-4 h-4 mr-1.5" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="qr">
              <QrCode className="w-4 h-4 mr-1.5" /> QR Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard title="Active Faults" value={activeFaults} icon={AlertTriangle} variant="destructive" />
              <StatCard title="Operational Poles" value={operational} icon={CheckCircle} variant="success" />
              <StatCard title="Repairs This Week" value={repairsThisWeek} icon={Wrench} variant="default" />
            </div>

            {/* Table */}
            <div className="rounded-xl border bg-card">
              <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center gap-3">
                <h2 className="font-display font-semibold text-foreground">All Streetlights</h2>
                <div className="relative sm:ml-auto w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID or zone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden sm:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pole ID</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Days Outage</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((pole) => (
                      <tr key={pole.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono font-semibold text-sm text-foreground">{pole.id}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{pole.zone}</td>
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
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {pole.daysOutage > 0 ? `${pole.daysOutage} day${pole.daysOutage !== 1 ? "s" : ""}` : "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setSelectedPole(pole); setDrawerOpen(true); }}
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" /> Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden divide-y">
                {filtered.map((pole) => (
                  <div key={pole.id} className="p-4 space-y-2" onClick={() => { setSelectedPole(pole); setDrawerOpen(true); }}>
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
                    <p className="text-xs text-muted-foreground">{pole.zone}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qr">
            <QRGenerator />
          </TabsContent>
        </Tabs>
      </div>

      <PoleDrawer pole={selectedPole} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
};

export default Dashboard;
