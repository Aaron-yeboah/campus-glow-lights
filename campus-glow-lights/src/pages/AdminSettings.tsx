import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Shield, Eye, EyeOff, Lock, CheckCircle, AlertTriangle,
    ArrowLeft, UserPlus, Trash2, RefreshCw, Mail, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import ugLogo from "@/assets/ug-logo.png";
import { format } from "date-fns";
import DeveloperCredit from "@/components/DeveloperCredit";

// Emails that cannot be removed
const DEFAULT_ADMIN_EMAILS = [
    "yeboahaaron602@gmail.com",
    "owusujunior2004@gmail.com",
];

interface AdminUser {
    id: string;
    email: string;
    created_at: string;
}

const AdminSettings = () => {
    const navigate = useNavigate();

    // Admin list
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loadingAdmins, setLoadingAdmins] = useState(true);

    // Add admin form
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [adding, setAdding] = useState(false);

    // Remove confirmation
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

    // Password strength for new admin
    const strength = (() => {
        if (!newPassword) return { score: 0, label: "", color: "" };
        let score = 0;
        if (newPassword.length >= 8) score++;
        if (newPassword.length >= 12) score++;
        if (/[A-Z]/.test(newPassword)) score++;
        if (/[0-9]/.test(newPassword)) score++;
        if (/[^A-Za-z0-9]/.test(newPassword)) score++;
        if (score <= 1) return { score, label: "Weak", color: "#ef4444" };
        if (score <= 3) return { score, label: "Moderate", color: "#f59e0b" };
        return { score, label: "Strong", color: "#22c55e" };
    })();

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setLoadingAdmins(true);
        try {
            const { data, error } = await supabase
                .from("admin_users")
                .select("id, email, created_at")
                .order("created_at", { ascending: true });
            if (error) throw error;
            setAdmins(data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load admin users.");
        } finally {
            setLoadingAdmins(false);
        }
    };

    const handleAddAdmin = async () => {
        if (!newEmail.trim() || !newPassword) {
            toast.error("Please fill in both email and password.");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }
        const emailLower = newEmail.trim().toLowerCase();
        if (admins.some(a => a.email === emailLower)) {
            toast.error("This email is already an admin.");
            return;
        }

        setAdding(true);
        try {
            const { error } = await supabase
                .from("admin_users")
                .insert({ email: emailLower, password: newPassword });
            if (error) throw error;
            toast.success(`Admin ${emailLower} added successfully!`);
            setNewEmail("");
            setNewPassword("");
            await fetchAdmins();
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to add admin. Check console.");
        } finally {
            setAdding(false);
        }
    };

    const handleRemoveAdmin = async (id: string, email: string) => {
        if (DEFAULT_ADMIN_EMAILS.includes(email)) {
            toast.error("Default admins cannot be removed.");
            return;
        }
        setRemovingId(id);
        try {
            const { error } = await supabase
                .from("admin_users")
                .delete()
                .eq("id", id);
            if (error) throw error;
            toast.success(`Admin ${email} removed.`);
            setConfirmRemoveId(null);
            await fetchAdmins();
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to remove admin.");
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-[#1A365D] text-white border-b border-white/10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <img src={ugLogo} alt="UG Logo" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
                        <div>
                            <h1 className="text-lg sm:text-xl font-display font-bold leading-none">Campus Glow</h1>
                            <p className="hidden sm:block text-[10px] opacity-75 mt-0.5 font-medium uppercase tracking-wider">Admin Settings</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/dashboard")}
                        className="text-white hover:bg-white/10 gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Back to Dashboard</span>
                    </Button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                {/* Page title */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1A365D]/10 flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-[#1A365D]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-display font-bold text-foreground">Security Settings</h2>
                        <p className="text-sm text-muted-foreground">Manage admin access and authentication</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Admin Management */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Current Admins */}
                        <div className="rounded-xl border bg-card p-6 space-y-4">
                            <div className="flex items-center gap-2 pb-3 border-b">
                                <Users className="w-4 h-4 text-[#1A365D]" />
                                <h3 className="font-display font-semibold text-foreground text-sm">Admin Users</h3>
                                <Badge variant="secondary" className="ml-auto text-[10px] font-bold">
                                    {admins.length} {admins.length === 1 ? "admin" : "admins"}
                                </Badge>
                            </div>

                            {loadingAdmins ? (
                                <div className="flex items-center justify-center py-6 text-muted-foreground text-sm gap-2">
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Loading admins...
                                </div>
                            ) : admins.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">No admins found.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {admins.map(admin => {
                                        const isDefault = DEFAULT_ADMIN_EMAILS.includes(admin.email);
                                        const isConfirming = confirmRemoveId === admin.id;
                                        const isRemoving = removingId === admin.id;
                                        return (
                                            <li
                                                key={admin.id}
                                                className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border bg-background hover:bg-muted/30 transition-colors"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-8 h-8 rounded-full bg-[#1A365D]/10 flex items-center justify-center shrink-0">
                                                        <Mail className="w-3.5 h-3.5 text-[#1A365D]" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-foreground truncate">{admin.email}</p>
                                                        <p className="text-[10px] text-muted-foreground">
                                                            Added {format(new Date(admin.created_at), "MMM d, yyyy")}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {isDefault && (
                                                        <Badge className="text-[10px] bg-blue-100 text-blue-700 border-blue-200 font-bold">
                                                            Default
                                                        </Badge>
                                                    )}
                                                    {!isDefault && (
                                                        isConfirming ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-[10px] text-destructive font-medium">Remove?</span>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => setConfirmRemoveId(null)}
                                                                    className="h-7 px-2 text-xs"
                                                                    disabled={isRemoving}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                                                                    disabled={isRemoving}
                                                                    className="h-7 px-2 bg-destructive hover:bg-destructive/90 text-white text-xs gap-1"
                                                                >
                                                                    {isRemoving
                                                                        ? <RefreshCw className="w-3 h-3 animate-spin" />
                                                                        : <Trash2 className="w-3 h-3" />}
                                                                    Yes
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => setConfirmRemoveId(admin.id)}
                                                                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        )
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>

                        {/* Add New Admin */}
                        <div className="rounded-xl border bg-card p-6 space-y-5">
                            <div className="flex items-center gap-2 pb-3 border-b">
                                <UserPlus className="w-4 h-4 text-[#1A365D]" />
                                <h3 className="font-display font-semibold text-foreground text-sm">Add New Admin</h3>
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        value={newEmail}
                                        onChange={e => setNewEmail(e.target.value)}
                                        placeholder="admin@example.com"
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder="Set a password"
                                        className="pl-9 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>

                                {/* Strength indicator */}
                                {newPassword && (
                                    <div className="space-y-1.5 pt-1">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div
                                                    key={i}
                                                    className="h-1.5 flex-1 rounded-full transition-all duration-300"
                                                    style={{ background: i <= strength.score ? strength.color : "#e2e8f0" }}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-[10px] font-bold" style={{ color: strength.color }}>
                                            {strength.label} password
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={handleAddAdmin}
                                disabled={adding || !newEmail || !newPassword}
                                className="w-full bg-[#1A365D] hover:bg-[#1A365D]/90 text-white font-bold gap-2"
                            >
                                {adding ? (
                                    <><RefreshCw className="w-4 h-4 animate-spin" /> Adding...</>
                                ) : (
                                    <><UserPlus className="w-4 h-4" /> Add Admin</>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Right: Info Cards */}
                    <div className="space-y-4">
                        {/* Status Card */}
                        <div className="rounded-xl border bg-card p-5 space-y-4">
                            <div className="flex items-center gap-2 pb-3 border-b">
                                <Shield className="w-4 h-4 text-[#1A365D]" />
                                <h3 className="font-semibold text-sm text-foreground">Access Status</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Protection</span>
                                    <Badge variant="secondary" className="text-[10px] font-bold bg-green-100 text-green-700 border-green-200">Active</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Auth Type</span>
                                    <Badge variant="outline" className="text-[10px] font-semibold">Email + Password</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Storage</span>
                                    <Badge variant="outline" className="text-[10px] font-semibold">Supabase</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Total Admins</span>
                                    <span className="text-[10px] font-bold text-foreground">{loadingAdmins ? "..." : admins.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="rounded-xl border bg-amber-50 border-amber-200 p-5 space-y-3">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                                <h3 className="font-semibold text-sm text-amber-800">Security Tips</h3>
                            </div>
                            <ul className="text-[11px] text-amber-700 space-y-1.5 leading-relaxed">
                                <li>• Use at least <strong>8 characters</strong></li>
                                <li>• Mix uppercase &amp; lowercase letters</li>
                                <li>• Include numbers and symbols</li>
                                <li>• Keep passwords confidential</li>
                                <li>• Only add trusted personnel</li>
                            </ul>
                        </div>

                        {/* Info */}
                        <div className="rounded-xl border bg-blue-50 border-blue-200 p-5 space-y-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                                <h3 className="font-semibold text-sm text-blue-800">Access Info</h3>
                            </div>
                            <p className="text-[11px] text-blue-700 leading-relaxed">
                                Default admins (<strong>yeboahaaron602</strong> and <strong>owusujunior2004</strong>) cannot be removed. Any admin added here can log in immediately with their email and password.
                            </p>
                        </div>
                    </div>
                </div>

                <footer className="border-t py-8 text-center text-xs text-muted-foreground mt-12">
                    University of Ghana, Legon — Campus Glow © {new Date().getFullYear()}
                    <DeveloperCredit />
                </footer>
            </div>
        </div>
    );
};

export default AdminSettings;
