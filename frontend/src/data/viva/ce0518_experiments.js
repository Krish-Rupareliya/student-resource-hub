// frontend/src/data/viva/ce0518_experiments.js
/**
 * CE0518: Computer Networks Practical Lab Experiments & Viva Questions
 */

export const CE0518_EXPERIMENTS = [
  {
    id: 'exp-1',
    experimentNumber: 1,
    title: 'Study of Network Transmission Media, Connectors, and Interconnection Devices',
    aim: 'To study and identify various network transmission media (UTP/STP Cat-5e/Cat-6, Coaxial, Fiber Optic), connectors (RJ-45, BNC, SC/LC), and network hardware devices (Repeater, Hub, Bridge, Switch, Router, Gateway).',
    shortTheory: 'Physical transmission media establish the hardware data link between endpoints. Guided media utilize copper or glass conduits, whereas network devices operate at different OSI layers to segment, filter, regenerate, and route electrical, optical, or packetized data.',
    requiredTools: ['Cat-6 UTP Cable', 'RJ-45 Connectors', 'Crimping Tool', 'Network Cable Continuity Tester', 'Cisco Catalyst 2960 Switch', 'Cisco 1941 Router'],
    procedure: [
      'Strip approximately 1.5 cm of outer PVC jacket from the Cat-6 cable.',
      'Untwist the 4 pairs and arrange them in TIA/EIA 568B sequence: White-Orange, Orange, White-Green, Blue, White-Blue, Green, White-Brown, Brown.',
      'Trim wire edges squarely and push firmly into the transparent RJ-45 connector until conductors hit copper pins.',
      'Insert connector into crimping tool and squeeze handles with uniform pressure until the ratchet clicks.',
      'Plug both ends into the digital continuity tester and verify that pins 1 through 8 illuminate in ascending sequence.',
      'Connect workstation to Cisco switch port and inspect link LED status (Green = 100/1000 Mbps link active).'
    ],
    expectedOutput: 'Sequential 1-8 LED activation on cable tester confirming zero open-circuits or short-circuits. Successful ping between host machines connected through the switch.',
    commonErrors: [
      {
        error: 'Tester LED skips pin 3 or 6',
        cause: 'Conductor failed to make contact with the gold blade pin inside RJ-45 connector.',
        solution: 'Snip off connector, ensure wires are seated to the very front tip, and re-crimp.'
      },
      {
        error: 'Excessive packet collision or 10 Mbps auto-fallback',
        cause: 'Pairs untwisted more than 0.5 inches outside jacket causing severe near-end crosstalk (NEXT).',
        solution: 'Keep pair untwisting under 12 mm right up to the connector blade.'
      }
    ],
    questions: [
      {
        id: 'exp1-q1',
        question: 'What is the color code standard difference between Straight-Through and Cross-Over cables?',
        answer: 'Straight-Through uses the same standard (either T568A or T568B) on both ends for connecting disparate devices (PC to Switch). Cross-Over uses T568A on one end and T568B on the other end (pins 1,2 swap with 3,6) for connecting identical devices (PC to PC or Switch to Switch).'
      },
      {
        id: 'exp1-q2',
        question: 'Why does an unmanaged Switch outperform a Hub?',
        answer: 'A Hub is a Layer 1 broadcast device sharing a single collision domain among all ports. A Switch operates at Layer 2, maintains a dynamic MAC address table, and provides dedicated micro-segmented collision domains per port.'
      },
      {
        id: 'exp1-q3',
        question: 'What is Auto-MDIX in modern network interface cards?',
        answer: 'Auto-MDIX (Automatic Medium-Dependent Interface Crossover) automatically detects the required cable connection type (straight or crossover) and configures the internal transmit/receive pairs accordingly, making crossover cables obsolete.'
      }
    ]
  },
  {
    id: 'exp-2',
    experimentNumber: 2,
    title: 'Network Simulation and Topology Implementation using Cisco Packet Tracer',
    aim: 'To design, simulate, and analyze Star, Bus, and Ring topologies using Cisco Packet Tracer and verify end-to-end connectivity using ICMP ping.',
    shortTheory: 'Cisco Packet Tracer is a network simulation program that models OSI layer behavior, frame encapsulation, ARP table resolution, and packet switching across heterogeneous topologies in real time.',
    requiredTools: ['Cisco Packet Tracer 8.x', 'Virtual Generic PCs', 'Cisco Catalyst 2960-24TT Switches', 'FastEthernet/GigabitEthernet Copper Cables'],
    procedure: [
      'Launch Packet Tracer and create a Star topology by dragging 1 switch and 4 workstations into the workspace.',
      'Connect each PC to FastEthernet ports 0/1 to 0/4 on the switch using Copper Straight-Through cables.',
      'Assign static IPv4 addresses: PC0: 192.168.1.10/24, PC1: 192.168.1.11/24, PC2: 192.168.1.12/24, PC3: 192.168.1.13/24.',
      'Switch to Simulation Mode to observe PDU transmission.',
      'From PC0 Command Prompt, execute ping 192.168.1.12 and track initial ARP broadcast followed by ICMP Echo Requests.'
    ],
    expectedOutput: '4/4 ICMP echo replies received with 0% packet loss. Switch CAM (MAC Address Table) populates dynamic port-to-MAC mappings.',
    commonErrors: [
      {
        error: 'Request Timed Out on first ping packet',
        cause: 'Normal behavior during ARP resolution where the first packet is buffered while ARP broadcast resolves the MAC address.',
        solution: 'Execute ping a second time; 100% response will be achieved.'
      }
    ],
    questions: [
      {
        id: 'exp2-q1',
        question: 'What happens in Simulation Mode during the first ping between two freshly booted PCs?',
        answer: 'PC0 discovers it does not possess PC2\'s MAC address in its ARP cache. It creates an ARP Request (Destination MAC FF:FF:FF:FF:FF:FF), the switch floods it to all ports, PC2 replies with its unicast MAC, and only then does the ICMP Echo packet leave PC0.'
      },
      {
        id: 'exp2-q2',
        question: 'How do you view the learned MAC addresses in a Cisco switch via CLI?',
        answer: 'Enter privileged EXEC mode and run "show mac address-table" or "show mac-address-table dynamic".'
      }
    ]
  },
  {
    id: 'exp-3',
    experimentNumber: 3,
    title: 'Packet Sniffing and Protocol Analysis using Wireshark',
    aim: 'To capture, dissect, and inspect network protocol packets (ARP, ICMP, TCP 3-Way Handshake, and HTTP GET) using Wireshark.',
    shortTheory: 'Wireshark is a packet analyzer that captures live network traffic on an interface in promiscuous mode, decoding OSI frames from Layer 2 to Layer 7 with detailed field-level inspection.',
    requiredTools: ['Wireshark Network Analyzer', 'Active LAN/Wi-Fi Connection', 'Web Browser', 'Command Terminal'],
    procedure: [
      'Open Wireshark as Administrator and select the active network interface.',
      'Apply display filter: "arp or icmp or http or tcp.port==80".',
      'Open terminal and execute "ping 8.8.8.8 -c 2" and open an HTTP webpage.',
      'Stop capture and inspect the packet list, packet details, and raw packet bytes window.',
      'Examine the TCP 3-way handshake: SYN (seq=0), SYN-ACK (seq=0, ack=1), ACK (seq=1, ack=1).'
    ],
    expectedOutput: 'Clear protocol ladder showing ARP broadcast/unicast, ICMP type 8/0, and TCP SYN/SYN-ACK/ACK sequence numbers.',
    commonErrors: [
      {
        error: 'No packets captured despite web browsing',
        cause: 'Selected loopback interface or incorrect network adapter, or traffic is encrypted (HTTPS/TLS port 443).',
        solution: 'Select correct active Ethernet/Wi-Fi adapter and test with plain HTTP or ping.'
      }
    ],
    questions: [
      {
        id: 'exp3-q1',
        question: 'What are the ICMP Type numbers for Echo Request and Echo Reply?',
        answer: 'ICMP Type 8 represents Echo Request; ICMP Type 0 represents Echo Reply.'
      },
      {
        id: 'exp3-q2',
        question: 'How do you identify a TCP SYN packet in Wireshark?',
        answer: 'Under Transmission Control Protocol flags, the SYN bit is set to 1 and the ACK bit is 0, with an initial sequence number generated by the client.'
      }
    ]
  },
  {
    id: 'exp-4',
    experimentNumber: 4,
    title: 'Implementation of Error Detection Code (CRC) in C/Python',
    aim: 'To implement Cyclic Redundancy Check (CRC) polynomial code generation and error verification using Modulo-2 binary division.',
    shortTheory: 'CRC treats bit strings as polynomials with binary coefficients. The transmitter appends r zeros to the message and divides by a predetermined generator polynomial G(x) of degree r using XOR logic. The remainder (CRC checksum) is appended to form the transmitted codeword.',
    requiredTools: ['GCC Compiler or Python 3.x', 'VS Code / Terminal'],
    procedure: [
      'Accept input message dataword M(x) (e.g., 100100) and generator polynomial G(x) (e.g., 1101).',
      'Append r zeros (degree of G(x) = 3 zeros) to the dataword: 100100000.',
      'Perform iterative bitwise XOR division while divisor leading bit aligns with a 1.',
      'Extract r-bit remainder and append to dataword to form the transmitted codeword.',
      'Simulate transmission with and without injected error; verify that remainder is 000 for uncorrupted data.'
    ],
    expectedOutput: 'Transmitted Codeword generated correctly. Receiver validates: Remainder = 0 -> No Error; Injected error -> Remainder != 0 -> Error Detected.',
    commonErrors: [
      {
        error: 'Receiver reports error on uncorrupted message',
        cause: 'Using standard arithmetic subtraction instead of XOR (modulo-2 division without carry/borrow).',
        solution: 'Ensure every bit comparison uses bitwise XOR: 1^1=0, 0^0=0, 1^0=1, 0^1=1.'
      }
    ],
    questions: [
      {
        id: 'exp4-q1',
        question: 'What is the condition on the generator polynomial G(x) to detect all single-bit errors?',
        answer: 'G(x) must have at least two terms (i.e., not a single monomial like x^k) and the coefficient of x^0 must be 1.'
      }
    ]
  },
  {
    id: 'exp-5',
    experimentNumber: 5,
    title: 'Simulation of Sliding Window Protocols (Stop-and-Wait & Go-Back-N)',
    aim: 'To simulate and analyze flow and error control mechanisms in Stop-and-Wait ARQ and Go-Back-N ARQ protocols.',
    shortTheory: 'Sliding window protocols allow pipelining of multiple frames before requiring an acknowledgment. Go-Back-N utilizes a sender window of 2^m - 1 and cumulative ACKs; if a frame is lost, the sender retransmits the lost frame and all subsequent frames in the current window.',
    requiredTools: ['C/C++ or Python Simulator', 'Linux terminal / GCC'],
    procedure: [
      'Define window size W_s, timeout timer, and maximum sequence number range.',
      'Sender transmits up to W_s frames without waiting for ACK.',
      'Inject artificial packet drop or ACK drop using pseudo-random probability.',
      'On timer expiration for unacknowledged frame, reset sender pointer to earliest unACKed frame and retransmit all frames.',
      'Record total frames sent, retransmissions, and channel efficiency.'
    ],
    expectedOutput: 'Demonstration of cumulative ACK forwarding and automatic window slide upon receipt of valid ACKs.',
    commonErrors: [
      {
        error: 'Infinite loop on timer expiry',
        cause: 'Failure to restart timeout timer upon retransmitting dropped frames.',
        solution: 'Reset and restart frame timer whenever a retransmission burst commences.'
      }
    ],
    questions: [
      {
        id: 'exp5-q1',
        question: 'Why is receiver window size equal to 1 in Go-Back-N ARQ?',
        answer: 'Because the receiver accepts frames strictly in sequential order. Any out-of-order frame is discarded without buffering, and the receiver re-sends cumulative ACK for the last in-order frame received.'
      }
    ]
  },
  {
    id: 'exp-6',
    experimentNumber: 6,
    title: 'Subnetting and VLSM Network Addressing Design for an Enterprise Campus',
    aim: 'To design, calculate, and implement a Variable Length Subnet Mask (VLSM) addressing scheme for an organization with multiple departments having unequal host requirements.',
    shortTheory: 'VLSM enables engineers to allocate different subnet masks to different subnets within the same classful network block, preventing IPv4 address exhaustion by tailoring host counts to exact departmental needs.',
    requiredTools: ['Subnet Planning Sheet', 'Cisco Packet Tracer', 'Router CLI'],
    procedure: [
      'Given base network: 192.168.10.0/24 (256 addresses).',
      'Sort departmental requirements descending: CS Dept (60 hosts), IT Dept (28 hosts), Admin (12 hosts), Router Wan Link (2 hosts).',
      'Allocate /26 (64 addresses, 62 usable) to CS: 192.168.10.0/26.',
      'Allocate /27 (32 addresses, 30 usable) to IT: 192.168.10.64/27.',
      'Allocate /28 (16 addresses, 14 usable) to Admin: 192.168.10.96/28.',
      'Allocate /30 (4 addresses, 2 usable) to WAN Link: 192.168.10.112/30.',
      'Configure interface IP addresses and subnet masks on Cisco 1941 router.'
    ],
    expectedOutput: 'Zero address collisions; all departments communicate via default router gateway; wasted IP addresses minimized to under 15%.',
    commonErrors: [
      {
        error: 'Overlapping subnets error on router interface',
        cause: 'Allocating smaller subnets before larger subnets, causing subnet boundary misalignment.',
        solution: 'Always sort host requirements in strictly descending order before carving VLSM blocks.'
      }
    ],
    questions: [
      {
        id: 'exp6-q1',
        question: 'Why does a /30 subnet mask provide exactly 2 usable host addresses?',
        answer: 'A /30 mask leaves 2 host bits (32 - 30 = 2). Total addresses = 2^2 = 4. Subtracting 1 for Network ID and 1 for Directed Broadcast leaves exactly 4 - 2 = 2 usable IPs, perfect for point-to-point router links.'
      }
    ]
  },
  {
    id: 'exp-7',
    experimentNumber: 7,
    title: 'Configuration of Routing Protocols (RIPv2 & Single-Area OSPF) on Cisco Routers',
    aim: 'To configure and evaluate Distance Vector (RIPv2) and Link State (OSPF Area 0) dynamic routing protocols across multiple Cisco routers.',
    shortTheory: 'Dynamic routing protocols automatically discover remote subnets, update routing tables upon link failure, and determine lowest metric paths. RIP uses hop count (max 15), while OSPF uses cost based on link bandwidth.',
    requiredTools: ['Cisco Packet Tracer', '3x Cisco 1941 Routers', 'Serial / Gigabit WAN Links'],
    procedure: [
      'Configure IP addresses on FastEthernet and Serial interfaces of Router0, Router1, and Router2.',
      'Enable OSPF: "router ospf 1", define router-id, and add networks: "network 192.168.1.0 0.0.0.255 area 0".',
      'Verify neighbor adjacency: "show ip ospf neighbor".',
      'Inspect routing table: "show ip route" (look for \'O\' codes for OSPF routes).',
      'Simulate link failure by shutting down an interface ("shutdown") and observe instant link-state recalculation.'
    ],
    expectedOutput: 'OSPF adjacencies establish FULL state. Full routing convergence within 2-3 seconds. Continuous ping survives alternate link reroute.',
    commonErrors: [
      {
        error: 'OSPF neighbor fails to form (stuck in INIT or 2-WAY)',
        cause: 'Mismatch in Area ID, Hello/Dead timers, or MTU size across the link.',
        solution: 'Ensure both adjacent interfaces share identical Hello (10s) and Dead (40s) intervals and Area 0.'
      }
    ],
    questions: [
      {
        id: 'exp7-q1',
        question: 'What is the formula used by Cisco OSPF to calculate interface metric cost?',
        answer: 'Cost = Reference Bandwidth / Interface Bandwidth in bps = 10^8 / Bandwidth. FastEthernet (100 Mbps) cost = 1; GigabitEthernet cost = 1 (unless reference-bandwidth is adjusted).'
      }
    ]
  },
  {
    id: 'exp-8',
    experimentNumber: 8,
    title: 'Socket Programming: Client-Server Architecture using TCP and UDP in C/Python',
    aim: 'To write, compile, and execute concurrent TCP and UDP client-server socket communication programs in C/Python.',
    shortTheory: 'A network socket is an endpoint abstraction combining an IP address and Port number. TCP provides reliable, full-duplex, connection-oriented byte streams via 3-way handshake; UDP provides lightweight connectionless datagram messaging.',
    requiredTools: ['GCC Compiler or Python 3', 'Linux Terminal / Command Prompt', 'Netcat'],
    procedure: [
      'Server: Call socket(), bind() to INADDR_ANY and port 8080, listen(5) for connections, accept() incoming client, recv(), and send().',
      'Client: Call socket(), connect() to server IP:8080, send() request string, recv() server response, and close().',
      'Compile using "gcc server.c -o server" and run "./server" in terminal 1.',
      'Run "./client" in terminal 2 and observe two-way message echo.'
    ],
    expectedOutput: 'Client connects to server; bidirectional text transmission verified; connection closes gracefully with FIN-ACK.',
    commonErrors: [
      {
        error: 'Address already in use (bind error)',
        cause: 'Previous socket connection is in TIME_WAIT state holding the port.',
        solution: 'Enable SO_REUSEADDR socket option: setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt)).'
      }
    ],
    questions: [
      {
        id: 'exp8-q1',
        question: 'What is the difference between listen() and accept() in TCP socket programming?',
        answer: 'listen() transitions the socket into passive listening mode and sets the backlog queue size for pending connections. accept() blocks until a client connects, completes the 3-way handshake, and returns a new connected socket file descriptor dedicated to that client.'
      }
    ]
  }
];
