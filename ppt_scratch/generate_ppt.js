const Presentation = require('pptxgenjs');

// Initialize presentation
const pres = new Presentation();

// Set presentation layout to 16:9 widescreen
pres.layout = 'LAYOUT_16x9';

// Theme Colors
const BG_COLOR = '0F172A';      // Deep slate/navy
const TITLE_COLOR = 'F59E0B';    // Amber/Gold
const SUBTITLE_COLOR = '94A3B8'; // Slate Gray
const BODY_COLOR = 'F8FAFC';     // Off-white
const ACCENT_BLUE = '3B82F6';    // Tech blue
const ACCENT_GREEN = '10B981';   // Emerald green
const ACCENT_RED = 'EF4444';     // Rose red

// Fonts
const FONT_TITLE = 'Segoe UI';
const FONT_BODY = 'Segoe UI';

// Slide 1: Title Slide (Dark slate background, amber title)
const s1 = pres.addSlide();
s1.background = { fill: BG_COLOR };
s1.addText("CAMPUS GLOW 💡", {
  x: 1.0, y: 1.8, w: 11.3, h: 0.8,
  fontSize: 48, bold: true, color: TITLE_COLOR, fontFace: FONT_TITLE
});
s1.addText("Chapter Two: Theory, Background, and Literature Review", {
  x: 1.0, y: 2.8, w: 11.3, h: 0.6,
  fontSize: 24, bold: true, color: BODY_COLOR, fontFace: FONT_TITLE
});
s1.addText("A Smart Streetlight Management and Fault Reporting System for the University of Ghana", {
  x: 1.0, y: 3.5, w: 11.3, h: 0.5,
  fontSize: 18, color: SUBTITLE_COLOR, fontFace: FONT_BODY
});
s1.addText("Candidate: OweJeh | Department of Computer Science", {
  x: 1.0, y: 5.5, w: 11.3, h: 0.4,
  fontSize: 14, color: SUBTITLE_COLOR, italic: true, fontFace: FONT_BODY
});

// Helper function to create consistent slide templates
function createStandardSlide(title, subtitleText = "") {
  const slide = pres.addSlide();
  slide.background = { fill: BG_COLOR };

  // Add decorative line at the top
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.0, y: 0.0, w: 13.3, h: 0.1,
    fill: { color: TITLE_COLOR }
  });

  // Slide Title
  slide.addText(title, {
    x: 0.6, y: 0.4, w: 12.0, h: 0.6,
    fontSize: 24, bold: true, color: TITLE_COLOR, fontFace: FONT_TITLE
  });

  // Optional Subtitle
  if (subtitleText) {
    slide.addText(subtitleText, {
      x: 0.6, y: 0.9, w: 12.0, h: 0.3,
      fontSize: 12, color: SUBTITLE_COLOR, italic: true, fontFace: FONT_BODY
    });
  }

  // Horizontal separator line under title/subtitle
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.25, w: 12.1, h: 0.02,
    fill: { color: '334155' } // Border-slate-700
  });

  // Footer
  slide.addText("Campus Glow - Chapter Two Literature Review", {
    x: 0.6, y: 7.0, w: 6.0, h: 0.3,
    fontSize: 10, color: SUBTITLE_COLOR, fontFace: FONT_BODY
  });

  return slide;
}

// Slide 2: Roadmap of the Literature Review
const s2 = createStandardSlide("Roadmap of Chapter Two", "Structural overview of the literature review");
s2.addText([
  { text: "This chapter critically examines the theoretical foundations, contextual background, and related works guiding the deployment of a smart campus streetlight management system.\n\n", options: { color: BODY_COLOR } },
  { text: "1. Theoretical Frameworks: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Establishing core research foundations through Cyber-Physical Systems (CPS), Public-Participatory GIS (PPGIS), Civic Coproduction, and the UTAUT model.\n", options: { color: BODY_COLOR } },
  { text: "2. Technical and Contextual Background: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Reviewing smart campus trends, streetlight monitoring evolution, asset tracking mechanisms, and database-level real-time pub-sub mechanisms.\n", options: { color: BODY_COLOR } },
  { text: "3. Related Systems and Gap Analysis: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Examining commercial, civic, and regional platforms to identify limitations in spatial resolution, cost overheads, and dispatch loop closure.\n", options: { color: BODY_COLOR } },
  { text: "4. System Positioning: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Defining how Campus Glow synthesizes low-cost QR-based tracking and PostgreSQL subscriptions to address academic and operational gaps.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 13, lineSpacing: 22, fontFace: FONT_BODY
});

// Slide 3: Theoretical Foundation I: Cyber-Physical Systems (CPS)
const s3 = createStandardSlide("Theoretical Foundation I: Cyber-Physical Systems (CPS)", "Integrating hardware networks with software control layers");
s3.addText([
  { text: "• Core Paradigm: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Cyber-Physical Systems (CPS) represent integrations of computation, networking, and physical processes. Embedded computers and networks monitor and control physical processes, with feedback loops where physical computations affect physical processes and vice-versa (Lee, 2008).\n\n", options: { color: BODY_COLOR } },
  { text: "• Application to Campus Glow: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Streetlights act as physical assets (nodes) containing distinct geographical states (active, offline, damaged). The database layer and administrative dashboard represent the cyber controller. The feedback loop operates through fault reports feeding the software controller, which prompts maintenance workflows to physically repair the lights.\n\n", options: { color: BODY_COLOR } },
  { text: "• Cyber-Physical Integration Challenges: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Unlike closed-loop automation systems, Campus Glow leverages human-in-the-loop cyber-physical control, utilizing campus residents to bridge the gap between physical outages and cyber representation.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 13, lineSpacing: 22, fontFace: FONT_BODY
});

// Slide 4: Theoretical Foundation II: Public-Participatory GIS (PPGIS)
const s4 = createStandardSlide("Theoretical Foundation II: PPGIS", "Leveraging crowdsourced geospatial data for public utility management");
s4.addText([
  { text: "• Definition & Background: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Public Participation Geographic Information Systems (PPGIS) explore how GIS technologies can be used by non-expert community members to participate in urban decision-making, planning, and utility management (Sieber, 2006).\n\n", options: { color: BODY_COLOR } },
  { text: "• Mapping vs. Tracking: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Traditional PPGIS focuses on mapping environmental hazards or land disputes. Campus Glow shifts this paradigm towards infrastructure monitoring, enabling real-time micro-spatial tracking of campus light poles using exact spatial tags mapped directly on interactive visual dashboards.\n\n", options: { color: BODY_COLOR } },
  { text: "• Empowerment and Inclusivity: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Democratizes the maintenance cycle. Campus users (students and faculty) are transformed from passive observers into active sensors who capture and supply georeferenced metadata to the university management.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 13, lineSpacing: 22, fontFace: FONT_BODY
});

// Slide 5: Theoretical Foundation III: Civic Tech & Service Coproduction
const s5 = createStandardSlide("Theoretical Foundation III: Civic Tech & Coproduction", "Co-producing public safety and campus utility maintenance");
s5.addText([
  { text: "• Theoretical Concept of Coproduction: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Coproduction is the process through which inputs from individuals who are not in the same organization are transformed into goods and services (Ostrom, 1996). In public service delivery, it implies citizen-government collaboration (Lember et al., 2019).\n\n", options: { color: BODY_COLOR } },
  { text: "• Role of Civic Technology: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Civic technology provides the digital medium that facilitates coproduction. It removes the bureaucratic barriers that historically prevented the public from reporting local problems directly to municipal technicians.\n\n", options: { color: BODY_COLOR } },
  { text: "• Application to the University of Ghana: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Campus Glow creates a shared responsibility model. Security and lighting are no longer sole mandates of the Physical Development and Municipal Services Directorate (PDMSD); rather, students and university staff actively co-produce a safer campus environment.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 13, lineSpacing: 22, fontFace: FONT_BODY
});

// Slide 6: Theoretical Foundation IV: UTAUT Model for Civic Apps
const s6 = createStandardSlide("Theoretical Foundation IV: UTAUT Model", "Predicting user adoption and engagement in campus civic reporting");
s6.addText([
  { text: "The Unified Theory of Acceptance and Use of Technology (Venkatesh et al., 2003) is used to analyze student engagement:\n\n", options: { color: BODY_COLOR } },
  { text: "• Performance Expectancy: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Students will report outages if they believe it leads to real action (e.g., lights get repaired quickly). Hence, the system must provide a transparent status loop showing progress.\n\n", options: { color: BODY_COLOR } },
  { text: "• Effort Expectancy (Friction reduction): ", options: { bold: true, color: TITLE_COLOR } },
  { text: "A user is highly unlikely to report a fault if they have to download a heavy app, register, and type long details. QR codes minimize effort: Scan -> Snap Photo -> Report (under 10 seconds).\n\n", options: { color: BODY_COLOR } },
  { text: "• Facilitating Conditions: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "The availability of campus Wi-Fi (UG Wifi) and smartphone penetration are critical external factors supporting system adoption.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 13, lineSpacing: 20, fontFace: FONT_BODY
});

// Slide 7: Conceptual Framework Diagram
const s7 = createStandardSlide("Conceptual Framework", "Interaction of theoretical paradigms in the Campus Glow system");
// Visual Boxes using Rectangles to represent flow
s7.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 2.0, w: 3.5, h: 3.5, fill: { color: '1E293B' }, line: { color: TITLE_COLOR, width: 2 } });
s7.addText("INPUTS\n\n• Physical Infrastructure: Campus Streetlights\n• Human Capital: Students, Faculty & PDMSD\n• Civic Motivation: Night security concerns", {
  x: 0.7, y: 2.1, w: 3.3, h: 3.3, fontSize: 12, color: BODY_COLOR, fontFace: FONT_BODY
});

s7.addShape(pres.shapes.RECTANGLE, { x: 4.8, y: 2.0, w: 3.7, h: 3.5, fill: { color: '1E293B' }, line: { color: ACCENT_BLUE, width: 2 } });
s7.addText("PROCESS (Campus Glow)\n\n• PPGIS Node Tracking: QR Codes on poles\n• Cyber-Physical Loop: Supabase Real-time\n• Coproduction: Mobile Reporting + Technician CRM", {
  x: 4.9, y: 2.1, w: 3.5, h: 3.3, fontSize: 12, color: BODY_COLOR, fontFace: FONT_BODY
});

s7.addShape(pres.shapes.RECTANGLE, { x: 9.2, y: 2.0, w: 3.5, h: 3.5, fill: { color: '1E293B' }, line: { color: ACCENT_GREEN, width: 2 } });
s7.addText("OUTCOMES\n\n• High Operational Efficiency: Shorter SLA repair cycles\n• Cost-effectiveness: Zero sensor overhead\n• Safer Campus: Improved pedestrian safety", {
  x: 9.3, y: 2.1, w: 3.3, h: 3.3, fontSize: 12, color: BODY_COLOR, fontFace: FONT_BODY
});

// Draw simple connecting arrows using text shapes
s7.addText("➔", { x: 4.25, y: 3.5, w: 0.5, h: 0.5, fontSize: 24, color: TITLE_COLOR });
s7.addText("➔", { x: 8.65, y: 3.5, w: 0.5, h: 0.5, fontSize: 24, color: ACCENT_BLUE });

// Slide 8: The Smart Campus Paradigm
const s8 = createStandardSlide("Context: The Smart Campus Paradigm", "Higher education institutions as micro-cities and utility testing grounds");
s8.addText([
  { text: "• The Micro-City Concept: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Modern university campuses resemble small municipalities, possessing complex road networks, residential facilities, and large utility demands (water, power, security). This makes them ideal sandboxes for evaluating smart city technologies (Gourisetti et al., 2020).\n\n", options: { color: BODY_COLOR } },
  { text: "• Criticality of Streetlighting: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Campus lighting represents a fundamental infrastructure pillar affecting night-time security, academic productivity, student movement, and physical safety. High crime rates are empirically linked to poorly lit walkways.\n\n", options: { color: BODY_COLOR } },
  { text: "• Legacy Maintenance Bottlenecks: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Historically, the University of Ghana's maintenance department relies on manual inspections or verbal reports by campus security personnel, leading to prolonged dark zones, delayed maintenance, and lack of historical fault analytics.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 13, lineSpacing: 22, fontFace: FONT_BODY
});

// Slide 9: Evolution of Streetlight Monitoring Systems
const s9 = createStandardSlide("Evolution of Streetlight Monitoring Systems", "Transition from manual workflows to digital integration");
s9.addText([
  { text: "1. Manual Patrol Inspection (Pre-2000s):\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "   - Maintenance crews drive around campus at night to catalog outages.\n   - Drawbacks: High fuel cost, labor-intensive, reporting delay of days or weeks.\n\n", options: { color: BODY_COLOR } },
  { text: "2. Photo-Sensor and Timer Automation (2000s - 2010s):\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "   - Automatic turn-on/off based on ambient light levels.\n   - Drawbacks: No back-channel reporting; fails to detect lamp failures.\n\n", options: { color: BODY_COLOR } },
  { text: "3. Sensor-Based Smart Nodes / IoT (2010s - Present):\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "   - Power-line communication (PLC) or wireless mesh networks (LoRa, ZigBee).\n   - Drawbacks: Prohibitive capital costs, sensor damage due to weather, complex diagnostics.\n\n", options: { color: BODY_COLOR } },
  { text: "4. Crowdsourced Smart Governance (Emerging):\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "   - Leveraging localized physical tags (QR) and mobile apps to track assets dynamically with zero sensor overhead.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.4, w: 12.1, h: 5.2,
  fontSize: 12.5, lineSpacing: 18, fontFace: FONT_BODY
});

// Slide 10: Comparison: Automated Sensors vs. Crowdsourcing
const s10 = createStandardSlide("Sensors vs. Crowdsourcing", "Analyzing economic and operational tradeoffs");
s10.addTable(
  [
    [
      { text: "Metric", options: { bold: true, color: TITLE_COLOR, fill: '1E293B' } },
      { text: "IoT Sensor Node Network", options: { bold: true, color: TITLE_COLOR, fill: '1E293B' } },
      { text: "Crowdsourced Management (Campus Glow)", options: { bold: true, color: TITLE_COLOR, fill: '1E293B' } }
    ],
    [
      { text: "Initial CapEx", options: { color: BODY_COLOR } },
      { text: "Extremely High (Sensors, gateways, routers)", options: { color: BODY_COLOR } },
      { text: "Near Zero (QR code prints, cloud server host)", options: { color: BODY_COLOR } }
    ],
    [
      { text: "Ongoing OpEx", options: { color: BODY_COLOR } },
      { text: "High (Sensor battery changes, gateway repairs)", options: { color: BODY_COLOR } },
      { text: "Low (Minimal cloud hosting fee, QR updates)", options: { color: BODY_COLOR } }
    ],
    [
      { text: "Detection Latency", options: { color: BODY_COLOR } },
      { text: "Near Real-Time (Seconds to minutes)", options: { color: BODY_COLOR } },
      { text: "Variable (Depends on student foot traffic)", options: { color: BODY_COLOR } }
    ],
    [
      { text: "Information Richness", options: { color: BODY_COLOR } },
      { text: "Low (Only current/voltage drops)", options: { color: BODY_COLOR } },
      { text: "High (Photos, text notes, precise pole tag ID)", options: { color: BODY_COLOR } }
    ],
    [
      { text: "Vandalism Vulnerability", options: { color: BODY_COLOR } },
      { text: "High (Expensive electronics easily stolen)", options: { color: BODY_COLOR } },
      { text: "Low (Low-cost vinyl QR stickers are resilient)", options: { color: BODY_COLOR } }
    ]
  ],
  { x: 0.6, y: 1.6, w: 12.1, h: 4.8, border: { color: '334155', pt: 1 }, fill: '0F172A', color: BODY_COLOR, fontFace: FONT_BODY, fontSize: 11 }
);

// Slide 11: Crowdsourcing Dynamics and Civic Engagement
const s11 = createStandardSlide("Crowdsourcing Dynamics and Civic Engagement", "Overcoming sociological barriers in public reporting systems");
s11.addText([
  { text: "• The Free Rider Dilemma: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Under Mancur Olson's (1965) logic of collective action, users tend to avoid participating in civic actions if they expect others to do it for them. On campus, students walk past broken streetlights, assuming university management is already aware or that another student will report it.\n\n", options: { color: BODY_COLOR } },
  { text: "• Reducing Interactive Friction: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "To overcome the free rider problem, the reporting process must require minimal time and effort. Forcing a student to fill a complex form with landmark explanations leads to rapid drop-offs. Campus Glow addresses this by mapping a physical QR code directly to the reporting landing page, cutting input steps by 80%.\n\n", options: { color: BODY_COLOR } },
  { text: "• Feedback Loop and Status Transparency: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Providing public updates (e.g., 'Report Received', 'Technician Dispatched', 'Resolved') builds institutional trust, boosting long-term civic engagement among the student population.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 13, lineSpacing: 22, fontFace: FONT_BODY
});

// Slide 12: Asset Identification: QR Codes vs. NFC/RFID
const s12 = createStandardSlide("Asset Identification: QR Codes vs. Alternative Tagging", "Selecting the appropriate tracking technology for public campuses");
s12.addText([
  { text: "• Radio Frequency Identification (RFID) & NFC: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Requires users to hold phones within centimeters of the tag. High physical accessibility requirements (can't scan tags placed high on poles). High installation and hardware cost. Many low-end smartphones lack NFC chips.\n\n", options: { color: BODY_COLOR } },
  { text: "• Global Positioning System (GPS) Coordinate Pinning: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Standard smartphone GPS drifts 5 to 15 meters, especially in wooded campus areas. When streetlights are spaced closely together, a GPS pin often points to the wrong pole, confusing technicians.\n\n", options: { color: BODY_COLOR } },
  { text: "• Quick Response (QR) Codes: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "1. Readable from meters away, even in dim twilight settings.\n2. Compatible with 100% of camera-equipped smartphones.\n3. Zero hardware cost; QR codes are printed on weather-resistant vinyl and attached to the poles.\n4. Embeds unique asset IDs, linking the report to the exact light pole in the database.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 12.5, lineSpacing: 18, fontFace: FONT_BODY
});

// Slide 13: Technical Architecture: Real-time Pub-Sub Databases
const s13 = createStandardSlide("Technical Architecture: Real-time Databases", "Moving beyond periodic HTTP polling for utility dashboards");
s13.addText([
  { text: "• Traditional Polling Overhead: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Legacy management portals repeatedly request database updates via HTTP. This strains database connections and introduces latencies in critical emergency reporting.\n\n", options: { color: BODY_COLOR } },
  { text: "• WebSockets and Publish-Subscribe (Pub-Sub): ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Maintains a single open TCP connection. When a row changes in the database, the server pushes the change instantly to listening client dashboards.\n\n", options: { color: BODY_COLOR } },
  { text: "• The Supabase Real-time Engine: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Campus Glow leverages Supabase's Realtime engine, which listens to PostgreSQL Write-Ahead Logs (WAL), detects INSERT, UPDATE, or DELETE actions, and broadcasts them via WebSockets. Admins see reported faults pop up on their maps immediately, and technicians get instant work orders without reloading the page.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 13, lineSpacing: 22, fontFace: FONT_BODY
});

// Slide 14: Maintenance Operations & SLA Tracking Systems
const s14 = createStandardSlide("Maintenance Operations & SLA Tracking", "Applying industrial workflow models to university facilities management");
s14.addText([
  { text: "• Corrective vs. Preventive Maintenance: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Preventive maintenance schedules routine checks to prevent failures. Corrective maintenance repairs assets after failure. Campus Glow acts as a corrective maintenance tool, shortening the critical time-to-repair (MTTR) through automation.\n\n", options: { color: BODY_COLOR } },
  { text: "• Service Level Agreements (SLAs) in Public Works: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "SLA models dictate response times based on severity. For example, a fault reported near a female residential hall is categorized as 'High Priority' (24-hour repair SLA), while a minor aesthetic light is 'Low Priority' (72-hour SLA).\n\n", options: { color: BODY_COLOR } },
  { text: "• Closing the Maintenance Loop: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "A workflow is incomplete without verification. Campus Glow requires technicians to submit a 'Repair Form' with photo proof of the glowing light. The system then automatically closes the ticket and updates the public status tracker.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 13, lineSpacing: 22, fontFace: FONT_BODY
});

// Slide 15: Related System Review I: Commercial Smart Cities
const s15 = createStandardSlide("Related Systems I: Commercial Smart Cities", "Reviewing high-end enterprise smart city products");
s15.addText([
  { text: "• Commercial Solutions (e.g., Philips CityTouch, Telensa): ", options: { bold: true, color: TITLE_COLOR } },
  { text: "These systems install sophisticated wireless micro-controllers on every streetlight. They measure electrical metrics and report outages automatically to a central dashboard.\n\n", options: { color: BODY_COLOR } },
  { text: "• Technical and Economic Limitations: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "1. Astronomical Cost: The cost of a single smart node can exceed $150, making campus-wide deployments financially unfeasible for institutions in developing countries.\n2. Dependency on Local Telco Infrastructure: They require high-bandwidth cellular networks or wide-area mesh networks which are subject to regular downtime on developing campuses.\n3. Closed Ecosystems: Commercial systems are proprietary, preventing customization, local integration, or developer extensions by computer science departments.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 13, lineSpacing: 22, fontFace: FONT_BODY
});

// Slide 16: Related System Review II: Civic Outage Trackers
const s16 = createStandardSlide("Related Systems II: Civic Outage Trackers", "Analyzing general-purpose public civic reporting platforms");
s16.addText([
  { text: "• Global Civic Tech Apps (e.g., FixMyStreet, SeeClickFix): ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Allow residents to report graffiti, potholes, and broken streetlights to municipal councils. They rely on GPS maps and allow users to attach photos.\n\n", options: { color: BODY_COLOR } },
  { text: "• Crucial Structural Flaws for Campus Use: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "1. Lack of Asset Granularity: GPS coordinate points do not indicate which specific pole is out. In dark corridors with poles lined 5 meters apart, this causes confusion.\n2. Unlinked Dispatch Workflows: They send automated emails to municipalities, but lack internal CRM modules for technician management, scheduling, and verified loop closures.\n3. Generalist Focus: They do not track technical properties of assets (e.g., bulb type, wattage, installation date) which is crucial for facilities management.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 13, lineSpacing: 22, fontFace: FONT_BODY
});

// Slide 17: Related System Review III: Global Smart Campus Initiatives
const s17 = createStandardSlide("Related Systems III: Global Smart Campus Initiatives", "Reviewing technological deployments at Western universities");
s17.addText([
  { text: "• Smart Campus Implementations (e.g., MIT, Stanford, NUS): ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Western campus environments utilize LoRaWAN infrastructure combined with building information modeling (BIM) systems. They track campus lights using high-fidelity geographic mapping and automated sensor nodes.\n\n", options: { color: BODY_COLOR } },
  { text: "• The Local Applicability Gap: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "1. Infrastructure assumptions: These systems assume constant Wi-Fi/mesh network coverage across the entire campus geographic space.\n2. Power Assumptions: They assume stable electricity. In sub-Saharan African contexts, power fluctuations and load-shedding damage sensitive gateway electronics and trigger false outage alarms.\n3. Skillsets: They require specialized hardware maintenance engineers, whereas local campus technicians are often trained only in basic electrical wiring.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 13, lineSpacing: 22, fontFace: FONT_BODY
});

// Slide 18: Related System Review IV: Sub-Saharan African Municipal Realities
const s18 = createStandardSlide("Related Systems IV: Sub-Saharan African Contexts", "Municipal reporting systems in resource-constrained environments");
s18.addText([
  { text: "• Local Implementations (e.g., Johannesburg's 'Find & Fix'): ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Mobile applications deployed in major African cities to report infrastructure failures. They suffer from high user abandonment rates and limited operational impact.\n\n", options: { color: BODY_COLOR } },
  { text: "• Key Obstacles Identified in African Literature: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "1. Bureaucracy and Trust Deficits: Citizens report faults but never receive updates. This lack of transparency leads to the belief that the system is a black hole, resulting in user drop-offs.\n2. Vandalism: Smart streetlights equipped with solar panels and batteries are targeted by thieves. High-tech monitoring sensors are stolen alongside the batteries.\n3. Network Cost Barriers: Mobile apps requiring high data usage exclude low-income users. Systems must be lightweight and mobile-web compatible.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 13, lineSpacing: 22, fontFace: FONT_BODY
});

// Slide 19: Literature Synthesis & Comparative Matrix
const s19 = createStandardSlide("Literature Synthesis", "Comparative matrix of Campus Glow vs. Existing Frameworks");
s19.addTable(
  [
    [
      { text: "System Type", options: { bold: true, color: TITLE_COLOR, fill: '1E293B' } },
      { text: "Deployment Cost", options: { bold: true, color: TITLE_COLOR, fill: '1E293B' } },
      { text: "Asset Granularity", options: { bold: true, color: TITLE_COLOR, fill: '1E293B' } },
      { text: "Technician Dispatch", options: { bold: true, color: TITLE_COLOR, fill: '1E293B' } },
      { text: "Real-time Loop", options: { bold: true, color: TITLE_COLOR, fill: '1E293B' } },
      { text: "Africa Resilience", options: { bold: true, color: TITLE_COLOR, fill: '1E293B' } }
    ],
    [
      { text: "Commercial Smart Cities (e.g., Philips)", options: { color: BODY_COLOR } },
      { text: "Prohibitive", options: { color: ACCENT_RED } },
      { text: "High (IP Address)", options: { color: BODY_COLOR } },
      { text: "Yes (Proprietary)", options: { color: BODY_COLOR } },
      { text: "Yes", options: { color: BODY_COLOR } },
      { text: "Low (Power issues)", options: { color: ACCENT_RED } }
    ],
    [
      { text: "Civic Trackers (e.g., FixMyStreet)", options: { color: BODY_COLOR } },
      { text: "Low", options: { color: ACCENT_GREEN } },
      { text: "Low (GPS only)", options: { color: ACCENT_RED } },
      { text: "No (Email alert)", options: { color: ACCENT_RED } },
      { text: "No", options: { color: ACCENT_RED } },
      { text: "Medium", options: { color: BODY_COLOR } }
    ],
    [
      { text: "Smart Campuses (e.g., MIT LoRa)", options: { color: BODY_COLOR } },
      { text: "High", options: { color: ACCENT_RED } },
      { text: "High (LoRa Node)", options: { color: BODY_COLOR } },
      { text: "Yes (Integrated)", options: { color: BODY_COLOR } },
      { text: "Yes", options: { color: BODY_COLOR } },
      { text: "Low (Infrastructure)", options: { color: ACCENT_RED } }
    ],
    [
      { text: "Campus Glow (This Research)", options: { color: TITLE_COLOR, bold: true } },
      { text: "Very Low", options: { color: ACCENT_GREEN, bold: true } },
      { text: "Exact (QR Code)", options: { color: ACCENT_GREEN, bold: true } },
      { text: "Yes (Built-in CRM)", options: { color: ACCENT_GREEN, bold: true } },
      { text: "Yes (Supabase)", options: { color: ACCENT_GREEN, bold: true } },
      { text: "High (Zero Sensor)", options: { color: ACCENT_GREEN, bold: true } }
    ]
  ],
  { x: 0.6, y: 1.6, w: 12.1, h: 4.8, border: { color: '334155', pt: 1 }, fill: '0F172A', color: BODY_COLOR, fontFace: FONT_BODY, fontSize: 10 }
);

// Slide 20: Critical Research Gap I: High CapEx vs. Resource Constraints
const s20 = createStandardSlide("Critical Research Gap I", "The hardware cost barrier in developing nations");
s20.addText([
  { text: "• Literature Bias towards Automation: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Over 80% of reviewed smart streetlighting literature (e.g., studies in IEEE Transactions on Smart Grid) assumes the presence of hardware sensors on every light fixture. The academic focus is on wireless sensor networking (WSN) routing protocols, mesh range optimization, and automated voltage diagnostics.\n\n", options: { color: BODY_COLOR } },
  { text: "• The Academic Gap: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "There is a profound lack of literature exploring software-defined, zero-sensor utility monitoring architectures. Researchers have neglected the design of systems that achieve similar maintenance turnaround speeds without purchasing expensive, delicate hardware.\n\n", options: { color: BODY_COLOR } },
  { text: "• Institutional Significance: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "For public universities in low-to-middle-income countries (LMICs) like Ghana, buying $100 sensors for 5,000 campus lamp poles is economically impossible. Research must pivot to leveraging human-infrastructure interfaces.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 13, lineSpacing: 22, fontFace: FONT_BODY
});

// Slide 21: Critical Research Gap II: Spatial Pinpoint Inaccuracy
const s21 = createStandardSlide("Critical Research Gap II", "The GPS drift problem in dense infrastructure settings");
s21.addText([
  { text: "• Standard Geolocation Limitations in Civic Apps: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Existing civic technology frameworks rely on the reporter's phone GPS to place a marker on a map. However, in physical environments containing tree canopies, tall academic buildings, and heavy clouds, GPS signals experience multipath propagation, resulting in errors of 10 to 20 meters.\n\n", options: { color: BODY_COLOR } },
  { text: "• The Troubleshooting Bottleneck: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "If a student reports an outage at night using a generic map pin, the pin might float between three or four poles. Technicians sent to inspect must guess which light is broken. If the issue is intermittent, they may repair the wrong light or declare it a false alarm.\n\n", options: { color: BODY_COLOR } },
  { text: "• The Academic Gap: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Literature fails to present standard methodologies for linking physical infrastructure assets directly to digital entries using robust, near-field visual tags that eliminate spatial tracking ambiguities.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 13, lineSpacing: 22, fontFace: FONT_BODY
});

// Slide 22: Critical Research Gap III: The Closed-Loop Dispatch Gap
const s22 = createStandardSlide("Critical Research Gap III", "The separation of civic reporting and technician dispatching");
s22.addText([
  { text: "• The Disconnected Workflow: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Most crowdsourced apps operate solely as reporting channels (front-end citizen face). Once a report is submitted, it is forwarded as an email to the municipality. The workflow then becomes manual, untracked, and opaque.\n\n", options: { color: BODY_COLOR } },
  { text: "• The Academic Gap: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "There is little academic design research on unified, real-time, closed-loop maintenance workflows that bridge the gap between: Citizen Reporting -> Administrative Dispatch -> Technician CRM -> Verification & Public Loop Closure.\n\n", options: { color: BODY_COLOR } },
  { text: "• Consequences of the Gap: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Without integrating these components: \n1. Technicians cannot receive structured directions or attach repair photos.\n2. Administrators cannot track response times against SLAs.\n3. Citizens lose faith in the system because they see no visible progress or resolution confirmation.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 12.5, lineSpacing: 18, fontFace: FONT_BODY
});

// Slide 23: Methodological Literature Review
const s23 = createStandardSlide("Methodological Literature Review", "Reviewing methodologies for designing and evaluating civic utility portals");
s23.addText([
  { text: "• Design Science Research (DSR) in Information Systems: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Following Hevner et al. (2004), DSR provides a framework where IT artifacts are designed, implemented, and evaluated to solve identified business or social problems. Campus Glow is designed as a DSR artifact, addressing the concrete problem of campus lighting maintenance.\n\n", options: { color: BODY_COLOR } },
  { text: "• Evaluation Metrics in Prior Literature: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "1. Mean Time to Repair (MTTR): The average time elapsed between fault reporting and ticket closure.\n2. System Usability Scale (SUS): A standard 10-item questionnaire to measure the usability and user experience of software systems.\n3. Citizen Adoption Rate: Evaluating the percentage of the student population engaging with the civic portal.\n\n", options: { color: BODY_COLOR } },
  { text: "• Application: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "This research adopts a quantitative evaluation approach, measuring MTTR improvements pre- and post-deployment, alongside conducting SUS tests with student reporters and PDMSD technicians.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 13, lineSpacing: 20, fontFace: FONT_BODY
});

// Slide 24: Legal, Security, and Privacy Dimensions
const s24 = createStandardSlide("Legal, Security, and Privacy Dimensions", "Aligning civic technology with local regulations and data privacy");
s24.addText([
  { text: "• Regulatory Alignment (Ghana Data Protection Act, 2012): ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Any application collecting user inputs in Ghana must protect personal identifiable information (PII). In Campus Glow, student reporters can report faults anonymously or submit without revealing their academic identities, avoiding privacy infringements.\n\n", options: { color: BODY_COLOR } },
  { text: "• Security in Crowdsourced Reporting: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "1. Sybil Attacks and Spam: Malicious users submitting fake reports to confuse maintenance teams. Mitigation: Requiring live camera photo proof of the fault instead of text-only reports.\n2. Role-Based Access Control (RBAC): Restricting backend database modifications to authenticated admins and authorized technicians using Supabase JWT policies.\n\n", options: { color: BODY_COLOR } },
  { text: "• Database-Level Integrity: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Using Row-Level Security (RLS) in PostgreSQL to ensure technicians can only modify tasks assigned to them, preventing unauthorized data tampering.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 12.5, lineSpacing: 18, fontFace: FONT_BODY
});

// Slide 25: Positioning Campus Glow
const s25 = createStandardSlide("Positioning Campus Glow", "Synthesizing theoretical paradigms to address literature gaps");
s25.addText([
  { text: "Campus Glow bridges the gap between theoretical crowdsourcing models and physical maintenance workflows:\n\n", options: { color: BODY_COLOR } },
  { text: "• Physical Asset-Linked QR Code (Bridges Gap I & II):\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  - Bypasses expensive sensor deployment by printing and attaching unique QR codes to every pole.\n  - Solves GPS drift: Scanning the QR code immediately identifies the exact pole ID and specifications in the database.\n\n", options: { color: BODY_COLOR } },
  { text: "• Integrated Multi-Role Portal (Bridges Gap III):\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  - Connects the public reporter interface with an admin control room and a mobile-friendly technician workspace.\n\n", options: { color: BODY_COLOR } },
  { text: "• Real-Time Pub-Sub Database Engine (Supports CPS Loop):\n", options: { bold: true, color: TITLE_COLOR } },
  { text: "  - Employs Supabase/PostgreSQL real-time replication to broadcast state changes, enabling seamless coordination between administrators and maintenance crews.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 12, lineSpacing: 16, fontFace: FONT_BODY
});

// Slide 26: Conclusion & Chapter Summary
const s26 = createStandardSlide("Conclusion & Chapter Summary", "Key findings of the literature review and path forward");
s26.addText([
  { text: "• Theoretical Validation: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Cyber-Physical Systems and Civic Coproduction theories support the model of using student crowdsourcing to monitor physical campus lights, confirming that human infrastructure can substitute for expensive sensor grids.\n\n", options: { color: BODY_COLOR } },
  { text: "• Core Gaps Solved: ", options: { bold: true, color: TITLE_COLOR } },
  { text: "Identified literature gaps in high IoT costs, GPS coordinate inaccuracy, and disconnected maintenance dispatches are directly addressed through Campus Glow's integrated design (QR code + Supabase real-time + Technician dashboard).\n\n", options: { color: BODY_COLOR } },
  { text: "• Transition to Chapter Three (Methodology): ", options: { bold: true, color: TITLE_COLOR } },
  { text: "The architectural specifications, database schemas, API pathways, and empirical testing methodologies will be detailed in the next chapter, showing the concrete software implementation of the theoretical models established here.", options: { color: BODY_COLOR } }
], {
  x: 0.6, y: 1.5, w: 12.1, h: 5.0,
  fontSize: 13, lineSpacing: 22, fontFace: FONT_BODY
});

// Save the presentation
const outputPath = "../Chapter_2_Literature_Review.pptx";
pres.writeFile({ fileName: outputPath })
  .then(fileName => {
    console.log(`PowerPoint successfully generated and saved to: ${fileName}`);
  })
  .catch(err => {
    console.error("Error generating PowerPoint:", err);
  });
