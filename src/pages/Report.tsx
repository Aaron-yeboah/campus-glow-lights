import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Camera, Upload, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePoles } from "@/context/PoleContext";
import { toast } from "sonner";
import ugLogo from "@/assets/ug-logo.png";

const faultTypes = ["Flickering", "Outage", "Physical Damage", "Dim Light", "Wiring Issue"];

const Report = () => {
  const [searchParams] = useSearchParams();
  const poleId = searchParams.get("poleId") || "";
  const { submitReport, poles } = usePoles();

  const [photo, setPhoto] = useState<string | null>(null);
  const [faultType, setFaultType] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const pole = poles.find((p) => p.id === poleId);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!photo || !faultType || !poleId) return;
    submitReport(poleId, faultType, photo);
    setSubmitted(true);
    toast.success("Report submitted successfully!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground">Report Submitted!</h2>
          <p className="text-muted-foreground">
            Your fault report for pole <span className="font-semibold text-foreground">{poleId}</span> has been received.
            The maintenance team will be notified.
          </p>
          <Button variant="outline" onClick={() => { setSubmitted(false); setPhoto(null); setFaultType(""); }}>
            Submit Another Report
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-5">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <img src={ugLogo} alt="UG Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-lg font-display font-bold">Campus Glow</h1>
            <p className="text-xs opacity-80">University of Ghana Streetlight Reporter</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-5">
        {/* Pole Info */}
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-warning" />
            <h2 className="font-display font-semibold text-foreground">Report a Fault</h2>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs">Pole ID</Label>
              <Input value={poleId || "No Pole ID provided"} readOnly className="bg-muted font-mono font-semibold" />
            </div>
            {pole && (
              <div>
                <Label className="text-muted-foreground text-xs">Location</Label>
                <Input value={pole.zone} readOnly className="bg-muted" />
              </div>
            )}
          </div>
        </div>

        {/* Photo Capture */}
        <div className="rounded-lg border bg-card p-4">
          <Label className="text-sm font-medium text-foreground mb-2 block">
            Fault Photo <span className="text-destructive">*</span>
          </Label>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCapture} />

          {!photo ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-40 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-muted transition-colors"
            >
              <Camera className="w-10 h-10 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">Tap to capture fault photo</span>
              <span className="text-xs text-muted-foreground/60">Required for submission</span>
            </button>
          ) : (
            <div className="relative">
              <img src={photo} alt="Fault" className="w-full h-40 object-cover rounded-lg" />
              <button
                onClick={() => { setPhoto(null); if (fileRef.current) fileRef.current.value = ""; }}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Fault Type */}
        <div className="rounded-lg border bg-card p-4">
          <Label className="text-sm font-medium text-foreground mb-2 block">Fault Type</Label>
          <Select value={faultType} onValueChange={setFaultType}>
            <SelectTrigger>
              <SelectValue placeholder="Select fault type..." />
            </SelectTrigger>
            <SelectContent>
              {faultTypes.map((ft) => (
                <SelectItem key={ft} value={ft}>{ft}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={!photo || !faultType || !poleId}
          className="w-full h-12 text-base font-semibold disabled:opacity-40"
          size="lg"
        >
          {!photo ? (
            <>
              <Camera className="w-5 h-5 mr-2" />
              Photo Required to Submit
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Submit Report
            </>
          )}
        </Button>

        {!photo && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
            <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">Please capture a photo of the faulty streetlight before submitting your report.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
