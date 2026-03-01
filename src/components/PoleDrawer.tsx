import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, AlertTriangle, Calendar, ShieldAlert, FileText, Phone } from "lucide-react";
import { Pole, usePoles } from "@/context/PoleContext";
import { format } from "date-fns";

interface PoleDrawerProps {
  pole: Pole | null;
  open: boolean;
  onClose: () => void;
}

const severityColor: Record<string, string> = {
  Low: "bg-muted text-muted-foreground",
  Medium: "bg-warning/10 text-warning border-warning/30",
  High: "bg-destructive/10 text-destructive border-destructive/30",
  Critical: "bg-destructive text-destructive-foreground",
};

const PoleDrawer = ({ pole, open, onClose }: PoleDrawerProps) => {
  const { markRepaired } = usePoles();

  if (!pole) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display">Pole Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-foreground">{pole.id}</span>
              <Badge variant={pole.status === "Operational" ? "default" : "destructive"} className={pole.status === "Operational" ? "bg-success text-success-foreground" : ""}>
                {pole.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4" /> {pole.zone}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Installed</p>
                <p className="text-sm font-medium text-foreground">{format(pole.installDate, "MMM d, yyyy")}</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Last Inspected</p>
                <p className="text-sm font-medium text-foreground">{format(pole.lastInspected, "MMM d, yyyy")}</p>
              </div>
            </div>
            {pole.daysOutage > 0 && (
              <div className="flex items-center gap-2 text-destructive text-sm font-medium">
                <AlertTriangle className="w-4 h-4" />
                {pole.daysOutage} day{pole.daysOutage !== 1 ? "s" : ""} outage
              </div>
            )}
          </div>

          {/* Repair Toggle */}
          <div className="rounded-lg border bg-muted/50 p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground text-sm">Mark as Repaired</p>
              <p className="text-xs text-muted-foreground">Toggle to mark this pole as operational</p>
            </div>
            <Switch
              checked={pole.status === "Operational"}
              onCheckedChange={() => {
                if (pole.status === "Defective") markRepaired(pole.id);
              }}
            />
          </div>

          <Separator />

          {/* Reports */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Fault Reports ({pole.reports.length})</h3>
            {pole.reports.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No reports filed for this pole.</p>
            ) : (
              <div className="space-y-3">
                {pole.reports.map((r) => (
                  <div key={r.id} className="rounded-lg border bg-card p-3 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{r.faultType}</Badge>
                        <Badge className={`text-xs ${severityColor[r.severity] || ""}`}>{r.severity}</Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {format(r.timestamp, "MMM d, yyyy h:mm a")}
                      </div>
                    </div>
                    {r.description && (
                      <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <FileText className="w-3 h-3 mt-0.5 shrink-0" />
                        <p>{r.description}</p>
                      </div>
                    )}
                    {r.contactInfo && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <p>{r.contactInfo}</p>
                      </div>
                    )}
                    {r.photoUrl && (
                      <img src={r.photoUrl} alt="Fault" className="w-full h-32 object-cover rounded-md" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PoleDrawer;
