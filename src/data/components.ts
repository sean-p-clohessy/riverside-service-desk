import type { ComponentInfo } from "../types.ts";

export const components: ComponentInfo[] = [
  {
    id: "cpu",
    name: "Central processing unit",
    shortName: "CPU",
    category: "Processing",
    diagram: "cpu",
    function:
      "Executes program instructions, performs calculations and coordinates processing tasks.",
    need: "Programs need a processor to carry out their instructions. It works with data held in RAM.",
    specs:
      "Clock speed in GHz; number of cores and threads; socket type; power and cooling requirements.",
    misconception:
      "A higher GHz number does not always mean a faster CPU. Architecture, core count and the workload also matter.",
  },
  {
    id: "ram",
    name: "Random access memory",
    shortName: "RAM",
    category: "Working memory",
    diagram: "ram",
    function:
      "Temporarily holds the data and instructions being actively used by running applications.",
    need: "Gives the CPU quick access to current work. More capacity can help when many applications are open.",
    specs:
      "Capacity in GB; generation such as DDR4 or DDR5; transfer rate in MT/s; compatible memory slots.",
    misconception:
      "RAM is not permanent file storage. Its contents are normally lost when power is removed.",
  },
  {
    id: "motherboard",
    name: "Motherboard",
    shortName: "Motherboard",
    category: "System platform",
    diagram: "motherboard",
    function:
      "Connects the CPU, RAM, expansion cards, storage interfaces and other hardware so they can communicate.",
    need: "Provides the main circuit board, sockets, slots and connections that bring the system together.",
    specs:
      "Form factor (ATX or micro-ATX); CPU socket; RAM support; PCIe slots; SATA and M.2 interfaces.",
    misconception:
      "The motherboard connects components; it does not replace the CPU or act as the main permanent storage.",
  },
  {
    id: "psu",
    name: "Power supply unit",
    shortName: "PSU",
    category: "Power",
    diagram: "psu",
    function:
      "Converts mains AC electricity into regulated DC power at the voltages required by computer components.",
    need: "Supplies stable, appropriate electrical power through compatible connectors.",
    specs:
      "Rated output in watts (W); connector types; efficiency rating; physical form factor.",
    misconception:
      "A 650 W PSU does not constantly use 650 W. Components draw the power they need. Never open a PSU casing.",
  },
  {
    id: "ssd",
    name: "Solid-state drive",
    shortName: "SSD",
    category: "Permanent storage",
    diagram: "ssd",
    function:
      "Stores the operating system, applications and files without power, using flash memory and no moving parts.",
    need: "Keeps work after shutdown and can reduce boot and application loading times compared with an HDD.",
    specs:
      "Capacity in GB or TB; SATA or NVMe interface; read/write speed in MB/s; compatible M.2 or drive bay.",
    misconception:
      "An SSD is storage, not extra RAM. M.2 describes a form factor; not every M.2 drive uses NVMe.",
  },
  {
    id: "hdd",
    name: "Hard disk drive",
    shortName: "HDD",
    category: "Permanent storage",
    diagram: "hdd",
    function:
      "Stores files permanently on rotating magnetic platters, read and written by a moving head.",
    need: "Provides large storage capacity, often at a lower cost per TB than an SSD, useful for bulk archives.",
    specs:
      "Capacity in GB or TB; rotation speed in RPM; SATA interface; 3.5-inch or 2.5-inch size.",
    misconception:
      "An HDD keeps files when switched off. It is generally slower than an SSD and is not itself a backup.",
  },
  {
    id: "gpu",
    name: "Graphics processing unit / card",
    shortName: "GPU",
    category: "Expansion & graphics",
    diagram: "gpu",
    function:
      "Processes graphics and renders images, video and 3D scenes for display.",
    need: "Dedicated graphics cards can accelerate demanding visual work. Some systems use graphics integrated into the CPU.",
    specs:
      "Video memory (VRAM) in GB; supported outputs; PCIe connection; card size; power requirements.",
    misconception:
      "VRAM on a graphics card is different from system RAM. Not every computer needs a separate graphics card.",
  },
  {
    id: "network",
    name: "Network interface card",
    shortName: "Network card",
    category: "Expansion & connectivity",
    diagram: "network",
    function:
      "Sends and receives data between the computer and a network, using Ethernet or Wi-Fi.",
    need: "Allows network access to shared resources and, through a network connection, the internet.",
    specs:
      "Link speed in Mbps or Gbps; Ethernet or Wi-Fi standard; PCIe or integrated connection.",
    misconception:
      "A network card is not a graphics card and does not guarantee a fast internet connection.",
  },
  {
    id: "cpu-cooling",
    name: "CPU cooling",
    shortName: "CPU cooling",
    category: "Temperature control",
    diagram: "cpu-cooling",
    function:
      "Transfers heat away from the CPU using a heatsink and fan, or a compatible liquid cooling system.",
    need: "Helps keep the CPU within safe temperatures so it can operate reliably under load.",
    specs:
      "CPU socket support; cooling capacity; fan size and RPM; cooler height or radiator size; noise in dB.",
    misconception:
      "Liquid cooling is not always necessary or better. A suitable air cooler can be enough. Cooling does not replace case airflow.",
  },
  {
    id: "case-cooling",
    name: "Case cooling",
    shortName: "Case cooling",
    category: "Temperature control",
    diagram: "case-cooling",
    function:
      "Moves air through the computer case, bringing in cooler air and removing warm air from internal components.",
    need: "Prevents heat building up around the CPU, graphics card, drives and other hardware.",
    specs:
      "Fan diameter in mm; speed in RPM; airflow; intake/exhaust direction; case mounting positions.",
    misconception:
      "Adding fans without planning airflow may not help. Case fans and CPU coolers have related but different jobs.",
  },
];
