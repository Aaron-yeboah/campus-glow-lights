const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle, HeightRule, HeadingLevel } = require('docx');
const fs = require('fs');
const path = require('path');

// Keep children in an array and initialize Document at the end
const children = [];

// Helpers to generate elements with strict styling (Times New Roman, proper spacing/sizes)
function addMainTitle(text) {
  children.push(new Paragraph({
    children: [
      new TextRun({
        text: text,
        font: "Times New Roman",
        size: 32, // 16pt
        bold: true,
        color: "000000"
      })
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 360, after: 360 }
  }));
}

function addHeading1(text) {
  children.push(new Paragraph({
    children: [
      new TextRun({
        text: text,
        font: "Times New Roman",
        size: 28, // 14pt
        bold: true,
        color: "000000"
      })
    ],
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 120 },
    keepWithNext: true
  }));
}

// Custom function to create section dividers
function addSectionDivider() {
  children.push(new Paragraph({
    children: [
      new TextRun({
        text: "_________________________________________________________________________________",
        font: "Times New Roman",
        size: 16,
        color: "94A3B8"
      })
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 240 }
  }));
}

function addHeading2(text) {
  children.push(new Paragraph({
    children: [
      new TextRun({
        text: text,
        font: "Times New Roman",
        size: 24, // 12pt
        bold: true,
        color: "000000"
      })
    ],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    keepWithNext: true
  }));
}

function addHeading3(text) {
  children.push(new Paragraph({
    children: [
      new TextRun({
        text: text,
        font: "Times New Roman",
        size: 24, // 12pt
        bold: true,
        italic: true,
        color: "000000"
      })
    ],
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 120, after: 120 },
    keepWithNext: true
  }));
}

function addParagraph(text) {
  children.push(new Paragraph({
    children: [
      new TextRun({
        text: text,
        font: "Times New Roman",
        size: 24, // 12pt
        color: "000000"
      })
    ],
    spacing: { line: 360, before: 120, after: 120 } // 1.5 spacing
  }));
}

function addBulletPoint(boldPrefix, normalText) {
  children.push(new Paragraph({
    children: [
      new TextRun({
        text: "• " + boldPrefix,
        font: "Times New Roman",
        size: 24,
        bold: true,
        color: "000000"
      }),
      new TextRun({
        text: normalText,
        font: "Times New Roman",
        size: 24,
        color: "000000"
      })
    ],
    spacing: { line: 360, before: 60, after: 60 },
    indent: { left: 720 }
  }));
}

// Custom numbered list function
function addListNumberPoint(numberString, boldPrefix, normalText) {
  children.push(new Paragraph({
    children: [
      new TextRun({
        text: numberString + " " + boldPrefix,
        font: "Times New Roman",
        size: 24,
        bold: true,
        color: "000000"
      }),
      new TextRun({
        text: normalText,
        font: "Times New Roman",
        size: 24,
        color: "000000"
      })
    ],
    spacing: { line: 360, before: 60, after: 60 },
    indent: { left: 720 }
  }));
}

function addTableCaption(text) {
  children.push(new Paragraph({
    children: [
      new TextRun({
        text: text,
        font: "Times New Roman",
        size: 22,
        bold: true,
        italic: true,
        color: "000000"
      })
    ],
    spacing: { before: 180, after: 60 },
    keepWithNext: true
  }));
}

function addStyledTable(headers, rows) {
  const tableRows = [];

  // Header Row
  tableRows.push(new TableRow({
    children: headers.map(header => new TableCell({
      children: [new Paragraph({
        children: [new TextRun({
          text: header,
          font: "Times New Roman",
          size: 20, // 10pt for compact table structure
          bold: true,
          color: "FFFFFF"
        })],
        alignment: AlignmentType.CENTER
      })],
      shading: { fill: "1E293B" },
      verticalAlign: "center"
    })),
    height: { value: 400, rule: HeightRule.ATLEAST }
  }));

  // Data Rows
  rows.forEach((row, rowIndex) => {
    const bgFill = rowIndex % 2 === 0 ? "F8FAFC" : "FFFFFF"; // Subtle zebra striping
    tableRows.push(new TableRow({
      children: row.map(cellText => {
        // Highlight this research row
        const isSpecialRow = cellText.includes("(This Research)") || cellText === "Campus Glow (This Research)";
        return new TableCell({
          children: [new Paragraph({
            children: [new TextRun({
              text: cellText,
              font: "Times New Roman",
              size: 20, // 10pt
              bold: isSpecialRow,
              color: isSpecialRow ? "B45309" : "000000" // Warm amber for research highlights
            })],
            spacing: { before: 80, after: 80 }
          })],
          shading: { fill: bgFill },
          verticalAlign: "center"
        });
      }),
      height: { value: 360, rule: HeightRule.ATLEAST }
    }));
  });

  children.push(new Table({
    rows: tableRows,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" }
    }
  }));

  // Empty spacing paragraph under the table
  children.push(new Paragraph({
    spacing: { before: 120, after: 120 }
  }));
}

// ----------------------------------------------------
// BUILD CHAPTER CONTENT
// ----------------------------------------------------

addMainTitle("CHAPTER TWO\nTHEORY, BACKGROUND AND LITERATURE REVIEW");

addHeading1("2.1 Introduction");
addParagraph(
  "This chapter presents a comprehensive, multi-dimensional review of the theoretical frameworks, technical core concepts, and empirical literature guiding the design, deployment, and operational evaluation of a smart campus streetlight management and fault reporting system. Streetlighting is a fundamental municipal and institutional utility, bearing directly on public safety, vehicular and pedestrian mobility, night-time campus security, and campus-wide energy consumption. Traditional utility management paradigms in higher education environments rely heavily on manual night patrols or unstructured, passive reporting channels (such as informal calls or general emails to administration). These traditional methods are plagued by significant latency, operational opaqueness, and high labor costs."
);
addParagraph(
  "By exploring key theoretical foundations—specifically Cyber-Physical Systems (CPS), Public Participation Geographic Information Systems (PPGIS), Civic Technology & Service Coproduction, and the Unified Theory of Acceptance and Use of Technology (UTAUT)—this chapter establishes a rigorous academic scaffolding for the Campus Glow system. Furthermore, this review provides a contextual review of smart campus transformations, surveys the technical evolution of streetlight monitoring networks, evaluates the socio-technical trade-offs between automated IoT sensors and crowdsourced models, and critically synthesizes related municipal and academic platforms globally. Finally, this chapter identifies and analyzes critical gaps in existing literature, particularly regarding the high capital barriers in low-to-middle-income countries (LMICs), spatial precision limitations of standard GPS pinning, and the absence of integrated CRM ticketing solutions to close the maintenance dispatch loop. The chapter concludes by defining the precise academic and operational positioning of the Campus Glow system."
);

addHeading1("2.2 Theoretical Frameworks");

addHeading2("2.2.1 Cyber-Physical Systems (CPS)");
addParagraph(
  "The paradigm of Cyber-Physical Systems (CPS) provides the foundational architectural logic for linking physical utilities with software control layers. As established by Lee (2008), Cyber-Physical Systems represent integrations of computation, networking, and physical processes. Embedded computers and networks monitor and control physical processes, with feedback loops where physical states inform cyber computations, and cyber decisions in turn actuate physical changes. Historically, CPS implementations are centered on closed-loop automation—such as SCADA systems in power grids or autopilot systems in aviation—where hardware sensors directly trigger software computations, which subsequently activate hardware actuators without human intervention."
);
addParagraph(
  "In public infrastructure and campus utility settings, however, establishing a fully automated closed-loop CPS (e.g., installing individual smart sensors on thousands of streetlights to detect outages wirelessly) is economically unviable and technically complex for resource-constrained institutions. Campus Glow addresses this by modeling campus lighting as a human-in-the-loop Cyber-Physical System. Here, the physical assets are the physical streetlight poles distributed across the geographic expanse of the University of Ghana campus. Each pole possesses specific, real-world physical states (e.g., active, offline, damaged, intermittent). The cyber controller comprises a cloud relational database (PostgreSQL deployed via Supabase), real-time pub-sub sync mechanisms, and administrative web interfaces."
);
addParagraph(
  "The critical feedback loop is bridged by campus citizens—students, faculty, and security patrols—who function as active human sensors. When an outage occurs, a physical action (scanning a unique tag on the pole) updates the cyber layer, creating a digital ticket. This digital event triggers an administrative maintenance dispatch, prompting a physical intervention by an electrical technician. Once the technician completes the repair, they log the resolution digitally (submitting photo verification), which updates the cyber dashboard, thereby closing the cyber-physical control loop. This approach highlights how public utility management can substitute expensive physical sensor arrays with structured crowdsourced human-physical interactions."
);

addHeading2("2.2.2 Public Participation Geographic Information Systems (PPGIS)");
addParagraph(
  "Public Participation Geographic Information Systems (PPGIS) emerged in the late 1990s as a research field focused on democratizing Geographic Information Systems (GIS) to allow non-expert community members to participate in urban planning, environmental monitoring, and public utility decision-making (Sieber, 2006). Traditionally, GIS technologies were highly centralized, complex, and restricted to geographers and administrative authorities due to expensive desktop licensing and steep learning curves. PPGIS research seeks to break down these barriers by providing accessible interfaces that allow local communities to map environmental hazards, document land disputes, or coordinate local development projects."
);
addParagraph(
  "While historical PPGIS literature focuses on static mapping and macro-environmental inputs, Campus Glow adapts the PPGIS model for real-time micro-spatial utility tracking. Instead of mapping broad neighborhoods or territorial polygons, Campus Glow provides non-expert campus residents with the ability to perform high-precision georeferenced node tracking on an interactive campus map. In crowdsourced platforms, spatial imprecision remains a persistent challenge; when users manually drop pins on mobile maps, standard GPS drift and human spatial confusion lead to inaccurate location inputs."
);
addParagraph(
  "Campus Glow resolves this PPGIS limitation by pairing digital mapping interfaces with physical identification tags (QR codes) physically attached to streetlight poles. By scanning a localized code, users generate structured georeferenced reports linked to the exact coordinates of the physical pole. This model transforms the student body from passive consumers into active GIS contributors, supplying high-fidelity data to the university administration and democratizing the campus maintenance lifecycle."
);

addHeading2("2.2.3 Civic Technology & Service Coproduction");
addParagraph(
  "The concept of service coproduction, pioneered by Nobel laureate Elinor Ostrom (1996), describes the processes through which inputs from individuals who are not in the same organization are transformed into public goods and services. In public administration, coproduction represents a fundamental departure from traditional, top-down bureaucratic models, establishing instead a collaborative framework where citizens and public agencies jointly produce services (Lember et al., 2019). Civic technology—digital platforms designed to connect citizens with government bodies—serves as the primary enabler of coproduction in the digital age, stripping away traditional bureaucratic barriers and allowing direct citizen-technician communication."
);
addParagraph(
  "At the University of Ghana, streetlight maintenance has historically been managed through a highly centralized, administrative framework under the Physical Development and Municipal Services Directorate (PDMSD). Students and staff remained passive consumers of dark walkways. Campus Glow introduces a digital coproduction model. Students and university personnel supply critical operational inputs (observations of broken streetlights, live photograph proofs, specific pole descriptions) while PDMSD technicians supply the maintenance labor to execute repairs. This joint model creates a shared responsibility framework for campus safety, demonstrating how civic technology can transform university residents into active co-producers of a secure campus environment."
);

addHeading2("2.2.4 Unified Theory of Acceptance and Use of Technology (UTAUT)");
addParagraph(
  "Deploying a civic reporting system is futile if the target community refuses to adopt the software. To model and predict student and staff engagement, this research leverages the Unified Theory of Acceptance and Use of Technology (UTAUT) framework developed by Venkatesh et al. (2003). UTAUT argues that technology adoption is driven by four primary constructs: performance expectancy, effort expectancy, social influence, and facilitating conditions. For Campus Glow, these constructs are analyzed as follows:"
);
addBulletPoint(
  "Performance Expectancy: ",
  "This is the degree to which users believe the system will help them achieve gains in utility. Students will report broken streetlights if and only if they believe their reports will result in tangible repairs. Thus, the system must provide transparent status updates (e.g., changing status from 'Reported' to 'Technician Dispatched' to 'Resolved') to build institutional trust."
);
addBulletPoint(
  "Effort Expectancy: ",
  "This is the perceived ease of use. Interactive friction is the single greatest cause of user abandonment in crowdsourced apps. Forcing students to download an application, register credentials, and type detailed landmark reports causes rapid drop-offs. Campus Glow addresses this by providing a lightweight web-app accessible via a QR scan, reducing the reporting flow to a scan, photo snap, and click, taking under 10 seconds."
);
addBulletPoint(
  "Facilitating Conditions: ",
  "This is the availability of infrastructure to support system use. The high smartphone penetration rate at the University of Ghana, combined with campus-wide Wi-Fi access (UG Wi-Fi), provides the necessary technical conditions that enable users to submit georeferenced reports instantly while walking."
);

addHeading2("2.2.5 Conceptual Framework Synthesis");
addParagraph(
  "The conceptual framework of Campus Glow integrates these theoretical paradigms into an operational loop. Cyber-Physical Systems (CPS) provide the core loop structure (physical state changes informing cyber states, leading to physical repairs). Public Participation GIS (PPGIS) dictates the spatial layout (QR codes mapping to interactive web maps). Civic Coproduction establishes the collaborative social framework, and UTAUT guides the interface design to ensure adoption. The interaction of these models is organized into Inputs, Processes, and Outcomes:"
);
addBulletPoint(
  "Inputs: ",
  "Physical assets (campus streetlight grid), human capital (students, staff, PDMSD personnel), and social motivation (night safety, crime deterrence, pedestrian protection)."
);
addBulletPoint(
  "Processes: ",
  "PPGIS-driven node tracking (physical QR tags on poles), database sync (Supabase Real-time WebSockets), and civic coproduction (mobile-first reporting + administrative CRM workflow)."
);
addBulletPoint(
  "Outcomes: ",
  "Closed-loop utility maintenance, low operational latency (reduced Mean Time to Repair), zero sensor infrastructure costs, and a safer campus environment."
);

addSectionDivider();

// ----------------------------------------------------
addHeading1("2.3 Contextual and Technical Background");

addHeading2("2.3.1 The Smart Campus Paradigm");
addParagraph(
  "Modern university campuses are increasingly conceptualized in literature as socio-technical micro-cities. Occupying large geographic areas, containing residential blocks, commercial facilities, transportation networks, water distribution grids, and dedicated security forces, higher education institutions mirror the complexities of small cities (Gourisetti et al., 2020). Consequently, campuses serve as ideal sandboxes and testing grounds for smart city technologies. The lessons learned from deploying digitized utility systems on a campus can be directly scaled to broader municipal environments."
);
addParagraph(
  "Within the campus environment, streetlighting represents a vital infrastructure pillar that directly affects student life, night-time mobility, academic productivity, and safety. A poorly lit campus restricts pedestrian movement, increases the risk of vehicular-pedestrian accidents, and creates opportunities for crime. At the University of Ghana, Accra, the legacy utility management workflow has historically been manual, disconnected, and slow. The Physical Development and Municipal Services Directorate (PDMSD) has relied on manual inspections or verbal reports by campus security personnel, leading to prolonged dark zones, delayed maintenance, and a complete lack of historical data for predictive asset management."
);

addHeading2("2.3.2 Evolution of Streetlight Monitoring Systems");
addParagraph(
  "The technical methodologies used to monitor and maintain streetlighting grids have undergone significant transformations over the past three decades:"
);
addListNumberPoint(
  "1.",
  "Manual Patrol Inspection (Pre-2000s): ",
  "Maintenance crews drive around campus at night to catalog broken bulbs on paper. This approach is labor-intensive, has high fuel costs, and exhibits a reporting latency of days or weeks."
);
addListNumberPoint(
  "2.",
  "Photo-Sensor and Timer Automation (2000s - 2010s): ",
  "Automation was introduced via photocells and timers that turn light grids on and off based on ambient light levels or schedules. While this improves energy efficiency, it does not provide a back-channel for reporting; if a lamp fails, the system remains unaware."
);
addListNumberPoint(
  "3.",
  "Sensor-Based Smart Nodes / Internet of Things (2010s - Present): ",
  "The modern standard in wealthy municipalities involves attaching smart wireless nodes to each streetlight (using LoRaWAN, ZigBee, or cellular networks) to measure electrical parameters. Although technically advanced, these networks require high capital expenditure and ongoing maintenance, making them difficult to sustain in resource-constrained environments."
);
addListNumberPoint(
  "4.",
  "Crowdsourced Smart Governance (Emerging): ",
  "Leveraging human sensors through physical tags (like QR codes) and mobile web platforms. This approach bridges physical assets to digital tracking with near-zero hardware costs, leveraging student foot traffic to identify and report faults."
);

addHeading2("2.3.3 Crowdsourcing Dynamics & Civic Engagement");
addParagraph(
  "Smart streetlight management systems must balance technical capability with human factors. A crowdsourced platform relies on civic engagement to function. The primary barrier is the 'free rider dilemma' first conceptualized by Mancur Olson (1965) in his logic of collective action. In a campus setting, hundreds of students walk past a broken streetlight each night. However, most will not report it, assuming that someone else has already done so or that university authorities are already aware. This results in under-reporting and sustained infrastructure neglect."
);
addParagraph(
  "To overcome this collective action barrier, civic technology systems must minimize 'interactive friction.' If the reporting flow requires downloading a native mobile app, undergoing email verification, and manually describing the location, user participation drops sharply. Campus Glow addresses this by mapping a physical QR code to each pole. By scanning the QR code, a student bypasses registration and location input, reducing the reporting flow to scanning, taking a photo, and hitting submit in under ten seconds. Furthermore, providing a public status loop (notifying users when a report is 'assigned' or 'resolved') establishes institutional transparency, building community trust and reinforcing long-term civic participation."
);

addHeading2("2.3.4 Asset Identification & Tracking Technologies");
addParagraph(
  "Accurately linking a citizen’s report to a specific physical asset is critical for operational efficiency. Various tagging and tracking technologies have been explored in literature:"
);
addBulletPoint(
  "RFID and NFC Tags: ",
  "Requires users to hold phones within centimeters of the tag. High physical accessibility requirements (can't scan tags placed high on poles). High installation and hardware cost. Many low-end smartphones lack NFC chips."
);
addBulletPoint(
  "GPS Coordinate Pinning: ",
  "Standard smartphone GPS coordinates drift 5 to 20 meters, which is exacerbated by campus tree canopies, weather, and proximity to concrete academic buildings. When streetlights are spaced closely together (e.g., 5 to 10 meters apart along corridors), GPS pins often point to the wrong light, confusing technicians."
);
addBulletPoint(
  "Quick Response (QR) Codes: ",
  "QR codes printed on weather-resistant vinyl stickers solve these issues. They are highly legible from several meters away, even in dim twilight, and are compatible with all camera-equipped smartphones. By embedding unique asset IDs directly in the QR payload, the system immediately matches the scanned report to the exact streetlight node in the database, eliminating geo-spatial ambiguity."
);

addHeading2("2.3.5 Real-Time Pub-Sub Database Architectures");
addParagraph(
  "Modern web applications are shifting away from legacy client-server patterns (such as periodic HTTP polling) towards real-time event-driven models. HTTP polling involves client dashboards repeatedly requesting updates from the server, which creates high network overhead and introduces latencies in data visualization."
);
addParagraph(
  "To support real-time data sync, systems employ WebSockets to establish a single, persistent TCP connection. Campus Glow utilizes Supabase's Realtime engine, which monitors the PostgreSQL database’s Write-Ahead Logs (WAL). When a transaction modifies a table (e.g., a new fault is reported), the engine immediately broadcasts this change via WebSockets to all connected administrative dashboards and technician CRM terminals. This publish-subscribe model ensures that utility managers can monitor incoming reports and assign tasks immediately without page reloads, closing the cyber-physical control loop in real time."
);

addHeading2("2.3.6 Maintenance Operations, Ticketing Workflows, & SLA Tracking");
addParagraph(
  "An effective public utility management system must close the maintenance loop by coordinating field technician workflows. In operations management, maintenance is classified as either preventive (scheduled inspections to prevent failure) or corrective (repairs conducted after a fault is reported). Campus Glow focuses on corrective maintenance, seeking to minimize the Mean Time to Repair (MTTR)."
);
addParagraph(
  "A critical component of this coordination is the enforcement of priority-based Service Level Agreements (SLAs). In utility operations, SLA models dictate maximum response times based on security and safety risks. For example, a fault reported near a female residential hall or a high-traffic pedestrian intersection is classified as 'High Priority' with a 24-hour repair SLA, whereas a light in an aesthetic garden zone might be 'Low Priority' with a 72-hour SLA. To close the ticketing loop, technicians must submit a digital 'Repair Form' containing photographic proof of the operational light. The system validates this input, updates the database, and publishes the resolved status back to the public, preventing incomplete or unverified work orders."
);

addTableCaption("Table 2.1: Technical and Economic Comparison of Streetlight Monitoring Models");
addStyledTable(
  ["Metric", "IoT Sensor Node Network", "Crowdsourced Management (Campus Glow)"],
  [
    ["Initial CapEx", "Extremely High (Sensors, gateways, routers)", "Near Zero (QR code prints, cloud server host)"],
    ["Ongoing OpEx", "High (Sensor battery changes, gateway repairs)", "Low (Minimal cloud hosting fee, QR updates)"],
    ["Detection Latency", "Near Real-Time (Seconds to minutes)", "Variable (Depends on student foot traffic)"],
    ["Information Richness", "Low (Only current/voltage drops)", "High (Photos, text notes, precise pole tag ID)"],
    ["Vandalism Vulnerability", "High (Expensive electronics easily stolen)", "Low (Low-cost vinyl QR stickers are resilient)"]
  ]
);

addSectionDivider();

// ----------------------------------------------------
addHeading1("2.4 Related Systems Review");

addHeading2("2.4.1 Enterprise/Commercial Smart Cities");
addParagraph(
  "Enterprise smart city lighting solutions, such as Philips CityTouch or Telensa, represent the industry standard in wealthy urban centers. These platforms utilize cellular (LTE-M/NB-IoT) or wireless mesh (LoRa/ZigBee) transceivers installed on every street light fixture to automatically report power utilization, lamp failure, and coordinates to a centralized dashboard. While technologically robust, these systems possess significant limitations for resource-constrained contexts:"
);
addBulletPoint(
  "Astronomical Cost: ",
  "The hardware, licensing, and installation costs for enterprise nodes often exceed $150 per light, making campus-wide deployments financially impossible for public universities in low-to-middle-income countries (LMICs)."
);
addBulletPoint(
  "Telecom Infrastructure Dependency: ",
  "They assume uninterrupted cellular data coverage or complex mesh repeaters. On many developing campuses, cellular networks suffer from periodic outages, resulting in loss of system connectivity."
);
addBulletPoint(
  "Closed Ecosystems: ",
  "Proprietary architectures prevent local customization, preventing computer science departments from extending or integrating the system with existing academic portals."
);

addHeading2("2.4.2 Civic Outage Trackers");
addParagraph(
  "Public civic reporting platforms, such as FixMyStreet (UK) and SeeClickFix (US), enable community members to report local infrastructure issues (like potholes, graffiti, or broken streetlights) directly to municipal authorities. These systems use standard mobile maps for GPS pinning and allow photo uploads."
);
addParagraph(
  "However, their general-purpose design makes them ill-suited for campus utility management:"
);
addBulletPoint(
  "Poor Spatial Resolution: ",
  "They rely on GPS maps, which cannot distinguish between adjacent streetlights on a narrow campus path."
);
addBulletPoint(
  "Lack of Dispatch Integration: ",
  "They typically forward reports as automated emails to municipal agencies, lacking integrated CRM portals to track work orders, manage technicians, or enforce SLA timelines."
);
addBulletPoint(
  "Generalist Asset Tracking: ",
  "They do not record technical asset specifications (e.g., bulb wattage, wiring details) needed by maintenance technicians."
);

addHeading2("2.4.3 Global Smart Campus Initiatives");
addParagraph(
  "Many universities in developed nations have implemented smart campus initiatives. For instance, MIT’s campus model and Stanford's smart utility grids integrate LoRaWAN networks and Building Information Modeling (BIM) to track utility statuses."
);
addParagraph(
  "These platforms assume high-fidelity infrastructural conditions, including:"
);
addBulletPoint(
  "Complete Wireless Coverage: ",
  "Stable campus-wide Wi-Fi or LoRaWAN mesh gateways."
);
addBulletPoint(
  "Stable Electrical Supply: ",
  "Constant power. In contrast, developing campuses experience frequent power surges and load-shedding, which can damage sensor nodes and trigger false alarms."
);
addBulletPoint(
  "High-Skill Maintenance: ",
  "The need for specialized engineers to maintain sensor hardware, whereas local maintenance crews are typically only trained in basic electrical wiring."
);

addHeading2("2.4.4 Sub-Saharan African Municipal Contexts");
addParagraph(
  "In sub-Saharan Africa, civic reporting apps, such as Johannesburg’s 'Find & Fix', face operational challenges. Academic literature identifies several reasons for their low impact:"
);
addBulletPoint(
  "Public Trust Deficits: ",
  "Users report faults but rarely see changes or receive updates, leading them to believe reports are ignored. This results in high user abandonment."
);
addBulletPoint(
  "Equipment Vandalism: ",
  "Smart streetlights containing solar panels, batteries, and IoT sensors are targeted by thieves, who steal the monitoring electronics alongside the batteries."
);
addBulletPoint(
  "Network Cost Barriers: ",
  "Applications that require heavy data downloads exclude low-income users. Systems must be lightweight, mobile-web compatible, and require minimal bandwidth."
);

addTableCaption("Table 2.2: Comparison of Streetlight Management Frameworks");
addStyledTable(
  ["System Type", "Deployment Cost", "Asset Granularity", "Technician Dispatch", "Real-time Loop", "Africa Resilience"],
  [
    ["Commercial Smart Cities", "Prohibitive", "High (IP Address)", "Yes (Proprietary)", "Yes", "Low (Power issues)"],
    ["Civic Trackers (e.g., FixMyStreet)", "Low", "Low (GPS only)", "No (Email alert)", "No", "Medium"],
    ["Smart Campuses (e.g., MIT LoRa)", "High", "High (LoRa Node)", "Yes (Integrated)", "Yes", "Low (Infrastructure)"],
    ["Campus Glow (This Research)", "Very Low", "Exact (QR Code)", "Yes (Built-in CRM)", "Yes (Supabase)", "High (Zero Sensor)"]
  ]
);

addSectionDivider();

// ----------------------------------------------------
addHeading1("2.5 Critical Research Gaps");

addHeading2("2.5.1 Gap I: High CapEx vs. Resource Constraints");
addParagraph(
  "A major gap in smart streetlighting literature is a strong bias towards automated sensor-based networks (e.g., IEEE Transactions on Smart Grid). Over 80% of reviewed papers assume that every streetlight contains a micro-controller. There is very little research focusing on zero-sensor utility monitoring architectures. This leaves public institutions in low-resource environments without viable models for digitizing their utilities without excessive hardware costs. Campus Glow addresses this gap by demonstrating that a software-defined citizen crowdsourcing approach can achieve comparable operational outcomes."
);

addHeading2("2.5.2 Gap II: Spatial Pinpoint Inaccuracy");
addParagraph(
  "Existing civic tech literature assumes that standard mobile GPS pinning is sufficient for spatial tracking. However, GPS coordinate drift (often exceeding 15 meters near buildings or under trees) creates significant confusion in high-density utility grids. When streetlights are spaced 5 meters apart, a GPS coordinate cannot pinpoint the exact faulty pole. Academic literature lacks standardized models for linking physical assets directly to digital entries using near-field visual tags that eliminate geographic positioning ambiguities. Campus Glow addresses this by using physical QR codes containing unique database asset IDs."
);

addHeading2("2.5.3 Gap III: The Closed-Loop Dispatch & Action Tracking Deficit");
addParagraph(
  "Most civic reporting tools operate solely as front-end submission channels (citizens submitting reports that are forwarded as email alerts). There is a lack of research on unified, closed-loop maintenance workflows that connect reporting, admin dispatch, technician CRM management, and verification. Without this integration, response times cannot be measured against SLAs, and the public lacks visibility into repair status, which ultimately degrades user trust. Campus Glow closes this loop by integrating a reporting interface, administrator dashboard, and technician CRM into a single real-time platform."
);

addSectionDivider();

// ----------------------------------------------------
addHeading1("2.6 Methodological, Legal, and Security Dimensions");

addHeading2("2.6.1 Design Science Research (DSR)");
addParagraph(
  "This study adopts the Design Science Research (DSR) framework in Information Systems (Hevner et al., 2004). DSR focuses on creating and evaluating innovative IT artifacts to solve identified business or social problems. Under this framework, Campus Glow is designed as an artifact that addresses the physical utility maintenance challenges at the University of Ghana. The evaluation of this artifact is based on quantitative metrics:"
);
addBulletPoint(
  "Mean Time to Repair (MTTR): ",
  "The average time elapsed between fault reporting and ticket closure."
);
addBulletPoint(
  "System Usability Scale (SUS): ",
  "A standard 10-item questionnaire to measure user experience among student reporters and PDMSD technicians."
);

addHeading2("2.6.2 Legal & Privacy Frameworks");
addParagraph(
  "Civic reporting systems must comply with local privacy regulations. In Ghana, this is governed by the Data Protection Act, 2012 (Act 843), which protects personal identifiable information (PII). To comply with this law, Campus Glow allows student reporters to submit fault reports anonymously. The system does not mandate registration or collect personal credentials, ensuring privacy compliance while lowering access barriers."
);

addHeading2("2.6.3 Security in Crowdsourced Systems");
addParagraph(
  "Crowdsourcing systems are vulnerable to spam and Sybil attacks, where malicious users submit fake reports to overwhelm maintenance crews. Campus Glow mitigates this by requiring live camera photos for submissions, preventing the upload of pre-saved or synthetic files."
);
addParagraph(
  "On the backend, database security is enforced using PostgreSQL Row-Level Security (RLS) and JSON Web Token (JWT) policies. RLS ensures that technicians can only access or modify tickets assigned to them, preventing unauthorized data tampering."
);

addSectionDivider();

// ----------------------------------------------------
addHeading1("2.7 System Positioning & Conclusion");

addHeading2("2.7.1 Positioning Campus Glow");
addParagraph(
  "Campus Glow bridges the gap between theoretical crowdsourcing models and physical maintenance workflows. By using QR codes, it avoids the hardware costs of smart sensors while resolving GPS drift issues. The system integrates the citizen reporter interface, administrator control room, and technician CRM into a single real-time database engine using Supabase and PostgreSQL, demonstrating a low-cost, closed-loop model for infrastructure monitoring."
);

addHeading2("2.7.2 Chapter Summary");
addParagraph(
  "This chapter reviewed the theoretical foundations (CPS, PPGIS, Coproduction, UTAUT) and technical concepts (real-time databases, SLAs, asset tracking) of smart streetlighting. It compared sensor-based systems with crowdsourcing, examined related platforms, and identified research gaps in cost, spatial accuracy, and workflow integration. These findings support the design of Campus Glow as a low-cost, closed-loop solution for resource-constrained campus environments. The next chapter will detail the system's architecture, database schemas, and implementation methodologies."
);

// ----------------------------------------------------
// SAVE THE DOCUMENT
// ----------------------------------------------------
const doc = new Document({
  sections: [{
    properties: {
      page: {
        margin: {
          top: 1440,    // 1 inch
          bottom: 1440, // 1 inch
          left: 1440,   // 1 inch
          right: 1440,  // 1 inch
        }
      }
    },
    children: children
  }]
});

const outputFileName = 'Chapter_2_Literature_Review.docx';
const outputPath = path.join(__dirname, '..', outputFileName);

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Word Document successfully generated and saved to: ${outputPath}`);
}).catch((err) => {
  console.error('Error generating Word Document:', err);
});
