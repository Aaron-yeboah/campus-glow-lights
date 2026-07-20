import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Shield, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import ugLogo from "@/assets/ug-logo.png";
import DeveloperCredit from "@/components/DeveloperCredit";
import adminBg from "@/assets/admin-bg.jpg";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // If already authenticated, skip login
    useEffect(() => {
        if (sessionStorage.getItem("admin_auth") === "true") {
            navigate("/dashboard", { replace: true });
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        setLoading(true);
        setError("");

        try {
            const { data, error: fetchErr } = await supabase
                .from("admin_users")
                .select("email")
                .eq("email", email.trim().toLowerCase())
                .eq("password", password)
                .maybeSingle();

            if (fetchErr) throw fetchErr;

            if (!data) {
                setError("Invalid email or password. Please try again.");
                setPassword("");
            } else {
                sessionStorage.setItem("admin_auth", "true");
                sessionStorage.setItem("admin_email", data.email);
                toast.success("Welcome to Admin Dashboard");
                navigate("/dashboard", { replace: true });
            }
        } catch (err) {
            console.error(err);
            toast.error("Authentication error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Image Side — Left on Desktop, Top on Mobile */}
            <div className="relative lg:w-1/2 min-h-[40vh] sm:min-h-[45vh] lg:min-h-screen overflow-hidden">
                <img
                    src={adminBg}
                    alt="University of Ghana Campus"
                    className="absolute inset-0 w-full h-full object-cover object-[center_bottom] lg:object-[35%_center]"
                />
                {/* Navy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-[#0f1c2e]/80 via-[#1A365D]/70 to-[#0f1c2e]/90 lg:from-[#0f1c2e]/90 lg:via-[#1A365D]/80 lg:to-[#0f1c2e]/95" />

                {/* Overlay Content */}
                <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-8 lg:p-12">
                    <div>
                        <button
                            onClick={() => navigate("/")}
                            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white/80 text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                    </div>

                    <div className="hidden lg:block space-y-6 max-w-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-xl">
                                <img src={ugLogo} alt="UG Logo" className="w-9 h-9 object-contain" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-display font-black text-white tracking-tight">Campus Glow</h1>
                                <p className="text-xs text-white/50 font-bold uppercase tracking-[0.15em] mt-0.5">Streetlight Management</p>
                            </div>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Monitoring and managing campus infrastructure to keep our university bright and safe.
                        </p>
                        <div className="flex gap-3">
                            <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                                Secure Access
                            </div>
                            <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                                Admin Only
                            </div>
                        </div>
                    </div>

                    {/* Mobile Branding & Title */}
                    <div className="lg:hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-2xl">
                                <img src={ugLogo} alt="UG Logo" className="w-7 h-7 object-contain" />
                            </div>
                            <div className="h-10 w-px bg-white/20" />
                            <div>
                                <h1 className="text-2xl font-display font-black text-white tracking-tight leading-none">Admin</h1>
                                <p className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] mt-1">Dashboard Access</p>
                            </div>
                        </div>
                        <div className="h-1 w-12 bg-blue-500 rounded-full" />
                    </div>

                    <div className="hidden lg:block">
                        <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.2em]">
                            University of Ghana · Physical Development Directorate
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Side — Right on Desktop, Bottom on Mobile */}
            <div className="flex-1 bg-[#0f1c2e] flex items-center justify-center p-6 sm:p-10 lg:p-12 relative overflow-hidden -mt-6 lg:mt-0 rounded-t-3xl lg:rounded-none z-20">
                {/* Decorative Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-600/[0.1] blur-[80px]" />
                    <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#1A365D]/30 blur-[100px]" />
                    <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-blue-400/[0.06] blur-[60px]" />
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                    <div className="absolute top-16 right-16 w-32 h-32 rounded-full border border-white/[0.06]" />
                    <div className="absolute bottom-24 left-12 w-20 h-20 rounded-full border border-white/[0.04]" />
                    <div className="absolute top-1/2 right-8 w-12 h-12 rounded-full border border-blue-400/[0.08]" />
                </div>

                <div className="w-full max-w-sm space-y-6">
                    {/* Login Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-2xl space-y-5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-[#1A365D] border border-white/10 flex items-center justify-center">
                                <Shield className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Secure Access</p>
                                <p className="text-[10px] text-white/50">Enter your admin credentials to continue</p>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                    <Input
                                        id="admin-email"
                                        type="email"
                                        value={email}
                                        onChange={e => { setEmail(e.target.value); setError(""); }}
                                        placeholder="Enter admin email"
                                        className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-400/50 focus:ring-blue-400/20"
                                        autoFocus
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                    <Input
                                        id="admin-password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={e => { setPassword(e.target.value); setError(""); }}
                                        placeholder="Enter admin password"
                                        className="pl-9 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-400/50 focus:ring-blue-400/20"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/75 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading || !email || !password}
                                className="w-full bg-[#1A365D] hover:bg-[#1A365D]/80 text-white font-bold h-11 rounded-xl border border-white/10 shadow-lg"
                            >
                                {loading ? "Verifying..." : "Access Dashboard →"}
                            </Button>
                        </form>
                    </div>

                    <p className="text-center text-[10px] text-white/25 font-medium">
                        University of Ghana · Physical Development Directorate
                        <DeveloperCredit />
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
