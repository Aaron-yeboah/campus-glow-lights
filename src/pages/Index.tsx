import { Link } from "react-router-dom";
import { Lightbulb, Shield, QrCode, ArrowRight, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import ugLogo from "@/assets/ug-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center">
          <img src={ugLogo} alt="University of Ghana" className="w-20 h-20 mx-auto mb-6 object-contain" />
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">Campus Glow</h1>
          <p className="text-lg sm:text-xl opacity-85 max-w-2xl mx-auto mb-8">
            University of Ghana's smart streetlight management system. Report faults instantly. Track repairs in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" variant="secondary" className="font-semibold bg-white text-[#1A365D] hover:bg-white/90">
              <Link to="/dashboard">
                <Shield className="w-5 h-5 mr-2" />
                Admin Dashboard
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-semibold bg-white text-[#1A365D] hover:bg-white/90">
              <Link to="/report?poleId=UG-LG-001">
                <Lightbulb className="w-5 h-5 mr-2" />
                Try Reporter
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-semibold bg-[#1A365D] text-white hover:bg-[#1A365D]/90 border border-white/20">
              <Link to="/maintenance">
                <Wrench className="w-5 h-5 mr-2" />
                Maintenance Portal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: QrCode, title: "QR-Based Tracking", desc: "Each pole has a unique QR code. Scan to instantly file a report." },
            { icon: Lightbulb, title: "Photo-Verified Reports", desc: "Students capture fault photos ensuring accurate, verifiable reports." },
            { icon: Shield, title: "Real-Time Dashboard", desc: "Admins monitor all poles, track faults, and manage repairs live." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        University of Ghana, Legon — Campus Glow © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Index;
