import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Shield, AlertTriangle, RotateCcw, RefreshCw, CheckCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import ugLogo from "@/assets/ug-logo.png";

const DEFAULT_PASSWORD = "admin123";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Forgot / reset flow
    const [showForgot, setShowForgot] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [resetDone, setResetDone] = useState(false);

    // If already authenticated, skip login
    useEffect(() => {
        if (sessionStorage.getItem("admin_auth") === "true") {
            navigate("/dashboard", { replace: true });
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) return;
        setLoading(true);
        setError("");

        try {
            const { data, error: fetchErr } = await supabase
                .from("admin_settings")
                .select("value")
                .eq("key", "admin_password")
                .maybeSingle();

            if (fetchErr) throw fetchErr;

            const stored = data?.value ?? DEFAULT_PASSWORD;

            if (password === stored) {
                sessionStorage.setItem("admin_auth", "true");
                toast.success("Welcome to Admin Dashboard");
                navigate("/dashboard", { replace: true });
            } else {
                setError("Incorrect password. Please try again.");
                setPassword("");
            }
        } catch (err) {
            console.error(err);
            toast.error("Authentication error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetToDefault = async () => {
        setResetting(true);
        try {
            const now = new Date().toISOString();

            const { data: existing } = await supabase
                .from("admin_settings")
                .select("id")
                .eq("key", "admin_password")
                .maybeSingle();

            if (existing) {
                const { error } = await supabase
                    .from("admin_settings")
                    .update({ value: DEFAULT_PASSWORD, updated_at: now })
                    .eq("key", "admin_password");
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("admin_settings")
                    .insert({ key: "admin_password", value: DEFAULT_PASSWORD, updated_at: now });
                if (error) throw error;
            }

            setResetDone(true);
            toast.success("Password reset to default!");
        } catch (err) {
            console.error(err);
            toast.error("Reset failed. Try again.");
        } finally {
            setResetting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1c2e] flex flex-col items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-400/5 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#1A365D]/10 blur-[80px]" />
            </div>

            <div className="relative w-full max-w-sm space-y-4">
                {/* Logo / Branding */}
                <div className="text-center space-y-3 pb-2">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#1A365D] border border-white/10 flex items-center justify-center shadow-2xl">
                            <img src={ugLogo} alt="UG Logo" className="w-10 h-10 object-contain" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-black text-white tracking-tight">Campus Glow</h1>
                        <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mt-1">Admin Dashboard</p>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-2xl space-y-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#1A365D] border border-white/10 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Secure Access</p>
                            <p className="text-[10px] text-white/50">Enter your admin password to continue</p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(""); }}
                                    placeholder="Enter admin password"
                                    className="pl-9 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-400/50 focus:ring-blue-400/20"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/75 transition-colors"
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
                            disabled={loading || !password}
                            className="w-full bg-[#1A365D] hover:bg-[#1A365D]/80 text-white font-bold h-11 rounded-xl border border-white/10 shadow-lg"
                        >
                            {loading ? "Verifying..." : "Access Dashboard →"}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="border-t border-white/10 pt-1">
                        <button
                            type="button"
                            onClick={() => { setShowForgot(v => !v); setResetDone(false); }}
                            className="w-full flex items-center justify-between text-[11px] text-white/40 hover:text-white/70 transition-colors py-1 font-medium"
                        >
                            <span>Forgot your password?</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showForgot ? "rotate-180" : ""}`} />
                        </button>

                        {/* Forgot panel */}
                        {showForgot && (
                            <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                {resetDone ? (
                                    /* Success state */
                                    <div className="flex flex-col items-center gap-3 py-3 text-center">
                                        <div className="w-10 h-10 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Password Reset!</p>
                                            <p className="text-[11px] text-white/50 mt-1">
                                                Your password is now{" "}
                                                <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono font-bold text-white">
                                                    {DEFAULT_PASSWORD}
                                                </code>
                                            </p>
                                            <p className="text-[10px] text-white/35 mt-1.5">
                                                Log in and change it in Settings.
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => { setResetDone(false); setShowForgot(false); }}
                                            className="bg-[#1A365D] text-white font-bold text-xs h-8 px-4"
                                        >
                                            Back to Login
                                        </Button>
                                    </div>
                                ) : (
                                    /* Reset panel */
                                    <>
                                        <div className="flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                            <div className="text-[11px] text-amber-300/80 leading-relaxed">
                                                This will reset the password back to{" "}
                                                <code className="bg-white/10 px-1 rounded font-mono font-bold text-amber-200">
                                                    {DEFAULT_PASSWORD}
                                                </code>.
                                                Remember to update it from Settings after logging in.
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={handleResetToDefault}
                                            disabled={resetting}
                                            variant="outline"
                                            className="w-full border-white/15 text-white/80 hover:bg-white/10 hover:text-white font-bold gap-2 h-10"
                                        >
                                            {resetting ? (
                                                <><RefreshCw className="w-4 h-4 animate-spin" /> Resetting...</>
                                            ) : (
                                                <><RotateCcw className="w-4 h-4" /> Reset to Default Password</>
                                            )}
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-center text-[10px] text-white/25 font-medium">
                    University of Ghana · Physical Development Directorate
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
