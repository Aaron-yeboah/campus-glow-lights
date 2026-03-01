import React, { createContext, useContext, useState, ReactNode } from "react";

export interface FaultReport {
  id: string;
  poleId: string;
  faultType: string;
  photoUrl: string;
  timestamp: Date;
  reportedBy: string;
}

export interface Pole {
  id: string;
  zone: string;
  status: "Operational" | "Defective";
  daysOutage: number;
  reports: FaultReport[];
}

interface PoleContextType {
  poles: Pole[];
  submitReport: (poleId: string, faultType: string, photoUrl: string) => void;
  markRepaired: (poleId: string) => void;
  addPole: (id: string, zone: string) => void;
}

const initialPoles: Pole[] = [
  { id: "UG-LG-001", zone: "Legon Main Gate", status: "Operational", daysOutage: 0, reports: [] },
  { id: "UG-LG-002", zone: "Balme Library", status: "Defective", daysOutage: 3, reports: [
    { id: "r1", poleId: "UG-LG-002", faultType: "Outage", photoUrl: "", timestamp: new Date(Date.now() - 3 * 86400000), reportedBy: "Student" }
  ]},
  { id: "UG-LG-003", zone: "Night Market", status: "Operational", daysOutage: 0, reports: [] },
  { id: "UG-LG-004", zone: "Pentagon Hostel", status: "Defective", daysOutage: 7, reports: [
    { id: "r2", poleId: "UG-LG-004", faultType: "Physical Damage", photoUrl: "", timestamp: new Date(Date.now() - 7 * 86400000), reportedBy: "Student" }
  ]},
  { id: "UG-LG-005", zone: "Athletic Oval", status: "Operational", daysOutage: 0, reports: [] },
  { id: "UG-LG-006", zone: "Business School", status: "Operational", daysOutage: 0, reports: [] },
  { id: "UG-LG-007", zone: "JQB Building", status: "Defective", daysOutage: 1, reports: [
    { id: "r3", poleId: "UG-LG-007", faultType: "Flickering", photoUrl: "", timestamp: new Date(Date.now() - 86400000), reportedBy: "Student" }
  ]},
  { id: "UG-LG-008", zone: "Volta Hall", status: "Operational", daysOutage: 0, reports: [] },
  { id: "UG-LG-009", zone: "Science Block", status: "Operational", daysOutage: 0, reports: [] },
  { id: "UG-LG-010", zone: "Engineering Block", status: "Operational", daysOutage: 0, reports: [] },
];

const PoleContext = createContext<PoleContextType | undefined>(undefined);

export const PoleProvider = ({ children }: { children: ReactNode }) => {
  const [poles, setPoles] = useState<Pole[]>(initialPoles);

  const submitReport = (poleId: string, faultType: string, photoUrl: string) => {
    setPoles((prev) =>
      prev.map((p) =>
        p.id === poleId
          ? {
              ...p,
              status: "Defective" as const,
              daysOutage: p.status === "Operational" ? 0 : p.daysOutage,
              reports: [
                ...p.reports,
                { id: `r-${Date.now()}`, poleId, faultType, photoUrl, timestamp: new Date(), reportedBy: "Student" },
              ],
            }
          : p
      )
    );
  };

  const markRepaired = (poleId: string) => {
    setPoles((prev) =>
      prev.map((p) => (p.id === poleId ? { ...p, status: "Operational" as const, daysOutage: 0 } : p))
    );
  };

  const addPole = (id: string, zone: string) => {
    setPoles((prev) => {
      if (prev.find((p) => p.id === id)) return prev;
      return [...prev, { id, zone, status: "Operational" as const, daysOutage: 0, reports: [] }];
    });
  };

  return <PoleContext.Provider value={{ poles, submitReport, markRepaired, addPole }}>{children}</PoleContext.Provider>;
};

export const usePoles = () => {
  const ctx = useContext(PoleContext);
  if (!ctx) throw new Error("usePoles must be used within PoleProvider");
  return ctx;
};
