import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: "destructive" | "success" | "default";
}

const variantStyles = {
  destructive: "border-destructive/20 bg-destructive/5",
  success: "border-success/20 bg-success/5",
  default: "border-border bg-card",
};

const iconStyles = {
  destructive: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
  default: "bg-primary/10 text-primary",
};

const StatCard = ({ title, value, icon: Icon, variant }: StatCardProps) => (
  <div className={`rounded-xl border p-5 ${variantStyles[variant]}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-3xl font-display font-bold text-foreground mt-1">{value}</p>
      </div>
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${iconStyles[variant]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

export default StatCard;
