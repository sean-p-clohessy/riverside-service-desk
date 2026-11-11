import type { ComponentInfo } from "../types.ts";

export const gatewayHardwareUnit =
  "https://www.gatewayqualifications.org.uk/unit/159013/";
export const priceSnapshotDate = "11 November 2026";

export const ports = [
  {
    id: "usb-a",
    name: "USB-A",
    type: "Data and power",
    shape: "Wide rectangle with a flat tongue. The plug goes in one way.",
    use: "Connects keyboards, mice, webcams, flash drives and USB receivers to a host.",
    check:
      "The shape alone gives no speed rating. Check the port and cable specifications before using a fast drive.",
  },
  {
    id: "usb-b",
    name: "USB-B",
    type: "Data and power",
    shape:
      "Nearly square with two bevelled top corners on the common USB 2.0 plug.",
    use: "Often the device end of a printer cable or the upstream link on a touchscreen.",
    check:
      "A USB-A to USB-B cable links the computer’s host port to the device. Many printers have a separate power lead.",
  },
  {
    id: "usb-c",
    name: "USB-C",
    type: "Data, power or video",
    shape: "Small rounded rectangle. The plug is reversible.",
    use: "Connects phones, drives and docks. A supported port and cable can also carry video or charging power.",
    check:
      "Look up the host, device and cable capabilities. A USB-C port that supports charging or data may lack video output.",
    source: "https://usb.org/cable_connector",
  },
  {
    id: "thunderbolt",
    name: "Thunderbolt",
    type: "Data, display and power",
    shape:
      "Recent Thunderbolt versions use the USB-C shape. Check the lightning symbol and specification.",
    use: "A compatible port and cable can link a dock, display or fast external drive.",
    check:
      "Confirm the Thunderbolt version and display support at both ends. A matching USB-C shape does not establish Thunderbolt support.",
    source:
      "https://www.intel.com/content/www/us/en/architecture-and-technology/thunderbolt/overview.html",
  },
  {
    id: "hdmi",
    name: "HDMI",
    type: "Digital video and audio",
    shape: "Wide, shallow opening with bevelled lower corners.",
    use: "Sends picture and sound from a computer or console to a monitor, projector or television.",
    check:
      "Use an output on the source and an input on the screen. Select the corresponding input. Confirm the cable and devices support the required resolution and refresh rate.",
  },
  {
    id: "displayport",
    name: "DisplayPort",
    type: "Digital video and audio",
    shape: "Mostly rectangular with a clipped corner on full-size DisplayPort.",
    use: "Connects many graphics outputs to monitors. Some plugs have a release latch.",
    check:
      "Match the port and cable to the resolution and refresh rate. If a plug latches, release it before pulling.",
  },
  {
    id: "vga",
    name: "VGA",
    type: "Analogue video",
    shape: "Trapezoid with 15 contacts in three rows and screw posts.",
    use: "Connects older monitors and projectors. Sound needs a separate path.",
    check:
      "Check that a digital-to-VGA adapter actively converts the signal and works in the direction you need.",
  },
  {
    id: "dvi",
    name: "DVI",
    type: "Legacy video",
    shape:
      "Wide connector with a pin grid, flat blade and screws. Pin layouts vary by type.",
    use: "Found on older displays and graphics cards. DVI-D carries digital video.",
    check:
      "Check which DVI variant is present. An analogue adapter cannot use analogue pins that the port does not provide.",
  },
  {
    id: "esata",
    name: "eSATA",
    type: "External storage data",
    shape: "Slim keyed rectangular opening with a flat contact strip.",
    use: "Connects compatible older external drives to a SATA storage controller.",
    check:
      "A standard eSATA connection carries data. Check whether the enclosure needs its own power supply.",
  },
  {
    id: "rj45",
    name: "RJ-45",
    type: "Wired networking",
    shape: "Modular plug with a locking clip and eight contacts.",
    use: "Connects a computer’s Ethernet interface to a switch, router or network wall socket.",
    check:
      "Check for a link light, then test access to an approved network resource. A link light alone does not prove internet access.",
  },
  {
    id: "rj11",
    name: "RJ-11",
    type: "Telephone or modem line",
    shape: "A narrower modular plug with fewer contacts than an Ethernet plug.",
    use: "Used for some telephone, DSL modem and legacy dial-up connections.",
    check:
      "Read the socket label. Connect to the correct line or modem socket and avoid forcing it into Ethernet hardware.",
  },
  {
    id: "audio",
    name: "3.5 mm audio",
    type: "Analogue sound",
    shape:
      "Small circular jack. The plug has metal sections separated by insulating rings.",
    use: "Connects headphones, powered speakers or microphones. Some sockets combine headphones and microphone.",
    check:
      "Check the headphone, line-out or microphone symbol. A split-jack PC may need a suitable splitter for a combined headset.",
  },
  {
    id: "power",
    name: "Power",
    type: "Electrical supply",
    shape:
      "Mains inlets and DC adapter sockets have different shapes. Read the label beside the socket.",
    use: "Provides power to the computer or independently powered peripherals such as screens, printers and speakers.",
    check:
      "Use an approved supply with the correct connector and electrical rating. Check the lead for visible damage before use.",
  },
  {
    id: "bluetooth",
    name: "Bluetooth",
    type: "Wireless data",
    shape: "Look for a Bluetooth symbol or the device’s pairing control.",
    use: "Connects a keyboard, mouse, headset or speakers to a compatible Bluetooth radio.",
    check:
      "Check power and pairing mode. Choose the intended device and confirm the correct input or output in settings.",
  },
  {
    id: "wifi",
    name: "Wi-Fi",
    type: "Wireless networking",
    shape: "A wireless network connection selected in device settings.",
    use: "Links compatible devices such as a shared printer or smart TV to a network.",
    check:
      "Check the network name and connection. A USB wireless receiver and a Wi-Fi network serve different purposes.",
  },
] as const;

export type PortId = (typeof ports)[number]["id"];
type DeviceClass = "Input" | "Output" | "Input and output" | "External storage";
export interface Peripheral extends ComponentInfo {
  category: DeviceClass;
  tile: number;
  look: string;
  connections: PortId[];
  connect: string;
  inside: string;
  relationship: string;
  price: { gbp: number; model: string; source: string; url: string };
  cost: string;
  test: string;
}

export const peripherals: Peripheral[] = [
  {
    id: "keyboard",
    name: "Keyboard",
    shortName: "Keyboard",
    category: "Input",
    diagram: "keyboard",
    tile: 0,
    look: "Rows of letter, number and function keys. A full-size board often has a number pad on the right.",
    function: "Sends key presses and shortcuts to the computer.",
    need: "Typing and shortcuts are central to office work. A compact keyboard saves space, while a number pad helps with repeated number entry.",
    specs:
      "Compare UK and US layouts, full-size and compact boards, and membrane and mechanical switches. For data entry, layout and comfort usually matter more than a gaming polling rate.",
    connections: ["usb-a", "usb-c", "bluetooth"],
    connect:
      "A wired model usually plugs into USB. Wireless models can pair over Bluetooth or use their own USB receiver.",
    inside: "motherboard",
    relationship:
      "The motherboard’s USB controller passes key events to the operating system. The keyboard sends the input from outside the case.",
    misconception:
      "A wireless receiver may use USB without using Bluetooth. Check which connection the keyboard actually supports.",
    price: {
      gbp: 12.99,
      model: "Logitech K120 wired keyboard",
      source: "Logitech UK",
      url: "https://www.logitech.com/en-gb/shop/p/k120-usb-standard-computer.920-002491",
    },
    cost: "Check the keyboard layout and size. Wireless support, switches and accessibility features can affect the cost.",
    test: "Type a short sentence, numbers and a shortcut in a test document. Check symbols match the selected UK layout.",
  },
  {
    id: "mouse",
    name: "Mouse and pointing devices",
    shortName: "Mouse",
    category: "Input",
    diagram: "mouse",
    tile: 1,
    look: "A mouse has buttons, a scroll wheel and a sensor underneath. A trackpad is a flat touch surface and a joystick has a stick for direction.",
    function:
      "Sends movement, clicks or gestures so a user can point, select and control items on screen.",
    need: "Choose a device the user can control comfortably. Trackballs, touchpads or joysticks can suit different tasks and access needs.",
    specs:
      "DPI describes how much movement the sensor reports over a distance. Around 1,000 DPI can suit everyday office work. Higher sensitivity can move the pointer further, and users can also adjust pointer speed.",
    connections: ["usb-a", "usb-c", "bluetooth"],
    connect:
      "Connect a cable or the mouse’s own USB receiver, or pair a Bluetooth model. Wireless models also need power.",
    inside: "motherboard",
    relationship:
      "A USB controller or Bluetooth radio receives movement and clicks. The operating system uses those events to move the pointer.",
    misconception:
      "Higher DPI changes sensitivity. Comfort, tracking surface and control settings still matter.",
    price: {
      gbp: 12.99,
      model: "Logitech M185 with USB receiver",
      source: "Argos",
      url: "https://www.argos.co.uk/product/7795916",
    },
    cost: "Basic wired and wireless mice cover everyday pointing. Ergonomics, extra controls and adjustable sensors can raise the price.",
    test: "Move the pointer, click an icon and scroll a page. For a receiver model, confirm the matching receiver is connected.",
  },
  {
    id: "scanner",
    name: "Flatbed scanner",
    shortName: "Scanner",
    category: "Input",
    diagram: "scan",
    tile: 2,
    look: "A shallow box with a hinged lid and a sheet of glass for placing the original face down.",
    function:
      "Captures an image of a paper document or photograph as digital data.",
    need: "A scanner lets records staff digitise existing paper. OCR software can turn a clear scan of printed text into searchable text.",
    specs:
      "DPI is the number of sampled dots per inch. Try 300 dpi for ordinary text and compare with 600 dpi for fine detail. More detail often increases file size and scan time. The V39II is rated up to 4,800 dpi optical.",
    connections: ["usb-a", "usb-c", "wifi"],
    connect:
      "A flatbed can use a USB data cable, while some office models share scans over a network. Check the driver and supported operating system.",
    inside: "ssd",
    relationship:
      "The scanner supplies the image. The computer processes it and saves the chosen PDF or image file to internal storage.",
    misconception:
      "A scan is initially a digital image. Editable or searchable text needs OCR or another conversion step.",
    price: {
      gbp: 113.98,
      model: "Epson Perfection V39II A4 flatbed",
      source: "Currys Business, incl. VAT",
      url: "https://business.currys.co.uk/catalogue/printers/scanners/epson-perfection-v39ii-flatbed-scanner-desktop-usb-2-0/P316691P",
    },
    cost: "Compare page size, optical resolution and how many originals staff need to scan. An automatic document feeder costs more and can save staff time.",
    test: "Scan a sample page, save it in the specified folder and reopen it. Check the whole page is legible and correctly oriented.",
  },
  {
    id: "microphone",
    name: "Microphone",
    shortName: "Microphone",
    category: "Input",
    diagram: "mic",
    tile: 3,
    look: "A small capsule or grille on a desk stand, headset boom or built into a webcam.",
    function:
      "Converts sound into a signal the computer can record or send to a call.",
    need: "Makes speech available for calls, recording and voice input. A close microphone can help when the room is noisy.",
    specs:
      "Sample rate measures samples per second. 48 kHz is common for video audio. Pickup pattern, distance, gain and room noise can matter more than a larger number on the box.",
    connections: ["usb-a", "usb-c", "audio"],
    connect:
      "A USB mic sends digital audio. An analogue mic needs the correct microphone input or audio interface.",
    inside: "cpu",
    relationship:
      "The microphone captures sound. The CPU runs the recording or call app and processes the audio stream.",
    misconception:
      "A speaker socket is an output. A microphone needs a supported input.",
    price: {
      gbp: 49.99,
      model: "Logitech Yeti Orb USB microphone",
      source: "Logitech UK",
      url: "https://www.logitech.com/en-gb/shop/c/microphones",
    },
    cost: "A basic mic can work for speech. Stands, controls, pickup patterns and a dedicated audio interface can affect total cost.",
    test: "Select the microphone as the input. Speak at normal volume and play back a short recording to check clarity and level.",
  },
  {
    id: "webcam",
    name: "Webcam",
    shortName: "Webcam",
    category: "Input",
    diagram: "webcam",
    tile: 4,
    look: "A small camera with a lens and clip for the top of a screen. Some have a privacy shutter or built-in microphone.",
    function:
      "Captures moving images for calls, recordings and demonstrations.",
    need: "Provides a picture for remote users. An external camera can be positioned at eye level or aimed at a demonstration.",
    specs:
      "720p and 1080p describe picture detail. Frames per second describe motion smoothness. A 720p/30 fps camera can serve a basic call. Better lighting and a stable connection also affect the result.",
    connections: ["usb-a", "usb-c"],
    connect:
      "Connect to a compatible USB data port. Choose the camera in the call app and check camera permission and any shutter.",
    inside: "cpu",
    relationship:
      "The webcam captures frames. The CPU runs the call app and helps prepare the video stream for transmission.",
    misconception:
      "A webcam can include a microphone, but the call app can choose a different audio input.",
    price: {
      gbp: 30.99,
      model: "Logitech C270 720p webcam",
      source: "Logitech UK",
      url: "https://www.logitech.com/en-gb/shop/c/logi-webcams",
    },
    cost: "Higher resolution, a better lens, autofocus and a privacy shutter can change the cost. Check the required viewing angle before choosing.",
    test: "Open a camera preview. Check the correct device, framing and picture, then test sound separately if needed.",
  },
  {
    id: "printer",
    name: "Printer",
    shortName: "Printer",
    category: "Output",
    diagram: "printer",
    tile: 5,
    look: "A paper tray, output slot and controls. An all-in-one can have a scanner lid as well.",
    function:
      "Produces a paper copy of digital content. A multifunction printer can also scan, which is a separate input function.",
    need: "Prints labels, forms and copies for people who need paper. A shared office may need duplex printing and reliable handling of long jobs.",
    specs:
      "Compare pages per minute (ppm) on the same test, resolution in dpi and cost per page. Inkjet and laser models suit different volumes and types of printing.",
    connections: ["usb-b", "wifi", "rj45", "power"],
    connect:
      "A local USB printer often has a USB-B socket. Network models use Wi-Fi or Ethernet. Install the approved driver and choose the right print queue.",
    inside: "ssd",
    relationship:
      "The computer’s print spooler can queue a job on storage before it sends it. The external printer makes the physical copy.",
    misconception:
      "The price of the machine is only part of the cost. Compare replacement cartridges, toner or other consumables as well.",
    price: {
      gbp: 39.99,
      model: "Epson Expression Home XP-2200 inkjet",
      source: "Currys advertised offer",
      url: "https://www.currys.co.uk/products/epson-expression-home-xp2200-allinone-wireless-inkjet-printer-10284458.html",
    },
    cost: "Check whether an offer includes a subscription. Compare the device, running costs and how many pages the office prints.",
    test: "Select the correct printer and print a test page. Check it reaches the intended tray and the text is readable.",
  },
  {
    id: "monitor",
    name: "Monitor",
    shortName: "Monitor",
    category: "Output",
    diagram: "monitor",
    tile: 6,
    look: "A flat screen with a stand, power button and labelled video inputs on the back or underside.",
    function:
      "Displays the image supplied by the computer’s graphics hardware.",
    need: "Makes the user interface visible. An extra screen helps someone view a reference document and work on another window at the same time.",
    specs:
      "Resolution is the number of pixels, such as 1920 × 1080. Refresh rate is how often the display can update, such as 60 or 100 Hz. The computer and link must support the selected mode.",
    connections: ["hdmi", "displayport", "usb-c", "vga", "dvi", "power"],
    connect:
      "Match an output on the PC to an input on the monitor. Check the display input setting, resolution and whether the desktop is extended or mirrored.",
    inside: "gpu",
    relationship:
      "The GPU produces the picture. It can be integrated into the processor or on a graphics card. The screen displays the signal outside the case.",
    misconception:
      "A higher refresh rate can make on-screen motion smoother. It cannot make the CPU process a spreadsheet faster.",
    price: {
      gbp: 74,
      model: "Dell SE2225HM Full HD monitor",
      source: "Dell UK",
      url: "https://www.dell.com/en-gb/shop/monitors/apd/dell-24-monitor-se2425hm/se2225hm/-",
    },
    cost: "Larger panels, more pixels, higher refresh rates and adjustable stands can increase price. Choose for the user’s task and space.",
    test: "Select the input, confirm the picture appears and move a window onto the second screen to test extended mode.",
  },
  {
    id: "speakers",
    name: "Speakers",
    shortName: "Speakers",
    category: "Output",
    diagram: "speaker",
    tile: 7,
    look: "One or two small cabinets with grilles, a volume control and an audio or power lead.",
    function: "Convert an audio signal into sound that people nearby can hear.",
    need: "Useful for shared demonstrations or media playback. Use a headset for a private listening task.",
    specs:
      "Stereo uses left and right channels. Compare rated continuous power (RMS) on the same basis. Small desktop speakers suit a desk. Room coverage also depends on the speakers and the room.",
    connections: ["audio", "usb-a", "bluetooth", "power"],
    connect:
      "Use line-out for powered analogue speakers, or select the USB or Bluetooth device as the sound output. Some USB leads provide power only.",
    inside: "motherboard",
    relationship:
      "Onboard audio hardware can convert digital sound into an analogue line signal. The external speakers turn that signal into audible sound.",
    misconception:
      "A speaker’s power lead and audio connection can be separate. Check both if it stays silent.",
    price: {
      gbp: 18.99,
      model: "Logitech Z150 stereo speakers",
      source: "Logitech UK advertised offer",
      url: "https://www.logitech.com/en-gb/shop/c/speakers",
    },
    cost: "Larger cabinets, extra channels, wireless connectivity and a subwoofer can raise the price.",
    test: "Choose the output and play a quiet test sound. Check both channels and adjust volume to suit the room.",
  },
  {
    id: "smart-tv",
    name: "Smart TV",
    shortName: "Smart TV",
    category: "Input and output",
    diagram: "tv",
    tile: 8,
    look: "A larger display with speakers, multiple inputs and a remote. It can also run built-in apps and connect to a network.",
    function:
      "Displays picture and plays sound. The TV can receive commands from its remote or other controls when used as a smart device.",
    need: "Useful for showing content to a room. It can receive a PC’s picture or run its own app for a different task.",
    specs:
      "Check size in inches, resolution and input support. A 43-inch 4K screen has 3840 × 2160 pixels. For presentation use, check that text is readable from the back of the room.",
    connections: ["hdmi", "wifi", "rj45", "power"],
    connect:
      "Use HDMI for a wired computer picture and sound. Network casting needs compatible devices and an approved network setup.",
    inside: "gpu",
    relationship:
      "In wired display mode the PC’s GPU supplies a picture and the TV shows it. The TV’s remote normally controls the TV itself.",
    misconception:
      "A smart TV can accept input for its own apps. A PC sees it as a display when you use a basic HDMI connection.",
    price: {
      gbp: 228.97,
      model: "Samsung U8000F 43-inch 4K TV",
      source: "Currys",
      url: "https://www.currys.co.uk/products/samsung-u8000f-43-crystal-uhd-4k-hdr-smart-tv-2025-ue43u8000f-10282666.html",
    },
    cost: "Size and panel type affect cost. Include a suitable stand or mount and any installation work in the budget.",
    test: "Select the connected HDMI input, display the presentation and check that the correct audio output is selected.",
  },
  {
    id: "touchscreen",
    name: "Touchscreen display",
    shortName: "Touchscreen",
    category: "Input and output",
    diagram: "touchscreen",
    tile: 9,
    look: "A display with a touch-sensitive surface and often a tilting stand. Look for a separate USB upstream connection.",
    function:
      "Shows a picture and sends taps, gestures or pen input back to the computer.",
    need: "Supports check-in kiosks, interactive displays and tasks where a user benefits from selecting items directly on screen.",
    specs:
      "Compare resolution, touch technology and the number of simultaneous touch points. The TD2223 supports up to 10 touch points with compatible setup. A check-in kiosk may only need reliable single taps.",
    connections: ["hdmi", "usb-b", "usb-c", "power"],
    connect:
      "Many models need a video cable for the picture and a USB upstream cable for touch. A supported single USB-C link can carry both on some models.",
    inside: "motherboard",
    relationship:
      "The GPU sends the picture. The motherboard’s USB controller receives the touch events through the separate data cable.",
    misconception:
      "A visible picture proves the video path works. Test the touch input separately.",
    price: {
      gbp: 215.98,
      model: "ViewSonic TD2223 22-inch touch monitor",
      source: "Currys Business, incl. VAT",
      url: "https://business.currys.co.uk/catalogue/computing/pc-monitors/viewsonic-td2223-led-monitor-full-hd-1080p-22/P278489P",
    },
    cost: "The touch sensor, stand and durability add cost compared with a basic monitor. Pay for the touch capabilities the job needs.",
    test: "Show the app, then tap a large button and drag an item. Check taps register on the correct display.",
  },
  {
    id: "headset",
    name: "Headset with microphone",
    shortName: "Headset",
    category: "Input and output",
    diagram: "headset",
    tile: 10,
    look: "Headphones plus a microphone on a boom, in the cable or built into the earcups.",
    function: "Outputs sound privately and captures speech as input.",
    need: "Lets reception staff hear and speak during a call without playing the caller to the room.",
    specs:
      "Compare microphone pickup and mute controls, comfort and isolation. For wireless models, check battery life and microphone quality in call mode.",
    connections: ["usb-a", "usb-c", "audio", "bluetooth"],
    connect:
      "A USB headset appears as a digital audio device. A 3.5 mm model needs a compatible combo jack or appropriate splitter. Select input and output in the call app.",
    inside: "motherboard",
    relationship:
      "The USB controller carries digital audio in both directions for a USB headset. The headset has its own audio conversion hardware.",
    misconception:
      "Hearing sound through a headset confirms the output. Make a recording or a test call to confirm its microphone.",
    price: {
      gbp: 19.99,
      model: "Logitech H390 USB-A headset",
      source: "Logitech UK advertised offer",
      url: "https://www.logitech.com/en-gb/shop/p/h390-usb-headset.981-001281",
    },
    cost: "Wireless support, comfort, active noise cancellation and replaceable parts can add cost. Check features against the call environment.",
    test: "Run a test call, listen to the return audio and record a sample from the headset microphone. Check the mute control.",
  },
  {
    id: "external-ssd",
    name: "External solid-state drive",
    shortName: "External SSD",
    category: "External storage",
    diagram: "external-ssd",
    tile: 11,
    look: "A small portable enclosure with a short data cable. External hard disks and flash drives are other removable storage options.",
    function:
      "Stores files outside the computer. The host can read from it and write to it.",
    need: "Useful for moving an approved copy or making a backup. The internal drive still holds the operating system and installed applications in a normal lab setup.",
    specs:
      "Capacity is measured in GB or TB. Transfer rates in MB/s describe how fast files move. A T7 is rated up to 1,050 MB/s read under suitable conditions. A slower port, cable or source drive can limit real speed.",
    connections: ["usb-a", "usb-c", "thunderbolt", "esata"],
    connect:
      "Use a cable and port with compatible data support. Some legacy enclosures use eSATA, and some specialist drives require Thunderbolt.",
    inside: "ssd",
    relationship:
      "The internal SSD stores files in the case. The external SSD performs a similar storage job in a removable enclosure and communicates through a peripheral port.",
    misconception:
      "A USB-C plug tells you the connector shape. Check the rated transfer speed of the cable, port and drive.",
    price: {
      gbp: 249,
      model: "Samsung T7 portable SSD, 1 TB, grey",
      source: "Currys Business, incl. VAT",
      url: "https://business.currys.co.uk/catalogue/computing/components-upgrades/hard-drives/external-hard-drives/samsung-t7-portable-external-ssd-1-tb-grey/N558646W",
    },
    cost: "Compare price per GB, transfer speed and durability. Use the organisation’s approved storage and backup process.",
    test: "Copy an approved sample file, reopen it from the external drive and safely eject the drive before unplugging it.",
  },
];

export const portPractice = [
  {
    id: "display-link",
    situation:
      "The computer has an HDMI output. The new monitor has an HDMI input. Which connection would you try first?",
    choices: ["RJ-45 network lead", "HDMI cable", "3.5 mm audio cable"],
    correct: 1,
    explanation:
      "HDMI carries the picture and can carry sound. Connect output to input and select HDMI on the monitor.",
  },
  {
    id: "touch-link",
    situation:
      "A touchscreen already shows the desktop over HDMI. The manufacturer specifies a USB-B upstream socket for touch. What is missing?",
    choices: [
      "A USB data cable from the screen to the PC",
      "A second HDMI cable",
      "An RJ-11 telephone cable",
    ],
    correct: 0,
    explanation:
      "The screen already receives video. USB provides a path for touch input to reach the computer.",
  },
  {
    id: "usb-c-link",
    situation:
      "A laptop has USB-C. You need to connect a USB-C display. What should you check before choosing the cable?",
    choices: [
      "Whether the connectors have the same colour",
      "Whether both devices have Bluetooth",
      "Whether the laptop port and cable support video",
    ],
    correct: 2,
    explanation:
      "USB-C describes the shape. The host, cable and display all need the relevant capability.",
  },
  {
    id: "printer-link",
    situation:
      "A printer has a square USB-B device socket. The PC has a rectangular USB-A host port. Which lead fits this setup?",
    choices: [
      "USB-A to USB-B data cable",
      "HDMI to HDMI cable",
      "USB-C charging cable",
    ],
    correct: 0,
    explanation:
      "USB-A fits the computer’s host port and USB-B fits this printer’s device port.",
  },
  {
    id: "line-link",
    situation:
      "A legacy modem has a telephone LINE socket and an Ethernet LAN socket. Where does the narrower RJ-11 telephone lead go?",
    choices: ["Ethernet LAN", "Telephone LINE", "USB-A"],
    correct: 1,
    explanation:
      "Use RJ-11 on the labelled telephone line connection. RJ-45 is used on the Ethernet side.",
  },
  {
    id: "ssd-link",
    situation:
      "A 10 Gbps external SSD works through a USB 2.0 adapter but copies slowly. Which change addresses that bottleneck?",
    choices: [
      "Change the screen refresh rate",
      "Use an HDMI port instead",
      "Use a compatible 10 Gbps USB port and data cable",
    ],
    correct: 2,
    explanation:
      "A fast drive can negotiate a slower connection. The drive, host port and cable all affect the speed.",
  },
] as const;

export const lessonPlan = [
  {
    minutes: "0–10 min",
    title: "Recall what’s inside",
    task: "Open Inside the PC. Find the motherboard, GPU, CPU and storage. Tell a partner what each one does.",
  },
  {
    minutes: "10–35 min",
    title: "Explore the desk",
    task: "Inspect at least five peripherals. Include one input, one output and one device that does both. Trace each to the PC and compare a specification and cost for two devices.",
  },
  {
    minutes: "35–50 min",
    title: "Match ports and connectors",
    task: "Inspect the socket shapes, then try the connection checks. Explain why a plug can fit and still lack the needed capability.",
  },
  {
    minutes: "50–75 min",
    title: "Work two tickets in pairs",
    task: "One person acts as technician and one as verifier. Choose the external device and internal component, explain the link and agree a functional test. Swap roles for the next ticket.",
  },
  {
    minutes: "75–90 min",
    title: "Write your own comparison",
    task: "Use the individual task below. Save your explanation and open your session report to review your evidence.",
  },
] as const;
