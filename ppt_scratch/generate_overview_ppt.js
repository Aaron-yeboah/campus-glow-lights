const Presentation = require('pptxgenjs');
const path = require('path');

const pres = new Presentation();
pres.layout = 'LAYOUT_16x9';

// Professional Palette
const BG_COLOR = '0F172A';        // Dark Navy / Slate 900
const CARD_BG = '1E293B';         // Slate 800
const TITLE_COLOR = 'F59E0B';      // Amber / Gold Accent
const SUBTITLE_COLOR = '94A3B8';   // Slate Gray 400
const BODY_COLOR = 'F8FAFC';       // Off-White 50
const ACCENT_BLUE = '3B82F6';      // Electric Blue
const ACCENT_GREEN = '10B981';     // Emerald Green
const ACCENT_RED = 'EF4444';       // Rose Red
const BORDER_COLOR = '334155';     // Slate 700

const FONT_TITLE = 'Segoe UI';
const FONT_BODY = 'Segoe UI';

function createBaseSlide(titleText, subtitleText = "") {
  const slide = pres.addSlide();
  slide.background = { fill: BG_COLOR };

  // Top Accent Strip
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.33, h: 0.08,
    fill: { color: TITLE_COLOR }
  });

  // Header Title
  slide.addText(titleText, {
    x: 0.6, y: 0.35, w: 12.1, h: 0.5,
    fontSize: 22, bold: true, color: TITLE_COLOR, fontFace: FONT_TITLE
  });

  // Subtitle if provided
  if (subtitleText) {
    slide.addText(subtitleText, {
      x: 0.6, y: 0.85, w: 12.1, h: 0.3,
      fontSize: 12, color: SUBTITLE_COLOR, italic: true, fontFace: FONT_BODY
    });
  }

  // Divider Line
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.2, w: 12.13, h: 0.02,
    fill: { color: BORDER_COLOR }
  });

  // Footer text & line
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 7.0, w: 12.13, h: 0.01,
    fill: { color: BORDER_COLOR }
  });
  slide.addText("Campus Glow - Smart Streetlight Management & Fault Reporting System", {
    x: 0.6, y: 7.05, w: 8.0, h: 0.3,
    fontSize: 9, color: SUBTITLE_COLOR, fontFace: FONT_BODY
  });
  slide.addText("System Overview Presentation", {
    x: 9.7, y: 7.05, w: 3.0, h: 0.3,
    fontSize: 9, color: SUBTITLE_COLOR, fontFace: FONT_BODY, align: 'right'
  });

  return slide;
}

// -------------------------------------------------------------
// SLIDE 1: Title Slide
// -------------------------------------------------------------
const s1 = pres.addSlide();
s1.background = { fill: BG_COLOR };
s1.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 0.4, h: 7.5,
  fill: { color: TITLE_COLOR }
});
s1.addText("CAMPUS GLOW 💡", {
  x: 1.0, y: 1.8, w: 11.3, h: 0.8,
  fontSize: 44, bold: true, color: TITLE_COLOR, fontFace: FONT_TITLE
});
s1.addText("Smart Streetlight Management and Fault Reporting System", {
  x: 1.0, y: 2.7, w: 11.3, h: 0.6,
  fontSize: 24, bold: true, color: BODY_COLOR, fontFace: FONT_TITLE
});
s1.addText("Comprehensive Project Overview, Technical Architecture & Technology Stack Rationale", {
  x: 1.0, y: 3.4, w: 11.3, h: 0.5,
  fontSize: 16, color: SUBTITLE_COLOR, fontFace: FONT_BODY
});
s1.addShape(pres.shapes.RECTANGLE, {
  x: 1.0, y: 4.2, w: 11.0, h: 0.02,
  fill: { color: BORDER_COLOR }
});
s1.addText("Presenter: System Architectural Lead\nInstitution: University of Ghana | Physical Development & Municipal Services Directorate (PDMSD)", {
  x: 1.0, y: 4.5, w: 11.3, h: 1.0,
  fontSize: 13, color: SUBTITLE_COLOR, fontFace: FONT_BODY, lineSpacing: 20
});

// -------------------------------------------------------------
// SLIDE 2: 1. Abstract
// -------------------------------------------------------------
const s2 = createBaseSlide("1. Abstract", "Executive summary of the Campus Glow system initiative");
s2.addText([
  { text: "Campus Glow ", options: { bold: true, color: TITLE_COLOR } },
  { text: "is a web-based, crowdsourced civic infrastructure management platform engineered specifically to transform streetlight fault reporting, dispatch workflows, and maintenance tracking at the University of Ghana.\n\n", options: { color: BODY_COLOR } },
  { text: "• Core Innovation: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Combines zero-CapEx QR code physical node tagging on lamp posts with real-time publish-subscribe database synchronization (Supabase/PostgreSQL) and a multi-tiered mobile/desktop portal.\n\n", options: { color: BODY_COLOR } },
  { text: "• Strategic Value: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Eliminates spatial ambiguity caused by GPS drift, automates technician dispatches, enforces SLA accountability, and delivers real-time spatial analytics for university administrators without requiring expensive IoT sensors.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.2,
  fontSize: 14, lineSpacing: 22, fontFace: FONT_BODY
});

// -------------------------------------------------------------
// SLIDE 3: 2. Introduction
// -------------------------------------------------------------
const s3 = createBaseSlide("2. Introduction", "Background context & modern smart campus infrastructure challenges");
s3.addText([
  { text: "• Campus Streetlights as Critical Safety Infrastructure:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  University campuses operate as micro-cities. Night-time pedestrian illumination directly influences student safety, crime prevention, academic activity, and campus mobility.\n\n", options: { color: BODY_COLOR } },
  { text: "• The Maintenance Reality in Developing Campuses:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  Despite their importance, streetlight management relies on ad-hoc phone calls, informal word-of-mouth reports, or periodic night patrols by municipal crews.\n\n", options: { color: BODY_COLOR } },
  { text: "• The Need for Digital Transformation:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  Campus Glow bridges physical campus assets with modern web architecture to establish a real-time, closed-loop maintenance framework connecting students, technicians, and administrators.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.2,
  fontSize: 13.5, lineSpacing: 20, fontFace: FONT_BODY
});

// -------------------------------------------------------------
// SLIDE 4: 3. Problem Statement Overview
// -------------------------------------------------------------
const s4 = createBaseSlide("3. Problem Statement", "Operational inefficiencies in traditional campus facility management");

s4.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.6, w: 5.8, h: 2.4, fill: { color: CARD_BG }, line: { color: ACCENT_RED, width: 1.5 } });
s4.addText("3.1 Delayed Fault Reporting", { x: 0.8, y: 1.8, w: 5.4, h: 0.4, fontSize: 15, bold: true, color: TITLE_COLOR });
s4.addText("Broken lights remain undetected for days or weeks due to reliance on manual night patrols or verbal feedback.", { x: 0.8, y: 2.3, w: 5.4, h: 1.5, fontSize: 12, color: BODY_COLOR });

s4.addShape(pres.shapes.RECTANGLE, { x: 6.9, y: 1.6, w: 5.8, h: 2.4, fill: { color: CARD_BG }, line: { color: ACCENT_RED, width: 1.5 } });
s4.addText("3.2 Lack of Maintenance Transparency", { x: 7.1, y: 1.8, w: 5.4, h: 0.4, fontSize: 15, bold: true, color: TITLE_COLOR });
s4.addText("Students and reporters have zero visibility into report progress, creating user apathy and mistrust in facilities management.", { x: 7.1, y: 2.3, w: 5.4, h: 1.5, fontSize: 12, color: BODY_COLOR });

s4.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.3, w: 5.8, h: 2.4, fill: { color: CARD_BG }, line: { color: ACCENT_RED, width: 1.5 } });
s4.addText("3.3 Data Fragmentation & No Central Dashboard", { x: 0.8, y: 4.5, w: 5.4, h: 0.4, fontSize: 15, bold: true, color: TITLE_COLOR });
s4.addText("Maintenance notes exist in disparate paper logs or messaging chats without a unified GIS dashboard or asset history.", { x: 0.8, y: 5.0, w: 5.4, h: 1.5, fontSize: 12, color: BODY_COLOR });

s4.addShape(pres.shapes.RECTANGLE, { x: 6.9, y: 4.3, w: 5.8, h: 2.4, fill: { color: CARD_BG }, line: { color: ACCENT_RED, width: 1.5 } });
s4.addText("3.4 Absence of Formal Documentation", { x: 7.1, y: 4.5, w: 5.4, h: 0.4, fontSize: 15, bold: true, color: TITLE_COLOR });
s4.addText("No standardized work orders, photo proof of repairs, or SLA audit trails to verify technician resolution quality.", { x: 7.1, y: 5.0, w: 5.4, h: 1.5, fontSize: 12, color: BODY_COLOR });

// -------------------------------------------------------------
// SLIDE 5: 4. Project Objectives (Part 1)
// -------------------------------------------------------------
const s5 = createBaseSlide("4. Project Objectives (4.1 - 4.2)", "Core goals: Automate reporting and centralize infrastructure");

s5.addText([
  { text: "4.1 Automate Fault Reporting:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "• Deploy physical QR code badges on streetlight poles for instantaneous scan-to-report access.\n", options: { color: BODY_COLOR } },
  { text: "• Eliminate manual app navigation and registration friction, allowing reports in under 10 seconds.\n", options: { color: BODY_COLOR } },
  { text: "• Capture exact pole metadata (Pole ID, zone, coordinates, bulb type) directly from the QR payload.\n\n", options: { color: BODY_COLOR } },
  { text: "4.2 Centralise Infrastructure Management:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "• Aggregate all campus streetlight assets into a single interactive GIS mapping interface.\n", options: { color: BODY_COLOR } },
  { text: "• Provide real-time status tracking (Active, Outage Reported, Dispatched, Resolved) across the campus.\n", options: { color: BODY_COLOR } },
  { text: "• Standardize digital ticket handling and real-time state synchronization.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.2,
  fontSize: 13, lineSpacing: 18, fontFace: FONT_BODY
});

// -------------------------------------------------------------
// SLIDE 6: 4. Project Objectives (Part 2)
// -------------------------------------------------------------
const s6 = createBaseSlide("4. Project Objectives (4.3 - 4.5)", "Accountability, data insights, and campus safety");

s6.addText([
  { text: "4.3 Improve Maintenance Accountability:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "• Implement SLA-based ticket prioritization (Emergency, High, Medium, Low) and technician assignments.\n", options: { color: BODY_COLOR } },
  { text: "• Require photo validation and technical notes before ticket closure.\n\n", options: { color: BODY_COLOR } },
  { text: "4.4 Generate Data-Driven Insights:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "• Deliver analytics on Mean Time To Repair (MTTR), recurring failure hotspots, and bulb lifespan.\n", options: { color: BODY_COLOR } },
  { text: "• Support executive reporting through automated PDF and Excel audit report generation.\n\n", options: { color: BODY_COLOR } },
  { text: "4.5 Enhance Campus Safety:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "• Rapidly eliminate campus dark spots along high-traffic student walkways, residential halls, and libraries.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.2,
  fontSize: 13, lineSpacing: 18, fontFace: FONT_BODY
});

// -------------------------------------------------------------
// SLIDE 7: 5. Technical Architecture Overview
// -------------------------------------------------------------
const s7 = createBaseSlide("5. Technical Architecture", "System architectural layers and data flow diagram");

// 3 Architecture Cards
s7.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.6, w: 3.7, h: 4.8, fill: { color: CARD_BG }, line: { color: ACCENT_BLUE, width: 2 } });
s7.addText("PRESENTATION LAYER\n(Client Web Applications)", { x: 0.7, y: 1.8, w: 3.5, h: 0.6, fontSize: 13, bold: true, color: TITLE_COLOR, align: 'center' });
s7.addText("• React 18 + TypeScript\n• Vite Engine\n• Tailwind CSS + Radix UI\n• Lucide Icons & Recharts\n\nModules:\n- Student Scan & Report UI\n- Technician Mobile CRM\n- Admin Control Center", { x: 0.8, y: 2.5, w: 3.3, h: 3.7, fontSize: 11, color: BODY_COLOR });

s7.addShape(pres.shapes.RECTANGLE, { x: 4.8, y: 1.6, w: 3.7, h: 4.8, fill: { color: CARD_BG }, line: { color: ACCENT_GREEN, width: 2 } });
s7.addText("STATE & REAL-TIME LAYER\n(Data Fetching & Subscriptions)", { x: 4.9, y: 1.8, w: 3.5, h: 0.6, fontSize: 13, bold: true, color: TITLE_COLOR, align: 'center' });
s7.addText("• TanStack React Query\n  (Cache & Async state)\n• Supabase Realtime Engine\n  (WebSocket WAL Replication)\n• Browser QR Scanner API\n\nFeatures:\n- Instant ticket updates\n- Auto background re-fetch\n- Optimistic UI updates", { x: 5.0, y: 2.5, w: 3.3, h: 3.7, fontSize: 11, color: BODY_COLOR });

s7.addShape(pres.shapes.RECTANGLE, { x: 9.0, y: 1.6, w: 3.7, h: 4.8, fill: { color: CARD_BG }, line: { color: TITLE_COLOR, width: 2 } });
s7.addText("BACKEND & DATABASE LAYER\n(BaaS Infrastructure)", { x: 9.1, y: 1.8, w: 3.5, h: 0.6, fontSize: 13, bold: true, color: TITLE_COLOR, align: 'center' });
s7.addText("• PostgreSQL Relational DB\n• Supabase Auth (JWT & RBAC)\n• Row Level Security (RLS)\n• Supabase Storage (Photos)\n\nTables:\n- light_poles, fault_reports\n- repair_logs, users/profiles\n- maintenance_schedules", { x: 9.2, y: 2.5, w: 3.3, h: 3.7, fontSize: 11, color: BODY_COLOR });

// -------------------------------------------------------------
// SLIDE 8: 5. Technology Stack & Reasons for Selection
// -------------------------------------------------------------
const s8 = createBaseSlide("5. Technology Stack & Rationale", "Selected technologies and justification for technical decisions");

s8.addTable(
  [
    [
      { text: "Technology Layer", options: { bold: true, color: TITLE_COLOR, fill: CARD_BG } },
      { text: "Selected Stack", options: { bold: true, color: TITLE_COLOR, fill: CARD_BG } },
      { text: "Technical Rationale for Selection", options: { bold: true, color: TITLE_COLOR, fill: CARD_BG } }
    ],
    [
      { text: "Frontend Core", options: { color: BODY_COLOR } },
      { text: "React 18 + TypeScript + Vite", options: { color: TITLE_COLOR, bold: true } },
      { text: "Type safety prevents runtime errors; Vite provides instant HMR & fast builds; React component model enables reusable UI across 3 portals.", options: { color: BODY_COLOR } }
    ],
    [
      { text: "Styling & UI Primitives", options: { color: BODY_COLOR } },
      { text: "Tailwind CSS + Radix UI", options: { color: TITLE_COLOR, bold: true } },
      { text: "Utility-first CSS ensures dark-mode & responsive mobile UI; Radix provides accessible, unstyled UI components (Dialogs, Tabs, Toasts).", options: { color: BODY_COLOR } }
    ],
    [
      { text: "State Management", options: { color: BODY_COLOR } },
      { text: "TanStack React Query", options: { color: TITLE_COLOR, bold: true } },
      { text: "Eliminates global Redux boilerplate; manages server state, caching, background refetching, and optimistic updates seamlessly.", options: { color: BODY_COLOR } }
    ],
    [
      { text: "Backend & Database", options: { color: BODY_COLOR } },
      { text: "Supabase (PostgreSQL)", options: { color: TITLE_COLOR, bold: true } },
      { text: "Industrial relational integrity for pole geospatial records + native WebSocket pub-sub engine for zero-delay admin/technician sync.", options: { color: BODY_COLOR } }
    ],
    [
      { text: "Security & Auth", options: { color: BODY_COLOR } },
      { text: "Supabase Auth + DB RLS", options: { color: TITLE_COLOR, bold: true } },
      { text: "Row-Level Security (RLS) policies enforce security directly at the DB engine; JWT auth segregates Admin, Technician, and Public roles.", options: { color: BODY_COLOR } }
    ],
    [
      { text: "Data Visuals & Export", options: { color: BODY_COLOR } },
      { text: "Recharts, jsPDF, XLSX", options: { color: TITLE_COLOR, bold: true } },
      { text: "Renders responsive administrative analytics charts and generates official university compliance reports in PDF/Excel formats.", options: { color: BODY_COLOR } }
    ]
  ],
  { x: 0.6, y: 1.5, w: 12.1, h: 5.2, border: { color: BORDER_COLOR, pt: 1 }, fill: BG_COLOR, fontSize: 10.5, fontFace: FONT_BODY }
);

// -------------------------------------------------------------
// SLIDE 9: 5. Why Crowdsourcing & QR over IoT Sensors?
// -------------------------------------------------------------
const s9 = createBaseSlide("5. Stack Rationale: QR & Crowdsourcing vs. IoT Sensors", "Economic & operational justification for zero-hardware asset tracking");

s9.addTable(
  [
    [
      { text: "Evaluation Criteria", options: { bold: true, color: TITLE_COLOR, fill: CARD_BG } },
      { text: "Hardware IoT Sensor Networks (LoRa/ZigBee)", options: { bold: true, color: ACCENT_RED, fill: CARD_BG } },
      { text: "Campus Glow QR + Crowdsourced Stack", options: { bold: true, color: ACCENT_GREEN, fill: CARD_BG } }
    ],
    [
      { text: "Capital Cost (CapEx)", options: { color: BODY_COLOR } },
      { text: "High ($50 - $150 per light fixture + gateways)", options: { color: ACCENT_RED } },
      { text: "Near Zero (< $0.50 per vinyl weather-proof QR sticker)", options: { color: ACCENT_GREEN, bold: true } }
    ],
    [
      { text: "Maintenance & Theft", options: { color: BODY_COLOR } },
      { text: "Sensors damaged by lightning, stolen, or need battery changes", options: { color: ACCENT_RED } },
      { text: "Resilient vinyl stickers; zero valuable electronics to steal", options: { color: ACCENT_GREEN, bold: true } }
    ],
    [
      { text: "Spatial Pinpoint Accuracy", options: { color: BODY_COLOR } },
      { text: "Depends on static node ID mapping", options: { color: BODY_COLOR } },
      { text: "100% exact pole ID lookup; completely resolves 15m GPS drift", options: { color: ACCENT_GREEN, bold: true } }
    ],
    [
      { text: "Data Richness", options: { color: BODY_COLOR } },
      { text: "Binary on/off or current voltage drop only", options: { color: ACCENT_RED } },
      { text: "Rich context: Photos of physical damage, user notes, fault severity", options: { color: ACCENT_GREEN, bold: true } }
    ],
    [
      { text: "Deployment Complexity", options: { color: BODY_COLOR } },
      { text: "Requires RF mesh network tuning & specialized engineers", options: { color: ACCENT_RED } },
      { text: "Instant deployment via web browser on any standard smartphone", options: { color: ACCENT_GREEN, bold: true } }
    ]
  ],
  { x: 0.6, y: 1.5, w: 12.1, h: 5.2, border: { color: BORDER_COLOR, pt: 1 }, fill: BG_COLOR, fontSize: 10.5, fontFace: FONT_BODY }
);

// -------------------------------------------------------------
// SLIDE 10: 6. Key Features - 6.1 Student Interface (Public Access)
// -------------------------------------------------------------
const s10 = createBaseSlide("6. Key Features", "6.1 Student Interface (Public Access) - Frictionless civic reporting");

s10.addText([
  { text: "• Zero-Friction QR Scan & Report:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  Students scan a QR badge on any streetlight pole. The web app automatically resolves the pole ID, zone, and location metadata without requiring login or app downloads.\n\n", options: { color: BODY_COLOR } },
  { text: "• Photo Upload & Fault Categorisation:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  Users attach photo evidence and select standardized fault categories (e.g., Complete Blackout, Flickering, Broken Fixture, Exposed Wiring).\n\n", options: { color: BODY_COLOR } },
  { text: "• Anonymous Reporting & Status Tracking:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  Protects reporter privacy while providing a unique Ticket Reference Code for public real-time progress tracking (Reported → Dispatched → Resolved).\n\n", options: { color: BODY_COLOR } },
  { text: "• Interactive Public Safety Map & FAQ:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  Allows students to view reported dark zones across campus and check safety guidelines.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.2,
  fontSize: 12.5, lineSpacing: 18, fontFace: FONT_BODY
});

// -------------------------------------------------------------
// SLIDE 11: 6. Key Features - 6.2 Technician Portal (Protected Access)
// -------------------------------------------------------------
const s11 = createBaseSlide("6. Key Features", "6.2 Technician Portal (Protected Access) - Mobile CRM for field crews");

s11.addText([
  { text: "• Authenticated Mobile Workspace:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  Role-authenticated portal optimized for field smartphones used by PDMSD technicians.\n\n", options: { color: BODY_COLOR } },
  { text: "• Dynamic Task Queue & SLA Prioritisation:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  Displays assigned work orders sorted by SLA urgency (Emergency 24hr, High 48hr, Routine).\n\n", options: { color: BODY_COLOR } },
  { text: "• Verified Repair Form & Closure:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  Technicians must submit proof of completion by uploading a photo of the repaired glowing light, logging replacement parts used (e.g., 50W LED bulb, ballast), and specifying resolution notes.\n\n", options: { color: BODY_COLOR } },
  { text: "• Historical Performance Tracker:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  Tracks individual technician repair logs, completed tasks, and average resolution speed.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.2,
  fontSize: 12.5, lineSpacing: 18, fontFace: FONT_BODY
});

// -------------------------------------------------------------
// SLIDE 12: 6. Key Features - 6.3 Administrator Dashboard (Management Access)
// -------------------------------------------------------------
const s12 = createBaseSlide("6. Key Features", "6.3 Administrator Dashboard (Management Access) - Central control center");

s12.addText([
  { text: "• Real-Time Interactive GIS Map:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  Displays color-coded light status markers (Green = Active, Red = Outage, Yellow = In Repair) across campus zones.\n\n", options: { color: BODY_COLOR } },
  { text: "• Automated Work Order Assignment & SLA Dispatch:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  Admins reassign or dispatch tickets to specific available technicians based on workload and zone proximity.\n\n", options: { color: BODY_COLOR } },
  { text: "• Executive Analytics & Hotspot Identification:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  Recharts-powered visual graphs showing Mean Time To Repair (MTTR), fault categories, recurring failure zones, and technician SLA compliance.\n\n", options: { color: BODY_COLOR } },
  { text: "• Automated Report & QR Code Generator:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  One-click batch QR code badge printing for new poles + automated PDF & Excel facility audit exports.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.2,
  fontSize: 12.5, lineSpacing: 18, fontFace: FONT_BODY
});

// -------------------------------------------------------------
// SLIDE 13: 7. Expected Benefits and Impact (Safety & Efficiency)
// -------------------------------------------------------------
const s13 = createBaseSlide("7. Expected Benefits and Impact", "7.1 Enhanced Campus Safety & 7.2 Improved Operational Efficiency");

s13.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.6, w: 5.8, h: 5.0, fill: { color: CARD_BG }, line: { color: ACCENT_GREEN, width: 2 } });
s7.addText("7.1 Enhanced Campus Safety", { x: 0.8, y: 1.8, w: 5.4, h: 0.4, fontSize: 16, bold: true, color: TITLE_COLOR });
s13.addText("7.1 Enhanced Campus Safety", { x: 0.8, y: 1.8, w: 5.4, h: 0.4, fontSize: 16, bold: true, color: TITLE_COLOR });
s13.addText([
  { text: "• Eliminates Dark Walkways:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "Dramatically reduces outage duration along student walking routes between halls, libraries, and lecture blocks.\n\n", options: { color: BODY_COLOR } },
  { text: "• Deterrence of Crime:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "Well-lit campuses correlate with significant reductions in night-time theft, harassment, and security incidents.\n\n", options: { color: BODY_COLOR } },
  { text: "• Gender-Inclusive Mobility:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "Empowers female students and staff to move safely across campus at night.", options: { color: BODY_COLOR } }
], { x: 0.8, y: 2.3, w: 5.4, h: 4.1, fontSize: 12, lineSpacing: 16, fontFace: FONT_BODY });

s13.addShape(pres.shapes.RECTANGLE, { x: 6.9, y: 1.6, w: 5.8, h: 5.0, fill: { color: CARD_BG }, line: { color: ACCENT_BLUE, width: 2 } });
s13.addText("7.2 Improved Operational Efficiency", { x: 7.1, y: 1.8, w: 5.4, h: 0.4, fontSize: 16, bold: true, color: TITLE_COLOR });
s13.addText([
  { text: "• Reduced MTTR (Mean Time to Repair):\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "Cuts response time from several days/weeks down to 24-48 hours via automated dispatch.\n\n", options: { color: BODY_COLOR } },
  { text: "• Zero Inspection Overhead:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "Eliminates wasteful night-patrol fuel consumption by substituting crowdsourced student reporting.\n\n", options: { color: BODY_COLOR } },
  { text: "• Streamlined Workflows:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "Replaces paper logs with instant digital work orders and photo proof.", options: { color: BODY_COLOR } }
], { x: 7.1, y: 2.3, w: 5.4, h: 4.1, fontSize: 12, lineSpacing: 16, fontFace: FONT_BODY });

// -------------------------------------------------------------
// SLIDE 14: 7. Expected Benefits and Impact (Cost & Sustainability)
// -------------------------------------------------------------
const s14 = createBaseSlide("7. Expected Benefits and Impact", "7.3 Cost Optimisation & 7.4 Institutional Sustainability");

s14.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.6, w: 5.8, h: 5.0, fill: { color: CARD_BG }, line: { color: TITLE_COLOR, width: 2 } });
s14.addText("7.3 Cost Optimisation", { x: 0.8, y: 1.8, w: 5.4, h: 0.4, fontSize: 16, bold: true, color: TITLE_COLOR });
s14.addText([
  { text: "• 95% CapEx Savings vs. IoT:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "Avoids spending tens of thousands of dollars on expensive IoT hardware sensors and mesh gateways.\n\n", options: { color: BODY_COLOR } },
  { text: "• Preventative Asset Longevity:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "Prompt replacement of faulty ballasts or wiring prevents severe electrical damage to light poles.\n\n", options: { color: BODY_COLOR } },
  { text: "• Resource Optimization:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "Ensures technicians carry exact replacement parts on first trip based on reported fault photos.", options: { color: BODY_COLOR } }
], { x: 0.8, y: 2.3, w: 5.4, h: 4.1, fontSize: 12, lineSpacing: 16, fontFace: FONT_BODY });

s14.addShape(pres.shapes.RECTANGLE, { x: 6.9, y: 1.6, w: 5.8, h: 5.0, fill: { color: CARD_BG }, line: { color: ACCENT_GREEN, width: 2 } });
s14.addText("7.4 Institutional Sustainability", { x: 7.1, y: 1.8, w: 5.4, h: 0.4, fontSize: 16, bold: true, color: TITLE_COLOR });
s14.addText([
  { text: "• Civic Co-Production Culture:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "Fosters shared responsibility between students and university administration for campus upkeep.\n\n", options: { color: BODY_COLOR } },
  { text: "• ESG & Green Governance:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "Supports energy conservation by detecting stuck-on daytime lights and facilitating LED bulb transition.\n\n", options: { color: BODY_COLOR } },
  { text: "• Replicable Smart Campus Model:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "Establishes a blueprint scalable to other public utilities (water leaks, sanitation, roads).", options: { color: BODY_COLOR } }
], { x: 7.1, y: 2.3, w: 5.4, h: 4.1, fontSize: 12, lineSpacing: 16, fontFace: FONT_BODY });

// -------------------------------------------------------------
// SLIDE 15: 8. Project Methodology
// -------------------------------------------------------------
const s15 = createBaseSlide("8. Methodology", "Design Science Research (DSR) & agile development phases");

s15.addText([
  { text: "Campus Glow was developed following the Design Science Research (DSR) framework (Hevner et al.):\n\n", options: { color: BODY_COLOR } },
  { text: "1. Problem Identification & Requirements Gathering:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "   • Field audits of University of Ghana light poles, stakeholder interviews with PDMSD facility managers & students.\n\n", options: { color: BODY_COLOR } },
  { text: "2. System Architectural Design:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "   • Database schema design in PostgreSQL, QR encoding structure definition, UI component wireframing.\n\n", options: { color: BODY_COLOR } },
  { text: "3. Iterative Implementation (Agile Sprints):\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "   • Frontend development with React/Vite/Tailwind; Backend integration with Supabase Realtime & DB RLS policies.\n\n", options: { color: BODY_COLOR } },
  { text: "4. Empirical Testing & Validation:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "   • System Usability Scale (SUS) evaluation, MTTR benchmarking, end-to-end load testing.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.2,
  fontSize: 12.5, lineSpacing: 18, fontFace: FONT_BODY
});

// -------------------------------------------------------------
// SLIDE 16: 9. Scope and Limitations
// -------------------------------------------------------------
const s16 = createBaseSlide("9. Scope and Limitations", "9.1 Project Scope & 9.2 Known Limitations");

s16.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.6, w: 5.8, h: 5.0, fill: { color: CARD_BG }, line: { color: ACCENT_BLUE, width: 2 } });
s16.addText("9.1 Project Scope", { x: 0.8, y: 1.8, w: 5.4, h: 0.4, fontSize: 16, bold: true, color: TITLE_COLOR });
s16.addText([
  { text: "• Target Environment:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "Main Campus outdoor streetlights, primary pedestrian walkways, and hall surroundings at UG Legon.\n\n", options: { color: BODY_COLOR } },
  { text: "• Core Functional Deliverables:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "Public scan-to-report portal, mobile technician portal with photo closure, admin interactive GIS dashboard, and automated PDF/Excel export modules.\n\n", options: { color: BODY_COLOR } },
  { text: "• Data Infrastructure:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "Cloud-hosted Supabase PostgreSQL backend with WebSocket real-time subscription.", options: { color: BODY_COLOR } }
], { x: 0.8, y: 2.3, w: 5.4, h: 4.1, fontSize: 12, lineSpacing: 16, fontFace: FONT_BODY });

s16.addShape(pres.shapes.RECTANGLE, { x: 6.9, y: 1.6, w: 5.8, h: 5.0, fill: { color: CARD_BG }, line: { color: ACCENT_RED, width: 2 } });
s16.addText("9.2 Known Limitations & Mitigation", { x: 7.1, y: 1.8, w: 5.4, h: 0.4, fontSize: 16, bold: true, color: TITLE_COLOR });
s16.addText([
  { text: "• Dependency on Student Foot Traffic:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "Outages in isolated/low-traffic areas may experience higher reporting latency. (Mitigation: Scheduled security guard checks).\n\n", options: { color: BODY_COLOR } },
  { text: "• Network Connectivity Dependency:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "Requires mobile data or UG Wi-Fi for report submission. (Mitigation: Lightweight web app payload < 500KB).\n\n", options: { color: BODY_COLOR } },
  { text: "• Physical QR Sticker Vandalism:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "Risk of sticker peeling or damage. (Mitigation: Weatherproof UV-laminated vinyl badges + manual Pole ID fallback).", options: { color: BODY_COLOR } }
], { x: 7.1, y: 2.3, w: 5.4, h: 4.1, fontSize: 12, lineSpacing: 16, fontFace: FONT_BODY });

// -------------------------------------------------------------
// SLIDE 17: 10. Conclusion
// -------------------------------------------------------------
const s17 = createBaseSlide("10. Conclusion", "Summary of system impact and future roadmap");

s17.addText([
  { text: "• Summary of Achievement:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  Campus Glow successfully demonstrates that a software-driven, crowdsourced civic infrastructure model can achieve near real-time streetlight maintenance without expensive hardware sensors.\n\n", options: { color: BODY_COLOR } },
  { text: "• Operational Transformation:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  By bridging students, technicians, and administrators into a single real-time workflow, the system cuts MTTR, enforces SLA accountability, and elevates campus safety.\n\n", options: { color: BODY_COLOR } },
  { text: "• Future Horizon:\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  1. Expansion to other municipal campus utilities (water hydrants, waste bins, road hazards).\n  2. AI-driven predictive maintenance modeling based on historical bulb failure cycles.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.2,
  fontSize: 13, lineSpacing: 20, fontFace: FONT_BODY
});

// Save Presentation
const outputFilePath = path.join(__dirname, "../Campus_Glow_System_Overview.pptx");
pres.writeFile({ fileName: outputFilePath })
  .then(fileName => {
    console.log(`PPTX successfully generated at: ${fileName}`);
  })
  .catch(err => {
    console.error("Error generating PPTX:", err);
  });
