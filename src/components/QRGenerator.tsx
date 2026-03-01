import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download, Plus, Printer } from "lucide-react";
import { usePoles } from "@/context/PoleContext";
import { toast } from "sonner";
import ugLogo from "@/assets/ug-logo.png";
import html2canvas from "html2canvas";

const QRGenerator = () => {
  const { addPole, poles } = usePoles();
  const [poleId, setPoleId] = useState("");
  const [zone, setZone] = useState("");
  const [generated, setGenerated] = useState<{ id: string; zone: string }[]>([]);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const baseUrl = window.location.origin;

  const handleGenerate = () => {
    if (!poleId || !zone) {
      toast.error("Please fill in both fields");
      return;
    }
    addPole(poleId, zone);
    setGenerated((prev) => [...prev, { id: poleId, zone }]);
    setPoleId("");
    setZone("");
    toast.success(`QR label generated for ${poleId}`);
  };

  const handleDownload = async (id: string) => {
    const el = cardRefs.current.get(id);
    if (!el) return;
    const canvas = await html2canvas(el, { backgroundColor: "#ffffff", scale: 2 });
    const link = document.createElement("a");
    link.download = `${id}-label.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handlePrintAll = () => window.print();

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="font-display font-semibold text-foreground mb-4">Generate Pole Label</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <Label className="text-xs text-muted-foreground">Pole ID</Label>
            <Input value={poleId} onChange={(e) => setPoleId(e.target.value)} placeholder="UG-LG-011" className="font-mono" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Campus Zone</Label>
            <Input value={zone} onChange={(e) => setZone(e.target.value)} placeholder="e.g. Main Library" />
          </div>
          <Button onClick={handleGenerate}>
            <Plus className="w-4 h-4 mr-1" /> Generate
          </Button>
        </div>
      </div>

      {/* Generated Labels */}
      {generated.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground">Generated Labels ({generated.length})</h3>
            <Button variant="outline" size="sm" onClick={handlePrintAll}>
              <Printer className="w-4 h-4 mr-1" /> Print All
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {generated.map((g) => (
              <div key={g.id} className="relative group">
                <div
                  ref={(el) => { if (el) cardRefs.current.set(g.id, el); }}
                  className="rounded-xl border-2 border-primary/20 bg-card p-5 text-center space-y-3"
                >
                  <img src={ugLogo} alt="UG" className="w-10 h-10 mx-auto object-contain" />
                  <p className="text-xs font-semibold text-primary tracking-wider uppercase">Campus Glow</p>
                  <div className="flex justify-center">
                    <QRCodeSVG
                      value={`${baseUrl}/report?poleId=${g.id}`}
                      size={140}
                      level="H"
                      fgColor="hsl(215,56%,23%)"
                    />
                  </div>
                  <p className="font-mono text-lg font-bold text-foreground">{g.id}</p>
                  <p className="text-xs text-muted-foreground">{g.zone}</p>
                  <div className="border-t pt-2">
                    <p className="text-[10px] text-muted-foreground">Scan to report a fault</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDownload(g.id)}
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;
