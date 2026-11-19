import type { ComponentInfo } from "../types.ts";

export const networkComponents: ComponentInfo[] = [
  {
    id: "network-interface",
    name: "Network interface",
    shortName: "Network interface",
    category: "Computer hardware",
    diagram: "network",
    function: "Sends and receives data so a device can take part in a network.",
    need: "A desktop can use an Ethernet interface. A laptop can also have a Wi-Fi interface.",
    specs:
      "Check the supported connection and link speed, such as 1 Gbit/s Ethernet. The actual transfer can be slower.",
    misconception:
      "A working interface or link light establishes one connection. You still need to test the resource the user wants.",
  },
  {
    id: "network-switch",
    name: "Ethernet switch",
    shortName: "Switch",
    category: "Local network",
    diagram: "network",
    function:
      "Connects wired devices on a local network and forwards Ethernet frames using learned device addresses.",
    need: "The classroom PCs, printer, server and wireless access point connect to this switch.",
    specs:
      "Check port count, link speed and power over Ethernet (PoE) support. Our model has eight 1 Gbit/s ports.",
    misconception:
      "A switch connects local equipment. Reaching another network also needs a route through a router.",
  },
  {
    id: "network-router",
    name: "Router",
    shortName: "Router",
    category: "Between networks",
    diagram: "network",
    function:
      "Forwards packets between networks, including the college network and the internet connection.",
    need: "It provides the college network with a route to other networks. Local printer traffic can stay within the local network.",
    specs:
      "Check supported connection speeds, LAN and WAN ports, and management and security features.",
    misconception:
      "A home wireless router can combine routing, a small switch and Wi-Fi. Our college diagram shows those roles separately.",
  },
  {
    id: "access-point",
    name: "Wireless access point",
    shortName: "Access point",
    category: "Wireless connection",
    diagram: "network",
    function:
      "Connects Wi-Fi devices to the local network through its network uplink.",
    need: "Learners' laptops use its radio connection. The access point also needs a working connection into the college network.",
    specs:
      "Check supported Wi-Fi standards, coverage, capacity and uplink speed. Walls and distance can affect performance.",
    misconception:
      "Joining a Wi-Fi network confirms association with an access point. Test local resources and internet access separately.",
  },
  {
    id: "modem",
    name: "Broadband modem",
    shortName: "Modem",
    category: "Provider connection",
    diagram: "network",
    function:
      "Provides the interface to the broadband provider's access line in this model.",
    need: "Our fictional college uses a separate modem and router. A fibre service may instead use an optical network terminal.",
    specs:
      "The device must support the type of provider line and service. Check its line status and connection to the router.",
    misconception:
      "The modem and router have separate jobs. A combined box can perform both.",
  },
  {
    id: "ethernet-link",
    name: "Ethernet cable and ports",
    shortName: "Ethernet link",
    category: "Network link",
    diagram: "network",
    function:
      "Carries data between compatible Ethernet interfaces, such as a PC and a switch.",
    need: "A securely connected network lead completes the wired link. Inspect the plug, port and link indicators.",
    specs:
      "Check cable condition and category, compatible ports and negotiated speed. This exercise uses RJ-45 connectors.",
    misconception:
      "A plug that fits a network socket still needs a suitable cable and a working connection at the other end.",
  },
  {
    id: "network-node",
    name: "Network node",
    shortName: "Node",
    category: "Network vocabulary",
    diagram: "network",
    function: "A device or connection point that takes part in a network.",
    need: "A workstation, printer or router is a node. A link is the connection between nodes.",
    specs:
      "When documenting a node, record its role, asset label and available interfaces.",
    misconception:
      "Nodes can have different roles. A printer and a router both participate in the network.",
  },
  {
    id: "file-server",
    name: "Shared file server",
    shortName: "File server",
    category: "Shared resource",
    diagram: "network",
    function:
      "Provides shared files and folders to authorised users on the network.",
    need: "It is the destination when a learner opens the college class folder.",
    specs:
      "Check storage capacity, network link speed, availability and access permissions.",
    misconception:
      "A shared folder can work while an internet connection is unavailable. They use different destinations.",
  },
  {
    id: "network-printer",
    name: "Shared network printer",
    shortName: "Network printer",
    category: "Shared resource",
    diagram: "network",
    function:
      "Receives print jobs through the network and produces printed output.",
    need: "Several classroom PCs can send jobs to the same printer.",
    specs:
      "Check supported connections, print speed, paper support and printer status.",
    misconception:
      "Being able to reach the printer is one check. A successful test page also checks that it can produce output.",
  },
  {
    id: "provider-link",
    name: "Provider connection",
    shortName: "Provider link",
    category: "External network link",
    diagram: "network",
    function:
      "Connects the college's broadband equipment to the provider's network.",
    need: "Internet traffic must cross this connection. Local classroom traffic can remain within the college.",
    specs:
      "Check service status, line availability and contracted speed. A provider fault may need escalation.",
    misconception:
      "If college files work while websites fail, gather evidence from the external connection before changing local equipment.",
  },
  {
    id: "network-hub",
    name: "Ethernet hub",
    shortName: "Hub",
    category: "Comparison",
    diagram: "network",
    function: "Repeats incoming Ethernet signals out to its other ports.",
    need: "It helps explain how older shared Ethernet networks differed from switched networks.",
    specs:
      "A hub shares its transmission capacity. A modern switch provides separate links and learns where devices connect.",
    misconception:
      "A hub and a switch can look similar. Read their functions and specifications when identifying them.",
  },
];

export const networkGuideChecks = [
  {
    id: "switch-role",
    component: "network-switch",
    question: "Which job belongs to the classroom switch?",
    options: [
      "Join local wired devices",
      "Store every learner's files",
      "Convert every file into a web page",
    ],
    answer: 0,
    explanation:
      "The switch joins local wired devices. The server stores shared files.",
  },
  {
    id: "router-role",
    component: "network-router",
    question: "Which device forwards packets to another network?",
    options: ["Printer", "Router", "Keyboard"],
    answer: 1,
    explanation:
      "The router forwards traffic between networks. The printer is a destination.",
  },
  {
    id: "ap-uplink",
    component: "access-point",
    question:
      "A laptop has joined Wi-Fi. What should you check before claiming college files work?",
    options: [
      "The colour of the laptop",
      "Only the Wi-Fi icon",
      "The uplink and access to the shared folder",
    ],
    answer: 2,
    explanation:
      "Wi-Fi association is the first link. The access point's uplink and the resource also need to work.",
  },
  {
    id: "link-node",
    component: "network-node",
    question: "Which example is a link between two nodes?",
    options: [
      "The cable from a PC to a switch",
      "The printer itself",
      "The file server itself",
    ],
    answer: 0,
    explanation:
      "The cable is a link. The PC, switch, printer and server are nodes.",
  },
  {
    id: "local-internet",
    component: "provider-link",
    question:
      "College files open, but websites fail. What should you investigate next?",
    options: [
      "Replace every workstation",
      "Check the router and provider connection",
      "Add more RAM to the printer",
    ],
    answer: 1,
    explanation:
      "The shared files show some local connectivity. The route and service beyond the local network need separate checks.",
  },
] as const;

export const networkNodes = [
  {
    id: "pc",
    name: "Classroom PC",
    component: "network-interface",
    port: "Ethernet port",
    x: 9,
    y: 22,
  },
  {
    id: "laptop",
    name: "Learner laptop",
    component: "network-interface",
    port: "Wi-Fi interface",
    x: 9,
    y: 76,
  },
  {
    id: "ap",
    name: "Access point",
    component: "access-point",
    port: "Ethernet uplink / Wi-Fi",
    x: 30,
    y: 76,
  },
  {
    id: "switch",
    name: "Classroom switch",
    component: "network-switch",
    port: "Eight Ethernet ports",
    x: 43,
    y: 28,
  },
  {
    id: "printer",
    name: "Shared printer",
    component: "network-printer",
    port: "Ethernet port",
    x: 71,
    y: 14,
  },
  {
    id: "files",
    name: "File server",
    component: "file-server",
    port: "Ethernet port",
    x: 71,
    y: 42,
  },
  {
    id: "router",
    name: "College router",
    component: "network-router",
    port: "LAN / WAN Ethernet",
    x: 53,
    y: 76,
  },
  {
    id: "modem",
    name: "Broadband modem",
    component: "modem",
    port: "Ethernet / provider line",
    x: 73,
    y: 76,
  },
  {
    id: "internet",
    name: "Internet service",
    component: "provider-link",
    port: "Provider network",
    x: 91,
    y: 76,
  },
] as const;

export const networkLinks = [
  {
    id: "pc-switch",
    from: "pc",
    to: "switch",
    kind: "ethernet",
    label: "PC Ethernet → switch port 1",
  },
  {
    id: "printer-switch",
    from: "printer",
    to: "switch",
    kind: "ethernet",
    label: "Printer Ethernet → switch port 2",
  },
  {
    id: "files-switch",
    from: "files",
    to: "switch",
    kind: "ethernet",
    label: "File server → switch port 3",
  },
  {
    id: "ap-switch",
    from: "ap",
    to: "switch",
    kind: "ethernet",
    label: "Access point uplink → switch port 4",
  },
  {
    id: "laptop-ap",
    from: "laptop",
    to: "ap",
    kind: "wifi",
    label: "Laptop Wi-Fi → Riverside-Lab access point",
  },
  {
    id: "switch-router",
    from: "switch",
    to: "router",
    kind: "ethernet",
    label: "Switch port 8 → router LAN",
  },
  {
    id: "router-modem",
    from: "router",
    to: "modem",
    kind: "ethernet",
    label: "Router WAN → modem Ethernet",
  },
  {
    id: "modem-internet",
    from: "modem",
    to: "internet",
    kind: "provider",
    label: "Modem line → provider network",
  },
] as const;

export const networkStartLinks = [
  "files-switch",
  "switch-router",
  "router-modem",
  "modem-internet",
];
export const networkDestinations = [
  { id: "link", label: "Check source link" },
  { id: "printer", label: "Test printer access" },
  { id: "files", label: "Open shared files" },
  { id: "internet", label: "Test internet access" },
] as const;

export const networkLesson = [
  {
    minutes: "0–10 min",
    title: "Recall the connection",
    task: "Find the network interface, Ethernet lead and Wi-Fi connection. Tell a partner which equipment might sit between a classroom PC and the printer.",
  },
  {
    minutes: "10–30 min",
    title: "Explore the guide",
    task: "Read the switch, router, access point, interface and modem entries, then explore nodes, links and shared resources. Compare the hub with the switch. Try the five checks.",
  },
  {
    minutes: "30–50 min",
    title: "Build and test",
    task: "Open the college network. Four backbone links are ready. Connect the PC, printer, access point and laptop. Test a local destination and the internet. Disconnect one link and compare what still works.",
  },
  {
    minutes: "50–75 min",
    title: "Investigate in pairs",
    task: "Choose two Week 9 requests. One technician leads and submits on their profile while the verifier questions the evidence. Swap roles and profiles for the second request.",
  },
  {
    minutes: "75–90 min",
    title: "Explain individually",
    task: "Choose a route you tested. Describe three devices along it in your own words. Explain what one investigation result establishes and which check you would do next. Open your Session Report and save it as a PDF.",
  },
] as const;

export const networkReferences = [
  {
    title: "Gateway IT Technical Support unit",
    url: "https://www.gatewayqualifications.org.uk/unit/159013/",
  },
  {
    title: "Cisco · Switches and routers",
    url: "https://www.cisco.com/site/us/en/learn/topics/small-business/network-switch-vs-router.html",
  },
  {
    title: "Cloudflare · Ethernet switches",
    url: "https://www.cloudflare.com/learning/network-layer/what-is-a-network-switch/",
  },
];
