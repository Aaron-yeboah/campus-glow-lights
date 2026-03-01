import { useState, useMemo } from "react";
import {
    Search, FileText, ChevronRight, Download,
    Calendar, User, Smartphone, History, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

import { usePoles } from "@/context/PoleContext";
import LoadingScreen from "@/components/LoadingScreen";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const MaintenanceHistory = () => {
    const { repairs, loadingRepairs, fetchRepairPhotos } = usePoles();
    const [search, setSearch] = useState("");

    const filteredFixes = useMemo(() => {
        return repairs.filter((f) =>
            f.poleId.toLowerCase().includes(search.toLowerCase()) ||
            f.techName.toLowerCase().includes(search.toLowerCase()) ||
            f.faultCategory.toLowerCase().includes(search.toLowerCase())
        );
    }, [repairs, search]);

    if (loadingRepairs) {
        return <LoadingScreen message="Loading history records..." />;
    }

    return (
        <div className="space-y-6">
            {/* Search & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#1A365D]">History & Records</h2>
                    <p className="text-sm text-slate-500 font-medium">Archive of all completed maintenance actions.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search by ID, Tech, or Fault..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-11 border-slate-200 focus-visible:ring-[#1A365D] rounded-lg"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-slate-100 text-[#1A365D] border-slate-200">
                    Showing {filteredFixes.length} Recent Fixes
                </Badge>
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Archived Records</span>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 sticky top-0 z-10">
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Date/Time</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Technician</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Pole ID</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Fault Type</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredFixes.map((f) => (
                                <tr key={f.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-[#1A365D]">{format(f.timestamp, "MMM dd, yyyy")}</span>
                                            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                                                <Clock className="w-3 h-3" /> {format(f.timestamp, "h:mm a")}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                            <div className="w-7 h-7 bg-[#1A365D]/5 text-[#1A365D] rounded-full flex items-center justify-center text-[10px] border border-[#1A365D]/10">
                                                {f.techName.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            {f.techName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-black text-[#1A365D] tracking-tight">{f.poleId}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-none text-[10px] font-bold px-2 py-0.5">
                                            {f.faultCategory}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-9 border-slate-200 text-[#1A365D] hover:bg-slate-50 hover:text-[#1A365D] font-bold text-[10px] uppercase tracking-wide px-3"
                                            onClick={async () => {
                                                const loadingToast = toast.loading("Fetching repair evidence...");
                                                const photos = await fetchRepairPhotos(f.id);
                                                toast.dismiss(loadingToast);

                                                if (photos?.after || photos?.before) {
                                                    const win = window.open("", "_blank");
                                                    win?.document.write(`
                                                        <html>
                                                            <body style="margin:0; background:#0f172a; display:flex; flex-direction:column; align-items:center; color:white; font-family:sans-serif; padding:20px;">
                                                                <h2>Repair Receipt: ${f.poleId}</h2>
                                                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; width:100%; max-width:1000px;">
                                                                    <div>
                                                                        <p>BEFORE</p>
                                                                        <img src="${photos.before || ""}" style="width:100%; border-radius:10px;"/>
                                                                    </div>
                                                                    <div>
                                                                        <p>AFTER</p>
                                                                        <img src="${photos.after || ""}" style="width:100%; border-radius:10px;"/>
                                                                    </div>
                                                                </div>
                                                                <div style="margin-top:20px; text-align:left; width:100%; max-width:1000px; background:rgba(255,255,255,0.05); padding:20px; border-radius:10px;">
                                                                    <p><b>Technician:</b> ${f.techName}</p>
                                                                    <p><b>Category:</b> ${f.faultCategory}</p>
                                                                    <p><b>Notes:</b> ${f.workNotes || "No notes provided"}</p>
                                                                </div>
                                                            </body>
                                                        </html>
                                                    `);
                                                } else {
                                                    toast.error("No photos found for this record.");
                                                }
                                            }}
                                        >
                                            View Receipt
                                            <FileText className="w-3.5 h-3.5 ml-1.5 opacity-60" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredFixes.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                            <History className="w-8 h-8 text-slate-300" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#1A365D]">No records found</h3>
                            <p className="text-sm text-slate-500">Adjust your search to find archived maintenance logs.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="bg-[#1A365D]/5 border border-[#1A365D]/10 rounded-xl p-4 flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg shadow-inner">
                    <Smartphone className="w-5 h-5 text-[#1A365D]" />
                </div>
                <div>
                    <p className="text-xs font-bold text-[#1A365D]">Cloud Synchronized</p>
                    <p className="text-[10px] text-slate-500 font-medium">All repairs are recorded for University of Ghana maintenance analytics.</p>
                </div>
                <Button
                    variant="outline"
                    className="ml-auto h-9 bg-white border-slate-200 text-[#1A365D] font-bold text-xs"
                    onClick={() => {
                        const csvData = filteredFixes.map(f => ({
                            "Date": format(f.timestamp, "yyyy-MM-dd"),
                            "Time": format(f.timestamp, "h:mm a"),
                            "Technician": f.techName,
                            "Pole ID": f.poleId,
                            "Fault Category": f.faultCategory,
                            "Work Notes": f.workNotes || "N/A",
                            "Status": f.status
                        }));
                        const ws = XLSX.utils.json_to_sheet(csvData);
                        const wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, "Maintenance History");
                        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
                        const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
                        saveAs(data, `Maintenance_History_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
                    }}
                >
                    Export Sheet
                    <Download className="w-3.5 h-3.5 ml-2" />
                </Button>
            </div>
        </div>
    );
};

export default MaintenanceHistory;
