// backend/scripts/convert_cnqb.js
'use strict';

const fs = require('fs');
const path = require('path');

// Knowledge base of comprehensive technical answers for Computer Networks (CE0518) Question Bank
const cnAnswers = {
  // UNIT 1: Introduction to Computer Networks, Data Link Layer
  'u1_q1': {
    shortAnswer: 'Network topology defines the geometric arrangement of nodes and links in a network. Common types are Mesh, Star, Bus, Ring, Tree, and Hybrid.',
    detailedAnswer: 'Network topology is the physical or logical arrangement of computing devices, cables, and connections.\n1. Mesh Topology: Every node is point-to-point connected to every other node. Dedicated links provide high fault tolerance and privacy, but cabling costs are highest (n(n-1)/2 links).\n2. Star Topology: All nodes connect to a central hub/switch. Easy to install and troubleshoot; if the central hub fails, the entire network fails.\n3. Bus Topology: Nodes share a single linear backbone cable terminated at both ends. Inexpensive and simple, but collisions occur and backbone break halts communication.\n4. Ring Topology: Each device is connected to exactly two neighbors forming a closed loop with token-passing. Predictable latency, but unidirectional break affects whole ring.\n5. Hybrid Topology: Combination of two or more topologies (e.g. Star-Bus, Star-Ring).',
    quickRevision: 'Mesh = Maximum redundancy; Star = Central switch; Bus = Shared cable; Ring = Token passing.',
    difficulty: 'basic',
    category: 'Theory Viva',
    tags: ['Topology', 'Mesh', 'Star', 'Bus', 'Ring']
  },
  'u1_q2': {
    shortAnswer: 'Bit stuffing inserts a 0 after five consecutive 1s to prevent data from mimicking the 01111110 flag. Byte stuffing inserts an ESC character before flag or ESC bytes in data.',
    detailedAnswer: 'Bit and byte stuffing are framing techniques at the Data Link Layer used to achieve transparent data transmission:\n- Bit Stuffing: When transmission uses flag bytes like 01111110 (HDLC), the sender automatically inserts an extra \'0\' bit whenever five consecutive \'1\'s appear in the data stream. The receiver detects five consecutive \'1\'s followed by a \'0\' and strips the stuffed \'0\'.\n- Byte (Character) Stuffing: When frame boundaries are marked with control characters like DLE STX and DLE ETX, any accidental DLE within data is prefixed with an additional DLE byte (DLE DLE). The receiver discards the first DLE and preserves data integrity.',
    quickRevision: 'Bit stuffing: Insert 0 after five 1s. Byte stuffing: Escape control bytes with ESC/DLE.',
    difficulty: 'intermediate',
    category: 'Theory Viva',
    tags: ['Framing', 'Bit Stuffing', 'Byte Stuffing', 'HDLC']
  },
  'u1_q3': {
    shortAnswer: 'CRC (Cyclic Redundancy Check) appends r parity bits to an m-bit frame using modulo-2 binary polynomial division so the transmitted code is divisible by generator G(x).',
    detailedAnswer: 'CRC is a powerful polynomial code error-detection method:\n1. Let data D have k bits and generator polynomial G have degree r (r+1 bits).\n2. Append r zeros to the data bits: D * 2^r.\n3. Divide (D * 2^r) by G using Modulo-2 division (XOR operations without carries/borrows).\n4. The resulting r-bit remainder is the CRC checksum.\n5. Transmitted Frame T = Data concatenated with Remainder.\n6. At receiver, T is divided by G. If remainder is zero, the frame is accepted as error-free; otherwise discarded.',
    quickRevision: 'Modulo-2 polynomial division; remainder is appended as CRC; zero remainder at receiver = no error.',
    difficulty: 'intermediate',
    category: 'Numerical / Theory',
    tags: ['CRC', 'Error Detection', 'Modulo-2', 'Polynomial']
  },
  'u1_q4': {
    shortAnswer: 'OSI Reference Model consists of 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application (Please Do Not Touch Steve\'s Pet Alligator).',
    detailedAnswer: 'The 7 layers and their core functions are:\n1. Physical: Transmission of raw unstructured bit streams over physical medium (voltages, pins, cables).\n2. Data Link: Node-to-node frame delivery, MAC addressing, error detection (CRC), flow control, framing.\n3. Network: Logical addressing (IP), path determination, packet routing, subnet traffic control.\n4. Transport: End-to-end process-to-process delivery (ports), TCP/UDP, segmentation, flow/congestion control.\n5. Session: Dialog control, token management, session synchronization checkpoints.\n6. Presentation: Syntax/semantics translation, data formatting, encryption/decryption, compression.\n7. Application: User network interface (HTTP, FTP, DNS, SMTP).',
    quickRevision: '7 Layers: Physical (bits), Datalink (frames), Network (packets), Transport (segments), Session, Presentation, Application.',
    difficulty: 'basic',
    category: 'Architecture',
    tags: ['OSI Model', 'Layers', 'ISO-OSI', 'Protocol Stack']
  },
  'u1_q5': {
    shortAnswer: 'Connection-oriented requires 3-way handshake setup, guarantees in-order delivery (e.g. TCP). Connectionless sends packets independently without pre-established state (e.g. UDP/IP).',
    detailedAnswer: 'Differences:\n1. Setup: Connection-oriented requires 3 phases (Connection setup, Data transfer, Teardown). Connectionless has zero setup.\n2. Routing: In connection-oriented (virtual circuits), all packets follow the same predetermined path. In connectionless (datagrams), each packet is routed independently.\n3. Reliability: Connection-oriented provides sequence numbers, ACKs, and retransmission. Connectionless provides best-effort delivery without guaranteed order or arrival.\n4. Overhead: Connection-oriented has higher delay during connection setup and larger state memory; connectionless has low latency and zero session overhead.\n5. Examples: TCP, ATM vs. UDP, IP.',
    quickRevision: 'Connection-oriented = Handshake, ordered, reliable (TCP); Connectionless = No handshake, independent datagrams (UDP).',
    difficulty: 'basic',
    category: 'Comparison',
    tags: ['Connection-Oriented', 'Connectionless', 'TCP', 'UDP']
  },
  'u1_q6': {
    shortAnswer: 'Repeater/Hub work at Layer 1 (signal regeneration/broadcast); Bridge/Switch work at Layer 2 (MAC filtering); Router works at Layer 3 (IP routing); Gateway works across Layers 4-7.',
    detailedAnswer: 'Network devices and their operating layers:\n- Repeater (Layer 1): Regenerates attenuated electrical or optical signals over long distances.\n- Hub (Layer 1): Multi-port repeater that blindly broadcasts incoming signals to all connected ports (single collision domain).\n- Bridge (Layer 2): Connects two network segments; filters and forwards frames based on MAC address table.\n- Switch (Layer 2): Multi-port bridge that provides dedicated bandwidth per port, creates separate collision domains, and forwards via MAC learning.\n- Router (Layer 3): Connects disparate networks; routes IP packets across subnets using routing tables (OSPF/BGP) and creates separate broadcast domains.\n- Gateway (Layers 4-7): Protocol converter allowing communication between completely different network architectures (e.g. email gateway, SNA gateway).',
    quickRevision: 'Hub/Repeater = L1 bits; Bridge/Switch = L2 MAC; Router = L3 IP; Gateway = Multi-layer protocol translator.',
    difficulty: 'intermediate',
    category: 'Devices',
    tags: ['Hub', 'Switch', 'Router', 'Bridge', 'Gateway', 'Repeater']
  },
  'u1_q7': {
    shortAnswer: 'In Go-Back-N, receiver accepts only in-order frames; on error, sender retransmits the erroneous frame and all subsequent frames (window size 2^n - 1). In Selective Repeat, receiver buffers out-of-order frames and sender retransmits only corrupted frames (window size 2^(n-1)).',
    detailedAnswer: 'Comparison of Sliding Window Protocols:\n1. Go-Back-N (GBN):\n   - Sender window size = 2^m - 1; Receiver window size = 1.\n   - Receiver discards any out-of-order frame even if correct, sending cumulative ACK for last in-order frame.\n   - Timeout triggers retransmission of all unacknowledged frames currently in flight. Inefficient on noisy channels.\n2. Selective Repeat (SR):\n   - Sender window size = 2^(m-1); Receiver window size = 2^(m-1).\n   - Receiver has buffer memory and accepts out-of-order frames, sending individual/selective ACKs.\n   - Sender only retransmits the specific frame whose timer expired. Requires more buffer memory but maximizes throughput.',
    quickRevision: 'GBN: Receiver window = 1, retransmits entire window. SR: Receiver window = 2^(n-1), retransmits only lost frame.',
    difficulty: 'intermediate',
    category: 'Protocol Analysis',
    tags: ['Go-Back-N', 'Selective Repeat', 'Sliding Window', 'ARQ']
  },
  'u1_q8': {
    shortAnswer: 'Parity check adds one redundant bit so the total number of 1s is either even (Even Parity) or odd (Odd Parity). It detects single-bit errors but misses even numbers of flipped bits.',
    detailedAnswer: 'Parity check is the simplest linear block error-detecting mechanism:\n1. Simple (1D) Parity:\n   - Even Parity: Adds a parity bit such that total count of 1s in (data + parity) is even.\n   - Odd Parity: Adds a parity bit such that total count of 1s is odd.\n   - Limitation: Detects odd number of bit errors (1, 3, 5); fails completely if an even number of bits flip (2, 4).\n2. Two-Dimensional Parity (LRC/VRC):\n   - Arranges data in a matrix (rows and columns).\n   - Calculates parity bit for every row and every column.\n   - Can detect 1, 2, and 3-bit errors and can correct single-bit errors at the row/column intersection.',
    quickRevision: 'Simple parity detects 1-bit error (fails on 2 flips). 2D parity checks rows & columns to locate single-bit error.',
    difficulty: 'basic',
    category: 'Error Detection',
    tags: ['Parity', 'Even Parity', 'Odd Parity', 'Error Detection']
  },
  'u1_q9': {
    shortAnswer: 'Stop-and-Wait suffers from extremely low throughput and channel underutilization due to waiting for ACK per frame. Selective Repeat utilizes channel pipeline by buffering and retransmitting only lost frames.',
    detailedAnswer: 'Issues in Stop-and-Wait:\n1. Poor Utilization: Sender transmits 1 frame and must wait for round-trip time (RTT + ACK processing). In high-bandwidth-delay product links (e.g. satellite), utilization U = 1 / (1 + 2a) drops near zero.\n2. Lost Data/ACK: Requires complex timers and sequence bits (0 and 1) to prevent duplicate processing.\nHow Selective Repeat Resolves This:\n- Uses sliding window pipelining: Sender keeps transmitting frames continuously up to window capacity W.\n- If a single frame is lost, receiver buffers subsequent frames and sends NACK or timeout occurs for that frame only.\n- Sender retransmits only the missing frame without stalling pipeline, achieving utilization up to W / (1 + 2a).',
    quickRevision: 'Stop-and-wait wastes bandwidth waiting for ACK; Selective Repeat pipelines multiple frames simultaneously.',
    difficulty: 'intermediate',
    category: 'Protocol Analysis',
    tags: ['Stop and Wait', 'Selective Repeat', 'Channel Utilization', 'ARQ']
  },
  'u1_q10': {
    shortAnswer: 'Guided media provide a physical conductor: Twisted Pair, Coaxial Cable, Optical Fiber. Unguided media transmit electromagnetic waves through air/space: Radio, Microwave, Infrared.',
    detailedAnswer: 'Transmission Media Types:\n1. Guided (Bound) Media:\n   - Twisted Pair (UTP/STP): Pairs of insulated copper wires twisted to cancel electromagnetic interference. Inexpensive; used in LANs (Cat 5e/Cat 6 up to 1Gbps).\n   - Coaxial Cable: Central copper core surrounded by dielectric insulator, braided shield, and jacket. High bandwidth, good noise immunity; used in cable TV.\n   - Optical Fiber: Glass/plastic core with cladding operating on Total Internal Reflection (TIR). Extremely high bandwidth (Tbps), zero EMI susceptibility, long distance.\n2. Unguided (Wireless) Media:\n   - Radio Waves (3 kHz - 1 GHz): Omnidirectional, penetrate walls; used in FM radio, Wi-Fi, cordless phones.\n   - Microwaves (1 GHz - 300 GHz): Line-of-sight propagation, focused beam; used in cellular networks, satellite links.\n   - Infrared (300 GHz - 400 THz): Short-range, cannot penetrate obstacles; used in remote controls, IrDA.',
    quickRevision: 'Guided = Twisted Pair, Coax, Fiber Optics. Unguided = Radio waves, Microwaves, Infrared.',
    difficulty: 'basic',
    category: 'Physical Media',
    tags: ['Guided Media', 'Unguided Media', 'Fiber Optics', 'Coaxial', 'Twisted Pair']
  },
  'u1_q11': {
    shortAnswer: 'Hamming Code is a linear block code that adds redundant parity bits at positions power of 2 (1, 2, 4, 8) to detect and correct single-bit errors using syndrome decoding.',
    detailedAnswer: 'Hamming Code Error Correction:\n1. Parity bit positions: Parity bits (P1, P2, P4, P8...) are placed at bit indices that are powers of 2 (1, 2, 4, 8...), and remaining positions are data bits.\n2. Redundancy condition: For m data bits and r parity bits: 2^r >= m + r + 1.\n3. Parity calculation: Each parity bit checks specific bit combinations whose binary representation has a 1 in that parity bit\'s bit position (e.g. P1 checks 1, 3, 5, 7...; P2 checks 2, 3, 6, 7...).\n4. Error detection & correction: At receiver, parity equations are recomputed. The resulting binary word forms the \'syndrome\'. If syndrome is 0, no error; if non-zero, the syndrome value gives the exact index of the corrupted bit, which is inverted to correct it.',
    quickRevision: '2^r >= m + r + 1. Parity bits at 1, 2, 4, 8... Syndrome binary value points directly to flipped bit.',
    difficulty: 'intermediate',
    category: 'Error Correction',
    tags: ['Hamming Code', 'Single Bit Error', 'Syndrome', 'Error Correction']
  },
  'u1_q12': {
    shortAnswer: 'Error detection only discovers whether corruption occurred (requires retransmission). Error correction locates and fixes corrupted bits without retransmission (e.g. Hamming Code).',
    detailedAnswer: 'Differences between Error Detection and Correction:\n1. Error Detection: Discovers errors during transmission. Requires fewer redundant bits (e.g. Parity, Checksum, CRC). Sender must retransmit data upon error (ARQ).\n2. Error Correction (Forward Error Correction - FEC): The receiver both detects and calculates the exact location of the inverted bits to reconstruct the original message without asking the sender for retransmission.\n3. Example: Hamming (7,4) Code adds 3 parity bits to 4 data bits. If bit 5 flips from 0 to 1, the syndrome vector calculates as 101 (binary for 5), allowing immediate correction by inverting bit 5 back to 0.',
    quickRevision: 'Detection = Checks if corrupted (retransmits via CRC/ARQ); Correction = Locates & fixes bit directly (Hamming code).',
    difficulty: 'basic',
    category: 'Comparison',
    tags: ['Error Detection', 'Error Correction', 'Hamming Code', 'CRC']
  },
  'u1_q13': {
    shortAnswer: 'OSI is a theoretical 7-layer model developed by ISO. TCP/IP is a practical 4-layer model (Network Interface, Internet, Transport, Application) implemented in the real-world Internet.',
    detailedAnswer: 'Comparison between OSI and TCP/IP Reference Models:\n1. Architecture:\n   - OSI: 7 Layers (Application, Presentation, Session, Transport, Network, Data Link, Physical).\n   - TCP/IP: 4 Layers (Application, Transport/Host-to-Host, Internet, Network Access/Host-to-Network).\n2. Model type: OSI is a conceptual standard model; TCP/IP is a protocol-centric practical implementation.\n3. Transport Layer: OSI supports connection-oriented transport; TCP/IP supports both TCP (connection-oriented) and UDP (connectionless).\n4. Network Layer: OSI supports both connectionless and connection-oriented; TCP/IP Internet layer strictly connectionless (IP).\n5. Session & Presentation: In TCP/IP, session and presentation duties are handled directly within the Application layer.',
    quickRevision: 'OSI = 7 layers theoretical; TCP/IP = 4 layers practical. Session & Presentation merged into Application in TCP/IP.',
    difficulty: 'basic',
    category: 'Architecture',
    tags: ['OSI Model', 'TCP/IP', 'Comparison', 'Protocol Stack']
  },
  'u1_q14': {
    shortAnswer: 'For data 10110111 and generator 110011 (degree 5), append 5 zeros, perform modulo-2 binary division, and obtain the 5-bit remainder CRC.',
    detailedAnswer: 'Numerical Calculation of CRC:\n- Given Data: 10110111 (8 bits)\n- Generator G(x): 110011 (6 bits, degree r = 5)\n- Step 1: Append r = 5 zeros to data: 1011011100000\n- Step 2: Modulo-2 division of 1011011100000 by 110011 using XOR:\n  1011011100000 XOR 110011... -> Remainder = 10010\n- Step 3: Transmitted sequence = Data + Remainder = 1011011110010\n- At receiver, dividing 1011011110010 by 110011 yields remainder 00000 (valid frame).',
    quickRevision: 'Degree r = 5. Append 5 zeros. XOR division gives 5-bit CRC remainder. Transmitted = Data || CRC.',
    difficulty: 'intermediate',
    category: 'Numerical / Problem',
    tags: ['CRC Calculation', 'Modulo-2', 'Polynomial', 'Data Link']
  },
  'u1_q15': {
    shortAnswer: 'Layered protocols provide modularity, abstraction, interoperability, easier troubleshooting, and allow layer upgrades without modifying adjacent layers.',
    detailedAnswer: 'Reasons for Using Layered Protocols in Networks:\n1. Modularity & Deconstruction: Divides complex communication tasks into smaller, self-contained sub-tasks.\n2. Abstraction: Each layer provides defined services to the layer above while hiding internal implementation details.\n3. Independent Evolution: A layer can be upgraded or replaced (e.g. switching from IPv4 to IPv6, or Wi-Fi to Ethernet) without changing the upper Application layer.\n4. Interoperability: Standardized interfaces allow heterogeneous hardware and OS platforms from different vendors to seamlessly communicate.\n5. Simplified Debugging: Network problems can be isolated layer-by-layer (e.g. ping tests L3, cable test L1).',
    quickRevision: 'Modularity, abstraction, vendor independence, simplified debugging, and clear interface boundaries.',
    difficulty: 'basic',
    category: 'Theory Viva',
    tags: ['Layering', 'Protocol Design', 'Modularity', 'Abstraction']
  },
  'u1_q16': {
    shortAnswer: 'Cladding surrounds the core to enable Total Internal Reflection (TIR). Cladding refractive index must be strictly lower than the core (n_cladding < n_core).',
    detailedAnswer: 'Purpose of Cladding in Optical Fiber:\n1. Total Internal Reflection (TIR): Light injected into the central core strikes the core-cladding boundary. To achieve TIR and keep light trapped within the core, two conditions must be met:\n   a) Light must travel from a denser medium to a rarer medium.\n   b) The refractive index of the cladding (n2) must be strictly less than the refractive index of the core (n1), i.e., n2 < n1.\n   c) The angle of incidence must exceed the critical angle (theta > theta_c = sin^-1(n2/n1)).\n2. Optical isolation: Prevents light leakage into surrounding air and stops cross-talk between fibers.\n3. Density relation: Core has higher optical density; cladding has lower optical density.',
    quickRevision: 'Cladding refractive index is strictly lower than core (n2 < n1) to produce Total Internal Reflection.',
    difficulty: 'intermediate',
    category: 'Physical Media',
    tags: ['Optical Fiber', 'Cladding', 'Total Internal Reflection', 'Refractive Index']
  },
  'u1_q17': {
    shortAnswer: 'A computer network connects autonomous computers that are aware of each other. A distributed system coordinates multiple computers to appear as a single unified system to the user.',
    detailedAnswer: 'Differences:\n1. Transparency: In a Distributed System, the existence of multiple autonomous computers is hidden from the user; it appears as a single unified virtual supercomputer (distribution transparency). In a Computer Network, users are explicitly aware of multiple machines, IP addresses, and file transfers.\n2. Autonomy: In a computer network, each node has its own independent operating system, local users, and scheduling. In a distributed system, a distributed OS or middleware coordinates resource allocation globally.\n3. Cohesion: Computer networks focus on data transmission and connectivity; distributed systems focus on coordinated computation, load balancing, and fault tolerance.\n4. Example: Internet/LAN is a computer network; Google Cloud / Hadoop cluster is a distributed system.',
    quickRevision: 'Network = Interconnected independent nodes; Distributed System = Appears as a single unified machine.',
    difficulty: 'basic',
    category: 'Comparison',
    tags: ['Computer Networks', 'Distributed Systems', 'Transparency', 'Comparison']
  },
  'u1_q18': {
    shortAnswer: 'Error correction codes at data link layer include Forward Error Correction (FEC) like Hamming Code and Reed-Solomon, allowing the receiver to reconstruct corrupted frames without retransmission.',
    detailedAnswer: 'Error Correction at Data Link Layer:\n1. Forward Error Correction (FEC): Used in environments with high propagation delays (satellite links) or simplex channels where retransmission is costly or impossible.\n2. Block Codes: Adds r parity bits to m data bits to form an n-bit codeword (n, k). The minimum Hamming distance (d_min) determines capabilities:\n   - To detect \'t\' errors: d_min >= t + 1.\n   - To correct \'t\' errors: d_min >= 2t + 1.\n3. Hamming Code: Places parity bits at positions 2^i and calculates syndrome vector at receiver to point directly to the corrupted bit index.\n4. Convolutional Codes & Reed-Solomon: Used in wireless (Wi-Fi, LTE) for burst error correction.',
    quickRevision: 'd_min >= 2t + 1 for correcting t errors. Hamming code uses parity bits to compute error syndrome.',
    difficulty: 'intermediate',
    category: 'Error Correction',
    tags: ['Error Correction', 'Hamming Distance', 'Data Link Layer', 'FEC']
  },
  'u1_q19': {
    shortAnswer: 'Types of transmission errors: Single-bit errors (one bit flips) and Burst errors (two or more consecutive bits corrupted due to noise impulse).',
    detailedAnswer: 'Types of Errors in Data Communication:\n1. Single-Bit Error: Only one bit in the entire data unit changes from 1 to 0 or 0 to 1. Rarely happens in serial high-speed transmission because noise duration usually spans multiple bits.\n2. Multiple-Bit Error: Two or more non-consecutive bits are inverted.\n3. Burst Error: Two or more consecutive bits within the frame are corrupted. The length of the burst error is measured from the first corrupted bit to the last corrupted bit (even if intermediate bits happen to be correct). Burst errors are most common due to transient electrical noise, lightning, or radio signal fades.',
    quickRevision: 'Single-bit error: exactly 1 bit flips; Burst error: cluster of 2+ bits corrupted by noise impulse.',
    difficulty: 'basic',
    category: 'Error Detection',
    tags: ['Single Bit Error', 'Burst Error', 'Noise', 'Data Transmission']
  },
  'u1_q20': {
    shortAnswer: 'The Simplex Protocol for a Noisy Channel (Stop-and-Wait ARQ) adds sequence numbers, timeouts, and ACKs to handle lost frames and duplicated frames.',
    detailedAnswer: 'Simplex Protocol for Noisy Channels (Stop-and-Wait ARQ):\n- Environment: Data flows unidirectionally from sender to receiver, but frames can be corrupted or lost.\n- Mechanism:\n  1. Sender transmits frame with a 1-bit sequence number (0 or 1) and starts a retransmission timer.\n  2. Receiver verifies frame checksum: If correct and has expected sequence number, it accepts the frame and sends an ACK back with the sequence number.\n  3. If frame is damaged, receiver discards it silently (or sends NAK).\n  4. If sender timer expires before ACK arrives, sender retransmits the same frame.\n  5. Sequence number prevents the receiver from delivering duplicate packets if an ACK was lost in transit.',
    quickRevision: 'Uses 1-bit sequence numbers (0 and 1) + retransmission timer to prevent packet loss & duplicates.',
    difficulty: 'intermediate',
    category: 'Protocol Analysis',
    tags: ['Simplex Protocol', 'Stop-and-Wait', 'Noisy Channel', 'ARQ']
  },
  'u1_q21': {
    shortAnswer: 'One-bit sliding window protocol sets sender and receiver window size to 1. Sequence numbers alternate between 0 and 1 for strict ping-pong stop-and-wait flow control.',
    detailedAnswer: 'One-Bit Sliding Window Protocol:\n- Window Sizes: Sender window = 1, Receiver window = 1.\n- Sequence Numbers: Maximum sequence number is 1 (uses 1 bit: 0 and 1).\n- Operation: The sender sends frame 0 and waits for ACK 0. It cannot send frame 1 until ACK 0 is received. When ACK 0 arrives, sender window slides to allow frame 1.\n- Piggybacking: If both ends are transmitting data, ACK is embedded into the header of outgoing reverse data frames.\n- Edge Case (Premature Timeout): If timeout is too short, redundant frames and duplicate ACKs circulate in the channel, reducing throughput.',
    quickRevision: 'Window size = 1. Alternates sequence numbers 0 and 1. Low throughput over long delay links.',
    difficulty: 'intermediate',
    category: 'Protocol Analysis',
    tags: ['Sliding Window', 'One-Bit', 'Flow Control', 'Stop-and-Wait']
  },
  'u1_q22': {
    shortAnswer: 'VRC (Vertical Redundancy Check) detects all single-bit errors and odd numbers of errors. It cannot detect even numbers of bit errors in the same character column.',
    detailedAnswer: 'Capabilities and Limitations of VRC (Vertical Redundancy Check / Parity Check):\n- What VRC CAN determine:\n  1. All single-bit errors in any byte/character.\n  2. Any odd number of bit errors (e.g. 3, 5, 7 bits flipped) because the overall parity bit calculation will fail.\n- What VRC CANNOT determine:\n  1. Any even number of bit errors (e.g. 2, 4, 6 bits inverted in the same byte). If bit 2 and bit 4 both flip from 0 to 1, the total count of 1s remains even, fooling the parity check completely.\n  2. The position of corrupted bits (cannot perform error correction).',
    quickRevision: 'VRC detects odd number of errors (1, 3, 5); fails completely on even number of errors (2, 4).',
    difficulty: 'basic',
    category: 'Error Detection',
    tags: ['VRC', 'Parity', 'Error Detection', 'Data Link']
  },
  'u1_q23': {
    shortAnswer: 'Framing divides raw bit streams into discrete manageable units. Design issues include framing boundaries, flow control, error control, and physical addressing.',
    detailedAnswer: 'Framing & Design Issues in Data Link Layer:\n1. Framing: Breaking physical bit stream into discrete frames using Character Count, Flag Bytes with Byte Stuffing, or Flag Bits with Bit Stuffing.\n2. Flow Control: Preventing a fast sender from overwhelming a slow receiver (Stop-and-Wait, Sliding Window).\n3. Error Control: Detecting and retransmitting lost or corrupted frames (CRC, Parity, ARQ).\n4. Physical Addressing: Adding Source and Destination MAC addresses to deliver frames across a local shared broadcast link.\n5. Channel Access Control: Resolving media contention in shared broadcast networks (CSMA/CD, Token Ring).',
    quickRevision: 'Design issues: Framing (bit/byte stuffing), flow control (sliding window), error control (CRC/ARQ), MAC addressing.',
    difficulty: 'intermediate',
    category: 'Theory Viva',
    tags: ['Framing', 'Data Link Layer', 'Design Issues', 'Flow Control']
  },
  'u1_q24': {
    shortAnswer: 'For 8-bit data 00111001, 4 parity bits are needed (2^r >= 8 + r + 1 -> r=4). Total codeword is 12 bits with parity at 1, 2, 4, 8.',
    detailedAnswer: 'Hamming Code Computation for Data 00111001:\n- Number of data bits m = 8.\n- Parity bits r condition: 2^r >= m + r + 1 -> 2^4 = 16 >= 8 + 4 + 1 = 13 (so r = 4 parity bits: P1, P2, P4, P8).\n- Total codeword length = 12 bits.\n- Bit positions: P1, P2, D3, P4, D5, D6, D7, P8, D9, D10, D11, D12.\n- Data placement: D3=0, D5=0, D6=1, D7=1, D9=1, D10=0, D11=0, D12=1.\n- Calculate Parity Bits (Even Parity):\n  * P1 (checks 1,3,5,7,9,11): P1 ^ 0 ^ 0 ^ 1 ^ 1 ^ 0 = 0 -> P1 = 0\n  * P2 (checks 2,3,6,7,10,11): P2 ^ 0 ^ 1 ^ 1 ^ 0 ^ 0 = 0 -> P2 = 0\n  * P4 (checks 4,5,6,7,12): P4 ^ 0 ^ 1 ^ 1 ^ 1 = 1 -> P4 = 1\n  * P8 (checks 8,9,10,11,12): P8 ^ 1 ^ 0 ^ 0 ^ 1 = 0 -> P8 = 0\n- Final 12-bit Hamming Code: 0 0 0 1 0 1 1 0 1 0 0 1.',
    quickRevision: '4 parity bits at positions 1, 2, 4, 8. Even parity yields final 12-bit codeword: 000101101001.',
    difficulty: 'advanced',
    category: 'Numerical / Problem',
    tags: ['Hamming Code', 'Numerical', 'Even Parity', 'Calculation']
  },
  'u1_q25': {
    shortAnswer: 'For data 100100 and divisor 1101 (degree 3): (i) Dividend = 100100000; (ii) CRC = 001; (iii) Transmitted sequence = 100100001; (iv) Receiver remainder = 000.',
    detailedAnswer: 'Step-by-step Solution for CRC Question:\n- Given Data: 100100 (6 bits)\n- Divisor: 1101 (4 bits, degree r = 3)\ni. Dividend at sender end: Data appended with r = 3 zeros -> 100100000.\nii. Determine CRC (Modulo-2 XOR division of 100100000 by 1101):\n   100100000 / 1101:\n   - 1001 XOR 1101 = 0100\n   - 1000 XOR 1101 = 0101\n   - 1010 XOR 1101 = 0111\n   - 1110 XOR 1101 = 0011\n   - 0110 XOR 0000 = 001 (remainder = 001).\niii. Transmitted data sequence: Data + CRC = 100100001.\niv. Remainder at receiver end: Dividing 100100001 by 1101 produces 000 (no remainder, proving zero transmission error).',
    quickRevision: 'Dividend = 100100000, CRC = 001, Transmitted = 100100001, Receiver Remainder = 000.',
    difficulty: 'advanced',
    category: 'Numerical / Problem',
    tags: ['CRC Numerical', 'Modulo-2', 'Receiver Remainder', 'Checksum']
  },

  // UNIT 2: Medium Access Sub-layer
  'u2_q1': {
    shortAnswer: 'Multiple Access Protocols are divided into 3 categories: Random Access (ALOHA, CSMA), Controlled Access (Reservation, Polling, Token Passing), and Channelization (FDMA, TDMA, CDMA).',
    detailedAnswer: 'Classification of Multiple Access Protocols:\n1. Random Access (Contention) Protocols:\n   - No station is superior or controls another; collision can occur.\n   - Examples: Pure ALOHA, Slotted ALOHA, CSMA, CSMA/CD (Ethernet), CSMA/CA (Wi-Fi).\n2. Controlled Access Protocols:\n   - Stations consult one another to determine who has right to transmit; zero collisions.\n   - Examples: Reservation, Polling (Master-Slave), Token Passing (Token Ring/FDDI).\n3. Channelization (Channel Division) Protocols:\n   - Available bandwidth is shared in frequency, time, or codes.\n   - Examples: FDMA (Frequency Division), TDMA (Time Division), CDMA (Code Division).',
    quickRevision: 'Random Access (ALOHA/CSMA), Controlled Access (Polling/Token Passing), Channelization (FDMA/TDMA/CDMA).',
    difficulty: 'basic',
    category: 'Classification',
    tags: ['MAC', 'Multiple Access', 'ALOHA', 'CSMA', 'Channelization']
  },
  'u2_q2': {
    shortAnswer: 'Pure ALOHA allows transmission anytime (vulnerable time 2*Tfr, max efficiency 18.4%). Slotted ALOHA restricts transmission to clock slot boundaries (vulnerable time Tfr, max efficiency 36.8%).',
    detailedAnswer: 'Pure ALOHA vs. Slotted ALOHA:\n1. Transmission Timing: Pure ALOHA lets stations transmit whenever data is ready. Slotted ALOHA divides time into discrete slots equal to frame transmission time (Tfr); stations can only transmit at the beginning of a slot.\n2. Vulnerable Time:\n   - Pure ALOHA: 2 * Tfr (collision occurs if another frame starts within [t - Tfr, t + Tfr]).\n   - Slotted ALOHA: 1 * Tfr (collision occurs only if another frame transmits in the same slot).\n3. Throughput Formula:\n   - Pure ALOHA: S = G * e^(-2G); Maximum throughput S_max = 1/(2e) = 18.4% at G = 0.5.\n   - Slotted ALOHA: S = G * e^(-G); Maximum throughput S_max = 1/e = 36.8% at G = 1.0.\n4. Synchronization: Pure ALOHA requires no clock; Slotted ALOHA requires global clock synchronization.',
    quickRevision: 'Pure ALOHA: S_max = 18.4% (Vulnerable = 2Tfr); Slotted ALOHA: S_max = 36.8% (Vulnerable = Tfr).',
    difficulty: 'intermediate',
    category: 'Comparison',
    tags: ['Pure ALOHA', 'Slotted ALOHA', 'Vulnerable Time', 'Throughput']
  },
  'u2_q3': {
    shortAnswer: 'CSMA (Carrier Sense Multiple Access) listens before transmitting. Variants: 1-persistent (transmits immediately when idle), Non-persistent (waits random time if busy), p-persistent (transmits with probability p).',
    detailedAnswer: 'CSMA Protocols (Listen Before Talk):\n1. 1-Persistent CSMA: Station senses channel. If busy, listens continuously until idle; as soon as channel is idle, transmits with probability 1. High collision probability if two stations were waiting for idle.\n2. Non-Persistent CSMA: Senses channel. If idle, transmits immediately. If busy, waits a random backoff time before sensing again. Lower collision rate, but introduces idle channel delays.\n3. p-Persistent CSMA (Slotted): Senses channel. If idle, transmits with probability p; with probability (1 - p), waits for next slot. Balances throughput and collision probability.\n4. CSMA/CD: Senses during transmission and aborts immediately upon collision.\n5. CSMA/CA: Uses IFS, contention window, and RTS/CTS in wireless.',
    quickRevision: '1-persistent = Transmits as soon as idle; Non-persistent = Waits random time if busy; p-persistent = Transmits with probability p.',
    difficulty: 'intermediate',
    category: 'Protocol Analysis',
    tags: ['CSMA', '1-Persistent', 'Non-Persistent', 'p-Persistent']
  },
  'u2_q4': {
    shortAnswer: 'CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance) is used in wireless networks (Wi-Fi 802.11) to avoid collisions using Interframe Spacing (IFS), Contention Window, and RTS/CTS handshake.',
    detailedAnswer: 'CSMA/CA Mechanism:\n- Why needed: In wireless, transceivers cannot listen while transmitting because their own signal swamps incoming signals; collision detection (CSMA/CD) is physically impossible.\n- Three avoidance strategies:\n  1. Interframe Space (IFS): When channel is sensed idle, station waits a period (DIFS/SIFS) before sending to give higher priority frames precedence.\n  2. Contention Window (Exponential Backoff): Station picks random backoff timer slots; pauses countdown if channel becomes busy.\n  3. Virtual Carrier Sensing (RTS/CTS): Sender sends Request to Send (RTS); receiver replies with Clear to Send (CTS) containing a Network Allocation Vector (NAV) duration that silences other stations, solving Hidden Station problem.',
    quickRevision: 'Avoids collisions using IFS, exponential backoff, and RTS/CTS handshake (Wi-Fi 802.11).',
    difficulty: 'intermediate',
    category: 'Wireless MAC',
    tags: ['CSMA/CA', 'Collision Avoidance', 'RTS/CTS', 'Wi-Fi', '802.11']
  },
  'u2_q6': {
    shortAnswer: 'Manchester encoding transitions at the center of every bit interval: low-to-high for \'0\' (or \'1\' in differential) and high-to-low for \'1\'. Guarantees self-clocking and zero DC component.',
    detailedAnswer: 'Manchester Encoding (IEEE 802.3 Convention):\n- Rule:\n  * Binary 0: Low-to-High transition at the middle of the bit interval.\n  * Binary 1: High-to-Low transition at the middle of the bit interval.\n- Encoding for bit stream: 1 0 0 1 1 1 0 1 0 0:\n  1: High-to-Low (HL)\n  0: Low-to-High (LH)\n  0: Low-to-High (LH)\n  1: High-to-Low (HL)\n  1: High-to-Low (HL)\n  1: High-to-Low (HL)\n  0: Low-to-High (LH)\n  1: High-to-Low (HL)\n  0: Low-to-High (LH)\n  0: Low-to-High (LH)\n- Advantages: Self-clocking synchronization, no DC baseline wander; Disadvantage: Requires 2x bandwidth compared to NRZ.',
    quickRevision: 'Mid-bit transition: 0 = Low-to-High; 1 = High-to-Low. Ensures clock recovery and no DC component.',
    difficulty: 'intermediate',
    category: 'Encoding',
    tags: ['Manchester Encoding', 'Physical Layer', 'Self-Clocking', 'Bit Stream']
  },
  'u2_q7': {
    shortAnswer: 'CSMA/CD detects collision during transmission and aborts immediately (used in wired Ethernet). CSMA/CA actively avoids collisions beforehand using RTS/CTS and backoff (used in wireless Wi-Fi).',
    detailedAnswer: 'Differences between CSMA/CD and CSMA/CA:\n1. Network Type: CSMA/CD is used in wired Ethernet (802.3); CSMA/CA is used in wireless LANs (802.11 Wi-Fi).\n2. Action during collision: In CSMA/CD, the transmitting station detects the collision via voltage spikes, broadcasts a jam signal, and immediately aborts transmission. In CSMA/CA, collisions cannot be detected while transmitting, so the entire frame is sent anyway.\n3. Prevention mechanism: CSMA/CA uses IFS delays, random contention windows, and RTS/CTS handshake with NAV timers to avoid collisions before transmission starts.\n4. Energy/Efficiency: CSMA/CD wastes minimal channel time upon collision; CSMA/CA trades header overhead (RTS/CTS) for fewer collisions.',
    quickRevision: 'CSMA/CD = Detects and stops collision (Wired Ethernet); CSMA/CA = Avoids collision via RTS/CTS (Wireless Wi-Fi).',
    difficulty: 'intermediate',
    category: 'Comparison',
    tags: ['CSMA/CD', 'CSMA/CA', 'Ethernet', 'Wi-Fi', 'Comparison']
  },
  'u2_q8': {
    shortAnswer: 'Controlled access protocols eliminate collisions: Reservation reserves transmission slots in advance; Polling uses a primary-secondary master controller; Token Passing passes a token ring frame.',
    detailedAnswer: 'Controlled Access Protocols:\n1. Reservation:\n   - Time is divided into intervals. Preceding each data frame interval is a reservation frame with N mini-slots for N stations.\n   - A station transmits a \'1\' in its mini-slot to reserve the corresponding data slot; stations transmit in reserved sequence with zero collisions.\n2. Polling:\n   - Works in Primary-Secondary (Master-Slave) topology.\n   - Primary node polls secondary nodes one by one ("Do you have data to send?"). If yes, secondary sends; if no, primary polls next.\n3. Token Passing:\n   - Nodes are organized into a logical ring.\n   - A special short frame called \'Token\' circulates continuously.\n   - Only the node holding the token is permitted to transmit. When done, it releases the token to its downstream neighbor (e.g. Token Ring 802.5, FDDI).',
    quickRevision: 'Reservation = Book mini-slot; Polling = Master polls slaves; Token Passing = Permission token circulates in ring.',
    difficulty: 'basic',
    category: 'Controlled Access',
    tags: ['Reservation', 'Polling', 'Token Passing', 'MAC']
  },
  'u2_q9': {
    shortAnswer: 'Binary Exponential Backoff algorithm doubles the maximum waiting contention window (0 to 2^k - 1) after each collision to dynamically resolve channel congestion in Ethernet.',
    detailedAnswer: 'Binary Exponential Backoff Algorithm (Ethernet CSMA/CD):\n- Purpose: Resolves collision by forcing colliding stations to pick a random delay before retrying, preventing them from colliding repeatedly.\n- Procedure:\n  1. After \'c\' consecutive collisions, set k = min(c, 10).\n  2. Station randomly chooses an integer \'r\' in range: 0 <= r <= (2^k - 1).\n  3. Station waits r slot times (1 slot = 512 bit times = 51.2 microseconds in 10Mbps Ethernet).\n  4. Example:\n     * 1st collision: k=1 -> r in {0, 1}\n     * 2nd collision: k=2 -> r in {0, 1, 2, 3}\n     * 10th collision: k=10 -> r in {0, 1 ... 1023}\n  5. If c reaches 16 collisions, the station aborts transmission and reports fatal network error.',
    quickRevision: 'After collision c, random delay chosen from [0, 2^(min(c,10)) - 1] slot times. Aborts at 16 collisions.',
    difficulty: 'intermediate',
    category: 'Algorithm',
    tags: ['Exponential Backoff', 'CSMA/CD', 'Ethernet', 'Collision Resolution']
  },
  'u2_q10': {
    shortAnswer: 'Controlled access protocols guarantee collision-free communication by granting transmission rights deterministically through Reservation, Polling, or Token Passing.',
    detailedAnswer: 'Controlled Access Protocols Overview:\n- Concept: Unlike contention-based protocols where stations compete and collide, controlled access protocols allow only one station to transmit at any given instant.\n- Key Methods:\n  1. Reservation Method: Stations send short reservation bits during a contention slot before the actual data transmission slot.\n  2. Polling Method: Master device issues POLL requests to select devices for reading data, and SELECT requests to send data to devices.\n  3. Token Ring (IEEE 802.5): Token rotates in a ring. Station captures token, modifies it to frame start, appends data, and regenerates free token when frame completes loop.\n- Advantage: Predictable latency, 100% collision-free; Disadvantage: Polling delay and token failure overhead.',
    quickRevision: 'Collision-free deterministic access: Reservation, Polling (Master-Slave), and Token Ring.',
    difficulty: 'basic',
    category: 'Controlled Access',
    tags: ['Controlled Access', 'Reservation', 'Polling', 'Token Passing']
  },
  'u2_q11': {
    shortAnswer: 'Static channel allocation divides capacity permanently (FDM/TDM) - inefficient for bursty computer traffic. Dynamic allocation assigns bandwidth on-demand, maximizing utilization.',
    detailedAnswer: 'Static vs. Dynamic Channel Allocation:\n1. Static Allocation (FDM / TDM):\n   - Channel capacity is divided into fixed frequency bands or time slots among N users.\n   - If a user has no data to transmit, its allocated slot sits completely idle (wasted capacity).\n   - Ineffective for bursty data traffic where peak-to-average ratio is high (1000:1).\n2. Dynamic Allocation (Statistical Multiplexing):\n   - Channel is shared on-demand; stations only consume bandwidth when they actively transmit.\n   - Uses MAC contention protocols (ALOHA, CSMA) or packet switching.\n   - Yields vastly superior throughput for bursty web and file transfer traffic, though packet collisions or queuing delays may occur.',
    quickRevision: 'Static (FDM/TDM) wastes unused dedicated slots; Dynamic allocates bandwidth on-demand for bursty traffic.',
    difficulty: 'basic',
    category: 'Comparison',
    tags: ['Static Allocation', 'Dynamic Allocation', 'FDM', 'TDM', 'Channel Allocation']
  },

  // UNIT 3: Network Layer
  'u3_q1': {
    shortAnswer: 'IPv4 uses 32-bit addresses (4.3 billion) with dotted-decimal notation. IPv6 uses 128-bit addresses (3.4x10^38) with hexadecimal colon notation, built-in IPSec, and simplified fixed header.',
    detailedAnswer: 'Comparison between IPv4 and IPv6:\n1. Address Length: IPv4 is 32 bits (4 bytes); IPv6 is 128 bits (16 bytes).\n2. Address Space: IPv4 has ~4.3 x 10^9 addresses (exhausted); IPv6 has ~3.4 x 10^38 addresses (virtually inexhaustible).\n3. Representation: IPv4 uses dotted-decimal (e.g. 192.168.1.1); IPv6 uses colon-hexadecimal (e.g. 2001:0db8::1).\n4. Header Size: IPv4 has variable header (20-60 bytes); IPv6 has fixed base header (40 bytes), speeding up router processing.\n5. Security: IPv4 has optional IPSec; IPv6 has mandatory/native IPSec support.\n6. Configuration: IPv4 relies on DHCP or manual configuration; IPv6 supports Stateless Address Autoconfiguration (SLAAC).\n7. Checksum: IPv4 header includes checksum (recalculated at every hop); IPv6 eliminated header checksum for router speed.',
    quickRevision: 'IPv4: 32-bit, dotted-decimal, 20-byte variable header. IPv6: 128-bit, colon-hex, 40-byte fixed header, SLAAC.',
    difficulty: 'basic',
    category: 'Comparison',
    tags: ['IPv4', 'IPv6', 'Comparison', 'IP Addressing']
  },
  'u3_q2': {
    shortAnswer: 'IPv4 header is 20-60 bytes containing Version, IHL, Type of Service, Total Length, Identification, Flags, Fragment Offset, TTL, Protocol, Header Checksum, Source IP, and Destination IP.',
    detailedAnswer: 'IPv4 Header Structure & Fields:\n1. Version (4 bits): 4 for IPv4.\n2. IHL (4 bits): Internet Header Length in 32-bit words (minimum 5 words = 20 bytes).\n3. Type of Service / DSCP (8 bits): Quality of service and packet priority.\n4. Total Length (16 bits): Total packet length including header and data (max 65,535 bytes).\n5. Identification (16 bits), Flags (3 bits: Reserved, DF, MF), Fragment Offset (13 bits): Used for packet fragmentation and reassembly.\n6. TTL (Time to Live, 8 bits): Hop count decremented by each router to prevent routing loops; packet discarded when TTL=0.\n7. Protocol (8 bits): Upper-layer protocol (6 for TCP, 17 for UDP, 1 for ICMP).\n8. Header Checksum (16 bits): Error checking for header only.\n9. Source & Destination IP (32 bits each): Originator and recipient IP addresses.',
    quickRevision: '20-60 bytes. Key fields: TTL (prevents loops), Protocol (6=TCP, 17=UDP), Identification/Offset (fragmentation).',
    difficulty: 'intermediate',
    category: 'Protocol Header',
    tags: ['IPv4 Header', 'TTL', 'Fragmentation', 'Checksum']
  },
  'u3_q3': {
    shortAnswer: 'IP addressing uniquely identifies host interfaces on a network. Classified into Classful (Classes A, B, C, D, E) and Classless Inter-Domain Routing (CIDR) using prefix notation.',
    detailedAnswer: 'IP Addressing Methods:\n1. Structure: 32-bit binary number divided into two parts: Network ID (identifies the network) and Host ID (identifies specific device on that network).\n2. Classful Addressing:\n   - Class A: First octet 1-126 (Default mask /8: 255.0.0.0). Huge networks.\n   - Class B: First octet 128-191 (Default mask /16: 255.255.0.0). Medium networks.\n   - Class C: First octet 192-223 (Default mask /24: 255.255.255.0). Small networks (254 hosts).\n   - Class D: First octet 224-239 (Multicasting).\n   - Class E: First octet 240-255 (Experimental / Research).\n3. Classless Addressing (CIDR):\n   - Eliminates rigid class boundaries using slash notation (e.g. 192.168.1.0/26), enabling variable length subnetting (VLSM).',
    quickRevision: 'Classes A (1-126), B (128-191), C (192-223), D (Multicast), E (Research). CIDR uses prefix /n.',
    difficulty: 'basic',
    category: 'IP Addressing',
    tags: ['IP Addressing', 'Classful', 'Classless', 'CIDR', 'Subnet Mask']
  },
  'u3_q4': {
    shortAnswer: 'Classful addressing uses fixed boundary masks (/8, /16, /24) leading to severe address waste. Classless (CIDR) uses variable prefix lengths (/n), enabling efficient address allocation and route aggregation.',
    detailedAnswer: 'Classful vs. Classless IP Addressing:\n1. Mask Flexibility: Classful has fixed default masks (Class A=/8, B=/16, C=/24). Classless allows any arbitrary mask length from /0 to /32.\n2. Address Wastage: In Classful, an organization needing 300 hosts had to take a Class B block (65,534 hosts), wasting 99% of addresses. CIDR assigns exact size (e.g. /23 = 510 hosts).\n3. Routing Protocols: Classful protocols (RIPv1, IGRP) do not transmit subnet masks in routing updates. Classless protocols (RIPv2, OSPF, BGP) include subnet mask prefixes, supporting VLSM and route summarization (supernetting).',
    quickRevision: 'Classful = Rigid fixed masks (/8, /16, /24), high wastage; Classless (CIDR) = Flexible /n masks, VLSM, efficient.',
    difficulty: 'basic',
    category: 'Comparison',
    tags: ['Classful', 'Classless', 'CIDR', 'VLSM', 'Subnetting']
  },
  'u3_q5': {
    shortAnswer: 'ARP (Address Resolution Protocol) resolves a known logical 32-bit IPv4 address to a physical 48-bit MAC address using broadcast request and unicast reply.',
    detailedAnswer: 'Working of ARP (Address Resolution Protocol):\n1. Purpose: IP packets must be encapsulated into Ethernet frames with destination MAC address. If sender knows destination IP but not MAC, ARP is used.\n2. ARP Request: Sender broadcasts an ARP Request frame (Dest MAC = FF:FF:FF:FF:FF:FF) asking: "Who has IP address 192.168.1.5? Tell 192.168.1.2".\n3. ARP Reply: The host owning that target IP responds with a unicast ARP Reply frame directly to sender containing its physical MAC address.\n4. ARP Cache: Sender stores the IP-to-MAC mapping in its local ARP Cache table (with TTL) for fast subsequent frame transmissions.',
    quickRevision: 'Maps IP address -> MAC address. ARP Request is broadcast; ARP Reply is unicast.',
    difficulty: 'basic',
    category: 'Protocol Analysis',
    tags: ['ARP', 'MAC Address', 'IP Resolution', 'Broadcast']
  },
  'u3_q6': {
    shortAnswer: 'Subnetting borrows bits from the host ID portion to create smaller logical sub-networks, reducing broadcast traffic and optimizing address utilization.',
    detailedAnswer: 'Subnetting Concepts:\n1. Why Subnet: A large single broadcast domain causes network congestion, security vulnerabilities, and management issues. Subnetting segments one large network into multiple smaller subnets.\n2. How It Works: Bits are borrowed from the Host ID field to extend the Network ID (Subnet ID).\n3. Formulas:\n   - Number of subnets created = 2^b (where b = borrowed bits).\n   - Usable hosts per subnet = 2^h - 2 (where h = remaining host bits; minus 2 for Subnet Network ID and Subnet Broadcast address).\n4. Example: Subnetting 192.168.1.0/24 with /26 (borrowing 2 bits):\n   - Creates 2^2 = 4 subnets.\n   - Each subnet has 2^6 - 2 = 62 usable hosts (Subnet mask 255.255.255.192).',
    quickRevision: 'Borrows host bits for subnets. Subnets = 2^b; Usable hosts/subnet = 2^h - 2.',
    difficulty: 'intermediate',
    category: 'Subnetting',
    tags: ['Subnetting', 'Subnet Mask', 'Host ID', 'Network ID']
  },
  'u3_q7': {
    shortAnswer: 'Distance Vector routing (e.g. RIP) shares routing table with immediate neighbors based on hop count (Bellman-Ford). Link State routing (e.g. OSPF) floods link state to all routers and builds full topology tree using Dijkstra.',
    detailedAnswer: 'Distance Vector vs. Link State Routing:\n1. Distance Vector (e.g. RIP, IGRP):\n   - Algorithm: Bellman-Ford algorithm.\n   - Knowledge: Knows direction (next hop) and distance (metric/hop count) to destination.\n   - Sharing: Passes full routing tables periodically only to directly connected neighbors.\n   - Drawbacks: Slow convergence, susceptible to Count-to-Infinity problem and routing loops.\n2. Link State (e.g. OSPF, IS-IS):\n   - Algorithm: Dijkstra\'s Shortest Path First (SPF) algorithm.\n   - Knowledge: Every router maintains a complete topological map of the entire autonomous system.\n   - Sharing: Floods small Link State Advertisements (LSAs) to all routers only when a link changes state.\n   - Advantages: Fast convergence, loop-free, supports large networks, but requires more CPU and memory.',
    quickRevision: 'Distance Vector = Bellman-Ford, periodic neighbor updates; Link State = Dijkstra, full topology map, fast convergence.',
    difficulty: 'intermediate',
    category: 'Routing Protocols',
    tags: ['Routing', 'Distance Vector', 'Link State', 'OSPF', 'RIP', 'Dijkstra']
  },
  'u3_q8': {
    shortAnswer: 'ICMP (Internet Control Message Protocol) is a network-layer protocol used by network devices to report errors (Destination Unreachable, Time Exceeded) and diagnostics (Ping, Traceroute).',
    detailedAnswer: 'ICMP Protocol Details:\n- Role: IP is best-effort and does not report delivery failures. ICMP handles error reporting and query management, encapsulated directly within IP datagrams (Protocol = 1).\n- Key Message Types:\n  1. Echo Request (Type 8) & Echo Reply (Type 0): Used by `ping` tool to verify reachability and RTT.\n  2. Destination Unreachable (Type 3): Generated by router if packet cannot be delivered (host unreachable, port unreachable).\n  3. Time Exceeded (Type 11): Sent when packet\'s TTL reaches 0; fundamental to how `traceroute` discovers intermediate routers.\n  4. Source Quench (Type 4): Informs sender to throttle transmission due to router buffer congestion.\n  5. Redirect (Type 5): Informs host of a better first-hop router.',
    quickRevision: 'IP Protocol 1. Used for network diagnostics (ping, traceroute) and error reporting (TTL expired, unreachable).',
    difficulty: 'basic',
    category: 'Protocol Analysis',
    tags: ['ICMP', 'Ping', 'Traceroute', 'TTL Exceeded', 'Error Reporting']
  },
  'u3_q9': {
    shortAnswer: 'RIP (Routing Information Protocol) is a Distance Vector interior routing protocol that uses hop count as metric (maximum 15 hops; 16 = unreachable) and updates every 30 seconds.',
    detailedAnswer: 'RIP (Routing Information Protocol) Features:\n1. Classification: Interior Gateway Protocol (IGP), Distance Vector based on Bellman-Ford algorithm.\n2. Metric: Pure hop count (1 to 15). A metric of 16 represents infinity/unreachable network.\n3. Update Interval: Broadcasts/multicasts its entire routing table every 30 seconds.\n4. Convergence Mechanisms: Uses Split Horizon, Poison Reverse, and Hold-down timers to mitigate routing loops.\n5. Versions:\n   - RIPv1: Classful, broadcasts to 255.255.255.255, no subnet masks.\n   - RIPv2: Classless (supports CIDR/VLSM), multicasts to 224.0.0.9, MD5 authentication.\n   - RIPng: IPv6 support.\n6. Limitation: Max 15 hops limits RIP strictly to small networks.',
    quickRevision: 'Hop count metric (max 15 hops; 16 = unreachable). Updates every 30s. Simple but limited to small networks.',
    difficulty: 'intermediate',
    category: 'Routing Protocols',
    tags: ['RIP', 'Distance Vector', 'Hop Count', 'Routing']
  },
  'u3_q10': {
    shortAnswer: 'OSPF (Open Shortest Path First) is an open-standard Link State interior gateway protocol that uses Dijkstra algorithm, cost metric (bandwidth), areas, and fast convergence.',
    detailedAnswer: 'OSPF (Open Shortest Path First) Architecture:\n1. Protocol Type: Link State Interior Gateway Protocol (IGP) running directly over IP (Protocol 89).\n2. Metric: Cost = 10^8 / Bandwidth (bps). Faster links have lower cost.\n3. Hierarchical Areas: Divides network into areas. Area 0 (Backbone Area) connects all non-backbone areas, minimizing routing overhead.\n4. Convergence: Routers establish neighbor adjacencies via Hello packets, elect DR/BDR on broadcast networks, exchange LSAs, build Link State Database (LSDB), and execute Dijkstra SPF algorithm.\n5. Advantages: Loop-free, rapid convergence, supports CIDR/VLSM, scales to very large enterprise networks.',
    quickRevision: 'Link State, Dijkstra SPF algorithm, Cost metric based on bandwidth, Hierarchical areas with Backbone Area 0.',
    difficulty: 'intermediate',
    category: 'Routing Protocols',
    tags: ['OSPF', 'Link State', 'Dijkstra', 'Cost', 'Areas']
  },
  'u3_q11': {
    shortAnswer: 'Distance Vector shares routing table with neighbors periodically using hop count; Link State floods link changes to all routers using Dijkstra based on link bandwidth.',
    detailedAnswer: 'Detailed Comparison between Distance Vector and Link State:\n| Feature | Distance Vector (RIP) | Link State (OSPF) |\n|---|---|---|\n| Algorithm | Bellman-Ford | Dijkstra (SPF) |\n| Topology Knowledge | Only next-hop neighbor info | Complete network topology map |\n| Routing Updates | Periodic (every 30s) full table | Triggered LSAs on link change |\n| Metric | Hop count (max 15) | Cost based on bandwidth |\n| Convergence | Slow (count-to-infinity risk) | Very fast (loop-free) |\n| Resource Usage | Low CPU and RAM | Higher CPU and RAM for SPF tree |\n| Network Size | Small networks (<15 hops) | Large enterprise/ISP networks |',
    quickRevision: 'Distance Vector = Bellman-Ford, periodic neighbor updates; Link State = Dijkstra, full topology map, fast convergence.',
    difficulty: 'intermediate',
    category: 'Comparison',
    tags: ['Distance Vector', 'Link State', 'RIP', 'OSPF', 'Routing']
  },
  'u3_q12': {
    shortAnswer: 'Network ID is found by bitwise ANDing IP address with Subnet Mask; Host ID is the host bit portion; Subnet Mask has 1s for network bits and 0s for host bits.',
    detailedAnswer: 'Finding NetID, HostID, and Subnet Mask:\n- Example: Given IP 192.168.10.130 with Subnet Mask 255.255.255.192 (/26):\n1. Subnet Mask in Binary: 11111111.11111111.11111111.11000000 (/26 prefix).\n2. IP in Binary: 11000000.10101000.00001010.10000010 (192.168.10.130).\n3. NetID (Bitwise AND of IP & Mask): 192.168.10.128.\n4. Host ID portion: The last 6 bits = 000010 = 2.\n5. Broadcast Address: Set all 6 host bits to 1 = 192.168.10.191.\n6. Usable Host IP Range: 192.168.10.129 to 192.168.10.190 (62 valid hosts).',
    quickRevision: 'NetID = IP AND Subnet Mask; HostID = host bits; Broadcast = NetID with all host bits set to 1.',
    difficulty: 'intermediate',
    category: 'Numerical / Problem',
    tags: ['NetID', 'HostID', 'Subnet Mask', 'CIDR Calculation']
  },
  'u3_q13': {
    shortAnswer: 'Internetworking connects different heterogeneous networks using routers and gateways to form a seamless global network using standard protocols like IP.',
    detailedAnswer: 'Internetworking Principles:\n1. Concept: Combining disparate networks (e.g. Ethernet LAN, Wi-Fi, ATM, cellular, optical backbones) having different packet formats, addressing schemes, and MTUs into an interconnected internetwork.\n2. Key Challenges:\n   - Different addressing schemes (resolved by logical IP addressing).\n   - Different Maximum Transmission Units (MTU) (resolved by IP fragmentation).\n   - Different quality of service and routing protocols.\n3. Connecting Devices: Routers operate at Layer 3 to route packets across subnet boundaries; Gateways translate across different application/protocol architectures.',
    quickRevision: 'Interconnecting heterogeneous networks into a seamless unified network using IP routers.',
    difficulty: 'basic',
    category: 'Theory Viva',
    tags: ['Internetworking', 'Routers', 'Heterogeneous Networks', 'MTU']
  },
  'u3_q14': {
    shortAnswer: 'Dijkstra Shortest Path algorithm finds the minimum-cost path from a source router to all other network nodes by greedily selecting the unvisited node with lowest tentative distance.',
    detailedAnswer: 'Dijkstra\'s Shortest Path Algorithm:\n1. Graph Representation: Network represented as a graph G = (V, E) where routers are vertices and transmission links are edges with positive weights (delay/cost).\n2. Steps:\n   - Initialize: Distance to source = 0; distance to all other nodes = infinity. Mark all nodes unvisited.\n   - Step 1: From the unvisited set, select the node \'u\' with smallest tentative distance.\n   - Step 2: For each unvisited neighbor \'v\' of \'u\', calculate tentative distance: dist[v] = min(dist[v], dist[u] + weight(u, v)).\n   - Step 3: Mark node \'u\' as visited (permanently settled).\n   - Step 4: Repeat until all nodes are visited.\n3. Result: Produces a Shortest Path Tree (SPT) used to populate the router\'s forwarding table.',
    quickRevision: 'Greedy algorithm computing shortest path tree using lowest tentative link costs (used in OSPF).',
    difficulty: 'intermediate',
    category: 'Algorithm',
    tags: ['Dijkstra', 'Shortest Path', 'SPF', 'Routing Algorithm']
  },
  'u3_q15': {
    shortAnswer: 'IPv6 provides 128-bit addresses, auto-configuration (SLAAC), fixed 40-byte header, built-in IPsec, and eliminates broadcast by using multicast and anycast.',
    detailedAnswer: 'Key Architectural Features of IPv6:\n1. Vast Address Space: 128 bits = 3.4 x 10^38 addresses (enough for every atom on Earth).\n2. Fixed 40-byte Base Header: Simplifies header parsing at routers; optional features handled through chained Extension Headers (Hop-by-hop, Routing, Fragment, ESP).\n3. Stateless Address Autoconfiguration (SLAAC): Hosts generate their own IPv6 address using router advertisement prefix and device MAC/random identifier.\n4. No Broadcast: Replaced broadcast with Multicast and Anycast (delivers to closest interface of group).\n5. No Router Fragmentation: Fragmentation is performed only by the sending host using Path MTU Discovery (PMTUD).\n6. Integrated IPSec: Native authentication and encryption support.',
    quickRevision: '128-bit address, 40-byte fixed header, SLAAC autoconfiguration, no broadcast, sender-only fragmentation.',
    difficulty: 'basic',
    category: 'Theory Viva',
    tags: ['IPv6', 'SLAAC', 'Anycast', 'Extension Headers']
  },
  'u3_q16': {
    shortAnswer: 'ICMP works over IP to report delivery errors and exchange diagnostic information. Routers send ICMP messages back to source IP upon drops or TTL expiry.',
    detailedAnswer: 'Working of ICMP Protocol:\n1. Encapsulation: ICMP messages are carried inside standard IP datagrams with protocol field = 1.\n2. Header: 8-byte header consisting of Type (8 bits), Code (8 bits), Checksum (16 bits), and Contents (4 bytes).\n3. Operation:\n   - When a router drops a packet (e.g. buffer full, no route, packet too large for MTU with DF bit set), it generates an ICMP Error Message.\n   - The message contains the original IP header plus first 8 bytes of payload so the sending host knows which socket/process triggered the error.\n   - Ping utility sends ICMP Echo Request (Type 8); target responds with ICMP Echo Reply (Type 0).',
    quickRevision: 'Layer 3 protocol; returns error status + first 8 bytes of original datagram to source host.',
    difficulty: 'intermediate',
    category: 'Protocol Analysis',
    tags: ['ICMP', 'Ping', 'Error Reporting', 'IP Protocol']
  },
  'u3_q17': {
    shortAnswer: 'Real-time scenario: An enterprise with 192.168.1.0/24 needs subnets for HR (50 hosts), Sales (25 hosts), and IT (10 hosts). VLSM assigns /26, /27, and /28 respectively without waste.',
    detailedAnswer: 'Real-Time Subnetting Scenario using VLSM:\n- Company base network: 192.168.1.0/24 (Total 256 IP addresses).\n- Department Requirements:\n  1. HR Department (Needs 50 hosts):\n     - 2^6 - 2 = 62 hosts -> Needs /26 mask (255.255.255.192).\n     - Subnet 1: 192.168.1.0/26 (Usable: 192.168.1.1 to 192.168.1.62, Broadcast: 192.168.1.63).\n  2. Sales Department (Needs 25 hosts):\n     - 2^5 - 2 = 30 hosts -> Needs /27 mask (255.255.255.224).\n     - Subnet 2: 192.168.1.64/27 (Usable: 192.168.1.65 to 192.168.1.94, Broadcast: 192.168.1.95).\n  3. IT Department (Needs 10 hosts):\n     - 2^4 - 2 = 14 hosts -> Needs /28 mask (255.255.255.240).\n     - Subnet 3: 192.168.1.96/28 (Usable: 192.168.1.97 to 192.168.1.110, Broadcast: 192.168.1.111).\n- Remaining address space: 192.168.1.112 to 192.168.1.255 preserved for future expansion.',
    quickRevision: 'VLSM matches subnet size to host needs: /26 for 50 hosts, /27 for 25 hosts, /28 for 10 hosts.',
    difficulty: 'intermediate',
    category: 'Case Study / Practical',
    tags: ['VLSM', 'Subnetting Scenario', 'IP Design', 'Network Engineering']
  },
  'u3_q18': {
    shortAnswer: 'Leaky Bucket algorithm shapes bursty traffic into a constant, steady output rate using a fixed-capacity FIFO buffer with constant drain rate.',
    detailedAnswer: 'Leaky Bucket Algorithm:\n1. Analogy: A bucket with a small hole at the bottom leaks water at a constant rate regardless of how erratically water is poured in. If the bucket overflows, extra water spills (packets dropped).\n2. Mechanism:\n   - Packets enter a FIFO queue of capacity C at irregular, bursty rates.\n   - Packets leave the queue at a strictly constant rate of \'r\' packets/second.\n   - If incoming bursts exceed capacity C, buffer overflows and incoming packets are discarded.\n3. Application: Traffic shaping in ATM and telecommunication to eliminate jitter and enforce strict SLAs.\n4. Limitation: Cannot transmit bursts faster even when channel is completely idle.',
    quickRevision: 'Shapes bursty traffic to constant output rate. Discards packets when buffer capacity overflows.',
    difficulty: 'intermediate',
    category: 'Traffic Shaping',
    tags: ['Leaky Bucket', 'Traffic Shaping', 'Congestion Control', 'QoS']
  },
  'u3_q19': {
    shortAnswer: 'Shortest path routing algorithm (Dijkstra) constructs a minimum-cost forwarding tree from source to all destinations based on link metrics.',
    detailedAnswer: 'Shortest Path Routing Algorithm:\n- Goal: Determine the optimal path between sender and receiver routers that minimizes total path metric (cost, latency, or hop count).\n- Execution Steps:\n  1. Source sets own distance to 0, puts itself in permanent set S.\n  2. For all adjacent neighbors, updates tentative distance.\n  3. Chooses unvisited node with lowest tentative cost, moves it to permanent set.\n  4. Recomputes neighbor paths through newly settled node.\n  5. Continues until all destination routers are permanently resolved.\n- Routing Table Output: Stores (Destination Subnet, Next Hop Router IP, Outgoing Interface).',
    quickRevision: 'Calculates minimum metric path using Dijkstra to populate router forwarding table.',
    difficulty: 'intermediate',
    category: 'Algorithm',
    tags: ['Shortest Path', 'Dijkstra', 'Routing', 'Metric']
  },
  'u3_q20': {
    shortAnswer: 'Congestion occurs when network traffic exceeds link or router buffer capacity. Avoided by Traffic Shaping, Admission Control, Choke Packets, and RED (Random Early Detection).',
    detailedAnswer: 'Congestion and Avoidance Techniques:\n- Definition: Congestion occurs when too many packets are present in a subnet, causing queue buffers to overflow, packet loss, and throughput collapse.\n- Avoidance & Mitigation Mechanisms:\n  1. Traffic Shaping: Smoothing packet transmission rate (Leaky Bucket, Token Bucket).\n  2. Admission Control: Rejecting new virtual circuit connections in congested subnets.\n  3. Choke Packets: Router sends a warning packet back to source to throttle transmission rate.\n  4. Implicit Signaling: Source detects packet drop or delay increase (TCP Tahoe/Reno) and reduces window size.\n  5. Random Early Detection (RED): Router begins randomly dropping packets before queue is 100% full to alert TCP endpoints to back off.',
    quickRevision: 'Congestion = Demand > Capacity. Avoided by traffic shaping, choke packets, admission control, and RED.',
    difficulty: 'basic',
    category: 'Congestion Control',
    tags: ['Congestion', 'Traffic Shaping', 'RED', 'Choke Packets']
  },
  'u3_q21': {
    shortAnswer: 'Flooding forwards incoming packets to every outgoing line except the arrival line. Disadvantages: Bandwidth waste, broadcast storms, and duplicate packets.',
    detailedAnswer: 'Flooding Algorithm & Disadvantages:\n- Concept: When a packet arrives, the router copies and transmits it onto every outgoing interface except the one it arrived on. Guarantees the packet will find the shortest path and reach destination if any path exists.\n- Disadvantages:\n  1. Enormous Bandwidth Waste: Generates massive numbers of duplicate copies across the network.\n  2. Broadcast Storms / Infinite Loops: Unless controlled by a hop counter (TTL) or sequence tracking, packets circulate forever.\n  3. Router Buffer Exhaustion: Router queues quickly overflow, degrading overall network performance.\n- Selective Flooding mitigates this by sending only along lines going roughly in the destination\'s direction.',
    quickRevision: 'Floods packet to all links; reliable but causes duplicate packets, broadcast storms, and wasted bandwidth.',
    difficulty: 'basic',
    category: 'Routing',
    tags: ['Flooding', 'Routing', 'Broadcast Storm', 'TTL']
  },
  'u3_q22': {
    shortAnswer: 'Flow-based routing considers both network topology and expected traffic load/capacity to calculate optimal routing paths that minimize average packet delay.',
    detailedAnswer: 'Flow-Based Routing:\n- Concept: An analytical routing algorithm that takes into account link capacity (C_i in bps) and average traffic flow (lambda_i in pps) on each line.\n- Calculation: Using queuing theory (Kleinrock\'s formula), average packet delay T = Sum [ lambda_i / (mu * C_i - lambda_i) ].\n- Operation: The algorithm tests various routing configurations and selects the path layout that minimizes total system delay T.\n- Requirement: Requires reliable knowledge of traffic matrix (traffic entering and exiting between all pairs of nodes).',
    quickRevision: 'Uses traffic load matrix and queuing theory to choose routes that minimize mean packet delay.',
    difficulty: 'advanced',
    category: 'Routing',
    tags: ['Flow Based Routing', 'Queuing Theory', 'Traffic Engineering', 'Delay Minimization']
  },

  // UNIT 4: Transport Layer, Application Layer
  'u4_q1': {
    shortAnswer: 'A socket is an endpoint for network communication defined by an IP address and Port number (e.g. 192.168.1.1:80). Types: Stream (TCP), Datagram (UDP), and Raw sockets.',
    detailedAnswer: 'Socket Definition & Types:\n- Definition: A socket is an abstraction provided by the OS networking stack representing an endpoint of a bidirectional communication link between two programs over the network.\n- Socket Address = IP Address + Port Number.\n- Types of Sockets:\n  1. Stream Sockets (SOCK_STREAM): Connection-oriented, sequenced, reliable, two-way byte stream using TCP.\n  2. Datagram Sockets (SOCK_DGRAM): Connectionless, unreliable, message-oriented using UDP.\n  3. Raw Sockets (SOCK_RAW): Direct access to underlying network layer protocols (bypass TCP/UDP), used for ping, packet sniffing, and custom protocol development.\n  4. Sequenced Packet Sockets (SOCK_SEQPACKET): Connection-oriented with fixed record boundaries.',
    quickRevision: 'Socket = IP + Port. Types: Stream (TCP), Datagram (UDP), Raw sockets (direct L3/L2 access).',
    difficulty: 'basic',
    category: 'Socket Programming',
    tags: ['Sockets', 'Stream Socket', 'Datagram Socket', 'Port Number']
  },
  'u4_q2': {
    shortAnswer: 'Duties of Transport Layer: Process-to-process delivery, port multiplexing/demultiplexing, connection management, flow control (sliding window), error control, and congestion control.',
    detailedAnswer: 'Core Duties of the Transport Layer:\n1. Process-to-Process Delivery: Delivers data to specific application processes running on hosts using 16-bit Port Numbers.\n2. Multiplexing & Demultiplexing: Combines streams from multiple application sockets onto a single network layer (multiplexing), and separates incoming packets to corresponding application ports (demultiplexing).\n3. Segmentation and Reassembly: Breaks large application messages into smaller segments and reassembles them in correct order at destination.\n4. Connection Management: Establishes, maintains, and cleanly terminates connections (3-way handshake in TCP).\n5. Flow Control: Prevents receiver buffer overflow using sliding window advertized window mechanism.\n6. Error Control: End-to-end checksum, acknowledgments, and retransmission of damaged segments.',
    quickRevision: 'Port addressing, multiplexing, segmentation, connection management, flow & error control.',
    difficulty: 'basic',
    category: 'Transport Layer',
    tags: ['Transport Layer', 'Duties', 'Multiplexing', 'Flow Control', 'Ports']
  },
  'u4_q3': {
    shortAnswer: 'TCP is connection-oriented, reliable (ACK, retransmission), ordered, with flow/congestion control (heavyweight). UDP is connectionless, unreliable, unordered, lightweight, and low-latency.',
    detailedAnswer: 'Comparison between TCP and UDP:\n| Feature | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |\n|---|---|---|\n| Connection | Connection-oriented (3-way handshake) | Connectionless (no setup) |\n| Reliability | Guaranteed delivery (ACK, retransmissions) | Best effort (unreliable) |\n| Ordering | Guarantees sequential order | Packets may arrive out-of-order |\n| Header Size | 20 to 60 bytes | Fixed 8 bytes |\n| Speed / Overhead | Slower, higher bandwidth overhead | Fast, minimal latency overhead |\n| Flow/Congestion | Yes (Window & Congestion algorithms) | No flow or congestion control |\n| Transmission Mode | Stream of bytes | Discrete message datagrams |\n| Applications | HTTP/HTTPS, FTP, SMTP, SSH | DNS, VoIP, Video Streaming, Gaming |',
    quickRevision: 'TCP = Reliable, ordered, handshake, flow control (HTTP/FTP); UDP = Fast, stateless, datagrams (DNS/VoIP).',
    difficulty: 'basic',
    category: 'Comparison',
    tags: ['TCP', 'UDP', 'Comparison', 'Transport Layer']
  },
  'u4_q4': {
    shortAnswer: 'Congestion occurs when the aggregate traffic submitted by hosts exceeds the network capacity (buffer queue overflow, packet dropping, high latency, throughput collapse).',
    detailedAnswer: 'Congestion in Computer Networks:\n- Cause: Occurs when traffic load (packets injected per unit time) exceeds channel bandwidth or router buffer capacity.\n- Effects: Long queuing delays, high packet drop rates, and retransmissions that exacerbate the congestion, leading to congestion collapse.\n- Detection: In TCP, congestion is detected by packet loss (RTO timer expiration or 3 duplicate ACKs) or explicit congestion notification (ECN).\n- Resolution: TCP uses slow start, congestion avoidance, fast retransmit, and fast recovery to halve the congestion window (CWND) and ease load.',
    quickRevision: 'Network overload leading to queue drops and throughput collapse. Managed via TCP CWND backoff.',
    difficulty: 'basic',
    category: 'Congestion Control',
    tags: ['Congestion', 'CWND', 'Packet Drop', 'Throughput']
  },
  'u4_q5': {
    shortAnswer: 'Transport layer provides logical communication between application processes running on different hosts, ensuring end-to-end data transfer integrity.',
    detailedAnswer: 'Functions of Transport Layer:\n1. Addressing: Uses 16-bit Port numbers (0-65535) to direct data to specific application processes.\n2. Segmentation & Reassembly: Divides application data into segments within Maximum Segment Size (MSS) and reconstructs them.\n3. End-to-End Reliability: Checks data integrity via checksum and guarantees arrival via acknowledgments.\n4. Flow Control: Prevents buffer overflow at receiver through Advertised Window size.\n5. Congestion Control: Manages transmission rate to prevent choking intermediate routers.',
    quickRevision: 'Provides end-to-end process-to-process data delivery, port multiplexing, and reliability.',
    difficulty: 'basic',
    category: 'Transport Layer',
    tags: ['Transport Layer', 'Functions', 'Reliability', 'Segmentation']
  },
  'u4_q6': {
    shortAnswer: 'UDP header is fixed at 8 bytes (64 bits), containing 4 fields of 2 bytes each: Source Port, Destination Port, Length, and Checksum.',
    detailedAnswer: 'UDP Header Structure:\n- Total Size: Exactly 8 bytes (fixed format, no options).\n- Fields (16 bits each):\n  1. Source Port (16 bits): Port number of sending process (optional, set to 0 if no reply expected).\n  2. Destination Port (16 bits): Port number of receiving application (e.g. 53 for DNS, 67 for DHCP).\n  3. Length (16 bits): Total length of UDP segment (header + payload in bytes; minimum = 8).\n  4. Checksum (16 bits): Error-detection checksum covering UDP header, payload, and an IP pseudo-header (optional in IPv4, mandatory in IPv6).',
    quickRevision: '8 bytes total: Source Port (16b), Destination Port (16b), Length (16b), Checksum (16b).',
    difficulty: 'basic',
    category: 'Protocol Header',
    tags: ['UDP Header', 'Format', 'Source Port', 'Destination Port']
  },
  'u4_q7': {
    shortAnswer: 'TCP header is 20-60 bytes. TCP provides reliable byte-stream transfer using a 3-way handshake (SYN, SYN-ACK, ACK), sequence numbers, ACKs, and sliding window flow control.',
    detailedAnswer: 'TCP Header & Working Principles:\n1. Header Fields (20-60 bytes):\n   - Source & Destination Ports (16 bits each).\n   - Sequence Number (32 bits): Tracks byte position in stream.\n   - Acknowledgment Number (32 bits): Next expected byte from sender.\n   - Header Length / Data Offset (4 bits).\n   - Control Flags (6 bits: URG, ACK, PSH, RST, SYN, FIN).\n   - Window Size (16 bits): Flow control advertized buffer space.\n   - Checksum (16 bits) & Urgent Pointer (16 bits).\n2. Connection Establishment (3-Way Handshake):\n   - Step 1: Client -> Server: SYN (seq=x)\n   - Step 2: Server -> Client: SYN-ACK (seq=y, ack=x+1)\n   - Step 3: Client -> Server: ACK (seq=x+1, ack=y+1)\n3. Termination: 4-way handshake using FIN and ACK control segments.',
    quickRevision: '20-60 bytes. 3-way handshake (SYN -> SYN-ACK -> ACK). Sliding window flow control with sequence numbers.',
    difficulty: 'intermediate',
    category: 'Protocol Analysis',
    tags: ['TCP Header', '3-Way Handshake', 'Sequence Number', 'SYN', 'ACK']
  },
  'u4_q9': {
    shortAnswer: 'World Wide Web (WWW) is an architectural framework for accessing distributed hypermedia documents across the Internet using URLs, HTTP, and HTML.',
    detailedAnswer: 'World Wide Web (WWW) Architecture:\n1. Invention: Invented by Sir Tim Berners-Lee at CERN in 1989.\n2. Three Core Building Blocks:\n   - URI/URL (Uniform Resource Identifier/Locator): Standardized global naming scheme for locating resources (protocol://domain:port/path).\n   - HTTP (HyperText Transfer Protocol): Request-response application-layer communication protocol.\n   - HTML (HyperText Markup Language): Document formatting language with hyperlinks connecting documents.\n3. Client-Server Model: Web browser (client) sends HTTP requests to Web server (Apache, Nginx); server serves HTML/CSS/JS resources rendered by browser.',
    quickRevision: 'Distributed hypermedia system built on URL (addressing), HTTP (transfer), and HTML (document formatting).',
    difficulty: 'basic',
    category: 'Application Layer',
    tags: ['WWW', 'HTTP', 'HTML', 'URL', 'Web Architecture']
  },
  'u4_q10': {
    shortAnswer: 'HTTP (Hypertext Transfer Protocol) is an application-layer request-response protocol running over TCP port 80/443 to transfer web resources. It is stateless and extensible.',
    detailedAnswer: 'HyperText Transfer Protocol (HTTP):\n1. Protocol Role: Client-server protocol powering the web (default TCP port 80 for HTTP, 443 for HTTPS/TLS).\n2. Request Methods: GET (retrieve resource), POST (submit form/data), PUT (replace resource), DELETE (remove), HEAD, OPTIONS, PATCH.\n3. Status Codes:\n   - 1xx: Informational\n   - 2xx: Success (200 OK, 201 Created)\n   - 3xx: Redirection (301 Moved Permanently, 304 Not Modified)\n   - 4xx: Client Error (400 Bad Request, 403 Forbidden, 404 Not Found)\n   - 5xx: Server Error (500 Internal Server Error, 502 Bad Gateway)\n4. Statelessness: Each request is independent; state is tracked via Cookies, Sessions, and JWT tokens.',
    quickRevision: 'Stateless request-response protocol over TCP 80/443. Methods: GET, POST; Status: 200 OK, 404 Not Found.',
    difficulty: 'basic',
    category: 'Application Layer',
    tags: ['HTTP', 'Methods', 'Status Codes', 'REST', 'Web']
  },
  'u4_q11': {
    shortAnswer: 'SMTP (Simple Mail Transfer Protocol) is an application-layer push protocol running over TCP port 25/587 used by mail servers to transmit and relay emails.',
    detailedAnswer: 'SMTP (Simple Mail Transfer Protocol):\n1. Purpose: Client-to-server and server-to-server email transmission.\n2. Architecture: Push protocol (pushes email from sender MUA to MTA, and between MTAs). Note: POP3 or IMAP are pull protocols used by recipients to retrieve mail.\n3. Port Numbers: Port 25 (traditional server relay), Port 587 (authenticated client submission), Port 465 (SMTPS with SSL).\n4. Text-Based Commands: HELO/EHLO (initiate session), MAIL FROM (sender), RCPT TO (recipient), DATA (body), QUIT (end session).\n5. Plain text limitation: Originally 7-bit ASCII only; extended to binary/attachments using MIME (Multipurpose Internet Mail Extensions).',
    quickRevision: 'Push protocol for sending emails over TCP port 25/587. Uses commands: HELO, MAIL FROM, RCPT TO, DATA.',
    difficulty: 'basic',
    category: 'Application Layer',
    tags: ['SMTP', 'Email', 'MTA', 'TCP 25', 'Push Protocol']
  },
  'u4_q12': {
    shortAnswer: 'DNS (Domain Name System) is a distributed hierarchical database that resolves human-readable domain names (e.g. google.com) into computer-routable IP addresses over UDP/TCP port 53.',
    detailedAnswer: 'Domain Name System (DNS) Architecture:\n1. Role: The phonebook of the Internet, translating hostnames to IP addresses.\n2. Hierarchical Tree Structure:\n   - Root Domain: Represented by dot (13 root server clusters worldwide).\n   - Top-Level Domain (TLD): .com, .org, .edu, .in.\n   - Second-Level Domain: google.com, indusuni.ac.in.\n   - Subdomain: mail.google.com.\n3. Resolution Process: Client -> Recursive Resolver -> Root Server -> TLD Server -> Authoritative Name Server.\n4. Key Record Types:\n   - A: Hostname to IPv4\n   - AAAA: Hostname to IPv6\n   - CNAME: Canonical name (alias)\n   - MX: Mail Exchange server\n   - NS: Authoritative Name Server\n   - PTR: Reverse lookup (IP to name)\n5. Port: Operates over UDP port 53 (queries) and TCP port 53 (zone transfers/large responses).',
    quickRevision: 'Hierarchical distributed database mapping domain names -> IP addresses over UDP port 53. Records: A, CNAME, MX.',
    difficulty: 'intermediate',
    category: 'Application Layer',
    tags: ['DNS', 'Domain Name', 'A Record', 'UDP 53', 'Hierarchical']
  },
  'u4_q13': {
    shortAnswer: 'HTTP is a stateless client-server protocol for web communication. Features include persistent connections (HTTP/1.1 Keep-Alive), multiplexing (HTTP/2), and QUIC over UDP (HTTP/3).',
    detailedAnswer: 'Detailed Explanation of HTTP Evolution & Features:\n1. HTTP/1.0: Non-persistent; opens a new TCP connection for every single object, creating high latency.\n2. HTTP/1.1: Persistent connections (Keep-Alive) allowing multiple requests over one TCP connection; introduces chunked transfer, host headers, and caching controls.\n3. HTTP/2: Binary framing layer, multiplexing (multiple parallel streams over a single connection), header compression (HPACK), and server push.\n4. HTTP/3: Runs over QUIC (UDP) to completely eliminate head-of-line blocking and achieve 0-RTT handshakes.\n5. HTTPS: HTTP layered over TLS/SSL (port 443) providing confidentiality, integrity, and server authentication.',
    quickRevision: 'HTTP/1.1 persistent connections; HTTP/2 multiplexed streams; HTTP/3 QUIC over UDP; HTTPS adds TLS encryption.',
    difficulty: 'intermediate',
    category: 'Application Layer',
    tags: ['HTTP', 'HTTP/2', 'HTTP/3', 'Persistent Connections', 'Web Protocols']
  },
  'u4_q14': {
    shortAnswer: 'FTP (File Transfer Protocol) uses two separate TCP connections: Control connection on port 21 (commands) and Data connection on port 20 (file transfer).',
    detailedAnswer: 'FTP (File Transfer Protocol) Architecture:\n1. Two-Connection Architecture (Out-of-Band Control):\n   - Control Connection (TCP Port 21): Remains open during the entire session for sending user commands (USER, PASS, RETR, STOR) and receiving status replies.\n   - Data Connection (TCP Port 20): Created on-demand and closed after each file or directory listing transfer.\n2. Transfer Modes:\n   - Active Mode: Client opens port N, sends PORT command to server; server connects back from port 20 to client port N (often blocked by client firewalls).\n   - Passive Mode (PASV): Client sends PASV command; server opens unprivileged port P and tells client to connect to port P (firewall friendly).\n3. Data Representation: Supports ASCII (text) and Binary/Image modes.',
    quickRevision: 'Uses 2 TCP connections: Port 21 for control commands, Port 20 for data transfer. Active & Passive modes.',
    difficulty: 'basic',
    category: 'Application Layer',
    tags: ['FTP', 'Port 21', 'Port 20', 'File Transfer', 'Active Mode', 'Passive Mode']
  },
  'u4_q15': {
    shortAnswer: 'FTP (File Transfer Protocol) provides reliable bulk file upload and download between client and server using separate control (port 21) and data (port 20) channels.',
    detailedAnswer: 'FTP Features and Security Considerations:\n1. Purpose: Standard network protocol for copying files between hosts across TCP/IP networks.\n2. Authentication: Supports username/password credentials as well as Anonymous FTP for public software distribution.\n3. Security Vulnerability: Traditional FTP transmits credentials and data in clear text, making it vulnerable to packet sniffing.\n4. Secure Alternatives: FTPS (FTP over SSL/TLS) and SFTP (SSH File Transfer Protocol running over SSH port 22).',
    quickRevision: 'Bulk file transfer over TCP 21 (control) and 20 (data). Insecure cleartext; replaced by SFTP/FTPS.',
    difficulty: 'basic',
    category: 'Application Layer',
    tags: ['FTP', 'SFTP', 'File Transfer', 'Network Security']
  },
  'u4_q16': {
    shortAnswer: 'Internet transport protocols comprise TCP (connection-oriented, reliable byte stream) and UDP (connectionless, lightweight datagrams), operating over IP.',
    detailedAnswer: 'Internet Transport Protocols Overview:\n1. TCP (Transmission Control Protocol):\n   - Provides reliable, in-order, error-checked delivery of a stream of octets between applications.\n   - Implements sliding window flow control, slow start, congestion avoidance, and retransmission timers.\n   - Used when accuracy is paramount (Web, Email, Banking).\n2. UDP (User Datagram Protocol):\n   - Thin wrapper over IP providing process-level port addressing and optional checksum.\n   - Zero connection overhead, no retransmission delays.\n   - Used for real-time voice/video, broadcast/multicast, and simple query-response (DNS, NTP, SNMP).\n3. Modern Additions: SCTP (Stream Control Transmission Protocol) with multi-homing; QUIC (UDP-based transport for HTTP/3).',
    quickRevision: 'Core internet transport protocols: TCP (reliable, connection-oriented) and UDP (fast, connectionless).',
    difficulty: 'basic',
    category: 'Transport Layer',
    tags: ['Transport Protocols', 'TCP', 'UDP', 'Internet Architecture']
  },
  'u4_q17': {
    shortAnswer: 'TCP segment header contains 20-60 bytes: Source/Dest Ports (16b), Sequence Number (32b), ACK Number (32b), Data Offset (4b), Flags (URG, ACK, PSH, RST, SYN, FIN), Window (16b), Checksum (16b).',
    detailedAnswer: 'Detailed Breakdown of TCP Segment Header:\n- Header size: 20 bytes minimum, up to 60 bytes with options.\n- Fields:\n  1. Source Port (16 bits) & Destination Port (16 bits): Identifies sending and receiving applications.\n  2. Sequence Number (32 bits): Specifies byte number of first data byte in segment; or Initial Sequence Number (ISN) if SYN is set.\n  3. Acknowledgment Number (32 bits): Next expected byte number from sender (valid if ACK flag = 1).\n  4. Data Offset (4 bits): Header length in 32-bit words (minimum 5 = 20 bytes).\n  5. Reserved (3 bits) & Flags (9 bits: NS, CWR, ECE, URG, ACK, PSH, RST, SYN, FIN).\n  6. Window Size (16 bits): Receive buffer space for flow control.\n  7. Checksum (16 bits): Covers header, payload, and pseudo-header.\n  8. Urgent Pointer (16 bits): Points to urgent data when URG flag is set.',
    quickRevision: '20 bytes minimum. Fields: Ports, Seq #, Ack #, Offset, Flags (SYN/ACK/FIN), Window size, Checksum.',
    difficulty: 'intermediate',
    category: 'Protocol Header',
    tags: ['TCP Segment Header', 'Flags', 'Flow Control', 'Sequence Number']
  },
  'u4_q18': {
    shortAnswer: 'An Absolute Domain Name (FQDN) ends with a trailing dot specifying the full path to the root (e.g. mail.google.com.). A Relative Domain Name specifies only the local prefix relative to a domain.',
    detailedAnswer: 'Absolute vs. Relative Domain Names:\n1. Fully Qualified Domain Name (FQDN / Absolute Domain Name):\n   - Specifies complete path from the node up to the root domain.\n   - Always ends with an explicit (or implicit) dot (e.g. `server1.sales.example.com.`).\n   - Unambiguous and resolved identically from anywhere on the global Internet.\n2. Relative Domain Name (Partially Qualified Domain Name - PQDN):\n   - Specifies only a portion of the hostname without full root path (e.g. `server1` or `server1.sales`).\n   - The operating system DNS resolver automatically appends the local default search domain (e.g. `.example.com.`) to resolve it into an FQDN.\n   - Ambiguous outside its local subnet/domain.',
    quickRevision: 'Absolute (FQDN) ends with dot and gives full path to root; Relative gives partial hostname completed by search domain.',
    difficulty: 'basic',
    category: 'Application Layer',
    tags: ['DNS', 'FQDN', 'Absolute Domain Name', 'Relative Domain Name']
  },
  'u4_q19': {
    shortAnswer: 'Domain Name System (DNS) is an Internet service that maps human-friendly hostnames to numeric IP addresses using a globally distributed, hierarchical database.',
    detailedAnswer: 'Domain Name System (DNS) Fundamentals:\n- Necessity: Humans prefer memorable names (www.google.com), while routers route packets using IP addresses (142.250.190.46).\n- Architecture: Distributed hierarchical database consisting of Root servers (13 named authorities), Top-Level Domain (TLD) servers (.com, .org), and Authoritative Name Servers.\n- Query Resolution Modes:\n  * Recursive Query: The local DNS resolver takes full responsibility to contact root, TLD, and authoritative servers on behalf of the client and returns final IP.\n  * Iterative Query: Server responds with best referral to next server in hierarchy.\n- Caching: Resolvers cache IP records according to TTL (Time to Live) to minimize latency and Internet root server traffic.',
    quickRevision: 'Global distributed database mapping human names -> IP addresses. Uses recursive and iterative queries.',
    difficulty: 'basic',
    category: 'Application Layer',
    tags: ['DNS', 'Domain Name System', 'Resolver', 'Root Server']
  },
  'u4_q20': {
    shortAnswer: 'MIME (Multipurpose Internet Mail Extensions) extends basic 7-bit ASCII email format to support non-ASCII text, audio, video, images, and multi-part attachments.',
    detailedAnswer: 'MIME (Multipurpose Internet Mail Extensions):\n- Why Needed: Standard SMTP was strictly limited to 7-bit ASCII text and rejected 8-bit binary data (executable files, images, non-English scripts).\n- MIME Headers Added to Email:\n  1. MIME-Version: Declares compliance (e.g. 1.0).\n  2. Content-Type: Specifies data format (e.g. text/html, image/jpeg, application/pdf, multipart/mixed).\n  3. Content-Transfer-Encoding: Describes transformation algorithm used to encode binary to safe 7-bit ASCII (e.g. Base64, Quoted-Printable).\n  4. Content-Disposition: Indicates inline display or attachment with filename.\n- Multi-part support: Enables email to carry HTML body and multiple binary file attachments simultaneously delimited by boundaries.',
    quickRevision: 'Extends SMTP with Content-Type and Base64 encoding to transmit binary files, images, and attachments.',
    difficulty: 'basic',
    category: 'Application Layer',
    tags: ['MIME', 'Email', 'Base64', 'Content-Type', 'SMTP']
  },
  'u4_q21': {
    shortAnswer: 'Principles of Congestion Control involve monitoring network resource utilization, throttling sender injection rate via Congestion Window (CWND), and fair bandwidth allocation.',
    detailedAnswer: 'Principles of Congestion Control:\n1. Root Cause: Sum of transmission rates > Link capacity (Sum of input rates > output bandwidth).\n2. Feedback Mechanisms:\n   - Open-Loop (Avoidance): Design protocols that prevent congestion (traffic shaping, scheduling, reservation).\n   - Closed-Loop (Recovery): Monitor system for congestion and dynamically feedback throttle signals (Choke packets, ECN, packet drop detection).\n3. End-to-End Congestion Control (TCP):\n   - Additive Increase / Multiplicative Decrease (AIMD): Gradually increases window by 1 MSS per RTT when network is healthy; cuts window by half upon packet loss.\n   - Max-Min Fairness: Allocates bottleneck bandwidth fairly among competing flows.',
    quickRevision: 'Open-loop (prevention via shaping) and Closed-loop (reaction via AIMD and window backoff).',
    difficulty: 'intermediate',
    category: 'Congestion Control',
    tags: ['Congestion Control', 'AIMD', 'CWND', 'Traffic Engineering']
  },
  'u4_q22': {
    shortAnswer: 'TCP header consists of 20-60 bytes including Source Port, Destination Port, Sequence Number, ACK Number, Data Offset, Control Flags, Window Size, Checksum, and Urgent Pointer.',
    detailedAnswer: 'TCP Header Diagram & Field Explanations:\n```\n 0                   1                   2                   3\n 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n|          Source Port          |       Destination Port        |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n|                        Sequence Number                        |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n|                    Acknowledgment Number                      |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n|  Data |           |U|A|P|R|S|F|                               |\n| Offset| Reserved  |R|C|S|S|Y|I|            Window             |\n|       |           |G|K|H|T|N|N|                               |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n|           Checksum            |        Urgent Pointer         |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n|                    Options (if any, up to 40 bytes)           |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n```\n- Flags:\n  * SYN: Synchronize sequence numbers to establish connection.\n  * ACK: Acknowledgment field is valid.\n  * FIN: Sender finished sending data (clean termination).\n  * RST: Reset connection.\n  * PSH: Push data immediately to application.\n  * URG: Urgent pointer valid.',
    quickRevision: '20 bytes base header. Diagram shows 16b Ports, 32b Seq/Ack numbers, 6 control flags, 16b Window.',
    difficulty: 'intermediate',
    category: 'Protocol Header',
    tags: ['TCP Header', 'Diagram', 'Flags', 'Transport Layer']
  },
  'u4_q23': {
    shortAnswer: 'UDP header is an ultra-simple 8-byte structure containing Source Port (16b), Destination Port (16b), Length (16b), and Checksum (16b).',
    detailedAnswer: 'UDP Header Diagram & Field Explanations:\n```\n 0      7 8     15 16    23 24    31\n+--------+--------+--------+--------+\n|     Source      |   Destination   |\n|      Port       |      Port       |\n+--------+--------+--------+--------+\n|                 |                 |\n|     Length      |    Checksum     |\n+--------+--------+--------+--------+\n|                                   |\n|        Data (if any) ...          |\n+--------+--------+--------+--------+\n```\n- Field Breakdown:\n  1. Source Port (16 bits): Port of sender process.\n  2. Destination Port (16 bits): Port of receiver process.\n  3. Length (16 bits): Total length in bytes of header + payload (min = 8).\n  4. Checksum (16 bits): Optional in IPv4, mandatory in IPv6. Computed over pseudo-header, UDP header, and payload.',
    quickRevision: '8 bytes total: 2 bytes Source Port, 2 bytes Destination Port, 2 bytes Length, 2 bytes Checksum.',
    difficulty: 'basic',
    category: 'Protocol Header',
    tags: ['UDP Header', 'Diagram', 'Format', 'Transport Layer']
  },
  'u4_q24': {
    shortAnswer: 'Leaky Bucket outputs data at a strictly constant rate, discarding excess bursts. Token Bucket accumulates tokens and allows bursty transmission up to available token capacity.',
    detailedAnswer: 'Leaky Bucket vs. Token Bucket:\n1. Output Rate:\n   - Leaky Bucket: Produces a strictly constant, uniform output rate regardless of input burstiness.\n   - Token Bucket: Allows bursty transmissions at maximum wire speed as long as sufficient tokens exist in the bucket.\n2. Discard Policy:\n   - Leaky Bucket: Packets arriving when bucket buffer is full are immediately dropped.\n   - Token Bucket: Discards tokens when full, not packets; packets wait or transmit when tokens generate.\n3. Token Accumulation: Leaky Bucket cannot save credits; Token Bucket accumulates tokens during idle periods for future bursts.\n4. Application: Leaky Bucket is ideal for traffic policing (strict ATM); Token Bucket is ideal for web/computer traffic where bursts are natural.',
    quickRevision: 'Leaky bucket = Constant output rate (no bursts); Token bucket = Allows bursty transmission up to token limit.',
    difficulty: 'intermediate',
    category: 'Traffic Shaping',
    tags: ['Leaky Bucket', 'Token Bucket', 'Comparison', 'Traffic Shaping']
  },
  'u4_q25': {
    shortAnswer: 'DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses, subnet masks, default gateways, and DNS servers using the 4-step DORA process: Discover, Offer, Request, Acknowledge.',
    detailedAnswer: 'Working of DHCP (DORA Process):\n1. DHCP Discover (Client -> Broadcast): A new or booting device broadcasts a `DHCPDISCOVER` packet (Dest IP: 255.255.255.255, Dest MAC: FF:FF:FF:FF:FF:FF, UDP port 67) asking for an IP.\n2. DHCP Offer (Server -> Client): DHCP server receives discover and reserves an IP; broadcasts/unicasts a `DHCPOFFER` packet containing offered IP, subnet mask, lease duration, and server IP.\n3. DHCP Request (Client -> Broadcast): Client broadcasts a `DHCPREQUEST` announcing acceptance of the offered IP.\n4. DHCP Acknowledge (Server -> Client): Server sends `DHCPACK` confirming lease allocation. The client configures its network stack.\n- Ports: Client uses UDP 68; Server uses UDP 67.',
    quickRevision: 'DORA Process: Discover (broadcast) -> Offer -> Request -> Acknowledge. Runs over UDP ports 67/68.',
    difficulty: 'intermediate',
    category: 'Application Layer',
    tags: ['DHCP', 'DORA Process', 'IP Assignment', 'UDP 67', 'UDP 68']
  },
  'u4_q26': {
    shortAnswer: 'Leaky Bucket traffic shaping algorithm forces packets through a finite-capacity queue at a constant rate, smoothing bursty network traffic.',
    detailedAnswer: 'Leaky Bucket Algorithm Working:\n1. Model: A bucket has a small hole at the bottom leaking water at a constant rate. Water can be poured in abruptly, but it leaks out smoothly.\n2. In Networking:\n   - A FIFO queue holds packets up to buffer size B.\n   - A timer tick releases exactly \'r\' packets per tick to the network interface.\n   - If a burst arrives and buffer has free space, packets are queued.\n   - If buffer is full, excess packets overflow and are dropped.\n3. Mathematical enforcement: Guarantees average and peak output rate <= r.',
    quickRevision: 'Queue with constant drain rate r. Prevents burst transmission and enforces strict rate limits.',
    difficulty: 'basic',
    category: 'Traffic Shaping',
    tags: ['Leaky Bucket', 'Traffic Shaping', 'Congestion Avoidance']
  }
};

async function convert() {
  const inputPdfPath = 'C:\\Users\\manan\\Downloads\\cnqb.pdf';
  const outputJsonPath = 'C:\\Users\\manan\\Downloads\\cnqb.json';
  const backendCopyPath = path.join(__dirname, 'cnqb_converted.json');

  console.log('Starting conversion of:', inputPdfPath);

  // Read raw lines from extracted text
  const txtPath = path.join(__dirname, 'cnqb_extracted_text.txt');
  const rawText = fs.readFileSync(txtPath, 'utf8');
  const lines = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  let currentUnitNum = 1;
  let currentUnitName = 'Introduction to Computer Networks, Data Link Layer';
  const questions = [];

  let currentQNumber = null;
  let currentQText = '';

  const saveCurrentQ = () => {
    if (currentQNumber && currentQText.trim()) {
      const cleanNum = currentQNumber.trim();
      const numMatch = cleanNum.match(/([0-9]+)/);
      const qIndex = numMatch ? numMatch[1] : '1';
      const lookupKey = `u${currentUnitNum}_q${qIndex}`;
      const ansInfo = cnAnswers[lookupKey] || {
        shortAnswer: `${currentQText.trim()} — Refer to standard Computer Networks reference materials for detailed proofs and diagrams.`,
        detailedAnswer: `${currentQText.trim()}\n\nThis core university exam question tests key principles in ${currentUnitName}. Consult standard networking texts (Tanenbaum, Forouzan) for full analytical formulations.`,
        quickRevision: `${currentQText.slice(0, 100)}...`,
        difficulty: 'intermediate',
        category: 'Theory Viva',
        tags: ['Computer Networks', `Unit ${currentUnitNum}`]
      };

      questions.push({
        unitId: `unit-${currentUnitNum}`,
        section: `Unit ${currentUnitNum}: ${currentUnitName}`,
        category: ansInfo.category || 'Theory Viva',
        difficulty: ansInfo.difficulty || 'intermediate',
        questionNumber: cleanNum.startsWith('Q.') ? cleanNum : `Q.${cleanNum}`,
        question: currentQText.trim(),
        shortAnswer: ansInfo.shortAnswer || '',
        detailedAnswer: ansInfo.detailedAnswer || ansInfo.shortAnswer || '',
        quickRevision: ansInfo.quickRevision || '',
        tags: ansInfo.tags || ['Computer Networks', `Unit ${currentUnitNum}`],
        followUpQuestions: [
          {
            question: `What is the primary practical application of this concept in modern networking?`,
            answer: `It forms a standard operational requirement in network protocol design, ensuring reliability, addressing, and high throughput across heterogeneous hosts.`
          }
        ],
        isPublished: true
      });
    }
    currentQNumber = null;
    currentQText = '';
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (!trimmed) continue;
    if (trimmed.match(/--\s*[0-9]+\s*of\s*[0-9]+\s*--/i)) continue;

    // Detect Unit Header
    const unitMatch = trimmed.match(/^Unit[- ]*([1-4])\s*(.*)$/i);
    if (unitMatch) {
      saveCurrentQ();
      currentUnitNum = parseInt(unitMatch[1], 10);
      const possibleName = unitMatch[2].trim();
      if (possibleName) {
        currentUnitName = possibleName;
      } else {
        // Next line might have unit title
        const nextLine = (lines[i + 1] || '').trim();
        if (nextLine && !nextLine.startsWith('Q.') && !nextLine.startsWith('Q ')) {
          currentUnitName = nextLine;
          i++;
        }
      }
      continue;
    }

    // Detect Question Starter: Q.1, Q.12, .18, Q 1
    const qMatch = trimmed.match(/^(?:Q\.?\s*([0-9]+)|\.([0-9]+))\s*[\t:.]?\s*(.*)$/i);
    if (qMatch) {
      saveCurrentQ();
      const num = qMatch[1] || qMatch[2];
      currentQNumber = `Q.${num}`;
      currentQText = qMatch[3] ? qMatch[3].trim() : '';
      continue;
    }

    // Continuation line
    if (currentQNumber) {
      // Sub-parts like i., ii., iii. or regular multi-line wrap
      currentQText += ' ' + trimmed;
    }
  }

  saveCurrentQ();

  console.log(`Parsed total ${questions.length} questions across 4 units.`);

  const finalJson = {
    subjectCode: 'CE0518',
    subjectTitle: 'Computer Networks',
    department: 'Computer Engineering / IT',
    semester: 5,
    source: 'End Sem Exam Question Bank (Unit 1-4) - Indus University',
    totalQuestions: questions.length,
    units: [
      {
        unitId: 'unit-1',
        name: 'Unit 1: Introduction to Computer Networks, Data Link Layer',
        questionCount: questions.filter(q => q.unitId === 'unit-1').length,
        questions: questions.filter(q => q.unitId === 'unit-1')
      },
      {
        unitId: 'unit-2',
        name: 'Unit 2: Medium Access Sub-layer',
        questionCount: questions.filter(q => q.unitId === 'unit-2').length,
        questions: questions.filter(q => q.unitId === 'unit-2')
      },
      {
        unitId: 'unit-3',
        name: 'Unit 3: Network Layer',
        questionCount: questions.filter(q => q.unitId === 'unit-3').length,
        questions: questions.filter(q => q.unitId === 'unit-3')
      },
      {
        unitId: 'unit-4',
        name: 'Unit 4: Transport Layer, Application Layer',
        questionCount: questions.filter(q => q.unitId === 'unit-4').length,
        questions: questions.filter(q => q.unitId === 'unit-4')
      }
    ],
    // Flat questions list for flexible importing
    questions: questions
  };

  fs.writeFileSync(outputJsonPath, JSON.stringify(finalJson, null, 2), 'utf8');
  fs.writeFileSync(backendCopyPath, JSON.stringify(finalJson, null, 2), 'utf8');

  console.log(`Saved compliant JSON file to: ${outputJsonPath}`);
  console.log(`Saved backend backup copy to: ${backendCopyPath}`);
}

convert().catch(console.error);
