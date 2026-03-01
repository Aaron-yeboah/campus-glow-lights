import React, { createContext, useContext, useState, ReactNode } from "react";

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
  submitReport: (poleId: string, faultType: string, severity: string, description: string, photoUrl: string, contactInfo: string) => void;
  markRepaired: (poleId: string) => void;
  addPole: (id: string, zone: string) => void;
}

const initialPoles: Pole[] = [
  { id: "UG-LG-001", zone: "Legon Main Gate", status: "Operational", daysOutage: 0, lastInspected: new Date(Date.now() - 5 * 86400000), installDate: new Date("2022-03-15"), reports: [] },
  { id: "UG-LG-002", zone: "Balme Library", status: "Defective", daysOutage: 3, lastInspected: new Date(Date.now() - 10 * 86400000), installDate: new Date("2021-08-20"), reports: [
    { id: "r1", poleId: "UG-LG-002", faultType: "Outage", severity: "High", description: "Complete blackout near the library entrance. Very dark and unsafe at night.", photoUrl: "", timestamp: new Date(Date.now() - 3 * 86400000), reportedBy: "Student", contactInfo: "" }
  ]},
  { id: "UG-LG-003", zone: "Night Market", status: "Operational", daysOutage: 0, lastInspected: new Date(Date.now() - 2 * 86400000), installDate: new Date("2023-01-10"), reports: [] },
  { id: "UG-LG-004", zone: "Pentagon Hostel", status: "Defective", daysOutage: 7, lastInspected: new Date(Date.now() - 14 * 86400000), installDate: new Date("2020-06-01"), reports: [
    { id: "r2", poleId: "UG-LG-004", faultType: "Physical Damage", severity: "Critical", description: "Pole is leaning dangerously after a vehicle collision. Exposed wiring visible.", photoUrl: "", timestamp: new Date(Date.now() - 7 * 86400000), reportedBy: "Student", contactInfo: "0551234567" }
  ]},
  { id: "UG-LG-005", zone: "Athletic Oval", status: "Operational", daysOutage: 0, lastInspected: new Date(Date.now() - 1 * 86400000), installDate: new Date("2022-11-05"), reports: [] },
  { id: "UG-LG-006", zone: "Business School", status: "Operational", daysOutage: 0, lastInspected: new Date(Date.now() - 7 * 86400000), installDate: new Date("2023-04-22"), reports: [] },
  { id: "UG-LG-007", zone: "JQB Building", status: "Defective", daysOutage: 1, lastInspected: new Date(Date.now() - 3 * 86400000), installDate: new Date("2021-12-18"), reports: [
    { id: "r3", poleId: "UG-LG-007", faultType: "Flickering", severity: "Medium", description: "Light flickers on and off intermittently throughout the night.", photoUrl: "", timestamp: new Date(Date.now() - 86400000), reportedBy: "Student", contactInfo: "" }
  ]},
  { id: "UG-LG-008", zone: "Volta Hall", status: "Operational", daysOutage: 0, lastInspected: new Date(Date.now() - 4 * 86400000), installDate: new Date("2022-07-30"), reports: [] },
  { id: "UG-LG-009", zone: "Science Block", status: "Operational", daysOutage: 0, lastInspected: new Date(Date.now() - 6 * 86400000), installDate: new Date("2023-02-14"), reports: [] },
  { id: "UG-LG-010", zone: "Engineering Block", status: "Operational", daysOutage: 0, lastInspected: new Date(Date.now() - 8 * 86400000), installDate: new Date("2021-05-20"), reports: [] },
  { id: "UG-LG-011", zone: "Great Hall", status: "Operational", daysOutage: 0, lastInspected: new Date(Date.now() - 2 * 86400000), installDate: new Date("2022-09-01"), reports: [] },
  { id: "UG-LG-012", zone: "Akuafo Hall", status: "Defective", daysOutage: 2, lastInspected: new Date(Date.now() - 9 * 86400000), installDate: new Date("2020-11-15"), reports: [
    { id: "r4", poleId: "UG-LG-012", faultType: "Dim Light", severity: "Low", description: "Light is extremely dim, barely visible from the pathway.", photoUrl: "", timestamp: new Date(Date.now() - 2 * 86400000), reportedBy: "Student", contactInfo: "" }
  ]},
];

const PoleContext = createContext<PoleContextType | undefined>(undefined);

export const PoleProvider = ({ children }: { children: ReactNode }) => {
  const [poles, setPoles] = useState<Pole[]>(initialPoles);

  const submitReport = (poleId: string, faultType: string, severity: string, description: string, photoUrl: string, contactInfo: string) => {
    setPoles((prev) =>
      prev.map((p) =>
        p.id === poleId
          ? {
              ...p,
              status: "Defective" as const,
              daysOutage: p.status === "Operational" ? 0 : p.daysOutage,
              reports: [
                ...p.reports,
                { id: `r-${Date.now()}`, poleId, faultType, severity: severity as FaultReport["severity"], description, photoUrl, timestamp: new Date(), reportedBy: "Student", contactInfo },
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
      return [...prev, { id, zone, status: "Operational" as const, daysOutage: 0, lastInspected: new Date(), installDate: new Date(), reports: [] }];
    });
  };

  return <PoleContext.Provider value={{ poles, submitReport, markRepaired, addPole }}>{children}</PoleContext.Provider>;
};

export const usePoles = () => {
  const ctx = useContext(PoleContext);
  if (!ctx) throw new Error("usePoles must be used within PoleProvider");
  return ctx;
};
