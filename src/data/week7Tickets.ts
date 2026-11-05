import type { Machine, Ticket } from "../types.ts";

const machine = (asset: string, changes: Partial<Machine> = {}): Machine => ({
  asset,
  model: "Riverside standard workstation",
  cpu: "Intel Core i5, 6 cores",
  ram: "8 GB DDR4",
  storage: "500 GB SATA SSD",
  gpu: "Integrated graphics",
  psu: "350 W, OEM",
  os: "Windows 11 Education",
  ...changes,
});

const authoredWeek7Tickets: Ticket[] = [
  {
    id: "w7-001",
    number: 1,
    tier: 1,
    title: "A busy morning in Student Services",
    summary:
      "Several applications, one workstation. Identify where the active work is held.",
    user: "Amira Patel",
    department: "Student Services",
    location: "Riverside House · R104",
    priority: "Normal",
    report:
      "I keep a browser, the attendance register and a spreadsheet open at the same time. Our team is making a guide to this PC. Which internal component holds the information those applications are using right now? I need a plain-English explanation for the guide.",
    machine: machine("RC-SS-014"),
    evidence: [
      {
        id: "usage",
        title: "Read the application snapshot",
        body: "Browser, register and spreadsheet are running. Their active data is held in working memory. Saved documents remain on the SSD when the PC is off.",
      },
      {
        id: "power",
        title: "Read the shutdown observation",
        body: "After a full shutdown, applications must be loaded again. Unsaved working data is not permanent.",
      },
    ],
    expected: ["ram"],
    functionRubric: {
      groups: [
        ["temporary", "temporarily", "volatile", "working memory"],
        [
          "data",
          "information",
          "instructions",
          "applications",
          "programs",
          "work",
        ],
      ],
      guidance: "Explain that RAM temporarily holds active application data.",
      example:
        "RAM temporarily holds data and instructions for running applications.",
    },
    reasoningRubric: {
      groups: [
        [
          "running",
          "open",
          "active",
          "multitask",
          "same time",
          "current",
          "using",
          "in use",
          "at once",
          "temporary",
          "temporarily",
          "working memory",
          "working on",
        ],
        [
          "applications",
          "programs",
          "browser",
          "spreadsheet",
          "register",
          "data",
          "information",
          "instructions",
          "work",
        ],
      ],
      guidance:
        "Explain why RAM fits Amira’s request: it holds the work her applications are using now. You do not need to name every application or recommend an upgrade.",
      example:
        "Amira has several applications open. RAM holds the data they are using right now.",
    },
    actions: [
      {
        id: "guide",
        label: "Add an explanation of working memory to the team guide.",
        correct: true,
        feedback:
          "A clear component explanation meets this request; no replacement has been justified.",
      },
      {
        id: "drive",
        label: "Replace the SSD because all open applications are saved there.",
        correct: false,
        feedback:
          "An SSD stores files, but active working data is held in a different component.",
      },
      {
        id: "cpu",
        label: "Replace the CPU before collecting any more information.",
        correct: false,
        feedback:
          "The user asked for an explanation, and no processing fault has been established.",
      },
    ],
    hints: [
      "Think about which component temporarily stores information being actively used by applications.",
      "This component loses its working contents when power is removed.",
    ],
    resolution:
      "RAM holds active application data temporarily. The SSD retains saved files after shutdown.",
  },
  {
    id: "w7-002",
    number: 2,
    tier: 1,
    title: "Who does the calculating?",
    summary:
      "A spreadsheet team needs to understand the workstation’s processing role.",
    user: "Daniel Brooks",
    department: "Finance",
    location: "Riverside House · R208",
    priority: "Low",
    report:
      "Our large budget sheet carries out lots of calculations. I know the data has to be held somewhere, but which part actually follows the program instructions and performs the calculations? Please explain the difference to me.",
    machine: machine("RC-FN-022", { ram: "16 GB DDR4" }),
    evidence: [
      {
        id: "calc",
        title: "Read the workload observation",
        body: "When the sheet recalculates, processor activity rises. There is enough working memory and no disk capacity problem has been reported.",
      },
      {
        id: "flow",
        title: "Read the data flow note",
        body: "Data is loaded into RAM for use. Program instructions then need to be executed to turn that input into results.",
      },
    ],
    expected: ["cpu"],
    functionRubric: {
      groups: [
        [
          "execute",
          "executes",
          "executing",
          "process",
          "performs",
          "carry out",
          "carries out",
        ],
        ["instructions", "calculations", "operations"],
      ],
      guidance:
        "Say that a CPU executes instructions or performs calculations.",
      example: "The CPU executes instructions and performs calculations.",
    },
    reasoningRubric: {
      groups: [
        ["spreadsheet", "budget", "sheet"],
        [
          "calculation",
          "calculate",
          "recalculate",
          "processing",
          "instructions",
        ],
      ],
      guidance: "Connect processing to the budget spreadsheet calculations.",
      example:
        "The budget spreadsheet needs the CPU to process its calculations.",
    },
    actions: [
      {
        id: "explain",
        label:
          "Explain the processor’s role and record it in the support notes.",
        correct: true,
        feedback: "This answers the request without assuming a hardware fault.",
      },
      {
        id: "ram",
        label: "Describe RAM as the component that executes calculations.",
        correct: false,
        feedback:
          "RAM holds active data; it does not execute program instructions.",
      },
      {
        id: "hdd",
        label: "Recommend an HDD to carry out the calculations.",
        correct: false,
        feedback: "Storage retains data rather than executing instructions.",
      },
    ],
    hints: [
      "Separate holding data from carrying out the instructions that use it.",
      "Look for the processor.",
    ],
    resolution:
      "The CPU executes instructions. RAM supports it by holding the active data and instructions.",
  },
  {
    id: "w7-003",
    number: 3,
    tier: 1,
    title: "Mapping the inside of a PC",
    summary: "Identify the platform that connects the workstation’s hardware.",
    user: "Beth Walker",
    department: "Learning Resource Centre",
    location: "Library · L012",
    priority: "Low",
    report:
      "We are labelling an internal-PC display. There is a large circuit board with the processor socket, memory slots and connections for drives and cards. What is that board called, and what is its main job?",
    machine: machine("RC-LR-008"),
    evidence: [
      {
        id: "layout",
        title: "Inspect the board layout note",
        body: "The board carries a CPU socket, two memory slots, a PCIe expansion slot, and SATA connectors. Cables link it to the storage and power supply.",
      },
      {
        id: "compat",
        title: "Read the compatibility note",
        body: "A replacement board must support the CPU socket, memory generation and case form factor.",
      },
    ],
    expected: ["motherboard"],
    functionRubric: {
      groups: [
        ["connect", "communication", "communicate", "links"],
        ["components", "hardware", "cpu", "ram"],
      ],
      guidance:
        "Describe how the motherboard connects hardware so it can communicate.",
      example:
        "The motherboard connects hardware components and allows them to communicate.",
    },
    reasoningRubric: {
      groups: [
        ["socket", "slots", "connections", "connectors"],
        ["board", "cpu", "memory", "drives", "cards"],
      ],
      guidance:
        "Use the reported sockets, slots and drive connections as evidence.",
      example:
        "The board has the CPU socket, memory slots and drive connections described in the report.",
    },
    actions: [
      {
        id: "label",
        label:
          "Label the board and explain its sockets, slots and connections.",
        correct: true,
        feedback: "The label now explains the board’s connecting role.",
      },
      {
        id: "power",
        label: "Label it as the part that converts mains AC to DC.",
        correct: false,
        feedback: "Converting mains power is the PSU’s job.",
      },
      {
        id: "files",
        label: "Label it as the permanent file store.",
        correct: false,
        feedback: "Drives store files; the board connects them to the system.",
      },
    ],
    hints: [
      "Find the main circuit board that other internal components connect to.",
      "Its name refers to the board that brings the system together.",
    ],
    resolution:
      "The motherboard is the main circuit board connecting the workstation hardware.",
  },
  {
    id: "w7-004",
    number: 4,
    tier: 2,
    title: "The long wait to get started",
    summary: "Choose faster permanent storage for a teaching workstation.",
    user: "Nina Hughes",
    department: "Business Studies",
    location: "Teaching Block · B203",
    priority: "Normal",
    report:
      "Starting Windows and opening our teaching resources takes ages. Once everything is open it works well enough. We need a replacement for the existing system drive that keeps our files after shutdown and loads them more quickly.",
    machine: machine("RC-BS-031", {
      storage: "1 TB SATA HDD, 7,200 RPM",
      ram: "16 GB DDR4",
    }),
    evidence: [
      {
        id: "disk",
        title: "Read the startup observation",
        body: "The mechanical system drive stays busy during startup and application loading. Memory use is 45%; the processor is not heavily loaded.",
      },
      {
        id: "migration",
        title: "Read the upgrade constraints",
        body: "The workstation has a compatible SATA connection. Any migration must protect the existing files and be approved by the technician in charge.",
      },
    ],
    expected: ["ssd"],
    functionRubric: {
      groups: [
        ["store", "stores", "storage", "retain", "keeps"],
        [
          "permanent",
          "non volatile",
          "nonvolatile",
          "without power",
          "shutdown",
          "flash",
        ],
      ],
      guidance:
        "Explain that an SSD retains files without power, using flash storage.",
      example:
        "An SSD stores files permanently using flash memory and keeps them without power.",
    },
    reasoningRubric: {
      groups: [
        ["boot", "startup", "load", "opening"],
        ["fast", "quicker", "reduce", "speed", "improve"],
      ],
      guidance: "Connect faster storage to boot and application loading times.",
      example:
        "An SSD can make startup and application loading faster than the current HDD.",
    },
    actions: [
      {
        id: "migrate",
        label:
          "Check compatibility, back up files and plan an approved SSD migration.",
        correct: true,
        feedback:
          "Compatibility and a backup come before changing the system drive.",
      },
      {
        id: "wipe",
        label: "Erase the current drive immediately without a backup.",
        correct: false,
        feedback: "Protect the existing data before any migration.",
      },
      {
        id: "memory",
        label: "Use extra RAM as permanent file storage.",
        correct: false,
        feedback: "RAM normally loses its contents when power is removed.",
      },
    ],
    hints: [
      "The files must survive shutdown; the delay is mainly while loading them.",
      "Look for storage with flash memory and no moving parts.",
    ],
    resolution:
      "An SSD retains files and generally loads the OS and applications faster than a mechanical HDD.",
  },
  {
    id: "w7-005",
    number: 5,
    tier: 2,
    title: "A power plan for an upgrade",
    summary: "Identify the component responsible for stable electrical power.",
    user: "Owen Carter",
    department: "IT Support",
    location: "IT Workshop · W002",
    priority: "High",
    report:
      "A proposed graphics upgrade needs more electrical power and an extra power connector. Which component must we check to make sure the workstation can supply appropriate, stable power? Explain its purpose before we approve any parts.",
    machine: machine("RC-IT-006", {
      gpu: "Planned: dedicated graphics card",
      psu: "300 W OEM; no spare GPU power connector",
    }),
    evidence: [
      {
        id: "rating",
        title: "Read the power specification",
        body: "The planned card manufacturer recommends a 550 W system supply with a specified PCIe power connector. The current supply is rated 300 W.",
      },
      {
        id: "safe",
        title: "Read the workshop instruction",
        body: "The PSU converts mains AC into regulated DC. Learners must not open its casing; even a disconnected unit can contain hazardous stored charge.",
      },
    ],
    expected: ["psu"],
    functionRubric: {
      groups: [
        ["convert", "converts", "supplies", "supply", "provides"],
        ["power", "electricity", "electrical"],
        ["dc", "regulated", "stable", "voltage"],
      ],
      guidance:
        "Explain the supply of stable DC power, converted from mains AC.",
      example:
        "The PSU converts mains AC to regulated DC power for computer components.",
    },
    reasoningRubric: {
      groups: [
        ["300", "550", "watts", "watt", "connector", "capacity"],
        ["upgrade", "graphics", "card", "power"],
      ],
      guidance:
        "Use the existing rating or missing connector to explain the upgrade requirement.",
      example:
        "The graphics upgrade needs a higher power rating and a connector the 300 W unit lacks.",
    },
    actions: [
      {
        id: "check",
        label:
          "Check total power, form factor and connectors; refer replacement to a qualified technician.",
        correct: true,
        feedback: "A suitable complete replacement can be planned safely.",
      },
      {
        id: "open",
        label: "Open the PSU casing to add an extra connector.",
        correct: false,
        feedback:
          "Never open the PSU casing. Refer the complete unit to a qualified technician.",
      },
      {
        id: "ignore",
        label: "Assume any PSU will work if it fits the case.",
        correct: false,
        feedback: "Output capacity and compatible connectors also matter.",
      },
    ],
    hints: [
      "Look for the component that supplies regulated power to all the others.",
      "Its output is rated in watts. Do not open its casing.",
    ],
    resolution:
      "The PSU supplies appropriate regulated DC power. Check capacity and connectors before the upgrade.",
  },
  {
    id: "w7-006",
    number: 6,
    tier: 2,
    title: "More detail, fewer frames",
    summary: "Identify the graphics component behind real-time 3D rendering.",
    user: "Lucas Evans",
    department: "Games Design",
    location: "Creative Centre · C301",
    priority: "Normal",
    report:
      "Our 3D scene is smooth with a simple preview but slows down when we enable detailed lighting and higher resolution. Which component is mainly responsible for rendering those images? We want to understand what a graphics expansion card adds.",
    machine: machine("RC-GD-019", {
      ram: "32 GB DDR4",
      gpu: "Integrated graphics",
      psu: "550 W",
    }),
    evidence: [
      {
        id: "render",
        title: "Read the preview comparison",
        body: "The detailed scene needs more graphics processing. Processor use is moderate; system memory has spare capacity. Lowering rendering detail improves the frame rate.",
      },
      {
        id: "slot",
        title: "Read the expansion note",
        body: "The motherboard has a PCIe graphics slot. Any dedicated card must also fit the case and have suitable power support.",
      },
    ],
    expected: ["gpu"],
    functionRubric: {
      groups: [
        ["render", "renders", "process", "generates"],
        ["graphics", "images", "3d", "visual", "video"],
      ],
      guidance:
        "Describe how a GPU processes graphics or renders images and 3D scenes.",
      example: "The GPU processes graphics and renders 3D images for display.",
    },
    reasoningRubric: {
      groups: [
        ["scene", "lighting", "detail", "resolution", "frame"],
        ["graphics", "render", "3d", "gpu"],
      ],
      guidance: "Link the detailed scene or frame rate to graphics rendering.",
      example:
        "The detailed 3D scene needs more graphics rendering work, reducing frame rate.",
    },
    actions: [
      {
        id: "plan",
        label:
          "Check software, slot, case and power requirements before recommending a graphics card.",
        correct: true,
        feedback: "The recommendation considers the complete workstation.",
      },
      {
        id: "network",
        label: "Install a network card to render the scene.",
        correct: false,
        feedback:
          "A network card transfers network data rather than rendering graphics.",
      },
      {
        id: "drive",
        label: "Replace storage solely because the live preview is detailed.",
        correct: false,
        feedback:
          "The evidence points to real-time rendering rather than file loading.",
      },
    ],
    hints: [
      "The work changes when visual detail and resolution increase.",
      "Consider the processor dedicated to rendering graphics.",
    ],
    resolution:
      "The GPU processes graphics. A compatible graphics expansion card can support demanding 3D rendering.",
  },
  {
    id: "w7-007",
    number: 7,
    tier: 3,
    title: "Room for the media archive",
    summary: "Recommend storage for a large, infrequently accessed archive.",
    user: "Grace Bennett",
    department: "Media Production",
    location: "Creative Centre · C114",
    priority: "Normal",
    report:
      "We need 8 TB for completed video projects that are opened only occasionally. The OS and current projects already run from an SSD. The new archive should keep files after shutdown and offer good capacity for a tight budget.",
    machine: machine("RC-MP-027", {
      storage: "1 TB NVMe SSD, 600 GB free",
      ram: "32 GB DDR4",
      psu: "650 W",
    }),
    evidence: [
      {
        id: "budget",
        title: "Read the purchasing comparison",
        body: "For this exercise, the approved 8 TB SATA HDD is within the archive budget; an 8 TB SSD is over budget. The archive is not used for live editing.",
      },
      {
        id: "backup",
        title: "Read the storage and backup note",
        body: "The case has a free 3.5-inch bay and SATA ports. A separate backup policy is still needed; adding one disk does not make a backup.",
      },
    ],
    expected: ["hdd"],
    functionRubric: {
      groups: [
        ["store", "stores", "storage", "retain", "keeps"],
        ["magnetic", "platter", "permanent", "shutdown", "without power"],
      ],
      guidance:
        "Explain permanent storage, ideally mentioning magnetic platters.",
      example: "An HDD stores files permanently on magnetic platters.",
    },
    reasoningRubric: {
      groups: [
        ["archive", "occasion", "infrequent", "completed"],
        ["budget", "capacity", "8 tb", "8tb", "cost", "cheap"],
      ],
      guidance:
        "Link the infrequent archive access and capacity or budget requirement.",
      example:
        "The infrequent archive needs 8 TB capacity within the budget rather than maximum speed.",
    },
    actions: [
      {
        id: "archive",
        label:
          "Recommend a compatible archive HDD and confirm a separate backup plan.",
        correct: true,
        feedback:
          "The recommendation matches capacity, use and budget while protecting the work.",
      },
      {
        id: "ram",
        label: "Use 8 TB of working memory as the permanent archive.",
        correct: false,
        feedback: "Working memory does not retain files without power.",
      },
      {
        id: "ssd",
        label:
          "Buy the over-budget SSD without considering the archive workload.",
        correct: false,
        feedback:
          "The purchasing evidence sets a budget and explains why maximum speed is not required.",
      },
    ],
    hints: [
      "The active projects already use fast storage. This request is about archive capacity and cost.",
      "A mechanical magnetic drive suits this exercise’s archive budget.",
    ],
    resolution:
      "An HDD offers appropriate permanent archive capacity within the stated budget. It still needs a separate backup.",
  },
  {
    id: "w7-008",
    number: 8,
    tier: 3,
    title: "Keeping the processor comfortable",
    summary:
      "Match a cooling recommendation to a sustained processing workload.",
    user: "Ella Morgan",
    department: "Engineering",
    location: "Engineering Centre · E207",
    priority: "High",
    report:
      "During a long simulation, the processor gets too hot and reduces its speed. Case airflow has already been checked. Which part transfers heat directly away from the processor? Should we automatically choose liquid cooling?",
    machine: machine("RC-EN-041", {
      cpu: "Intel Core i7, 12 cores",
      ram: "32 GB DDR4",
      psu: "650 W",
    }),
    evidence: [
      {
        id: "thermal",
        title: "Read the thermal observation",
        body: "The CPU temperature rises under sustained load. Other internal temperatures are normal. The CPU heatsink and its fan need inspection by the workshop technician.",
      },
      {
        id: "options",
        title: "Read the cooler options",
        body: "An approved compatible air cooler meets this processor’s cooling requirement. Liquid cooling is an option only when justified by compatibility, cooling needs and maintenance arrangements.",
      },
    ],
    expected: ["cpu-cooling"],
    functionRubric: {
      groups: [
        ["heat", "temperature", "cool"],
        ["cpu", "processor"],
        ["transfer", "remove", "away", "reduce", "dissipat", "keeps"],
      ],
      guidance: "Explain how the cooler transfers heat away from the CPU.",
      example:
        "CPU cooling transfers heat away from the processor to keep its temperature safe.",
    },
    reasoningRubric: {
      groups: [
        ["load", "simulation", "sustained", "hot", "overheat"],
        ["cpu", "processor"],
      ],
      guidance:
        "Connect the processor’s temperature under sustained load to its cooler.",
      example:
        "The CPU becomes hot during the sustained simulation, while case temperatures are normal.",
    },
    actions: [
      {
        id: "air",
        label:
          "Arrange a safe cooler inspection; choose compatible cooling, with air cooling sufficient here.",
        correct: true,
        feedback:
          "The evidence supports a suitable air cooler. Liquid cooling is not automatically required.",
      },
      {
        id: "liquid",
        label: "Fit liquid cooling immediately because it is always better.",
        correct: false,
        feedback:
          "A compatible air cooler meets the requirement here. Liquid cooling needs a reasoned choice.",
      },
      {
        id: "stopfan",
        label: "Disable the processor fan to remove noise.",
        correct: false,
        feedback: "Removing cooling can cause overheating and damage.",
      },
    ],
    hints: [
      "The processor is hot, but case airflow has already been checked.",
      "Consider the heatsink and fan attached to the CPU, or a suitable liquid cooler.",
    ],
    resolution:
      "CPU cooling transfers heat away from the processor. The suitable air cooler meets this scenario’s need.",
  },
  {
    id: "w7-009",
    number: 9,
    tier: 3,
    title: "Warm air with nowhere to go",
    summary: "Recommend a way to move air through the whole workstation.",
    user: "Mason Reed",
    department: "Digital Technologies",
    location: "Technology Block · T102",
    priority: "High",
    report:
      "A workstation is warm around the graphics card and drives as well as the processor. The CPU cooler is operating correctly. The rear vent is blocked by folders and the case exhaust fan has stopped. Which cooling area should we address?",
    machine: machine("RC-DT-053", {
      gpu: "Dedicated 6 GB graphics card",
      psu: "550 W",
    }),
    evidence: [
      {
        id: "airflow",
        title: "Read the airflow observation",
        body: "Warm air is building up inside the case. The CPU cooler works, but the stopped exhaust fan cannot remove warm air through the rear vent.",
      },
      {
        id: "procedure",
        title: "Read the safe next-step note",
        body: "Stop the workload and follow the workshop shutdown and isolation procedure. Keep ventilation clear and refer the failed fan for a compatible replacement.",
      },
    ],
    expected: ["case-cooling"],
    functionRubric: {
      groups: [
        ["air", "airflow"],
        ["case", "chassis"],
        ["move", "remov", "exhaust", "circulat", "intake", "bring"],
      ],
      guidance:
        "Describe case fans moving air through the case and removing warm air.",
      example: "Case cooling moves air through the case and removes warm air.",
    },
    reasoningRubric: {
      groups: [
        ["vent", "exhaust", "fan", "blocked"],
        ["warm", "heat", "air", "stopped"],
      ],
      guidance:
        "Use the blocked vent or stopped exhaust fan to explain the heat buildup.",
      example:
        "The blocked vent and stopped exhaust fan let warm air build up around several components.",
    },
    actions: [
      {
        id: "clear",
        label:
          "Stop the workload, follow safe isolation, clear ventilation and arrange a case-fan replacement.",
        correct: true,
        feedback: "The next step addresses airflow and the failed fan safely.",
      },
      {
        id: "cpu",
        label:
          "Replace only the functioning CPU cooler and leave the vent blocked.",
        correct: false,
        feedback:
          "The report says the CPU cooler works; the whole-case airflow is restricted.",
      },
      {
        id: "ignore",
        label: "Keep running the heavy workload while the case heats up.",
        correct: false,
        feedback: "Stop the workload and follow the safe workshop procedure.",
      },
    ],
    hints: [
      "Several components are warm; the processor cooler itself works.",
      "Think about intake, exhaust and airflow through the case.",
    ],
    resolution:
      "Case cooling maintains airflow through the whole case. A working CPU cooler alone cannot remove trapped warm air.",
  },
  {
    id: "w7-010",
    number: 10,
    tier: 4,
    title: "Fast storage, crowded working space",
    summary:
      "Use the evidence to distinguish memory pressure from file storage.",
    user: "Zara Ali",
    department: "Digital Marketing",
    location: "Riverside House · R215",
    priority: "Normal",
    report:
      "The PC has a fairly new SSD, so I thought it would handle anything. It slows down when I have many browser tabs, an image editor and a meeting open. A colleague suggested a bigger drive. Which component is the best match for the evidence?",
    machine: machine("RC-DM-063", {
      ram: "8 GB DDR4",
      storage: "1 TB NVMe SSD, 700 GB free",
    }),
    evidence: [
      {
        id: "memory",
        title: "Read the resource snapshot",
        body: "Memory is at 96% with the normal workload. Storage has 700 GB free. Processor and graphics use are moderate. Closing applications reduces the slowdown.",
      },
      {
        id: "capacity",
        title: "Read the compatibility result",
        body: "The motherboard supports 16 GB or 32 GB of compatible RAM. The storage capacity is sufficient for the current workload.",
      },
    ],
    expected: ["ram"],
    functionRubric: {
      groups: [
        ["temporary", "temporarily", "working memory", "volatile"],
        ["data", "applications", "programs", "information", "work"],
      ],
      guidance: "Describe temporary memory for active application data.",
      example:
        "RAM is temporary working memory for active applications and their data.",
    },
    reasoningRubric: {
      groups: [
        ["96", "memory", "ram"],
        ["applications", "tabs", "open", "multitask"],
        ["ssd", "storage", "700", "drive"],
      ],
      guidance:
        "Use high memory use and the open apps, and distinguish the SSD’s spare storage.",
      example:
        "Memory is at 96% with many applications open, while the SSD has spare storage.",
    },
    actions: [
      {
        id: "ram",
        label:
          "Confirm compatible RAM capacity and recommend an approved memory upgrade.",
        correct: true,
        feedback:
          "The resource snapshot supports more working memory, subject to compatibility.",
      },
      {
        id: "drive",
        label: "Buy a bigger drive solely because many applications are open.",
        correct: false,
        feedback:
          "The current drive has spare capacity; the evidence points to working-memory pressure.",
      },
      {
        id: "gpu",
        label: "Replace the graphics card despite moderate graphics use.",
        correct: false,
        feedback: "The snapshot does not establish a graphics limitation.",
      },
    ],
    hints: [
      "Compare memory use with free drive capacity and what changes when apps close.",
      "The SSD has room; the temporary working space is almost full.",
    ],
    resolution:
      "RAM is the strongest recommendation here. The evidence distinguishes high working-memory use from adequate SSD capacity.",
  },
  {
    id: "w7-011",
    number: 11,
    tier: 4,
    title: "Two jobs, two kinds of storage",
    summary:
      "Build a balanced storage recommendation for startup and archiving.",
    user: "Theo Clarke",
    department: "Photography",
    location: "Creative Centre · C108",
    priority: "Normal",
    report:
      "We need a new workstation storage plan: quick startup and application loading, plus 8 TB of completed photo projects. We rarely open the archive. The purchasing list permits a smaller fast drive and a larger low-cost drive. Select both components and explain their different jobs.",
    machine: machine("RC-PH-072", {
      storage: "Existing 1 TB HDD; replacement plan requested",
      ram: "16 GB DDR4",
      psu: "550 W",
    }),
    evidence: [
      {
        id: "plan",
        title: "Read the purchasing options",
        body: "The approved plan can include a 500 GB SSD for the OS and applications plus an 8 TB HDD for completed projects. An 8 TB SSD alone exceeds this exercise’s budget.",
      },
      {
        id: "fit",
        title: "Read the compatibility and backup note",
        body: "Both SATA drives are compatible with the case and motherboard. Archive data must also have a separate backup. Two drives with different jobs do not automatically provide redundancy.",
      },
    ],
    expected: ["ssd", "hdd"],
    functionRubric: {
      groups: [
        ["ssd", "solid state"],
        ["hdd", "hard disk"],
        ["store", "storage", "files", "permanent"],
      ],
      guidance:
        "Explain that both SSD and HDD retain files, with different storage technologies or roles.",
      example:
        "An SSD and an HDD both provide permanent file storage; the SSD uses flash and the HDD magnetic platters.",
    },
    reasoningRubric: {
      groups: [
        ["boot", "startup", "applications", "loading"],
        ["archive", "completed", "photos"],
        ["budget", "cost", "capacity", "8 tb", "8tb"],
      ],
      guidance:
        "Separate fast startup from the large archive’s capacity and budget needs.",
      example:
        "The SSD speeds startup and application loading; the HDD holds the archive capacity within budget.",
    },
    actions: [
      {
        id: "two",
        label:
          "Plan the SSD for OS/apps and HDD for the archive, with migration and separate backups.",
        correct: true,
        feedback:
          "Each drive has a justified role and existing files are protected.",
      },
      {
        id: "ram",
        label: "Use RAM for the archive and skip permanent storage.",
        correct: false,
        feedback: "RAM does not retain the archive without power.",
      },
      {
        id: "backup",
        label: "Install both drives and treat them as an automatic backup.",
        correct: false,
        feedback: "Separate storage roles are not a backup strategy.",
      },
    ],
    hints: [
      "This request has two different workloads. You need two component selections.",
      "Pair flash-based storage for loading with magnetic storage for archive capacity.",
    ],
    resolution:
      "Use an SSD for the OS and applications and an HDD for the large archive, with a separate backup plan.",
  },
  {
    id: "w7-012",
    number: 12,
    tier: 4,
    title: "A graphics upgrade is a system decision",
    summary:
      "Select the performance component and the supporting power component.",
    user: "Isla Robinson",
    department: "Games Design",
    location: "Creative Centre · C302",
    priority: "High",
    report:
      "This PC needs smoother real-time 3D previews. It currently uses integrated graphics, and the proposed graphics card needs a 550 W supply and a power connector our 300 W unit lacks. Select the two components central to the recommendation, then explain why we must plan them together.",
    machine: machine("RC-GD-084", {
      cpu: "Intel Core i7, 8 cores",
      ram: "32 GB DDR4",
      gpu: "Integrated graphics",
      psu: "300 W OEM; no dedicated GPU connector",
    }),
    evidence: [
      {
        id: "graphics",
        title: "Read the workload and fit check",
        body: "The detailed preview is limited by graphics rendering. CPU and RAM are adequate. The approved graphics card fits the case and PCIe slot; case cooling has already been checked.",
      },
      {
        id: "power",
        title: "Read the power and procurement note",
        body: "The manufacturer’s system recommendation is 550 W with a specified card power connector. The current 300 W supply cannot meet the stated plan. A compatible complete PSU replacement must be handled by the workshop.",
      },
    ],
    expected: ["gpu", "psu"],
    functionRubric: {
      groups: [
        ["graphics", "render", "3d"],
        ["power", "electricity", "voltage"],
        ["gpu", "graphics card"],
        ["psu", "power supply"],
      ],
      guidance:
        "Explain both jobs: the GPU renders graphics and the PSU supplies stable power.",
      example:
        "The GPU renders graphics, while the PSU supplies regulated power to the components.",
    },
    reasoningRubric: {
      groups: [
        ["preview", "3d", "render", "graphics"],
        ["300", "550", "connector", "rating"],
        ["power", "psu", "supply"],
      ],
      guidance:
        "Link graphics performance to the power rating or connector limitation.",
      example:
        "The graphics card improves 3D preview rendering, but the 300 W power supply lacks the required connector and rating.",
    },
    actions: [
      {
        id: "paired",
        label:
          "Recommend the compatible GPU and PSU together, with approved workshop installation.",
        correct: true,
        feedback:
          "The plan addresses graphics performance and the supporting electrical requirement.",
      },
      {
        id: "gpu-only",
        label:
          "Order only the card and assume the existing power supply will cope.",
        correct: false,
        feedback:
          "The existing supply does not meet the stated rating and connector requirement.",
      },
      {
        id: "psu-only",
        label: "Replace only the PSU and promise faster 3D rendering.",
        correct: false,
        feedback: "The PSU supports the upgrade but does not render graphics.",
      },
    ],
    hints: [
      "One component handles the visual work; another must support its electrical needs.",
      "Select both the graphics processor/card and the power supply.",
    ],
    resolution:
      "Recommend a GPU for rendering and a compatible PSU for its power requirements. A workstation upgrade needs supporting components.",
  },
];

// Stable variation prevents the first next-step option always being the answer.
export const week7Tickets: Ticket[] = authoredWeek7Tickets.map((ticket) => {
  const split = ticket.number % ticket.actions.length;
  return {
    ...ticket,
    actions: [
      ...ticket.actions.slice(split),
      ...ticket.actions.slice(0, split),
    ],
  };
});
