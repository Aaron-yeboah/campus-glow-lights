import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface FaultReport {
  id: string;
  poleId: string;
  faultType: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  description: string;
  photoUrl: string;
  timestamp: Date;
  reportedBy: string;
  contactInfo: string;
}

export interface Pole {
  id: string;
  zone: string;
  status: "Operational" | "Defective";
  daysOutage: number;
  lastInspected: Date;
  installDate: Date;
  reports: FaultReport[];
}

interface PoleContextType {
  poles: Pole[];
  submitReport: (poleId: string, faultType: string, severity: string, description: string, photoUrl: string, contactInfo: string) => Promise<void>;
  markRepaired: (poleId: string) => Promise<void>;
  addPole: (pole: Partial<Pole>) => Promise<void>;
  deletePole: (id: string) => Promise<void>;
  loading: boolean;
}

const PoleContext = createContext<PoleContextType | undefined>(undefined);

export const PoleProvider = ({ children }: { children: ReactNode }) => {
  const [poles, setPoles] = useState<Pole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPoles = async () => {
    try {
      const { data: polesData, error: polesError } = await supabase
        .from("poles")
        .select(`
          *,
          reports (*)
        `);

      if (polesError) throw polesError;

      const mappedPoles: Pole[] = (polesData || []).map((p: any) => ({
        id: p.id,
        zone: p.zone,
        status: p.status,
        daysOutage: p.days_outage || 0,
        lastInspected: new Date(p.last_inspected),
        installDate: new Date(p.install_date),
        reports: (p.reports || []).map((r: any) => ({
          id: r.id,
          poleId: r.pole_id,
          faultType: r.fault_type,
          severity: r.severity,
          description: r.description,
          photoUrl: r.photo_url,
          timestamp: new Date(r.timestamp),
          reportedBy: r.reported_by,
          contactInfo: r.contact_info,
        })),
      }));

      setPoles(mappedPoles);
    } catch (error) {
      console.error("Error fetching poles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoles();

    const channel = supabase
      .channel("pole-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "poles" },
        () => fetchPoles()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reports" },
        () => fetchPoles()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const submitReport = async (
    poleId: string,
    faultType: string,
    severity: string,
    description: string,
    photoUrl: string,
    contactInfo: string
  ) => {
    try {
      const { error: reportError } = await supabase.from("reports").insert([
        {
          pole_id: poleId,
          fault_type: faultType,
          severity,
          description,
          photo_url: photoUrl,
          reported_by: "Student",
          contact_info: contactInfo,
        },
      ]);

      if (reportError) throw reportError;

      const { error: poleError } = await supabase
        .from("poles")
        .update({ status: "Defective", days_outage: 0 })
        .eq("id", poleId);

      if (poleError) throw poleError;
    } catch (error) {
      console.error("Error submitting report:", error);
      throw error;
    }
  };

  const markRepaired = async (poleId: string) => {
    try {
      const { error } = await supabase
        .from("poles")
        .update({ status: "Operational", days_outage: 0 })
        .eq("id", poleId);

      if (error) throw error;
    } catch (error) {
      console.error("Error marking pole as repaired:", error);
      throw error;
    }
  };

  const addPole = async (pole: Partial<Pole>) => {
    try {
      const { error } = await supabase.from("poles").insert([
        {
          id: pole.id,
          zone: pole.zone,
          status: pole.status || "Operational",
          days_outage: pole.daysOutage || 0,
          last_inspected: pole.lastInspected?.toISOString() || new Date().toISOString(),
          install_date: pole.installDate?.toISOString() || new Date().toISOString(),
        },
      ]);

      if (error) throw error;
    } catch (error) {
      console.error("Error adding pole:", error);
      throw error;
    }
  };

  const deletePole = async (id: string) => {
    try {
      const { error } = await supabase.from("poles").delete().eq("id", id);
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting pole:", error);
      throw error;
    }
  };

  return (
    <PoleContext.Provider value={{ poles, submitReport, markRepaired, addPole, deletePole, loading }}>
      {children}
    </PoleContext.Provider>
  );
};

export const usePoles = () => {
  const ctx = useContext(PoleContext);
  if (!ctx) throw new Error("usePoles must be used within PoleProvider");
  return ctx;
};
