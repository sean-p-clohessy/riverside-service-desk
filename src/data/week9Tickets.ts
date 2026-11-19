import type { ConceptRubric, Machine, Ticket } from "../types.ts";

const machine = (asset: string, connections: string): Machine => ({
  asset,
  model: "Riverside teaching workstation",
  cpu: "Intel Core i5",
  ram: "16 GB",
  storage: "512 GB SSD",
  gpu: "Integrated graphics",
  psu: "350 W",
  os: "Windows 11 Education",
  connections,
});
const rubric = (
  criterion: string,
  terms: string[],
  example: string,
): ConceptRubric => ({
  criteria: [criterion],
  groups: [terms],
  guidance: criterion,
  example,
});

export const week9Tickets: Ticket[] = [
  {
    id: "w9-001",
    number: 1,
    tier: 1,
    title: "One PC cannot reach the printer",
    summary: "Compare the local link with a working neighbouring PC.",
    user: "Leah Khan",
    department: "Learning support",
    location: "Room T12",
    priority: "Normal",
    report:
      "The shared printer works from the desk next to me. My PC cannot print or open the class folder. It worked yesterday before the desks were moved.",
    machine: machine(
      "RS-T12-04",
      "Ethernet interface enabled. A network lead should run to the classroom switch.",
    ),
    evidence: [
      {
        id: "link",
        title: "Check cable link",
        body: "No Ethernet link is detected. The network plug at this PC is partly out of its socket.",
      },
      {
        id: "printer",
        title: "Test printer from a neighbouring PC",
        body: "The neighbouring PC reaches the same printer and prints a test page successfully.",
      },
      {
        id: "files",
        title: "Open shared files from the affected PC",
        body: "The class folder cannot be reached. The fault affects more than printing on this PC.",
      },
    ],
    expected: ["ethernet-link"],
    functionRubric: rubric(
      "Explain what the Ethernet link connects or carries.",
      ["connect", "carr", "data", "network", "switch"],
      "The Ethernet cable carries data between the PC and the switch.",
    ),
    reasoningRubric: rubric(
      "Use the loose plug or absent local link to explain your decision.",
      ["loose", "plug", "partly", "link", "cable"],
      "The plug is partly out and there is no link, while the neighbouring PC can print.",
    ),
    actions: [
      {
        id: "reconnect",
        label:
          "Seat the Ethernet plug, check link status and send a test page.",
        correct: true,
        feedback:
          "That restores the affected link and checks the user's printing task.",
      },
      {
        id: "replace",
        label: "Replace the shared printer immediately.",
        correct: false,
        feedback:
          "The neighbouring PC can print. Start with the affected PC's local link.",
      },
      {
        id: "restart",
        label: "Restart every device in the room.",
        correct: false,
        feedback:
          "Use the loose plug evidence to make a focused change, then test it.",
      },
    ],
    hints: [
      "Compare what works on the neighbouring PC with what fails on this PC.",
      "Look at the physical link before changing the shared printer.",
    ],
    resolution:
      "A secure Ethernet connection restores the PC's route into the local network. A test page verifies the original task.",
  },
  {
    id: "w9-002",
    number: 2,
    tier: 1,
    title: "Wi-Fi joined, college files unavailable",
    summary: "Follow the wireless connection beyond the access point.",
    user: "Marcus Bell",
    department: "Student services",
    location: "Study room L03",
    priority: "High",
    report:
      "Our laptops join Riverside-Lab and show a strong Wi-Fi signal, but they cannot open the class folder or websites. The wired classroom PCs can do both.",
    machine: machine(
      "RS-L03-LAP",
      "Wi-Fi associated with Riverside-Lab. Access point AP-L03 has an Ethernet uplink.",
    ),
    evidence: [
      {
        id: "wifi",
        title: "Check Wi-Fi association",
        body: "The laptop is associated with AP-L03. Signal strength is good and the network name is correct.",
      },
      {
        id: "uplink",
        title: "Check access point uplink",
        body: "AP-L03 has power, but its Ethernet uplink lead is disconnected from the classroom switch.",
      },
      {
        id: "wired",
        title: "Test a wired classroom PC",
        body: "The wired PC opens the class folder and the test website. The shared resources and provider route work for it.",
      },
    ],
    expected: ["access-point"],
    functionRubric: rubric(
      "Explain how an access point links Wi-Fi devices to the local network.",
      ["connect", "link", "wifi", "wi fi", "wireless", "uplink"],
      "The access point links wireless laptops into the wired local network.",
    ),
    reasoningRubric: rubric(
      "Use the disconnected uplink as evidence.",
      ["uplink", "disconnect", "lead", "cable", "switch"],
      "The laptops join Wi-Fi, but the access point's disconnected uplink breaks the onward route.",
    ),
    actions: [
      {
        id: "uplink",
        label:
          "Reconnect the access point uplink, then open the class folder from a laptop.",
        correct: true,
        feedback:
          "The resource check verifies the onward route after the connection is restored.",
      },
      {
        id: "ram",
        label: "Fit extra RAM to every laptop.",
        correct: false,
        feedback:
          "The evidence identifies the access point's uplink. Test that connection first.",
      },
      {
        id: "signal",
        label: "Record the strong signal as proof that the task works.",
        correct: false,
        feedback:
          "Wi-Fi association covers one part of the path. The class folder still needs to open.",
      },
    ],
    hints: [
      "A strong signal only covers the laptop-to-access-point link.",
      "Compare the working wired route with the access point's onward connection.",
    ],
    resolution:
      "The access point needs both a wireless connection and a working uplink to the local network.",
  },
  {
    id: "w9-003",
    number: 3,
    tier: 1,
    title: "College files work, websites fail",
    summary: "Use working local services to narrow the investigation.",
    user: "Nadia Evans",
    department: "Learning resource centre",
    location: "Library L01",
    priority: "High",
    report:
      "Every classroom PC can open the college folder and print. None can open the test website. We need to know what to report to the network team.",
    machine: machine(
      "RS-L01-02",
      "Local switch connected to the college router. Separate broadband modem and provider connection.",
    ),
    evidence: [
      {
        id: "local",
        title: "Test local resources",
        body: "The class folder opens and a printer test page succeeds from two PCs.",
      },
      {
        id: "gateway",
        title: "Check router reachability",
        body: "The network team confirms the college router is reachable and its modem cable is connected.",
      },
      {
        id: "line",
        title: "Check provider service status",
        body: "The modem reports no line synchronisation. The provider confirms a local service outage.",
      },
    ],
    expected: ["provider-link"],
    functionRubric: rubric(
      "Explain what the provider link connects.",
      ["internet", "provider", "outside", "external", "network"],
      "The provider connection links the college broadband equipment to the external network.",
    ),
    reasoningRubric: rubric(
      "Use the provider outage or absent line synchronisation as evidence.",
      ["outage", "provider", "line", "synchron"],
      "Local resources work, but the provider confirms an outage and the modem has no line synchronisation.",
    ),
    actions: [
      {
        id: "escalate",
        label:
          "Record the working local tests and outage evidence, then escalate to the network team/provider.",
        correct: true,
        feedback:
          "That gives the responsible team evidence and avoids disrupting the working local network.",
      },
      {
        id: "switch",
        label: "Replace every classroom switch.",
        correct: false,
        feedback:
          "Local printing and files work. The provider service evidence identifies where to escalate.",
      },
      {
        id: "password",
        label: "Change every learner's password.",
        correct: false,
        feedback:
          "The service outage needs network-team/provider action. Keep the useful local test results.",
      },
    ],
    hints: [
      "List which destinations work before changing anything.",
      "Use the provider's status alongside the modem line result.",
    ],
    resolution:
      "Local access can work during a provider outage. Record and escalate the external-service evidence.",
  },
  {
    id: "w9-004",
    number: 4,
    tier: 1,
    title: "Three more wired desks",
    summary: "Choose equipment for additional local connections.",
    user: "Ibrahim Reed",
    department: "Teaching",
    location: "Room T14",
    priority: "Normal",
    report:
      "We need three extra wired PCs. The current small switch has no spare ports. Keep the existing PCs, server and printer working, and allow room for later additions.",
    machine: machine(
      "RS-T14-NEW",
      "Three new PCs have 1 Gbit/s Ethernet interfaces. An uplink also needs a switch port.",
    ),
    evidence: [
      {
        id: "ports",
        title: "Count required ports",
        body: "Four existing devices, three new PCs and one router uplink need eight ports in total.",
      },
      {
        id: "stock",
        title: "Compare available equipment",
        body: "Option A is a five-port 1 Gbit/s switch. Option B is a sixteen-port 1 Gbit/s switch. Option C is a wireless access point with one uplink.",
      },
      {
        id: "test",
        title: "Review acceptance checks",
        body: "Each new PC must show a link, open the class folder and print a test page. The existing PCs must still work after the change.",
      },
    ],
    expected: ["network-switch"],
    functionRubric: rubric(
      "Explain how a switch connects local wired devices.",
      ["connect", "wired", "ethernet", "local", "devices"],
      "A switch connects the wired devices on the local network.",
    ),
    reasoningRubric: rubric(
      "Use the required port count or spare capacity in your recommendation.",
      ["eight", "8", "sixteen", "16", "ports", "spare"],
      "The sixteen-port switch has room for all eight connections and spare capacity.",
    ),
    actions: [
      {
        id: "sixteen",
        label:
          "Plan the sixteen-port switch change, then verify links, shared files and printing on new and existing PCs.",
        correct: true,
        feedback:
          "The plan meets the port requirement and verifies both added and existing connections.",
      },
      {
        id: "five",
        label: "Choose the five-port switch and connect only the new PCs.",
        correct: false,
        feedback:
          "Count the existing connections and uplink as well as the new PCs.",
      },
      {
        id: "ap",
        label: "Replace all cables with the single-uplink access point.",
        correct: false,
        feedback:
          "The request specifies extra wired connections. Compare the switch port counts.",
      },
    ],
    hints: [
      "Count every device and the uplink.",
      "Check which option meets today's port count and leaves spare capacity.",
    ],
    resolution:
      "A suitable switch provides enough local wired ports. Verify the requested services after the planned change.",
  },
];
