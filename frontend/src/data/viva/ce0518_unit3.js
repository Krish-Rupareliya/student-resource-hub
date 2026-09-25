// frontend/src/data/viva/ce0518_unit3.js
/**
 * CE0518 Unit 3: Network Layer
 * Indus University End Sem Question Bank
 */

export const CE0518_UNIT3_QUESTIONS = [
  {
    id: 'ce0518-u3-q1',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'Compare IPv4 & IPv6.',
    shortAnswer: 'IPv4 uses 32-bit addresses providing 4.3 billion unique IPs with a variable 20-60 byte header, requiring NAT and router fragmentation. IPv6 uses 128-bit addresses providing 3.4 × 10^38 addresses with a streamlined fixed 40-byte header, native IPSec security, source-only fragmentation, and auto-configuration (SLAAC).',
    detailedAnswer: 'A side-by-side technical comparison between Internet Protocol versions:\n\n1. Address Space: IPv4 has 32 bits (2^32 ≈ 4.29 × 10^9 addresses), which has been exhausted globally. IPv6 has 128 bits (2^128 ≈ 3.4 × 10^38 addresses), providing virtually infinite addressing.\n2. Header Architecture: IPv4 header is variable (20 to 60 bytes with Options). IPv6 has a streamlined fixed 40-byte base header with daisy-chained Extension Headers, dramatically accelerating router hardware forwarding.\n3. Checksum: IPv4 includes a 16-bit header checksum recalculated at every hop. IPv6 eliminates the checksum to reduce latency, relying on L2 and L4 checks.\n4. Fragmentation: In IPv4, both intermediate routers and the sending host can fragment packets. In IPv6, routers NEVER fragment; fragmentation is performed exclusively by the sending host using Path MTU Discovery.\n5. Broadcast vs Multicast: IPv4 uses Broadcast (ARP, etc.). IPv6 completely eliminates broadcast, replacing it with Multicast and Anycast.',
    keyPoints: [
      'IPv4: 32-bit (dotted-decimal), 20-60 byte header, NAT required.',
      'IPv6: 128-bit (hex colon-separated), fixed 40-byte base header, no NAT needed.',
      'IPv6 eliminates header checksum and broadcast addresses.',
      'IPv6 supports Stateless Address Autoconfiguration (SLAAC) and native IPSec.'
    ],
    example: 'IPv4 format: 192.168.1.1\nIPv6 format: 2001:0db8:85a3:0000:0000:8a2e:0370:7334 (or compressed: 2001:db8:85a3::8a2e:370:7334).',
    diagram: `+-----------------------+--------------------------+---------------------------+
| ATTRIBUTE             | IPv4                     | IPv6                      |
+-----------------------+--------------------------+---------------------------+
| Address Size          | 32 bits (4 bytes)        | 128 bits (16 bytes)       |
| Total Addresses       | ~4.29 Billion            | ~3.4 × 10^38 (Undecillion)|
| Header Size           | 20 - 60 bytes (Variable) | 40 bytes (Fixed)          |
| Header Checksum       | Present (Recalculated)   | Removed (Zero overhead)   |
| Fragmentation         | By Sender and Routers    | By Sender Only (PMTU)     |
| Security              | Optional (IPSec add-on)  | Mandatory / Native IPSec  |
| Broadcast Support     | Yes (Broadcast address)  | No (Multicast & Anycast)  |
+-----------------------+--------------------------+---------------------------+`,
    followUpQuestions: [
      {
        question: 'Why did IPv6 eliminate the header checksum?',
        answer: 'To drastically reduce packet processing latency at intermediate core routers. Both Data Link layer (CRC) and Transport layer (TCP/UDP checksums) already verify integrity.'
      }
    ],
    quickRevision: 'IPv4 uses 32-bit addresses with variable headers; IPv6 uses 128-bit addresses with a streamlined 40-byte fixed header, no checksum, and no broadcast.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.1'
    },
    tags: ['ipv4', 'ipv6', 'network-layer', 'ip-header', 'addressing']
  },
  {
    id: 'ce0518-u3-q2',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Explain about the IPV4 Header.',
    shortAnswer: 'The IPv4 header is a 20 to 60-byte control structure prepended to every IPv4 datagram. It consists of 14 fields: Version (4-bit), IHL (4-bit), Type of Service (8-bit), Total Length (16-bit), Identification (16-bit), Flags (3-bit), Fragment Offset (13-bit), Time to Live (8-bit), Protocol (8-bit), Header Checksum (16-bit), Source IP (32-bit), Destination IP (32-bit), and optional Padding.',
    detailedAnswer: 'Key Field Breakdown:\n1. Version (4 bits): Indicates IP version (always 0100 for IPv4).\n2. IHL (Internet Header Length, 4 bits): Multiplied by 4 to give header length in bytes. Minimum value is 5 (5 × 4 = 20 bytes); maximum is 15 (60 bytes).\n3. Type of Service / DSCP + ECN (8 bits): Quality of Service classification and Explicit Congestion Notification.\n4. Total Length (16 bits): Total length of IP datagram (Header + Data) in bytes. Maximum size = 65,535 bytes.\n5. Identification (16 bits): Unique integer identifying fragments of the same original datagram.\n6. Flags (3 bits): [Bit 0: Reserved (0), Bit 1: DF (Don\'t Fragment - 1=do not fragment), Bit 2: MF (More Fragments - 1=more fragments follow, 0=last fragment)].\n7. Fragment Offset (13 bits): Indicates the starting position of data in this fragment relative to original datagram in units of 8 bytes (64 bits).\n8. TTL (Time to Live, 8 bits): Hop counter decremented by 1 at every router. If TTL reaches 0, router discards packet and returns ICMP Time Exceeded (prevents infinite routing loops).\n9. Protocol (8 bits): Identifies payload protocol (6 = TCP, 17 = UDP, 1 = ICMP, 2 = IGMP, 89 = OSPF).\n10. Header Checksum (16 bits): 1s complement checksum covering the header only.\n11. Source & Destination IP Addresses (32 bits each): 4-byte logical addresses of sender and target.',
    keyPoints: [
      'Base header size is 20 bytes (IHL = 5); max 60 bytes with Options.',
      'Fragment Offset is measured in 8-byte blocks.',
      'TTL decrements at each hop to eliminate looping packets.',
      'Protocol numbers: TCP = 6, UDP = 17, ICMP = 1.'
    ],
    example: 'When Wireshark inspects a ping packet: Version = 4, IHL = 5 (20 bytes), TTL = 64, Protocol = 1 (ICMP), Source = 192.168.1.100, Destination = 8.8.8.8.',
    diagram: ` 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|Version|  IHL  |Type of Service|          Total Length         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Identification        |Flags|      Fragment Offset    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Time to Live |    Protocol   |        Header Checksum        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                       Source IP Address                       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Destination IP Address                     |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Options                    |    Padding    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+`,
    followUpQuestions: [
      {
        question: 'Why is the Fragment Offset field scaled by 8 bytes?',
        answer: 'Because the field is only 13 bits (max 8191). Multiplying by 8 allows addressing up to 8191 × 8 = 65,528 bytes, covering the full 65,535-byte IP datagram.'
      }
    ],
    quickRevision: 'The IPv4 header is 20-60 bytes containing Version, IHL, Total Length, ID, DF/MF flags, Fragment Offset, TTL, Protocol, Checksum, and Source/Dest IPs.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.2'
    },
    tags: ['ipv4-header', 'ttl', 'fragmentation', 'protocol', 'network-layer']
  },
  {
    id: 'ce0518-u3-q3',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'Explain IP addressing method.',
    shortAnswer: 'An IP address is a 32-bit numerical label assigned to each device connected to a computer network using the Internet Protocol. IP addressing methods comprise Classful Addressing (Classes A, B, C, D, E with fixed boundary masks) and Classless Addressing (CIDR / VLSM using variable-length slash notation prefixes).',
    detailedAnswer: 'IP addresses uniquely identify network interfaces. Every IPv4 address is split into two logical components: Network ID (NetID - identifies the specific network) and Host ID (HostID - identifies the specific node within that network).\n\n1. Classful Addressing Scheme (Historical RFC 791):\n   - Class A (0.0.0.0 to 127.255.255.255): 1st bit = 0. Default mask /8 (255.0.0.0). 126 networks, 16 million hosts each.\n   - Class B (128.0.0.0 to 191.255.255.255): 1st bits = 10. Default mask /16 (255.255.0.0). 16,384 networks, 65,534 hosts each.\n   - Class C (192.0.0.0 to 223.255.255.255): 1st bits = 110. Default mask /24 (255.255.255.0). 2 million networks, 254 hosts each.\n   - Class D (224.0.0.0 to 239.255.255.255): 1st bits = 1110. Reserved for Multicasting.\n   - Class E (240.0.0.0 to 255.255.255.255): 1st bits = 1111. Experimental / Research.\n\n2. Special IP Addresses:\n   - 127.0.0.1: Loopback address (localhost testing).\n   - 0.0.0.0: Default route / unknown network.\n   - 255.255.255.255: Limited broadcast address.\n   - Private IP Ranges (RFC 1918): 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 (not routable on public Internet; mapped via NAT).',
    keyPoints: [
      '32-bit address represented in dotted-decimal format (e.g. 192.168.1.1).',
      'Address = NetID + HostID.',
      'Classes A, B, C for unicast; Class D for multicast; Class E for research.',
      'Private IP ranges (10.x, 172.16-31.x, 192.168.x) save global address space via NAT.'
    ],
    example: 'In IP 192.168.10.50 with default /24 mask: Network ID is 192.168.10.0 and Host ID is 50.',
    diagram: `CLASSFUL ADDRESSING BOUNDARIES:
Class A: [0] [7-bit NetID]  [-------- 24-bit Host ID --------] (0 - 127)
Class B: [10] [14-bit NetID]         [--- 16-bit Host ID ----] (128 - 191)
Class C: [110] [21-bit NetID]                  [ 8-bit HostID] (192 - 223)
Class D: [1110] [---------- 28-bit Multicast Group ---------] (224 - 239)
Class E: [1111] [---------- 28-bit Experimental ------------] (240 - 255)`,
    followUpQuestions: [
      {
        question: 'What is the purpose of subnet mask in IP addressing?',
        answer: 'The subnet mask tells routers which bits belong to the Network prefix (1s) and which bits belong to the Host identifier (0s) via bitwise ANDing.'
      }
    ],
    quickRevision: 'IP addresses combine NetID and HostID; Classful addressing divides them into Classes A-E, while modern networks use CIDR prefix masks.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.3'
    },
    tags: ['ip-addressing', 'classful', 'classes', 'subnet-mask', 'network-id']
  },
  {
    id: 'ce0518-u3-q4',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Compare Classful and classless IP address.',
    shortAnswer: 'Classful addressing restricts network boundaries to fixed octets (/8, /16, /24), leading to massive address waste and bloated global routing tables. Classless addressing (CIDR - Classless Inter-Domain Routing) uses arbitrary bit-length prefix masks (/n), enabling Variable Length Subnet Masking (VLSM) and route summarization (supernetting) to conserve IPv4 space.',
    detailedAnswer: 'Comparison Breakdown:\n1. Boundary Flexibility: Classful enforces rigid boundaries (Class A = 8 bits, Class B = 16 bits, Class C = 24 bits). Classless supports any mask length from /1 to /32 (e.g., /22, /27, /30).\n2. Address Wastage: An organization requiring 300 hosts in Classful was forced to obtain a Class B license (65,534 hosts), wasting >65,000 IPs! In Classless, the ISP allocates a /23 block (512 addresses), wasting almost nothing.\n3. Routing Updates: Classful routing protocols (RIPv1, IGRP) do NOT transmit subnet masks in routing updates (mask is assumed from IP class). Classless routing protocols (RIPv2, OSPF, BGP) explicitly include subnet masks with every route advertisement.\n4. Route Aggregation (Supernetting): Classless allows combining multiple contiguous Class C networks into a single route entry (e.g., four /24 networks aggregated into one /22 route), drastically shrinking core router BGP routing tables.',
    keyPoints: [
      'Classful: Fixed /8, /16, /24 boundaries; severe address wastage.',
      'Classless (CIDR): Arbitrary prefix /n; tailored block allocations.',
      'Classless protocols (OSPF, RIPv2) include subnet masks in routing updates.',
      'Enables supernetting / route aggregation to shrink Internet routing tables.'
    ],
    example: 'Allocating 1000 IPs: In Classful, you must buy Class B (65,534 IPs - 98.5% waste!). In CIDR, you receive a /22 block (1024 IPs - 2.3% waste!).',
    diagram: `+----------------------+--------------------------+---------------------------+
| FEATURE              | CLASSFUL ADDRESSING      | CLASSLESS ADDRESSING (CIDR|
+----------------------+--------------------------+---------------------------+
| Mask Boundary        | Fixed (/8, /16, /24)     | Any prefix length (/1-/32)|
| Subnet Mask in Update| Not sent (Assumed)       | Explicitly transmitted    |
| Address Efficiency   | Low (Massive waste)      | High (Tailored blocks)    |
| Routing Protocols    | RIPv1, IGRP              | OSPF, EIGRP, BGP, RIPv2   |
| Supernetting         | Not supported            | Fully supported           |
+----------------------+--------------------------+---------------------------+`,
    followUpQuestions: [
      {
        question: 'What is Longest Prefix Match in CIDR routing?',
        answer: 'When a router has multiple overlapping routing table entries for a destination IP, it forwards the packet to the route with the most specific (longest) subnet mask.'
      }
    ],
    quickRevision: 'Classful uses fixed /8, /16, /24 boundaries with massive waste; Classless (CIDR) uses variable /n prefixes and transmits masks in routing updates.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.4'
    },
    tags: ['classful', 'classless', 'cidr', 'vlsm', 'supernetting']
  },
  {
    id: 'ce0518-u3-q5',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Explain ARP protocol.',
    shortAnswer: 'Address Resolution Protocol (ARP - RFC 826) dynamically resolves a known Layer 3 logical IP address into a physical Layer 2 hardware MAC address on a local broadcast link. The sender broadcasts an ARP Request ("Who has IP X?"), and the target unicasts back an ARP Reply ("I have IP X, here is my MAC").',
    detailedAnswer: 'Operating Mechanism:\n1. ARP Cache Check: When host A wants to send a frame to host B on the same LAN, it checks its local ARP cache table. If entry exists, it encapsulates the Ethernet frame immediately.\n2. ARP Request (Broadcast):\n   - If target MAC is not cached, Host A creates an ARP Request packet.\n   - Destination MAC = FF:FF:FF:FF:FF:FF (broadcast to all switch ports).\n   - Packet asks: "Who has IP 192.168.1.20? Tell 192.168.1.10."\n3. ARP Reply (Unicast):\n   - Every station receives the broadcast, but only the host matching the queried IP processes it.\n   - Host B updates its ARP cache with Host A\'s mapping, and sends an ARP Reply directly (unicast) to Host A\'s MAC containing its hardware address.\n4. Cache Retention: Host A caches the MAC address with an expiration timer (typically 15-20 minutes).\n5. Proxy ARP & Gratuitous ARP:\n   - Proxy ARP: A router replies to an ARP request on behalf of a remote subnet host.\n   - Gratuitous ARP: A host broadcasts its own IP/MAC mapping on boot to detect duplicate IP conflicts and update neighbor caches.',
    keyPoints: [
      'Resolves 32-bit IPv4 address -> 48-bit MAC address.',
      'ARP Request is Broadcast (FF:FF:FF:FF:FF:FF); ARP Reply is Unicast.',
      'Operates between Data Link (L2) and Network (L3) layers.',
      'Maintains a dynamic ARP Cache table with TTL timeouts.',
      'Gratuitous ARP checks for duplicate IP address conflicts.'
    ],
    example: 'PC0 (192.168.1.5) pings PC1 (192.168.1.10). PC0 broadcasts ARP Request. PC1 responds: "My MAC is 00:1A:2B:3C:4D:5E". PC0 caches it and sends the ICMP echo frame.',
    diagram: `ARP PROTOCOL FLOW:
[Host A: 192.168.1.5] --- ARP Request (Broadcast: FF:FF:FF:FF:FF:FF) ---> [All Hosts & Switch]
                       <--- ARP Reply (Unicast to Host A's MAC) ------- [Host B: 192.168.1.10]
                                                                        (MAC: 00:1A:2B:3C:4D:5E)`,
    followUpQuestions: [
      {
        question: 'What is ARP Spoofing / Poisoning?',
        answer: 'An attacker sends forged gratuitous ARP replies associating their MAC address with the default gateway\'s IP, enabling Man-in-the-Middle (MITM) packet interception.'
      },
      {
        question: 'How is address resolution handled in IPv6?',
        answer: 'IPv6 completely replaces ARP with ICMPv6 Neighbor Discovery Protocol (NDP) using solicited-node multicast messages.'
      }
    ],
    quickRevision: 'ARP maps IP to MAC: sender broadcasts an ARP Request, target unicasts an ARP Reply, and result is cached locally.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.5'
    },
    tags: ['arp', 'mac-address', 'broadcast', 'unicast', 'address-resolution']
  },
  {
    id: 'ce0518-u3-q6',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Explain subnetting.',
    shortAnswer: 'Subnetting is the process of partitioning a single large network into two or more smaller, logically distinct subnetworks (subnets) by borrowing bits from the host portion of an IP address to extend the network prefix. It reduces broadcast traffic, enhances network security, and optimizes address utilization.',
    detailedAnswer: 'Why Subnetting is Essential:\n1. Broadcast Containment: Broadcast packets are confined within each subnet, preventing network degradation (broadcast storms).\n2. Security Segregation: Restricts inter-department communication via router access control lists (ACLs).\n3. Address Conservation: Eliminates wasting huge blocks of host addresses.\n\nSubnetting Mathematics:\n- Let s = number of borrowed subnet bits.\n- Number of created subnets = 2^s.\n- Let h = remaining host bits.\n- Number of usable hosts per subnet = 2^h - 2 (subtracting 2 for Network ID and Directed Broadcast Address).\n- Subnet Mask Block Size (Magic Number) = 256 - Subnet Mask Octet Value = 2^h.\n\nWorked Example:\nSubnetting 192.168.1.0/24 into 4 subnets:\n- Borrow s = 2 bits (2^2 = 4 subnets). Remaining host bits h = 6.\n- New Subnet Mask: /26 = 11111111.11111111.11111111.11000000 = 255.255.255.192.\n- Block Size = 256 - 192 = 64.\n- Subnet 0: NetID 192.168.1.0, Hosts 192.168.1.1 to .62, Broadcast 192.168.1.63.\n- Subnet 1: NetID 192.168.1.64, Hosts 192.168.1.65 to .126, Broadcast 192.168.1.127.\n- Subnet 2: NetID 192.168.1.128, Hosts 192.168.1.129 to .190, Broadcast 192.168.1.191.\n- Subnet 3: NetID 192.168.1.192, Hosts 192.168.1.193 to .254, Broadcast 192.168.1.255.',
    keyPoints: [
      'Subnetting borrows host bits to form a subnet ID.',
      'Formula: Subnets = 2^s; Usable hosts = 2^h - 2.',
      'Always subtract 2 because all-0s host is NetID and all-1s host is Broadcast.',
      'Block size = 256 - mask octet value.'
    ],
    example: 'Dividing 192.168.1.0/24 into 4 subnets creates subnets starting at .0, .64, .128, and .192 with mask 255.255.255.192 (/26).',
    diagram: `SUBNETTING BIT DIVISION (/26):
[---------- 24-bit Network ID ----------] [2-bit Subnet] [6-bit Host ID]
11111111 . 11111111 . 11111111 .          1 1             0 0 0 0 0 0
< - - - - - - - Subnet Mask = 255.255.255.192 - - - - - - - - - - - - - >
Subnet 1: 192.168.1.0/26   (Hosts: .1 - .62)
Subnet 2: 192.168.1.64/26  (Hosts: .65 - .126)
Subnet 3: 192.168.1.128/26 (Hosts: .129 - .190)
Subnet 4: 192.168.1.192/26 (Hosts: .193 - .254)`,
    followUpQuestions: [
      {
        question: 'Why can we not assign the first and last address of a subnet to a host?',
        answer: 'The first address (host bits all 0s) represents the Subnet Network Identifier; the last address (host bits all 1s) is reserved for the Subnet Directed Broadcast.'
      }
    ],
    quickRevision: 'Subnetting borrows host bits to create subnets (2^s subnets, 2^h - 2 hosts); limits broadcast domains and optimizes IP distribution.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.6'
    },
    tags: ['subnetting', 'vlsm', 'subnet-mask', 'network-id', 'ip-calculation']
  },
  {
    id: 'ce0518-u3-q7',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Define routing & explain distance vector routing and link state routing.',
    shortAnswer: 'Routing is the network-layer process of determining optimal forwarding paths for packets from source to destination across internetworks. Distance Vector Routing (Bellman-Ford) shares full routing tables periodically with direct neighbors only ("routing by rumor"). Link State Routing (Dijkstra SPF) floods link status advertisements to all routers, giving every router a complete map of the entire network topology.',
    detailedAnswer: '1. Distance Vector Routing (e.g., RIP):\n   - Algorithm: Distributed Bellman-Ford.\n   - Information Exchanged: Vector of distances (hop counts) to all known destinations.\n   - Sharing Scope: Communicates only with directly connected neighbors.\n   - Periodic Updates: Broadcasts/multicasts full routing table every 30 seconds.\n   - Drawbacks: Slow convergence, high bandwidth overhead on large networks, vulnerable to Count-to-Infinity routing loops.\n\n2. Link State Routing (e.g., OSPF, IS-IS):\n   - Algorithm: Dijkstra\'s Shortest Path First (SPF).\n   - Information Exchanged: Link State Advertisements (LSAs) containing the status, bandwidth, and cost of directly connected links.\n   - Sharing Scope: Floods LSAs to ALL routers in the routing domain.\n   - Event-Triggered Updates: Sends updates only when a link state changes (or periodic refresh every 30 mins).\n   - Advantages: Fast convergence (seconds), zero loops, builds full topology tree.\n   - Drawback: Higher memory and CPU utilization.',
    keyPoints: [
      'Routing: Path selection algorithm at Layer 3.',
      'Distance Vector: "Tells neighbors about the whole world"; slow convergence.',
      'Link State: "Tells the whole world about direct neighbors"; fast convergence.',
      'Distance Vector uses Bellman-Ford (RIP); Link State uses Dijkstra SPF (OSPF).'
    ],
    example: 'Distance Vector is asking someone on the street for directions (they tell you what direction to walk next). Link State is downloading Google Maps (you see the entire city map and compute the best path yourself).',
    diagram: `+----------------------+--------------------------+---------------------------+
| ATTRIBUTE            | DISTANCE VECTOR          | LINK STATE                |
+----------------------+--------------------------+---------------------------+
| Algorithm            | Bellman-Ford             | Dijkstra SPF              |
| Knowledge            | Neighborhood distance    | Entire network topology   |
| Updates Sent To      | Direct neighbors only    | Flooded to all routers    |
| Update Trigger       | Periodic (e.g., 30s)     | Event-driven (link changes|
| Convergence Speed    | Slow (Count-to-Infinity) | Extremely fast            |
| Protocols            | RIPv1, RIPv2, IGRP       | OSPF, IS-IS               |
+----------------------+--------------------------+---------------------------+`,
    followUpQuestions: [
      {
        question: 'What is the Count-to-Infinity problem in Distance Vector routing?',
        answer: 'When a link breaks, neighboring routers may slowly increment hop counts back and forth until reaching the metric infinity (16 in RIP) before realizing the destination is unreachable.'
      }
    ],
    quickRevision: 'Distance Vector exchanges table summaries with neighbors (Bellman-Ford); Link State floods link statuses to everyone to build a full network map (Dijkstra).',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.7'
    },
    tags: ['routing', 'distance-vector', 'link-state', 'ospf', 'rip', 'dijkstra']
  },
  {
    id: 'ce0518-u3-q8',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Write a note on ICMP.',
    shortAnswer: 'Internet Control Message Protocol (ICMP - RFC 792) is a network-layer companion protocol to IPv4 (Protocol 1) used by routers and hosts to report communication errors (Destination Unreachable, Time Exceeded) and diagnostic operational queries (Echo Request / Reply used by Ping).',
    detailedAnswer: 'Because IPv4 is an unreliable best-effort protocol with no built-in feedback, ICMP provides error reporting and diagnostics:\n\n1. Encapsulation: ICMP messages are encapsulated directly inside IP datagrams (IP Protocol field = 1).\n2. Common ICMP Message Types:\n   - Type 0: Echo Reply (ping response)\n   - Type 8: Echo Request (ping query)\n   - Type 3: Destination Unreachable (Code 0: Net unreachable, Code 1: Host unreachable, Code 3: Port unreachable, Code 4: Fragmentation needed but DF set)\n   - Type 11: Time Exceeded (Code 0: TTL expired in transit - exploited by Traceroute)\n   - Type 5: Redirect (informs host of a better first-hop router)\n   - Type 12: Parameter Problem (corrupted IP header field)\n3. Critical Rule: ICMP error messages are NEVER generated in response to an ICMP error message, preventing infinite broadcast cascades.',
    keyPoints: [
      'Layer 3 companion protocol (Protocol number 1).',
      'Provides error reporting and diagnostic queries (Ping, Traceroute).',
      'Ping uses Echo Request (Type 8) and Echo Reply (Type 0).',
      'Traceroute exploits TTL Time Exceeded (Type 11) to discover routers.',
      'Does not correct errors; simply notifies source host.'
    ],
    example: 'Executing "ping 8.8.8.8" transmits ICMP Type 8 Echo Request. The Google server replies with ICMP Type 0 Echo Reply with RTT timing.',
    diagram: `ICMP PACKET FORMAT:
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|     Type      |     Code      |           Checksum            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                 Rest of Header (ID, Seq, etc.)                |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|       Data / Original IP Header + First 8 Bytes of Payload    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+`,
    followUpQuestions: [
      {
        question: 'How does Traceroute use ICMP to map paths?',
        answer: 'Traceroute sends UDP/ICMP packets with increasing TTL values (TTL=1, 2, 3...). Each intermediate router drops the packet when TTL=0 and returns an ICMP Time Exceeded (Type 11) packet revealing its IP.'
      }
    ],
    quickRevision: 'ICMP reports network errors and diagnostics; powers Ping (Echo Request Type 8 / Reply Type 0) and Traceroute (Time Exceeded Type 11).',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.8'
    },
    tags: ['icmp', 'ping', 'traceroute', 'network-layer', 'error-reporting']
  },
  {
    id: 'ce0518-u3-q9',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Write a note on RIP.',
    shortAnswer: 'Routing Information Protocol (RIP - RFC 1058 / RFC 2453) is an Interior Gateway Protocol (IGP) based on the Distance Vector Bellman-Ford algorithm. It uses Hop Count as its routing metric (maximum 15 hops; 16 signifies unreachable/infinity) and broadcasts/multicasts full routing tables to neighbors every 30 seconds.',
    detailedAnswer: 'RIP Architecture & Mechanics:\n1. Metric: Hop Count. Every router traversed counts as 1 hop, regardless of whether the link is 10 Mbps copper or 10 Gbps fiber optic.\n2. Hop Limit: Maximum valid hops = 15. A hop count of 16 represents infinity (unreachable destination), limiting RIP to small networks.\n3. Timers:\n   - Periodic Update Timer: 30 seconds (sends full routing table).\n   - Invalid / Route Timeout: 180 seconds (marks route unreachable if no refresh).\n   - Flush Timer: 240 seconds (removes route from table).\n4. RIPv1 vs RIPv2:\n   - RIPv1: Classful, broadcasts to 255.255.255.255, no subnet masks, no authentication.\n   - RIPv2: Classless (supports CIDR/VLSM), multicasts to 224.0.0.9, MD5 authentication.\n5. Loop Prevention: Employs Split Horizon (do not advertise a route back out the interface it was learned from) and Poison Reverse (advertise broken route with hop count 16).',
    keyPoints: [
      'Distance Vector IGP using Bellman-Ford algorithm.',
      'Metric is Hop Count (maximum 15; 16 = Infinity).',
      'RIPv2 multicasts to 224.0.0.9 and supports CIDR / VLSM.',
      'Uses Split Horizon and Poison Reverse to prevent routing loops.',
      'Sends full routing updates every 30 seconds.'
    ],
    example: 'Path A traverses two 10 Mbps links (2 hops). Path B traverses three 1 Gbps fiber links (3 hops). RIP chooses slower Path A because 2 hops < 3 hops!',
    diagram: `RIP ROUTING MECHANISM:
[Router A] <=== Update (30s) ===> [Router B] <=== Update (30s) ===> [Router C]
Max Hops: 15. Hop 16 = UNREACHABLE!
RIPv2 Multicast Address: 224.0.0.9`,
    followUpQuestions: [
      {
        question: 'What is Split Horizon with Poison Reverse?',
        answer: 'Split Horizon states a router never advertises a route back to the neighbor it learned it from. Poison Reverse overrides this by advertising the route back with hop count 16 (infinity) to proactively prevent loops.'
      }
    ],
    quickRevision: 'RIP is a distance-vector protocol using hop count (max 15 hops; 16 = infinity) and 30-second periodic updates; best suited for small networks.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.9'
    },
    tags: ['rip', 'distance-vector', 'hop-count', 'routing', 'igp']
  },
  {
    id: 'ce0518-u3-q10',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Write a note on OSPF.',
    shortAnswer: 'Open Shortest Path First (OSPF - RFC 2328) is an open-standard, classless Link State Interior Gateway Protocol based on Dijkstra\'s Shortest Path First (SPF) algorithm. It calculates metric Cost inversely proportional to link bandwidth (Cost = 10^8 / Bandwidth), converges within seconds, and uses a hierarchical two-tier area architecture centered around Backbone Area 0.',
    detailedAnswer: 'OSPF Features & Architecture:\n1. Link-State Foundation: Every OSPF router floods Link State Advertisements (LSAs). Each router maintains an identical Link State Database (LSDB) and runs Dijkstra\'s algorithm to build a loop-free shortest path tree.\n2. Metric (Cost): Cost = Reference Bandwidth / Interface Bandwidth (bps). Standard reference bandwidth = 100 Mbps (10^8). 100 Mbps Ethernet cost = 1; 10 Mbps Ethernet cost = 10.\n3. Hierarchical Areas:\n   - Area 0 (Backbone Area): All non-backbone areas (Area 1, Area 2...) must connect directly to Area 0 through Area Border Routers (ABRs).\n   - Reduces LSDB size and confines route recalculations within local areas.\n4. Router Roles:\n   - DR (Designated Router) & BDR (Backup Designated Router): Elected on multi-access broadcast segments to avoid N*(N-1)/2 peering adjacencies. Other routers form adjacencies only with DR/BDR via multicast 224.0.0.6.\n5. Event-Driven Updates: LSAs are triggered immediately upon link status changes, achieving near-instant convergence.',
    keyPoints: [
      'Link-state IGP using Dijkstra SPF algorithm.',
      'Metric: Cost = Reference Bandwidth / Interface Bandwidth.',
      'Hierarchical structure: Core Area 0 (Backbone) + standard areas.',
      'Elected DR/BDR routers minimize LSA flooding on broadcast networks.',
      'Event-triggered updates deliver convergence within seconds.'
    ],
    example: 'In an enterprise campus, Area 0 connects core data center routers, while Area 1 handles the CS Department and Area 2 handles the Admin building.',
    diagram: `OSPF HIERARCHICAL TWO-TIER DESIGN:
      [Area 1: Engineering] <---+
                                |
                   [Backbone Area 0] <--- (Core ABRs)
                                |
      [Area 2: Business]   <----+`,
    followUpQuestions: [
      {
        question: 'Why does OSPF elect a Designated Router (DR)?',
        answer: 'On a broadcast network with N routers, full meshing requires N(N-1)/2 adjacencies. Electing a DR and BDR reduces adjacencies to 2(N-1), dramatically cutting LSA flooding overhead.'
      }
    ],
    quickRevision: 'OSPF is a link-state routing protocol using Dijkstra\'s SPF algorithm, bandwidth-based cost, hierarchical Area 0, and DR/BDR election for fast convergence.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.10'
    },
    tags: ['ospf', 'link-state', 'dijkstra', 'area-0', 'dr-bdr', 'routing']
  },
  {
    id: 'ce0518-u3-q11',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Compare distance vector routing and link state routing.',
    shortAnswer: 'Distance Vector routing (RIP) uses the Bellman-Ford algorithm where routers share entire routing tables periodically with direct neighbors only, suffering from slow convergence and count-to-infinity loops. Link State routing (OSPF) uses Dijkstra\'s algorithm where routers flood link statuses to all routers, creating an identical global topology map with rapid convergence and zero loops.',
    detailedAnswer: 'Comprehensive Comparison Matrix:\n\n1. Underlying Algorithm: Distance Vector relies on Bellman-Ford; Link State relies on Dijkstra\'s Shortest Path First (SPF).\n2. Network Topology Knowledge: Distance Vector routers have zero map visibility (they only know neighbor vectors - "routing by rumor"). Link State routers build a complete, synchronized map of every router and link in the network.\n3. Metric: Distance Vector uses simple hop count (RIP max 15). Link State uses composite cost based on link bandwidth, delay, and reliability.\n4. Update Mechanism: Distance Vector transmits full routing tables periodically (every 30s) even when network is static. Link State sends small, event-triggered Link State Advertisements (LSAs) only when a link changes state.\n5. Convergence Speed: Distance Vector is slow to converge and susceptible to loops. Link State converges in seconds without loops.\n6. Hardware Resource Requirements: Distance Vector requires minimal CPU and memory. Link State requires substantial memory to store the LSDB and high CPU to run Dijkstra SPF calculations.',
    keyPoints: [
      'Distance Vector: "Routing by rumor", periodic updates to neighbors, hop count metric.',
      'Link State: Full topology map, event-driven flooding to all routers, bandwidth cost.',
      'RIP is Distance Vector; OSPF and IS-IS are Link State.',
      'Link State converges significantly faster and eliminates count-to-infinity.'
    ],
    example: 'Distance Vector is blindly following roadside signs at each intersection. Link State is using GPS navigation with a live satellite traffic map.',
    diagram: `+-----------------------+--------------------------+---------------------------+
| FEATURE               | DISTANCE VECTOR (RIP)    | LINK STATE (OSPF)         |
+-----------------------+--------------------------+---------------------------+
| Algorithm             | Bellman-Ford             | Dijkstra's SPF            |
| Network Knowledge     | Direct neighbors only    | Full network topology map |
| Metric Used           | Hop count (Max 15)       | Cost (Inverse bandwidth)  |
| Update Timing         | Periodic (e.g. 30s)      | Event-triggered (changes) |
| Convergence           | Slow                     | Fast (Near-instantaneous) |
| Loop Vulnerability    | Yes (Count-to-Infinity)  | No (Loop-free by design)  |
| CPU / Memory Overhead | Low                      | Moderate to High          |
+-----------------------+--------------------------+---------------------------+`,
    followUpQuestions: [
      {
        question: 'What is the administrative distance (AD) of RIP vs OSPF in Cisco routers?',
        answer: 'OSPF has an AD of 110, while RIP has an AD of 120. A lower AD means higher trustworthiness, so routers will always prefer OSPF over RIP.'
      }
    ],
    quickRevision: 'Distance Vector exchanges hop vectors with neighbors (Bellman-Ford); Link State floods link changes to all routers to compute shortest paths (Dijkstra).',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.11'
    },
    tags: ['distance-vector', 'link-state', 'comparison', 'rip', 'ospf', 'routing']
  },
  {
    id: 'ce0518-u3-q12',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'practical',
    difficulty: 'intermediate',
    question: 'To solve the examples related to identify netid, hostid, subnet mask.',
    shortAnswer: 'To identify NetID, HostID, and Subnet Mask: 1. Determine address class or prefix (/n). 2. Bitwise AND the IP address with the Subnet Mask to obtain the Network ID (NetID). 3. Subtract the NetID from the IP address to get the HostID. 4. For CIDR prefixes, convert the prefix length to decimal octets.',
    detailedAnswer: 'Step-by-Step Solved Numericals:\n\nExample 1 (Classful):\nGiven IP Address: 192.168.10.75\n- Class: 1st octet 192 falls in [192-223] -> Class C.\n- Default Subnet Mask: 255.255.255.0 (/24).\n- Network ID (NetID): First 3 octets = 192.168.10.0.\n- Host ID: Last octet = 75 (or 0.0.0.75).\n- Directed Broadcast Address: 192.168.10.255.\n\nExample 2 (Classless / CIDR):\nGiven IP Address: 172.16.45.10/20\n1. Subnet Mask Determination:\n   - Prefix /20 has 20 ones and 12 zeros: 11111111.11111111.11110000.00000000\n   - Decimal Subnet Mask = 255.255.240.0.\n2. Interesting Octet & Block Size:\n   - 3rd octet has mask value 240.\n   - Block size = 256 - 240 = 16.\n3. NetID Calculation:\n   - Subnet boundaries in 3rd octet occur in multiples of 16: 0, 16, 32, 48...\n   - Since 32 <= 45 < 48, the subnet boundary is 32.\n   - Subnet Network ID = 172.16.32.0.\n4. Broadcast & Host Range:\n   - Next Subnet = 172.16.48.0.\n   - Broadcast Address = 172.16.47.255.\n   - Valid Usable Host Range = 172.16.32.1 to 172.16.47.254 (Total 4,094 usable hosts).\n   - Host ID within subnet = offset from 172.16.32.0.',
    keyPoints: [
      'NetID = IP Address AND Subnet Mask.',
      'HostID = IP address with NetID bits zeroed.',
      'Block size = 256 - mask value in interesting octet.',
      'Broadcast address is always 1 less than the next subnet NetID.'
    ],
    example: 'For 10.50.120.7/16: Subnet Mask = 255.255.0.0. NetID = 10.50.0.0. HostID = 120.7. Broadcast = 10.50.255.255.',
    diagram: `BITWISE AND OPERATION TO FIND NetID:
IP Address:   192.168. 10. 75 -> 11000000.10101000.00001010.01001011
Subnet Mask:  255.255.255.  0 -> 11111111.11111111.11111111.00000000
---------------------------------------------------------------------
Network ID:   192.168. 10.  0 -> 11000000.10101000.00001010.00000000`,
    followUpQuestions: [
      {
        question: 'What is the subnet mask for a /29 network and how many usable hosts does it provide?',
        answer: 'Mask is 255.255.255.248. Remaining host bits = 3 (32 - 29). Usable hosts = 2^3 - 2 = 6 hosts.'
      }
    ],
    quickRevision: 'NetID = IP AND Subnet Mask; HostID = remaining host bits; Block size = 256 - mask octet; usable hosts = 2^h - 2.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.12'
    },
    tags: ['numerical', 'netid', 'hostid', 'subnet-mask', 'cidr-calculation']
  },
  {
    id: 'ce0518-u3-q13',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'Explain internetworking.',
    shortAnswer: 'Internetworking is the practice of interconnecting multiple disparate computer networks (different architectures, link technologies, frame sizes, and transmission media) using routers, switches, and gateways to function as a single, seamless, cooperative communication network (an internetwork or the Internet).',
    detailedAnswer: 'Challenges and Solutions in Internetworking:\n1. Heterogeneous Technologies: Different LANs/WANs use different framing (Ethernet, Wi-Fi, ATM, MPLS). Internetworking relies on IP (Layer 3) as a universal abstraction layer that encapsulates underlying L2 payloads.\n2. Addressing Differences: Different networks use distinct physical addressing formats. IP provides a globally unique logical addressing scheme (IPv4/IPv6).\n3. Packet Size Discrepancies (MTU): Ethernet MTU is 1500 bytes, while Wi-Fi is 2304 bytes and FDDI is 4352 bytes. Internetworking solves this through fragmentation and reassembly at routers.\n4. Routing & Interconnection: Interconnected via routers that maintain autonomous system routing tables (IGP like OSPF internally, EGP like BGP externally).',
    keyPoints: [
      'Connects distinct networks into a unified communication system.',
      'IP operates as the universal unifying protocol layer.',
      'Routers bridge disparate media and resolve MTU differences via fragmentation.',
      'BGP coordinates routing between independent Autonomous Systems (AS).'
    ],
    example: 'A student on a smartphone using 5G cellular network downloads a PDF hosted on a college web server connected via Gigabit Ethernet; internetworking protocols seamlessly handle the protocol conversions across intermediate ISPs.',
    diagram: `INTERNETWORKING TOPOLOGY:
[Ethernet LAN] --- (Switch) --- [Router A] === WAN Backbone === [Router B] --- (AP) --- [Wi-Fi LAN]
                                 ^                               ^
                        [Translates Framing]            [Translates Framing]`,
    followUpQuestions: [
      {
        question: 'What is an Autonomous System (AS)?',
        answer: 'An Autonomous System is a collection of connected IP routing prefixes under the control of a single administrative entity (e.g., an ISP or university) presenting a unified routing policy.'
      }
    ],
    quickRevision: 'Internetworking connects heterogeneous networks using routers and the universal IP protocol to deliver seamless global communication.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.13'
    },
    tags: ['internetworking', 'heterogeneous-networks', 'mtu', 'routers', 'ip']
  },
  {
    id: 'ce0518-u3-q14',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'advanced',
    question: 'Explain shortest path routing algorithm.',
    shortAnswer: 'The Shortest Path Routing algorithm (Dijkstra\'s Algorithm) finds the path of lowest cumulative cost from a source router to all other nodes in a network graph. It operates greedily by maintaining tentative distances, iteratively selecting the unvisited node with the minimum distance, and relaxing all outgoing edges until all nodes are permanently labeled.',
    detailedAnswer: 'Dijkstra\'s Shortest Path Algorithm Step-by-Step:\n1. Graph Representation: Network is modeled as a weighted graph G = (V, E) where vertices V are routers and edges E are communication links with non-negative weights (cost/delay).\n2. Initialization:\n   - Set dist[source] = 0; for all other nodes v, dist[v] = ∞.\n   - Set of visited nodes S = ∅.\n3. Iteration:\n   - Select unvisited node u with the minimum tentative dist[u].\n   - Add u to permanent visited set S: S = S ∪ {u}.\n   - Relaxation: For each unvisited neighbor v of u, calculate: new_dist = dist[u] + cost(u, v).\n   - If new_dist < dist[v], update: dist[v] = new_dist, and set parent[v] = u.\n4. Termination: Repeat until all nodes are visited (S = V). The resulting tree is the Shortest Path Tree (SPT).\n5. Computational Complexity: O(V^2) with an array; O((V + E) log V) using a min-heap/priority queue.\n6. Protocol Implementation: OSPF runs Dijkstra\'s algorithm inside each router to construct its forwarding table.',
    keyPoints: [
      'Greedy algorithm developed by Edsger W. Dijkstra.',
      'Builds loop-free Shortest Path Tree (SPT) from source to all destinations.',
      'Relaxation step: dist[v] = min(dist[v], dist[u] + weight(u, v)).',
      'Requires non-negative edge weights; powers OSPF and IS-IS.'
    ],
    example: 'Router A connects to B (cost 2) and C (cost 5). B connects to C (cost 1). Direct path A->C costs 5. Dijkstra finds path A->B->C with total cost 2 + 1 = 3, choosing the lower-cost indirect route.',
    diagram: `DIJKSTRA'S SHORTEST PATH TREE (SPT):
       (2)             (1)
[A] ---------> (B) ---------> (C)
 |                             ^
 +------------ (5) ------------+  (Direct path cost 5 > Indirect cost 3!)
Shortest path to C: A -> B -> C (Cost = 3)`,
    followUpQuestions: [
      {
        question: 'Can Dijkstra\'s algorithm work with negative edge weights?',
        answer: 'No. Negative edge weights can create negative cycles, requiring the Bellman-Ford algorithm instead.'
      }
    ],
    quickRevision: 'Dijkstra\'s algorithm greedily relaxes edges to compute the lowest cumulative cost tree from source to all routers; forms the core of OSPF.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.14'
    },
    tags: ['dijkstra', 'shortest-path', 'spf', 'graph-theory', 'ospf', 'algorithms']
  },
  {
    id: 'ce0518-u3-q15',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Explain IPv6.',
    shortAnswer: 'IPv6 is the next-generation Internet Protocol developed by the IETF (RFC 8200) to succeed IPv4. It features 128-bit addresses (3.4 × 10^38 unique IPs), a fixed 40-byte base header, daisy-chained extension headers, stateless address auto-configuration (SLAAC), mandatory IPSec security, and eliminates broadcast in favor of multicast and anycast.',
    detailedAnswer: 'Comprehensive Architecture of IPv6:\n1. Addressing Representation:\n   - 128 bits represented as 8 groups of 4 hexadecimal digits separated by colons: 2001:0db8:85a3:0000:0000:8a2e:0370:7334.\n   - Compression Rule 1: Leading zeros in any block may be omitted (0000 -> 0; 0db8 -> db8).\n   - Compression Rule 2: A contiguous sequence of all-zero blocks can be replaced by "::" once per address (e.g. fe80::1).\n2. Header Architecture:\n   - Streamlined fixed 40-byte base header: Version (4), Traffic Class (8), Flow Label (20), Payload Length (16), Next Header (8), Hop Limit (8), Source IP (128), Destination IP (128).\n   - Next Header field daisy-chains Extension Headers (Hop-by-hop options, Routing, Fragment, ESP, AH) only when needed.\n3. Address Types:\n   - Unicast: Identifies a single interface.\n   - Multicast: Identifies a group of interfaces; replaces broadcast.\n   - Anycast: Identifies a group of interfaces where a packet is routed to the nearest member (measured by routing distance).\n4. Stateless Autoconfiguration (SLAAC):\n   - Hosts generate their own IPv6 address combining the router\'s advertised /64 network prefix with their MAC-derived EUI-64 or random 64-bit interface ID without needing DHCP.',
    keyPoints: [
      '128-bit address space provides 3.4 × 10^38 unique addresses.',
      'Fixed 40-byte base header accelerates hardware routing.',
      'Extension Headers are linked sequentially using the Next Header pointer.',
      'Eliminates Broadcast; uses Multicast and Anycast.',
      'SLAAC enables automatic zero-configuration address generation.'
    ],
    example: 'Link-local IPv6 address auto-assigned to an interface: fe80::1a2b:3c4d:5e6f:7081/64.',
    diagram: `IPv6 FIXED 40-BYTE BASE HEADER:
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|Version| Traffic Class |           Flow Label (20 bits)        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Payload Length        |  Next Header  |   Hop Limit   |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                                                               +
|                                                               |
+                   Source Address (128 bits)                   +
|                                                               |
+                                                               +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                                                               +
|                                                               |
+                Destination Address (128 bits)                 +
|                                                               |
+                                                               +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+`,
    followUpQuestions: [
      {
        question: 'What is the purpose of the Flow Label field in the IPv6 header?',
        answer: 'The 20-bit Flow Label allows routers to identify packets belonging to the same real-time traffic flow (e.g. VoIP, video streaming) and maintain the same path and QoS without inspecting deep packet headers.'
      }
    ],
    quickRevision: 'IPv6 provides 128-bit addresses, fixed 40-byte headers, daisy-chained extension headers, auto-configuration (SLAAC), and replaces broadcast with multicast.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.15'
    },
    tags: ['ipv6', '128-bit', 'extension-header', 'slaac', 'flow-label']
  },
  {
    id: 'ce0518-u3-q16',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Write a note on working of ICMP protocol.',
    shortAnswer: 'ICMP works as an out-of-band supervisory protocol that generates feedback when packet forwarding fails. When a router encounters an error (TTL expires, network unreachable, port closed), it creates an ICMP packet containing the error Type/Code, prepends the original IP header + first 8 bytes of payload, and routes it back to the original source IP.',
    detailedAnswer: 'Operational Workflow of ICMP:\n1. Trigger Condition: A router or destination host encounters a fatal forwarding condition (e.g., TTL drops to 0, router buffer is full, destination port is not listening, or packet exceeds MTU with DF bit set).\n2. Packet Generation:\n   - Router extracts the source IP address from the failed packet.\n   - Generates an ICMP message: Type (8 bits), Code (8 bits), and Checksum (16 bits).\n   - Payload inclusion: Router appends the entire IPv4 header of the offending datagram plus the first 8 bytes of that datagram\'s payload (which contains TCP/UDP source and destination port numbers). This allows the sending OS to identify exactly which process or socket caused the error.\n3. Encapsulation & Transmission: The ICMP packet is encapsulated in a standard IPv4 datagram with Protocol = 1 and routed back to the sender.\n4. Sender Action: The sender\'s networking stack reads the ICMP error and notifies the corresponding application (e.g., throwing "Connection Refused" or "Network Unreachable" socket exceptions).',
    keyPoints: [
      'Encapsulates error Type, Code, and Checksum inside IP (Protocol 1).',
      'Includes original IP header + first 8 bytes of payload so sender identifies the socket.',
      'Never generates ICMP errors for another ICMP error to prevent loops.',
      'Never generates ICMP errors for broadcast/multicast packets.'
    ],
    example: 'A client attempts to connect to port 9999 on a server with no service listening. The server OS sends back ICMP Type 3, Code 3 (Destination Port Unreachable), prompting client terminal to print "Connection Refused".',
    diagram: `ICMP ERROR PACKET CONSTRUCTION:
[ICMP Header: Type + Code] + [Offending IP Header (20B)] + [First 8 Bytes of Offending Data]
< - - - - - - - - Encapsulated into new IP Datagram to Source - - - - - - - - - - - - >`,
    followUpQuestions: [
      {
        question: 'Why does an ICMP error packet include the first 8 bytes of the offending datagram?',
        answer: 'The first 8 bytes of TCP/UDP payload contain the Source and Destination Port numbers, enabling the sending operating system to map the error to the exact user process/socket.'
      }
    ],
    quickRevision: 'ICMP encapsulates error codes along with the original IP header + 8 bytes of payload and sends it back to the source to notify user sockets.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.16'
    },
    tags: ['icmp', 'error-reporting', 'ttl-expired', 'network-layer', 'transport-socket']
  },
  {
    id: 'ce0518-u3-q17',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'practical',
    difficulty: 'advanced',
    question: 'With a real time scenario explain IP addressing and subnetting.',
    shortAnswer: 'In a real-world scenario, an enterprise with a single assigned block (e.g., 192.168.1.0/24) uses Variable Length Subnet Masking (VLSM) to allocate IP blocks matching the exact host needs of diverse departments (CS Lab: 60 hosts, IT Lab: 28 hosts, Admin: 12 hosts, WAN link: 2 hosts), minimizing wasted address space to under 15%.',
    detailedAnswer: 'Real-Time Enterprise Campus Scenario:\nAn engineering college receives network address 192.168.1.0/24 (256 total IP addresses). It must accommodate 4 separate departments with minimal IP waste:\n\nStep 1: Sort Requirements Descending:\n1. Computer Science Lab: 60 hosts\n2. Information Tech Lab: 28 hosts\n3. Administrative Office: 12 hosts\n4. Router Point-to-Point WAN Link: 2 hosts\n\nStep 2: Calculate Subnets using VLSM:\n1. CS Lab (60 hosts):\n   - Needs 2^h - 2 >= 60 -> h = 6 host bits (2^6 - 2 = 62 usable hosts).\n   - Prefix = 32 - 6 = /26 (Subnet mask 255.255.255.192).\n   - Subnet Address: 192.168.1.0/26\n   - Usable Range: 192.168.1.1 to 192.168.1.62\n   - Broadcast: 192.168.1.63\n\n2. IT Lab (28 hosts):\n   - Next available IP = 192.168.1.64.\n   - Needs 2^h - 2 >= 28 -> h = 5 host bits (2^5 - 2 = 30 usable hosts).\n   - Prefix = 32 - 5 = /27 (Subnet mask 255.255.255.224).\n   - Subnet Address: 192.168.1.64/27\n   - Usable Range: 192.168.1.65 to 192.168.1.94\n   - Broadcast: 192.168.1.95\n\n3. Admin Office (12 hosts):\n   - Next available IP = 192.168.1.96.\n   - Needs 2^h - 2 >= 12 -> h = 4 host bits (2^4 - 2 = 14 usable hosts).\n   - Prefix = 32 - 4 = /28 (Subnet mask 255.255.255.240).\n   - Subnet Address: 192.168.1.96/28\n   - Usable Range: 192.168.1.97 to 192.168.1.110\n   - Broadcast: 192.168.1.111\n\n4. Router WAN Link (2 hosts):\n   - Next available IP = 192.168.1.112.\n   - Needs 2^h - 2 = 2 -> h = 2 host bits (2^2 - 2 = 2 usable hosts).\n   - Prefix = 32 - 2 = /30 (Subnet mask 255.255.255.252).\n   - Subnet Address: 192.168.1.112/30\n   - Usable Range: 192.168.1.113 to 192.168.1.114\n   - Broadcast: 192.168.1.115\n\nRemaining Unallocated Space: 192.168.1.116 to 192.168.1.255 (140 IP addresses reserved for future campus expansion).',
    keyPoints: [
      'Always sort host requirements in descending order.',
      'CS Lab gets /26 (62 hosts); IT Lab gets /27 (30 hosts); Admin gets /28 (14 hosts).',
      'Router point-to-point links always use /30 (2 usable hosts).',
      'Leaves 140 free IPs for future expansion without address collisions.'
    ],
    example: 'CS Lab Gateway is assigned 192.168.1.1/26 on Router Fa0/0; IT Lab Gateway is assigned 192.168.1.65/27 on Fa0/1.',
    diagram: `CAMPUS VLSM SUBNET ALLOCATION MAP:
[192.168.1.0/26: CS Dept] -------> (Fa0/0) [ROUTER] (Fa0/1) <------- [192.168.1.64/27: IT Dept]
                                               |
                                            (Fa1/0)
                                               |
                                     [192.168.1.96/28: Admin]`,
    followUpQuestions: [
      {
        question: 'What happens if you allocate subnets without sorting in descending order first?',
        answer: 'Subnet boundary misalignment occurs, resulting in overlapping subnets and invalid routing table conflicts.'
      }
    ],
    quickRevision: 'In real networks, VLSM sorts host demands descending and allocates tailored /26, /27, /28, and /30 masks to eliminate IP wastage.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.17'
    },
    tags: ['vlsm', 'subnetting', 'real-world', 'enterprise-network', 'ip-plan']
  },
  {
    id: 'ce0518-u3-q18',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Explain leaky bucket algorithm.',
    shortAnswer: 'The Leaky Bucket algorithm is an open-loop traffic shaping algorithm used to smooth out bursty traffic. Irrespective of the burstiness or arrival rate of incoming packets into a finite buffer (the bucket), packets leak out at a strictly uniform, constant rate. If the bucket overflows, incoming packets are discarded.',
    detailedAnswer: 'Traffic Shaping Principle:\nBursty network traffic can easily overwhelm router queues and cause congestion. Leaky Bucket enforces a rigid average traffic transmission rate:\n\n1. Water Bucket Analogy:\n   - A bucket has a small hole at the bottom.\n   - Water (packets) may be poured into the bucket in violent bursts or erratic intervals.\n   - Water drips out through the bottom hole at a smooth, constant rate.\n   - If water is poured in faster than the bucket capacity, the excess water overflows the rim and is lost.\n\n2. Implementation in Networking:\n   - A FIFO queue of capacity C packets/bytes represents the bucket.\n   - At each clock tick, a fixed number of packets (or bytes) are released onto the network.\n   - When bursty traffic arrives, packets buffer in the queue.\n   - If the queue is full (buffer overrun), newly arriving packets are dropped.\n\n3. Limitation: Cannot handle traffic bursts gracefully even when the network has idle capacity, because output rate is strictly capped at a constant value (addressed by Token Bucket).',
    keyPoints: [
      'Traffic shaping mechanism that outputs at a strictly constant rate.',
      'Converts variable/bursty traffic into a smooth, steady transmission stream.',
      'Uses a finite FIFO queue; packet drops occur on buffer overflow.',
      'Cannot accommodate temporary bursts even if the network is idle.'
    ],
    example: 'An ISP allocates a customer 10 Mbps. If the customer suddenly transmits a burst of 50 MB, the Leaky Bucket buffers the burst and drains it steadily at exactly 10 Mbps.',
    diagram: `LEAKY BUCKET ALGORITHM:
Incoming Traffic (Bursty, Variable Rate)
    |||   | |      |||||
    vvv   v v      vvvvv
  +-----------------------+
  | \\                   / |
  |  \\  Queued Packets /  | <--- Bucket Capacity C
  |   \\               /   |      (Overflow = Discard!)
  |    +-------------+    |
  +-----------+-----------+
              |
              v (Constant Leak Rate r Packets/sec)
       Smooth Uniform Output Traffic`,
    followUpQuestions: [
      {
        question: 'How does Token Bucket differ from Leaky Bucket?',
        answer: 'Leaky Bucket enforces a strictly rigid output rate with zero burst tolerance; Token Bucket allows bursts of traffic up to the accumulated token bucket capacity.'
      }
    ],
    quickRevision: 'Leaky bucket smooths bursty incoming packets into a strictly constant output rate, discarding packets that exceed its buffer capacity.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.18'
    },
    tags: ['leaky-bucket', 'traffic-shaping', 'congestion-control', 'qos', 'network-layer']
  },
  {
    id: 'ce0518-u3-q19',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Explain shortest path routing algorithm (Dijkstra vs Bellman-Ford).',
    shortAnswer: 'Shortest path routing algorithms compute the lowest-cost path between nodes. Dijkstra\'s algorithm (Link State) requires global topology knowledge and uses greedy edge relaxation with O(V^2) complexity. Bellman-Ford (Distance Vector) is decentralized, relaxes all edges |V|-1 times using local neighbor exchanges with O(V × E) complexity, and can handle negative weights.',
    detailedAnswer: 'Comparison of the two core shortest path routing algorithms:\n\n1. Dijkstra\'s SPF (Used in OSPF/IS-IS):\n   - Centralized computation: Every router has a complete topology database (LSDB).\n   - Greedy approach: Picks the minimum tentative node and permanently labels it.\n   - Complexity: O(E + V log V) with priority queues.\n   - Restriction: Requires all edge weights to be non-negative (cost >= 0).\n   - Fast convergence, loop-free.\n\n2. Bellman-Ford (Used in RIP/BGP):\n   - Decentralized computation: Routers know only distances advertised by immediate neighbors.\n   - Dynamic programming: Evaluates dist[v] = min(dist[v], dist[u] + cost(u, v)) for all edges across |V| - 1 iterations.\n   - Complexity: O(V × E).\n   - Capability: Can detect negative cycles.\n   - Drawback: Vulnerable to slow convergence and Count-to-Infinity loops.',
    keyPoints: [
      'Dijkstra: Centralized, greedy, non-negative weights, powers Link-State (OSPF).',
      'Bellman-Ford: Decentralized, iterative, handles negative weights, powers Distance-Vector (RIP).',
      'Dijkstra converges much faster than Bellman-Ford.',
      'Dijkstra complexity: O(V log V + E); Bellman-Ford: O(V × E).'
    ],
    example: 'Dijkstra finds the fastest highway route on a GPS map; Bellman-Ford is a traveler asking successive local guides at each town.',
    diagram: `+-----------------------+--------------------------+---------------------------+
| FEATURE               | DIJKSTRA SPF             | BELLMAN-FORD              |
+-----------------------+--------------------------+---------------------------+
| Method                | Greedy Search            | Dynamic Programming       |
| Topology View         | Full Network Graph       | Local Neighbors Only      |
| Edge Weights          | Non-negative only        | Handles negative weights  |
| Complexity            | O((V+E) log V)           | O(V × E)                  |
| Protocol Example      | OSPF, IS-IS              | RIP, BGP                  |
+-----------------------+--------------------------+---------------------------+`,
    followUpQuestions: [
      {
        question: 'Why do routing metrics in real networks never have negative weights?',
        answer: 'Because real network metrics represent latency, hop count, or financial link cost, all of which are physical positive values.'
      }
    ],
    quickRevision: 'Dijkstra computes shortest paths from a complete topology map (OSPF); Bellman-Ford computes iteratively via neighbor vectors (RIP).',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.19'
    },
    tags: ['dijkstra', 'bellman-ford', 'shortest-path', 'algorithms', 'routing']
  },
  {
    id: 'ce0518-u3-q20',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'What is meant by congestion? List the ways of avoiding congestion.',
    shortAnswer: 'Congestion occurs when the volume of traffic offered to a subnet exceeds the data handling capacity or buffer storage of intermediate routers, causing queue delays to escalate and packets to be dropped. Congestion avoidance techniques are divided into Open-Loop (prevention) and Closed-Loop (reactive feedback) mechanisms.',
    detailedAnswer: 'Congestion Dynamics:\nWhen total load exceeds link capacity, router queues fill up. Dropped packets trigger TCP retransmissions, creating a positive feedback loop that leads to Congestion Collapse (throughput drops to zero).\n\nTechniques for Congestion Avoidance & Control:\n\n1. Open-Loop (Preventative) Methods:\n   - Traffic Shaping: Regulates transmission rate using Leaky Bucket and Token Bucket algorithms.\n   - Admission Control: Rejects new virtual circuit connections if capacity is saturated.\n   - Packet Discarding Policy: Proactively drops lower-priority packets before queues overflow (Random Early Detection - RED).\n   - Retransmission Policies: Carefully tuned timers prevent aggressive redundant retransmissions.\n\n2. Closed-Loop (Feedback-Driven) Methods:\n   - Choke Packets: A congested router generates a choke packet (or ICMP Source Quench) directing the source host to slow its transmission rate.\n   - Explicit Congestion Notification (ECN): Routers mark the 2-bit ECN field in IP headers of passing packets without dropping them; the receiver echoes this in TCP ACKs to signal the sender to shrink its congestion window.\n   - Hop-by-Hop Backpressure: Congested router forces the upstream router to buffer packets, propagating backpressure hop-by-hop back to the source.',
    keyPoints: [
      'Occurs when offered load > link capacity or router buffer space.',
      'Open-loop: Prevents congestion (Traffic shaping, admission control, RED).',
      'Closed-loop: Reacts to congestion (Choke packets, ECN bit marking, backpressure).',
      'ECN allows routers to signal congestion without dropping packets.'
    ],
    example: 'During a flash sale, thousands of buyers flood an e-commerce gateway. Without congestion control, servers crash. With admission control and traffic shaping, incoming requests are queued and throttled smoothly.',
    diagram: `CONGESTION COLLAPSE CURVE:
Throughput ^
           |        /|\\
           |       / | \\  <--- Congestion Knee
           |      /  |  \\
           |     /   |   \\___ Congestion Collapse (Throughput -> 0)
           |    /    |
           +---+-----+------------------> Offered Load`,
    followUpQuestions: [
      {
        question: 'What is Random Early Detection (RED)?',
        answer: 'RED is an active queue management algorithm that drops packets randomly with a probability proportional to average queue length before buffers become 100% full, notifying TCP senders to slow down.'
      }
    ],
    quickRevision: 'Congestion happens when traffic exceeds network capacity; controlled via open-loop prevention (traffic shaping) and closed-loop feedback (choke packets, ECN).',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.20'
    },
    tags: ['congestion', 'traffic-shaping', 'choke-packet', 'ecn', 'red']
  },
  {
    id: 'ce0518-u3-q21',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'What is flooding? What are its disadvantages?',
    shortAnswer: 'Flooding is a static routing algorithm where every incoming packet is duplicated and retransmitted on every outgoing link except the one it arrived on. Its primary disadvantages are broadcast storms, massive bandwidth wastage, duplicate packets arriving at the destination, and infinite looping unless hop-count dampening is enforced.',
    detailedAnswer: 'Flooding Characteristics:\n- Every incoming packet is forwarded out all outbound interfaces (like water flooding all channels).\n- Highly robust: if any physical path exists between source and destination, the packet is guaranteed to arrive via the shortest delay route.\n- Zero routing tables required.\n\nDisadvantages & Pitfalls:\n1. Exponential Traffic Explosion (Broadcast Storm): Duplication multiplies packets exponentially across mesh topologies, quickly saturating channel bandwidth.\n2. Inefficient Resource Utilization: Generates excessive duplicate processing at every router and the destination host.\n3. Infinite Packet Looping: Without suppression, duplicated packets circulate forever in cyclic topologies.\n\nDampening Solutions:\n- Hop-Counter / TTL: Packets include a hop limit decremented at each hop; discarded when count reaches 0.\n- Sequence Number Tracking: Routers record a list of recently seen (Source IP, Sequence Number) pairs and discard duplicates.\n- Selective Flooding: Routers only flood along links pointing roughly in the destination\'s direction.',
    keyPoints: [
      'Static routing: forwards incoming packet out every link except arrival link.',
      'Guarantees packet reaches destination along the shortest delay path.',
      'Disadvantages: Bandwidth waste, broadcast storms, duplicate deliveries.',
      'Requires Hop Count (TTL) or sequence number tracking to prevent infinite loops.',
      'Used in military networks (robustness) and OSPF LSA distribution.'
    ],
    example: 'When OSPF initializes, routers use flooding to distribute Link State Advertisements (LSAs) to ensure every router receives the topology updates.',
    diagram: `FLOODING EXPONENTIAL SPREAD:
       [Source A]
        /      \\
      (B)      (C)
     /   \\    /   \\
   (D)   (E)(E)   (F)  <--- Duplicate packets collide and multiply!`,
    followUpQuestions: [
      {
        question: 'Where is flooding legitimately used in modern computer networks?',
        answer: 'In OSPF LSA database flooding, ARP request broadcasting, and military tactical communications where extreme survivability against node destruction is required.'
      }
    ],
    quickRevision: 'Flooding sends packets out every interface; extremely robust but causes severe broadcast storms and bandwidth waste without TTL limits.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.21'
    },
    tags: ['flooding', 'routing-algorithms', 'broadcast-storm', 'ttl', 'network-layer']
  },
  {
    id: 'ce0518-u3-q22',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: Network Layer',
    category: 'theory',
    difficulty: 'advanced',
    question: 'Explain flow based routing.',
    shortAnswer: 'Flow-based routing is a static routing algorithm that uses knowledge of both network topology and expected traffic flow matrices (traffic volume between all source-destination pairs) to calculate link queues and choose routes that minimize mean packet delay across the entire network.',
    detailedAnswer: 'Mathematical Foundation:\n1. Input Data:\n   - Network topology: nodes, links, and link capacities C_i in bps.\n   - Traffic flow matrix: expected traffic volume λ_ij packets/sec between every source-destination pair.\n2. Queueing Model:\n   - Each communication link is modeled as an independent M/M/1 queue.\n   - If total flow on link i is μ_i and capacity is C_i, mean packet delay on link i is: T_i = 1 / (μC_i - λ_i).\n3. Optimization Goal:\n   - Calculate overall mean network delay: T = (1 / γ) × Σ λ_i T_i, where γ is total network traffic.\n   - The algorithm evaluates various alternative routing assignments and selects the set of paths that minimizes global mean delay T without exceeding any link capacity (λ_i < C_i).',
    keyPoints: [
      'Static routing algorithm taking traffic matrices into account.',
      'Models links as M/M/1 queues to calculate mean packet delay.',
      'Goal: Minimize overall network delay T = (1 / γ) × Σ λ_i / (C_i - λ_i).',
      'Ensures no link is saturated beyond capacity (λ_i < C_i).'
    ],
    example: 'Planning backbone trunks between 4 metropolitan cities where daytime banking transactions generate known, predictable data flow matrices.',
    diagram: `FLOW-BASED ROUTING OPTIMIZATION:
[Traffic Matrix λ] + [Link Capacities C] ==> M/M/1 Queue Modeling ==> [Min Delay Routing Plan]`,
    followUpQuestions: [
      {
        question: 'What is the key limitation of flow-based routing?',
        answer: 'It assumes static, predictable traffic matrices. In real networks where traffic is wildly unpredictable and bursty, dynamic adaptive routing performs much better.'
      }
    ],
    quickRevision: 'Flow-based routing optimizes path selection based on known traffic matrices and M/M/1 queue delays to minimize overall network latency.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.22'
    },
    tags: ['flow-based-routing', 'queueing-theory', 'traffic-matrix', 'm-m-1', 'network-delay']
  }
];
