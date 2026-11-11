import type { ConceptRubric, Machine, Ticket } from "../types.ts";

function machine(
  asset: string,
  connections: string,
  change: Partial<Machine> = {},
): Machine {
  return {
    asset,
    model: "Riverside desktop",
    cpu: "Intel Core i5, 6 cores",
    ram: "16 GB DDR4",
    storage: "512 GB internal SSD",
    gpu: "Integrated graphics",
    psu: "350 W",
    os: "Windows 11 Education",
    connections,
    ...change,
  };
}

function rubric(
  example: string,
  ...ideas: [prompt: string, terms: string[]][]
): ConceptRubric {
  return {
    groups: ideas.map(([, terms]) => terms),
    criteria: ideas.map(([prompt]) => prompt),
    guidance: ideas.map(([prompt]) => prompt).join(" "),
    example,
  };
}

type Choice = [label: string, feedback: string];
function nextSteps(
  number: number,
  best: Choice,
  alternative: Choice,
  mistake: Choice,
): Ticket["actions"] {
  const choices = [best, alternative, mistake].map(
    ([label, feedback], index) => ({
      id: ["recommend", "alternative", "mistake"][index],
      label,
      feedback,
      correct: index === 0,
    }),
  );
  const start = number % choices.length;
  return [...choices.slice(start), ...choices.slice(0, start)];
}

export const week8Tickets: Ticket[] = [
  {
    id: "w8-001",
    number: 1,
    tier: 1,
    title: "A second screen for the training desk",
    summary: "Choose a display and trace the picture back into the computer.",
    user: "Leah Khan",
    department: "Learning support",
    location: "Training room T12",
    priority: "Normal",
    report:
      "I want to keep a guide open while I work in another window. The second screen is for documents. I do not need touch input and I have a £90 limit for the screen.",
    machine: machine(
      "RS-T12-04",
      "Free HDMI output on the PC. The existing screen uses DisplayPort.",
    ),
    evidence: [
      {
        id: "stock",
        title: "Compare the displays",
        body: "Lab stock offers a 1080p HDMI monitor at an illustrative £74 or a touch display at £216. The PC’s integrated graphics supports two displays at 1080p for this exercise.",
      },
      {
        id: "signal",
        title: "Check what sends the picture",
        body: "The HDMI socket on the PC is an output. The screen’s HDMI socket is an input. The graphics hardware sends the picture before the screen can display it.",
      },
    ],
    expected: ["monitor", "gpu"],
    functionRubric: rubric(
      "The monitor shows the image and the GPU produces the picture.",
      [
        "Describe how the screen presents the picture to the user.",
        ["show", "display", "present", "see", "receiv"],
      ],
      [
        "Describe how the graphics hardware creates or sends the picture.",
        ["render", "generat", "produc", "creat", "send", "suppl", "make"],
      ],
    ),
    reasoningRubric: rubric(
      "The HDMI connection fits both devices and the £74 monitor is within the £90 budget.",
      ["Name the usable connection.", ["hdmi"]],
      [
        "Link the screen to the budget or the user’s document work.",
        ["budget", "74", "90", "document", "window", "extend"],
      ],
    ),
    actions: nextSteps(
      1,
      [
        "Connect HDMI, select HDMI on the screen and move a window onto the extended display.",
        "That confirms both the video connection and the user’s two-screen workflow.",
      ],
      [
        "Choose a touchscreen above budget and test only its touch sensor.",
        "The user needs a second picture within budget. Test the extended desktop.",
      ],
      [
        "Plug the screen into a network socket and check the internet.",
        "The screen needs a compatible video signal. The network socket serves a different job.",
      ],
    ),
    hints: [
      "Find the external part that shows the picture, then the internal hardware that creates it.",
      "Look for the free video output and compare the two prices with the budget.",
    ],
    resolution:
      "Monitor outside, graphics hardware inside. HDMI carries the picture between them. Extended mode gives the user room for two windows.",
  },
  {
    id: "w8-002",
    number: 2,
    tier: 1,
    title: "The pointer has disappeared",
    summary: "Match a receiver-based mouse to the PC’s USB connection.",
    user: "Marcus Bell",
    department: "Reception",
    location: "Main reception R01",
    priority: "High",
    report:
      "I have a wireless mouse with a tiny USB receiver in the battery compartment. The mouse lights up but the pointer does not move. The desktop has no Bluetooth.",
    machine: machine(
      "RS-R01-02",
      "Two working USB-A host ports. No Bluetooth radio.",
    ),
    evidence: [
      {
        id: "receiver",
        title: "Inspect the receiver",
        body: "The mouse communicates with its supplied receiver. The receiver has a rectangular USB-A plug and is currently stored in the mouse.",
      },
      {
        id: "host",
        title: "Inspect the PC’s ports",
        body: "A known working keyboard responds on the desktop’s USB-A port. The motherboard contains the USB controller for these ports.",
      },
    ],
    expected: ["mouse", "motherboard"],
    functionRubric: rubric(
      "The mouse sends clicks and movement. The motherboard USB controller receives that data.",
      [
        "Describe mouse input.",
        ["pointer", "movement", "click", "cursor", "point"],
      ],
      [
        "Describe what receives that input in the PC.",
        ["motherboard", "usb", "controller", "receiv", "passes"],
      ],
    ),
    reasoningRubric: rubric(
      "The USB-A receiver fits the working port and can receive the mouse’s wireless signal.",
      ["Identify the receiver.", ["receiv", "dongle", "adapter"]],
      [
        "Link it to the working port or the wireless signal.",
        ["usb", "port", "wireless", "signal"],
      ],
    ),
    actions: nextSteps(
      2,
      [
        "Plug in the matching USB-A receiver and test movement, clicks and scrolling.",
        "The receiver gives this mouse a working path to the host and the tests cover its basic controls.",
      ],
      [
        "Search for this mouse in Bluetooth settings.",
        "This model uses its own receiver and the desktop has no Bluetooth radio.",
      ],
      [
        "Replace the internal SSD to restore the pointer.",
        "The evidence points to the missing input connection. Storage does a different job.",
      ],
    ),
    hints: [
      "Check the external mouse and the internal board that provides the PC’s USB ports.",
    ],
    resolution:
      "The mouse is the input device. Its receiver brings the signal into the motherboard’s USB controller.",
  },
  {
    id: "w8-003",
    number: 3,
    tier: 1,
    title: "A private call at reception",
    summary:
      "Choose equipment that captures and plays sound through the same USB link.",
    user: "Farah Ali",
    department: "Student services",
    location: "Reception R03",
    priority: "Normal",
    report:
      "Staff need to hear callers privately and reply without using the speakers. We have a wired USB headset in stock and a free USB port on the PC.",
    machine: machine(
      "RS-R03-07",
      "USB-A, audio line-out and a separate microphone jack.",
    ),
    evidence: [
      {
        id: "kit",
        title: "Inspect the headset label",
        body: "The kit is a USB-A headset with headphones and a boom mic. It appears as a digital audio device once connected.",
      },
      {
        id: "audio",
        title: "Inspect the call settings",
        body: "The call app lets staff choose a microphone and speaker separately. The motherboard’s USB controller handles both streams for this headset.",
      },
    ],
    expected: ["headset", "motherboard"],
    functionRubric: rubric(
      "The headphones play sound and the microphone records speech. The motherboard handles both over USB.",
      [
        "Include the listening function.",
        ["headphones", "hear", "listen", "play", "output"],
      ],
      [
        "Include the speaking or recording function.",
        ["microphone", "mic", "voice", "speech", "record", "input"],
      ],
      [
        "Link both directions to the USB controller.",
        ["usb", "controller", "motherboard"],
      ],
    ),
    reasoningRubric: rubric(
      "The USB headset lets Farah hear and speak on the call in private.",
      [
        "Link the choice to privacy.",
        ["privat", "headphone", "quiet", "without speakers"],
      ],
      [
        "Refer to the call or its two sound directions.",
        ["call", "hear", "speak", "voice", "audio", "microphone"],
      ],
    ),
    actions: nextSteps(
      3,
      [
        "Connect USB-A, select the headset as input and output, then make a test call.",
        "Both directions are selected and tested, which meets the request.",
      ],
      [
        "Play a sound through the headset and assume the microphone works.",
        "Playback only verifies the output. Test a spoken reply too.",
      ],
      [
        "Use a desktop speaker and turn it up.",
        "Speakers play sound to the room and do not capture the reply.",
      ],
    ),
    hints: [
      "Choose one device that includes both a microphone and private headphones. Trace its USB connection into the PC.",
    ],
    resolution:
      "The headset has input and output. The motherboard handles digital audio over USB while the headset captures and plays sound.",
  },
  {
    id: "w8-004",
    number: 4,
    tier: 1,
    title: "Turn a paper register into a file",
    summary:
      "Capture a document and identify the part that keeps the saved copy.",
    user: "Jon Reed",
    department: "Records",
    location: "Admin A08",
    priority: "Normal",
    report:
      "I need a clear digital copy of one paper register. The file has to stay in the computer’s approved local folder after a restart. We have a flatbed available.",
    machine: machine(
      "RS-A08-11",
      "USB-A host ports. The scanner’s USB data cable is supplied.",
    ),
    evidence: [
      {
        id: "scan",
        title: "Compare scan settings",
        body: "The flatbed can scan to PDF. Try a 300 dpi sample for readable text. A higher setting can capture more detail and make a larger file.",
      },
      {
        id: "destination",
        title: "Check the saving destination",
        body: "The approved folder is on the workstation’s internal SSD. The document needs to reopen after the scan app is closed and the PC is restarted.",
      },
    ],
    expected: ["scanner", "ssd"],
    functionRubric: rubric(
      "A scanner captures the paper page as digital data. The SSD saves the file after shutdown.",
      [
        "Describe how the page becomes digital.",
        ["scan", "capture", "digital", "image", "digitis"],
      ],
      ["Describe permanent file storage.", ["sav", "stor", "keep", "retain"]],
    ),
    reasoningRubric: rubric(
      "The register starts on paper, so I scan it and save the PDF to the internal SSD to keep it after a restart.",
      [
        "Refer to the paper register or the scan.",
        ["paper", "register", "scan", "pdf"],
      ],
      [
        "Explain why the file needs to be saved persistently.",
        [
          "sav",
          "restart",
          "shutdown",
          "permanent",
          "keep",
          "reopen",
          "folder",
          "retain",
        ],
      ],
    ),
    actions: nextSteps(
      4,
      [
        "Scan a sample, save it to the approved folder and reopen it to check legibility.",
        "That tests image capture, persistence and whether the file is useful to the user.",
      ],
      [
        "Print a blank page and check the ink level.",
        "Printing creates a paper output. This request starts with a paper original to capture.",
      ],
      [
        "Leave the preview open as the only copy.",
        "A preview can be lost when the program closes. Save and reopen the file.",
      ],
    ),
    hints: [
      "The outside device takes in an image. Choose the internal part that holds a saved file when the computer is off.",
    ],
    resolution:
      "A scanner captures input from paper. Internal non-volatile storage keeps the resulting file.",
  },
  {
    id: "w8-005",
    number: 5,
    tier: 1,
    title: "Picture works, touch does not",
    summary: "Trace the missing input path for a check-in kiosk.",
    user: "Chloe Evans",
    department: "Visitor services",
    location: "Kiosk K02",
    priority: "High",
    report:
      "The check-in screen shows the desktop, but a visitor cannot tap the large check-in button. The screen is a touch monitor. Only HDMI and mains power are connected.",
    machine: machine(
      "RS-K02-03",
      "HDMI picture works. One free USB-A host port. Display has USB-B upstream.",
    ),
    evidence: [
      {
        id: "manual",
        title: "Read the display connection instructions",
        body: "This model uses HDMI for the picture. The supplied USB-A to USB-B upstream data cable carries touch back to the PC.",
      },
      {
        id: "paths",
        title: "Identify the missing path",
        body: "The GPU’s video path is already working. The USB controller on the motherboard has a working port for the missing touch input path.",
      },
    ],
    expected: ["touchscreen", "motherboard"],
    functionRubric: rubric(
      "The touchscreen displays the picture and sends taps back to the motherboard’s USB controller.",
      [
        "Describe the screen’s picture output.",
        ["display", "picture", "image", "video", "show"],
      ],
      ["Describe touch input.", ["touch", "tap", "gesture"]],
      [
        "Identify the USB route for touch.",
        ["usb", "motherboard", "controller"],
      ],
    ),
    reasoningRubric: rubric(
      "The picture works over HDMI, but this model needs USB for touch.",
      [
        "Use evidence that the picture path is working.",
        ["hdmi", "picture", "video", "desktop"],
      ],
      [
        "Explain which link the touch path needs.",
        ["usb", "upstream", "data cable"],
      ],
    ),
    actions: nextSteps(
      5,
      [
        "Connect the USB-A to USB-B data cable and test a tap and a drag on the kiosk.",
        "The USB data path restores touch. Testing a tap and drag checks the missing input function.",
      ],
      [
        "Install a second HDMI cable to carry touch.",
        "For this model the HDMI cable already carries the picture. Touch uses USB upstream.",
      ],
      [
        "Replace the graphics card because the touch button does not respond.",
        "The visible picture shows the video path works. Follow the input path.",
      ],
    ),
    hints: [
      "Choose the device that both displays and detects touch. Which internal board provides the USB port?",
      "Separate the video path from the touch data path.",
    ],
    resolution:
      "The screen sends touch through USB to the motherboard. The GPU’s separate HDMI path supplies the picture.",
  },
  {
    id: "w8-006",
    number: 6,
    tier: 1,
    title: "Back up the media project",
    summary:
      "Compare internal and external storage and find the slow connection.",
    user: "Priya Nair",
    department: "Media",
    location: "Edit suite M16",
    priority: "Normal",
    report:
      "The media files live on the computer. I need a removable copy for an approved backup. The new 1 TB portable SSD works, but the copy is slow through the old adapter.",
    machine: machine(
      "RS-M16-06",
      "Rear USB-C rated 10 Gbps. Current adapter is USB 2.0. Internal NVMe SSD.",
      { storage: "1 TB internal NVMe SSD", ram: "32 GB DDR4" },
    ),
    evidence: [
      {
        id: "transfer",
        title: "Check the drive and link ratings",
        body: "The external drive can use a 10 Gbps USB connection with a suitable data cable. The old adapter limits the connection to USB 2.0.",
      },
      {
        id: "files",
        title: "Check the two storage locations",
        body: "The source files are on the internal SSD. The backup is written to the removable external SSD. Keep the original and verify the copy before ejecting.",
      },
    ],
    expected: ["external-ssd", "ssd"],
    functionRubric: rubric(
      "The internal SSD holds the source files and the external SSD stores a removable copy.",
      [
        "Identify the internal drive as the source.",
        ["internal", "source", "original", "inside"],
      ],
      [
        "Describe the external drive’s removable storage role.",
        ["external", "remov", "portable", "backup", "copy"],
      ],
      [
        "Mention the data or files being stored.",
        ["file", "data", "stor", "copy"],
      ],
    ),
    reasoningRubric: rubric(
      "The USB 2.0 adapter limits speed, so a 10 Gbps USB connection and cable can let the drive transfer faster.",
      [
        "Use the USB link evidence.",
        ["usb", "10 gbps", "adapter", "cable", "port"],
      ],
      [
        "Link the port or cable to the speed bottleneck.",
        ["speed", "fast", "slow", "bottleneck", "limit", "transfer"],
      ],
    ),
    actions: nextSteps(
      6,
      [
        "Use the 10 Gbps USB port and suitable cable, copy a sample, reopen it and safely eject.",
        "The faster link addresses the observed bottleneck and reopening the copy tests the backup path.",
      ],
      [
        "Use a USB-C cable labelled charge only because the plug fits.",
        "The backup needs a data cable rated for the required speed.",
      ],
      [
        "Erase the internal SSD after starting the copy.",
        "Keep the source files and verify an approved backup before making changes to originals.",
      ],
    ),
    hints: [
      "The two selected components both store files. One is inside the case and the other can be unplugged.",
      "Read the adapter and host port specifications.",
    ],
    resolution:
      "Internal and external SSDs retain files. The outside drive’s data path can limit transfer performance even when it fits.",
  },
  {
    id: "w8-007",
    number: 7,
    tier: 1,
    title: "A camera for a remote demonstration",
    summary: "Choose a camera and explain how the computer uses its input.",
    user: "Owen Hart",
    department: "Teaching",
    location: "Workshop W05",
    priority: "Low",
    report:
      "The remote class can already hear me. They need to see a close-up of a demonstration. The desktop has a free USB-A data port and a webcam in stock.",
    machine: machine(
      "RS-W05-12",
      "USB-A data available. Existing USB microphone works.",
    ),
    evidence: [
      {
        id: "camera",
        title: "Inspect the webcam",
        body: "The camera can show a 720p/30 fps feed. Its clip or stand can aim at the work area. A camera preview lets you check the lighting and framing.",
      },
      {
        id: "processing",
        title: "Trace the video feed",
        body: "The webcam supplies frames to the PC. The CPU runs the call software and helps process its outgoing feed.",
      },
    ],
    expected: ["webcam", "cpu"],
    functionRubric: rubric(
      "The webcam captures video and the CPU runs the call software and processes the feed.",
      [
        "Describe camera input.",
        ["video", "frame", "image", "captur", "picture"],
      ],
      [
        "Describe the processor’s role.",
        ["cpu", "process", "run", "encod", "execute"],
      ],
    ),
    reasoningRubric: rubric(
      "The learner needs to see the demonstration, so I can connect the webcam over USB and frame the work area.",
      [
        "Link to seeing the demonstration.",
        ["demonstrat", "see", "view", "frame", "close up"],
      ],
      [
        "Name the suitable link or camera feed.",
        ["usb", "video", "webcam", "camera"],
      ],
    ),
    actions: nextSteps(
      7,
      [
        "Connect USB, select the webcam and test its preview on the demonstration area.",
        "That checks both the connection and whether the class can see what matters.",
      ],
      [
        "Replace the working microphone to improve the picture.",
        "The sound already works. The request is for picture input.",
      ],
      [
        "Connect a monitor and assume it sends a camera feed.",
        "A normal monitor displays output. A webcam captures the feed.",
      ],
    ),
    hints: [
      "Pair the outside camera with the internal processor that runs the call software.",
    ],
    resolution:
      "The webcam provides video input. The processor runs the application that uses the feed.",
  },
  {
    id: "w8-008",
    number: 8,
    tier: 1,
    title: "One paper copy for the office",
    summary: "Choose a printer, identify the local queue and check the output.",
    user: "Sofia Malik",
    department: "Admin",
    location: "Office A02",
    priority: "Normal",
    report:
      "We need a printed visitor form. The local printer is powered and has paper. We are setting it up by USB, with a rectangular plug at the PC end and a square plug at the printer.",
    machine: machine(
      "RS-A02-15",
      "USB-A host port. Printer has a USB-B device socket and separate power.",
    ),
    evidence: [
      {
        id: "setup",
        title: "Check the connection and running costs",
        body: "The machine uses USB-A to USB-B and an approved print driver. Stock has the required ink. Staff should factor consumables into future replacement decisions.",
      },
      {
        id: "queue",
        title: "Locate the print queue",
        body: "For this setup Windows spools the print job to its internal SSD before sending the data to the printer.",
      },
    ],
    expected: ["printer", "ssd"],
    functionRubric: rubric(
      "The printer makes a paper copy. The internal SSD holds the queued print job before it is sent.",
      [
        "Describe the printer’s paper output.",
        ["paper", "print", "physical copy", "hard copy"],
      ],
      [
        "Describe temporary queue storage on the drive.",
        ["queue", "spool", "job"],
      ],
      [
        "Identify the storage action or internal drive.",
        ["ssd", "stor", "hold", "sav", "drive"],
      ],
    ),
    reasoningRubric: rubric(
      "USB-A to USB-B links the computer to the printer so it can print the visitor form.",
      ["Name the USB connection.", ["usb"]],
      [
        "Link the choice to the printed form.",
        ["print", "form", "paper", "hard copy"],
      ],
    ),
    actions: nextSteps(
      8,
      [
        "Connect USB-A to USB-B, select the approved printer and print a readable test page.",
        "You checked the connection, the selected queue and the physical output.",
      ],
      [
        "Use HDMI to send the form to the printer.",
        "HDMI is a video connection. Use the printer’s USB data input.",
      ],
      [
        "Stop after the device appears in the settings list.",
        "The device can be listed without producing a correct page. Test the actual output.",
      ],
    ),
    hints: [
      "Choose the external device that makes the paper copy, then the internal drive where this PC queues the job.",
    ],
    resolution:
      "The printer creates the physical output. In this scenario the PC’s internal SSD temporarily holds the queued data.",
  },
];
