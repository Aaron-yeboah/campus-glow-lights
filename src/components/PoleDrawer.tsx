import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, AlertTriangle } from "lucide-react";
import { Pole, usePoles } from "@/context/PoleContext";
import { format } from "date-fns";

interface PoleDrawerProps {
  pole: Pole | null;
  open: boolean;
  onClose: () => void;
}

const PoleDrawer = ({ pole, open, onClose }: PoleDrawerProps) => {
  const { markRepaired } = usePoles();

  if (!pole) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
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
              <MapPin className="w-4 h-4" />
              {pole.zone}
            </div>
            {pole.daysOutage > 0 && (
              <div className="flex items-center gap-2 text-destructive text-sm">
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

          {/* Reports */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Fault Reports ({pole.reports.length})</h3>
            {pole.reports.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reports filed for this pole.</p>
            ) : (
              <div className="space-y-3">
                {pole.reports.map((r) => (
                  <div key={r.id} className="rounded-lg border bg-card p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{r.faultType}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {format(r.timestamp, "MMM d, yyyy h:mm a")}
                      </div>
                    </div>
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
