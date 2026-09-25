// frontend/src/data/viva/ce0518_unit1.js
/**
 * CE0518 Unit 1: Introduction to Computer Networks, Data Link Layer
 * Indus University End Sem Question Bank
 */

export const CE0518_UNIT1_QUESTIONS = [
  {
    id: 'ce0518-u1-q1',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to Computer Networks, Data Link Layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'What is network topology? Explain different types of network topology.',
    shortAnswer: 'Network topology is the physical or logical arrangement of computing devices, transmission media, and interconnecting links in a computer network. The primary topologies are Mesh, Star, Bus, Ring, Tree, and Hybrid, each offering distinct trade-offs between cost, redundancy, and fault tolerance.',
    detailedAnswer: 'Network topology defines the structural blueprint of a network. It is bifurcated into Physical Topology (the physical layout of cables, nodes, and hardware) and Logical Topology (the actual path data signals travel through the medium).\n\n1. Mesh Topology: Every device has a dedicated point-to-point link to every other device. For n devices, it requires n(n-1)/2 physical duplex links. Offers maximum fault tolerance, security, and zero traffic congestion, but suffers from high cabling cost and complex I/O installation.\n\n2. Star Topology: All nodes connect directly to a central hub, switch, or router. Communication between devices passes through the central controller. If a link fails, only that workstation is affected. Easy to install and troubleshoot; failure of central hub causes network outage.\n\n3. Bus Topology: A single continuous multipoint backbone coaxial or twisted pair cable connects all devices with terminators at both ends. Inexpensive and simple for small networks; however, a break in the backbone halts the entire network.\n\n4. Ring Topology: Nodes are daisy-chained in a closed circular loop. Packets circulate unidirectionally or bidirectionally via tokens. Repeaters regenerate the signal. Cable failure breaks the loop unless a dual ring is used.\n\n5. Tree & Hybrid Topologies: Hierarchical star configurations connected to a central bus backbone or combination of two or more distinct topologies.',
    keyPoints: [
      'Defines geometric representation of nodes and communication links.',
      'Physical layout vs logical signal flow.',
      'Mesh formula: Total physical links = n(n - 1) / 2.',
      'Star topology is the industry standard for modern Ethernet LANs.',
      'Bus topology uses terminators to absorb reflected signals.'
    ],
    example: 'A modern campus computer lab utilizes a Star topology where all student PCs connect via Cat-6 cables to a central Cisco Catalyst 2960 switch.',
    diagram: `+-------------------------------------------------------------+
|                     NETWORK TOPOLOGIES                      |
+-------------------------------------------------------------+
   [Mesh: Full Links]         [Star: Central Switch]
      (A)-----(B)                   (A)     (B)
       | \\   / |                      \\   /
       |   X   |                     [SWITCH]
       | /   \\ |                      /   \\
      (C)-----(D)                   (C)     (D)

   [Bus: Shared Backbone]     [Ring: Circulating Token]
   ===|===|===|===|===                 (A)----(B)
     (A) (B) (C) (D)                    |      |
     [Terminator]                      (D)----(C)
+-------------------------------------------------------------+`,
    followUpQuestions: [
      {
        question: 'How many links and I/O ports are required for a 6-node fully connected Mesh network?',
        answer: 'Links = 6 × (6 - 1) / 2 = 15 links. Each node requires 5 I/O ports.'
      },
      {
        question: 'What is the function of terminators in a Bus topology?',
        answer: 'Terminators absorb propagating electrical signals at the ends of the bus to prevent signal reflection, which causes data corruption.'
      }
    ],
    quickRevision: 'Topology is the arrangement of nodes; Star is the most common in modern LANs, while Mesh provides maximum fault tolerance.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.1'
    },
    tags: ['topology', 'star', 'mesh', 'bus', 'ring', 'osi', 'lan']
  },
  {
    id: 'ce0518-u1-q2',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to Computer Networks, Data Link Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'What is bit and byte stuffing? Explain with example.',
    shortAnswer: 'Bit stuffing and byte stuffing (character stuffing) are Data Link Layer framing techniques used to delineate frame boundaries transparently. They prevent reserved framing flag sequences occurring naturally in user payload data from prematurely ending the frame.',
    detailedAnswer: 'At the Data Link Layer, frames are bounded by delimiter flags. If the user data payload contains the same byte or bit sequence as the flag, the receiver will mistakenly assume the frame has ended. Framing mechanisms prevent this:\n\n1. Bit Stuffing: Used in bit-oriented protocols like HDLC. The frame delimiter flag is 01111110 (six consecutive 1s). Whenever the sender detects five consecutive 1s in the data stream, it automatically inserts a stuffed \'0\' bit into the outgoing stream. The receiver checks the incoming stream: whenever five consecutive 1s are followed by a 0, the receiver removes the stuffed 0 and restores the original data.\n\n2. Byte Stuffing (Character Stuffing): Used in byte-oriented protocols. Frames begin and end with a FLAG byte (e.g., 0x7E). When the FLAG byte or an ESC (Escape, 0x1B) byte appears inside the data, the sender prepends a special ESC byte. If the receiver encounters an ESC byte, it discards the ESC byte and accepts the following byte as pure data.',
    keyPoints: [
      'Ensures data transparency across arbitrary payload contents.',
      'Bit Stuffing: A \'0\' is inserted after five consecutive \'1\'s (0111110).',
      'Flag pattern in HDLC is 01111110.',
      'Byte Stuffing: Inserts ESC byte before naturally occurring FLAG or ESC bytes.',
      'Receiver automatically un-stuffs the sequence to restore original payload.'
    ],
    example: 'Original data bitstream: 0110111111101\nAfter five 1s, sender stuffs a 0: 011011111[0]1101\nTransmitted frame: 01111110 | 01101111101101 | 01111110',
    diagram: `BIT STUFFING (HDLC Standard 01111110):
Original Data:   0 1 1 0 1 1 1 1 1 1 0
Sender Stuffs 0: 0 1 1 0 1 1 1 1 1 [0] 1 0
                                    ^ Stuffed bit prevents 6 ones!

BYTE STUFFING:
Original Data:   [HEADER] [DATA: FLAG A ESC B] [TRAILER]
Transmitted:     FLAG ... [ESC FLAG] A [ESC ESC] B ... FLAG`,
    followUpQuestions: [
      {
        question: 'What does the receiver do if it detects seven consecutive 1s in HDLC?',
        answer: 'Seven or more consecutive 1s is an invalid signal framing error and triggers frame abortion.'
      },
      {
        question: 'What is the overhead of bit stuffing in the worst-case scenario?',
        answer: 'In the worst case (data consisting entirely of 1s), a 0 is inserted every 5 bits, adding 20% overhead.'
      }
    ],
    quickRevision: 'Bit stuffing inserts a 0 after five consecutive 1s; byte stuffing prepends an ESC byte before data matching FLAG/ESC.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.2'
    },
    tags: ['bit-stuffing', 'byte-stuffing', 'data-link', 'framing', 'hdlc']
  },
  {
    id: 'ce0518-u1-q3',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to Computer Networks, Data Link Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Explain CRC code generation with example.',
    shortAnswer: 'Cyclic Redundancy Check (CRC) is an error-detecting polynomial code based on binary modulo-2 division (bitwise XOR without carry). The sender appends r zeros to the message, divides by a predefined generator polynomial G(x) of degree r, and appends the resulting remainder to form the transmitted codeword.',
    detailedAnswer: 'CRC is widely used in Ethernet, Wi-Fi, and storage systems due to its robust detection of burst errors.\n\nSteps for CRC Generation:\n1. Let dataword M = 100100 (k bits).\n2. Let generator polynomial G(x) = x^3 + x^2 + 1, which translates to binary 1101 (divisor has r+1 = 4 bits, so degree r = 3).\n3. Append r = 3 zeros to M: M\' = 100100000.\n4. Perform Modulo-2 division of M\' by G:\n   - In modulo-2 division, subtraction is performed via XOR (1^1=0, 0^0=0, 1^0=1, 0^1=1).\n5. The division yields quotient Q and an r-bit remainder R (e.g., 001).\n6. Codeword T = M\' XOR R = 100100001.\n7. At the receiver, T is divided by G. If remainder is 0, frame is accepted; otherwise, bit error occurred.',
    keyPoints: [
      'Based on binary polynomial arithmetic using XOR logic.',
      'Generator polynomial G(x) must have degree r and least-significant bit 1.',
      'Number of appended zeros = degree of generator polynomial (r).',
      'Detects all single-bit errors, all double errors (with proper G(x)), and all burst errors of length <= r.',
      'Receiver division resulting in zero remainder confirms error-free transmission.'
    ],
    example: 'Data M = 100100, Divisor G = 1101.\nAppend 3 zeros: 100100000 / 1101.\nRemainder = 001.\nCodeword transmitted = 100100001.',
    diagram: `Modulo-2 Division (Data: 100100, Divisor: 1101)
         110100 (Quotient)
1101 | 100100000
       1101
       -----
        1000
        1101
        -----
         1010
         1101
         -----
          1110
          1101
          -----
           0110
           0000
           ----
            1100
            1101
            ----
             001 (Remainder R = 001)
Codeword = 100100 + 001 = 100100001`,
    followUpQuestions: [
      {
        question: 'What is CRC-32 and where is it used?',
        answer: 'CRC-32 uses a 32nd-degree polynomial generating a 4-byte FCS (Frame Check Sequence). It is the standard error-checking algorithm in IEEE 802.3 Ethernet frames.'
      },
      {
        question: 'Can CRC correct detected errors?',
        answer: 'No, CRC is purely an error-detection code. When an error is detected, the frame is discarded and retransmission is handled by higher-layer ARQ protocols.'
      }
    ],
    quickRevision: 'CRC appends r zeros, divides by generator G(x) using XOR, appends the remainder, and flags an error if receiver remainder != 0.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.3'
    },
    tags: ['crc', 'error-detection', 'modulo-2', 'polynomial', 'data-link']
  },
  {
    id: 'ce0518-u1-q4',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to Computer Networks, Data Link Layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'Draw the OSI reference model. Explain the functionality of each layer in brief.',
    shortAnswer: 'The Open Systems Interconnection (OSI) reference model is an ISO-standardized 7-layer architectural framework for network communication: Layer 7 (Application), Layer 6 (Presentation), Layer 5 (Session), Layer 4 (Transport), Layer 3 (Network), Layer 2 (Data Link), and Layer 1 (Physical).',
    detailedAnswer: 'Each layer provides distinct services to the layer above it via encapsulation:\n\n1. Physical Layer (L1): Transmits raw unstructured bitstream over physical media (voltages, pinouts, radio frequencies, cabling). Protocol Data Unit (PDU): Bits.\n\n2. Data Link Layer (L2): Provides node-to-node frame delivery, physical MAC addressing, media access control, error detection (CRC), and flow control. PDU: Frame.\n\n3. Network Layer (L3): Responsible for logical host-to-host addressing (IPv4/IPv6), subnet routing, path determination (OSPF, BGP), and packet forwarding. PDU: Packet.\n\n4. Transport Layer (L4): Manages end-to-end process-to-process delivery, port addressing, segmentation/reassembly, connection management, and reliability (TCP/UDP). PDU: Segment.\n\n5. Session Layer (L5): Establishes, manages, synchronizes, and terminates dialogues/sessions between applications (RPC, NetBIOS, checkpointing).\n\n6. Presentation Layer (L6): Handles syntax and semantics of information exchange, including data translation/formatting (ASCII/Unicode), encryption/decryption (SSL/TLS), and compression.\n\n7. Application Layer (L7): Directly interacts with end-user software applications to deliver network services (HTTP, DNS, SMTP, FTP, SSH).',
    keyPoints: [
      '7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.',
      'PDU sequence: Bits -> Frames -> Packets -> Segments -> Data.',
      'L2 handles MAC addresses; L3 handles IP addresses; L4 handles Port numbers.',
      'Upper layers (5-7) are user/application-focused; lower layers (1-4) handle data transport.'
    ],
    example: 'Accessing a web page: User interacts with Chrome (L7 HTTP), SSL decrypts data (L6 TLS), session maintained (L5), TCP segments packet on port 443 (L4), router routes IP packet (L3), switch forwards Ethernet frame by MAC (L2), physical cable carries electrical pulses (L1).',
    diagram: `+-------------------------------------------------------------+
|                     OSI 7-LAYER MODEL                       |
+-----+--------------+----------------------+-----------------+
| L#  | Layer Name   | Primary Function     | PDU / Unit      |
+-----+--------------+----------------------+-----------------+
| L7  | Application  | Network Services     | Message / Data  |
| L6  | Presentation | Formatting, SSL/TLS  | Formatted Data  |
| L5  | Session      | Dialog Management    | Synced Session  |
| L4  | Transport    | Process-to-Process   | Segment (TCP)   |
| L3  | Network      | Routing & IP Address | Packet (IP)     |
| L2  | Data Link    | MAC Hop-to-Hop Framing| Frame           |
| L1  | Physical     | Raw Bitstream Signals| Bits (0s & 1s)  |
+-----+--------------+----------------------+-----------------+`,
    followUpQuestions: [
      {
        question: 'Why does the Internet use TCP/IP instead of the OSI model?',
        answer: 'TCP/IP was developed with working running code and protocol implementations (pragmatic design) before formal standardization, whereas OSI was designed by committee before widespread deployment.'
      },
      {
        question: 'What is data encapsulation?',
        answer: 'Data encapsulation is the process where each layer wraps protocol-specific control headers (and trailers at L2) around the payload received from the layer above.'
      }
    ],
    quickRevision: 'OSI is a 7-layer theoretical model: L1 Physical (bits), L2 Data Link (frames), L3 Network (packets), L4 Transport (segments), L5-7 Application services.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.4'
    },
    tags: ['osi', 'layers', 'encapsulation', 'tcp-ip', 'pdu']
  },
  {
    id: 'ce0518-u1-q5',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to Computer Networks, Data Link Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Give differences between Connection oriented versus Connection less Services.',
    shortAnswer: 'Connection-oriented service establishes a dedicated logical connection before transmitting data, guarantees ordered delivery, and terminates the connection afterward (e.g., TCP). Connection-less service transmits packets independently without prior setup, where each packet is routed individually with no delivery guarantee (e.g., UDP).',
    detailedAnswer: 'The core differences between Connection-Oriented and Connection-Less communication models are:\n\n1. Connection Handshake: Connection-oriented requires a three-way handshake to agree on sequence numbers and buffers. Connection-less sends packets immediately.\n2. Routing & Path: In connection-oriented (virtual circuits), all packets follow the same predetermined path. In connection-less (datagrams), each packet may take different routes and arrive out of order.\n3. Reliability: Connection-oriented features acknowledgments, retransmissions, and flow/congestion control. Connection-less is best-effort with no intrinsic retransmission.\n4. Overhead: Connection-oriented incurs higher protocol overhead (20-60 byte headers + setup latency). Connection-less is lightweight with low latency (8-byte UDP header).',
    keyPoints: [
      'Connection-oriented: Setup -> Data Transfer -> Teardown.',
      'Connection-less: Independent packets (datagrams), zero setup delay.',
      'TCP is connection-oriented; UDP and IPv4 are connection-less.',
      'Packets arrive sequentially in connection-oriented; may arrive out of order in connection-less.'
    ],
    example: 'Making a telephone call is connection-oriented (dial, connect, speak, hang up). Sending a postcard through postal mail is connection-less (drop in mailbox, no reservation, arrival not confirmed).',
    diagram: `+----------------------+--------------------------+---------------------------+
| FEATURE              | CONNECTION-ORIENTED      | CONNECTION-LESS           |
+----------------------+--------------------------+---------------------------+
| Handshake / Setup    | Required (3-way SYN)     | None                      |
| Packet Order         | Guaranteed in-order      | May arrive out of order   |
| Reliability          | High (ACKs & Retransmit) | Best-effort (No ACKs)     |
| Overhead & Speed     | Slower, larger headers   | Fast, minimal latency     |
| Protocols            | TCP, SCTP, ATM, X.25     | UDP, IP, ICMP, DNS        |
+----------------------+--------------------------+---------------------------+`,
    followUpQuestions: [
      {
        question: 'Can connection-oriented service run on top of a connection-less layer?',
        answer: 'Yes! TCP (connection-oriented) operates on top of IP (connection-less datagram service) by handling sequencing and ACKs at the endpoints.'
      }
    ],
    quickRevision: 'Connection-oriented sets up a session and guarantees reliable in-order delivery; connection-less sends datagrams independently with minimum latency.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.5'
    },
    tags: ['connection-oriented', 'connectionless', 'tcp', 'udp', 'virtual-circuit']
  },
  {
    id: 'ce0518-u1-q6',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to Computer Networks, Data Link Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Explain functionality of Repeater, HUB, Bridge, Switch, Router and Gateway.',
    shortAnswer: 'These devices connect network segments across different OSI layers: Repeater & Hub (Layer 1 - signal regeneration & broadcasting), Bridge & Switch (Layer 2 - frame filtering by MAC & collision domain segmentation), Router (Layer 3 - packet forwarding by IP & broadcast domain segmentation), and Gateway (Layer 4-7 - protocol translation between disparate network architectures).',
    detailedAnswer: '1. Repeater (Layer 1): An active hardware device that receives weak or attenuated electrical/optical signals and regenerates them bit-for-bit to extend network cable length without interpreting frames.\n\n2. Hub (Layer 1): A multiport repeater. When a signal arrives on one port, the hub regenerates and broadcasts it to all other ports. Creates 1 collision domain and 1 broadcast domain across all connected ports.\n\n3. Bridge (Layer 2): Connects two distinct LAN segments. It maintains a MAC address forwarding table and inspects incoming frame headers, forwarding frames only if the target MAC resides on the opposite segment. Separates collision domains.\n\n4. Switch (Layer 2): A multiport bridge offering micro-segmentation. Maintains a Content Addressable Memory (CAM) table to forward frames directly to the intended destination port. Each switch port is an independent collision domain.\n\n5. Router (Layer 3): An intelligent internetworking device that connects disparate networks (e.g., LAN to WAN). It parses IP packet headers and uses dynamic routing tables (OSPF, BGP) to select the optimal shortest path. Routers do not forward broadcasts (separates broadcast domains).\n\n6. Gateway (Layer 4-7): A protocol converter that interconnects architectures with entirely distinct protocol stacks (e.g., converting an IP network to an SNA or telecom SS7 network).',
    keyPoints: [
      'Layer 1: Repeater (2 ports), Hub (multi-port) - raw bit regeneration, 1 collision domain.',
      'Layer 2: Bridge (2 segments), Switch (multi-port) - MAC address filtering, breaks collision domains.',
      'Layer 3: Router - IP routing, breaks broadcast domains.',
      'Layer 4-7: Gateway - protocol translator between disparate systems.'
    ],
    example: 'In a college LAN, PCs connect to a Layer 2 Switch (dedicated bandwidth), which connects to a Layer 3 Cisco Router (providing default gateway to the ISP), protected by an application proxy Gateway.',
    diagram: `+------------+-------+------------------+-------------------+
| DEVICE     | LAYER | COLLISION DOMAIN | BROADCAST DOMAIN  |
+------------+-------+------------------+-------------------+
| Repeater   | L1    | 1 Shared         | 1 Shared          |
| Hub        | L1    | 1 Shared         | 1 Shared          |
| Bridge     | L2    | 1 per segment (2)| 1 Shared          |
| Switch     | L2    | 1 per port (N)   | 1 Shared          |
| Router     | L3    | 1 per port       | 1 per port (Breaks)|
| Gateway    | L4-7  | Protocol-specific| Protocol-specific |
+------------+-------+------------------+-------------------+`,
    followUpQuestions: [
      {
        question: 'How many collision domains and broadcast domains exist on a 24-port unmanaged switch?',
        answer: 'A 24-port switch creates 24 separate collision domains and 1 single broadcast domain (unless configured into VLANs).'
      },
      {
        question: 'What is the key difference between a Switch and a Router?',
        answer: 'A Switch forwards frames using Layer 2 hardware MAC addresses within a local LAN; a Router routes packets using Layer 3 logical IP addresses between different networks.'
      }
    ],
    quickRevision: 'Hub/Repeater = L1 signal repeaters; Switch/Bridge = L2 MAC filters (break collision domains); Router = L3 IP forwarder (breaks broadcast domains); Gateway = L4-7 protocol translator.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.6'
    },
    tags: ['network-devices', 'switch', 'router', 'hub', 'bridge', 'gateway']
  },
  {
    id: 'ce0518-u1-q7',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to Computer Networks, Data Link Layer',
    category: 'theory',
    difficulty: 'advanced',
    question: 'Describe Go Back N and Selective Repeat protocol.',
    shortAnswer: 'Go-Back-N and Selective Repeat are sliding window ARQ protocols. In Go-Back-N, the sender can transmit up to 2^m - 1 frames without ACK; if a frame is lost, the sender retransmits that frame and ALL subsequent frames in the window. In Selective Repeat, the receiver has a buffer and selectively ACKs packets, so ONLY the corrupted/lost frame is retransmitted.',
    detailedAnswer: 'Both protocols improve channel utilization over Stop-and-Wait by pipelining frames:\n\n1. Go-Back-N (GBN):\n   - Sender window size W_s = 2^m - 1; Receiver window size W_r = 1.\n   - Receiver accepts frames strictly in sequence. If frame k is lost, all subsequent frames k+1, k+2 arriving at the receiver are discarded.\n   - Uses Cumulative Acknowledgments (ACK n confirms all frames up to n-1).\n   - Inefficient on high-loss or high-bandwidth-delay product links due to redundant retransmissions.\n\n2. Selective Repeat (SR):\n   - Sender window size W_s = 2^(m-1); Receiver window size W_r = 2^(m-1).\n   - Receiver contains a buffer to store out-of-order frames that arrive intact.\n   - Uses Individual/Selective Acknowledgments (or Negative Acknowledgments - NAK).\n   - When a frame timer expires, only the missing frame is retransmitted, drastically saving bandwidth at the cost of receiver buffer memory and complex logic.',
    keyPoints: [
      'GBN: Sender window 2^m - 1, Receiver window 1. Retransmits entire window upon error.',
      'Selective Repeat: Sender window 2^(m-1), Receiver window 2^(m-1). Retransmits only lost frames.',
      'GBN requires no buffering at receiver; SR requires substantial receiver memory.',
      'GBN uses cumulative ACKs; SR uses selective/individual ACKs.'
    ],
    example: 'Sender transmits frames 0, 1, 2, 3, 4. Frame 2 is dropped. In GBN, receiver discards 3 and 4; sender times out on 2 and retransmits 2, 3, and 4. In Selective Repeat, receiver buffers 3 and 4; sender retransmits ONLY frame 2.',
    diagram: `GO-BACK-N (Frame 2 Lost):
Sender:  [0]  [1]  [2-Lost]  [3]  [4]  ==> Timeout on 2! ==> Retransmits: [2] [3] [4]
Receiver:[OK] [OK]  (Drop)  (Drop)(Drop)

SELECTIVE REPEAT (Frame 2 Lost):
Sender:  [0]  [1]  [2-Lost]  [3]  [4]  ==> Timeout on 2! ==> Retransmits: [2] ONLY!
Receiver:[OK] [OK]  (Wait)  [Buf] [Buf] ==> Receives [2], delivers [2,3,4] to app!`,
    followUpQuestions: [
      {
        question: 'Why must W_s + W_r <= 2^m in sliding window protocols?',
        answer: 'To prevent window overlap ambiguity, where an ACK received for a retransmitted frame is confused with an ACK for a new frame with the same sequence number.'
      },
      {
        question: 'What is the efficiency formula for Go-Back-N?',
        answer: 'Efficiency = W_s / (1 + 2a), where a = Propagation Time (T_p) / Transmission Time (T_t).'
      }
    ],
    quickRevision: 'Go-Back-N retransmits all frames from the lost frame onward (receiver window = 1); Selective Repeat buffers out-of-order frames and retransmits only missing frames (receiver window > 1).',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.7'
    },
    tags: ['go-back-n', 'selective-repeat', 'arq', 'sliding-window', 'flow-control']
  },
  {
    id: 'ce0518-u1-q8',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to Computer Networks, Data Link Layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'Discuss the parity checks for error detection in data transfer.',
    shortAnswer: 'A parity check is an error detection scheme that appends a single redundant parity bit to a binary message to make the total count of 1-bits either even (Even Parity) or odd (Odd Parity). It exists as Simple (1D) Parity and Two-Dimensional (2D) Parity.',
    detailedAnswer: '1. Simple (One-Dimensional) Parity Check:\n   - Even Parity: Parity bit is set to 1 if the count of 1s in data is odd, ensuring the codeword has an even number of 1s.\n   - Odd Parity: Parity bit is set to 1 if the count of 1s in data is even, ensuring the codeword has an odd number of 1s.\n   - Limitation: Detects any odd number of bit errors (1, 3, 5). Completely fails to detect an even number of bit errors (2, 4), because two inverted bits preserve total parity.\n\n2. Two-Dimensional (2D) Parity Check (LRC + VRC):\n   - Data is organized into a table of rows and columns.\n   - A parity bit is calculated for each row (Horizontal Parity) and an additional parity byte is created for each column (Vertical Parity).\n   - Significantly boosts burst error detection: can detect all 1-bit, 2-bit, and 3-bit errors, and can isolate the exact row/column coordinates to correct a single-bit error.',
    keyPoints: [
      'Appends 1 parity bit to ensure even or odd number of 1s.',
      'Detects all odd-numbered bit errors; blind to even-numbered errors.',
      '2D Parity organizes bits in an M x N matrix with row and column check bits.',
      '2D Parity can correct a single-bit error by pinpointing intersection of invalid row and column.'
    ],
    example: 'Data = 1011001 (four 1s).\nEven Parity: Parity bit = 0 (Codeword: 10110010).\nOdd Parity: Parity bit = 1 (Codeword: 10110011).',
    diagram: `Two-Dimensional Parity Matrix:
Data Row 1:   1  1  0  0  1  1  0  -> Row Parity: 0
Data Row 2:   1  0  1  0  1  0  1  -> Row Parity: 0
Data Row 3:   0  1  1  1  0  0  1  -> Row Parity: 0
-----------------------------------------
Col Parity:   0  0  0  1  0  1  0  -> [LRC/VRC Checks]`,
    followUpQuestions: [
      {
        question: 'What is the Hamming distance of a single parity code?',
        answer: 'The minimum Hamming distance (d_min) is 2. It can detect 1 error (d_min - 1 = 1), but cannot correct any error.'
      }
    ],
    quickRevision: 'Parity check adds a bit to make total 1s even or odd; detects odd-count bit errors, but fails on even-count bit flips unless 2D parity is used.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.8'
    },
    tags: ['parity', 'error-detection', 'even-parity', 'odd-parity', 'vrc', 'lrc']
  },
  {
    id: 'ce0518-u1-q9',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to Computer Networks, Data Link Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'What are the issues of stop and wait protocol? How selective repeat protocol resolves issues of stop and wait protocol?',
    shortAnswer: 'Stop-and-Wait protocol suffers from poor channel utilization because the sender transmits 1 frame and sits idle waiting for an ACK for the entire Round-Trip Time (RTT). Selective Repeat resolves this by introducing a sliding window that pipelines multiple unacknowledged frames continuously, keeping the transmission pipe full.',
    detailedAnswer: 'Issues of Stop-and-Wait Protocol:\n1. Extreme Inefficiency: Efficiency η = 1 / (1 + 2a), where a = T_prop / T_trans. On long-distance satellite links or high-speed fiber links where propagation delay dominates, utilization drops below 1%.\n2. Throughput Collapse: Regardless of channel bandwidth, maximum throughput is bounded by 1 frame per RTT.\n3. Susceptibility to Lost ACKs: Lost ACK leads to timer expiration and redundant duplicate frame retransmissions.\n\nHow Selective Repeat Resolves These Issues:\n1. Continuous Pipelining: Sender window W_s allows transmitting up to 2^(m-1) frames back-to-back without waiting for individual ACKs, maximizing link utilization.\n2. Receiver Buffering: Out-of-order frames that arrive safely are held in a receiver buffer instead of being thrown away.\n3. Selective Retransmission: Using NAK or Selective ACKs, the sender retransmits only the missing or corrupted sequence number, eliminating the redundant retransmission penalty of Go-Back-N.',
    keyPoints: [
      'Stop-and-Wait utilization: η = 1 / (1 + 2a); drops sharply when bandwidth-delay product is high.',
      'Sender idle time = 2 × Propagation Delay per frame.',
      'Selective Repeat sets sender and receiver window size to 2^(m-1).',
      'Pipelining keeps the communication channel full of transmitting data.'
    ],
    example: '1 Gbps link with 25 ms propagation delay (RTT = 50 ms). Frame size = 1 KB (8000 bits). T_trans = 8 μs. a = 25000 / 8 = 3125. Stop-and-Wait efficiency is 1 / 6251 = 0.016% (0.16 Mbps)! Selective Repeat achieves nearly 100% throughput by sizing the window to the Bandwidth-Delay Product.',
    diagram: `Stop-and-Wait (Huge Idle Gap):
Sender:   |--Frame 0--| ............................(Waiting for ACK) => [ACK 0]
Receiver:             |--ACK 0--|

Selective Repeat (Pipelined Bandwidth):
Sender:   |--F0--||--F1--||--F2--||--F3--||--F4--| ... (Channel always active!)`,
    followUpQuestions: [
      {
        question: 'What is Bandwidth-Delay Product (BDP)?',
        answer: 'BDP = Bandwidth × Round-Trip Time. It represents the maximum volume of data "in flight" across the transmission pipe at any instant.'
      }
    ],
    quickRevision: 'Stop-and-Wait leaves the channel idle during RTT; Selective Repeat pipelines multiple frames continuously and selectively retransmits only lost packets.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.9'
    },
    tags: ['stop-and-wait', 'selective-repeat', 'efficiency', 'bdp', 'pipelining']
  },
  {
    id: 'ce0518-u1-q10',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to Computer Networks, Data Link Layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'Discuss different types of guided and unguided media used to transmit data in network.',
    shortAnswer: 'Transmission media is divided into Guided (Bounded/Cabled) media where signals propagate along physical conduits (Twisted Pair, Coaxial Cable, Fiber Optic) and Unguided (Wireless/Unbounded) media where electromagnetic waves propagate through air, water, or vacuum (Radio waves, Microwaves, Infrared).',
    detailedAnswer: 'A. Guided Media (Physical Cables):\n1. Twisted Pair Cable: Insulated copper wires twisted in pairs to cancel Electromagnetic Interference (EMI) and crosstalk. Exists as Unshielded (UTP - Cat5e, Cat6) and Shielded (STP). Max segment length 100m; speeds up to 10 Gbps.\n2. Coaxial Cable: Central copper core, insulating dielectric, woven copper braid shielding, and outer plastic jacket. Used in legacy Ethernet (10Base2/10Base5) and cable broadband.\n3. Fiber Optic Cable: Hair-thin glass or plastic core that transmits pulses of light using Total Internal Reflection (TIR). Exists as Single-Mode Fiber (SMF - laser source, long haul > 40 km, ultra-high bandwidth) and Multi-Mode Fiber (MMF - LED source, LANs < 2 km). Immune to EMI.\n\nB. Unguided Media (Wireless):\n1. Radio Waves (3 kHz - 1 GHz): Omnidirectional, easily penetrate solid walls; utilized in AM/FM radio, cellular networks, and Wi-Fi.\n2. Microwaves (1 GHz - 300 GHz): Highly directional, line-of-sight propagation, absorbed by atmospheric moisture; utilized in satellite dishes, radar, and cellular backhaul.\n3. Infrared (300 GHz - 400 THz): High frequency, cannot penetrate walls (secure), strictly short-range line-of-sight; used in TV remotes and IrDA sensors.',
    keyPoints: [
      'Guided: Twisted pair (twisted to reduce crosstalk), Coaxial (shielded), Fiber Optic (TIR light pulses, zero EMI).',
      'Unguided: Radio waves (omnidirectional), Microwaves (line-of-sight), Infrared (short-range, line-of-sight).',
      'Fiber optic provides the highest bandwidth and longest transmission distances.',
      'Cat-6 twisted pair is the standard for modern 1 Gbps/10 Gbps Ethernet LANs.'
    ],
    example: 'A university campus uses Single-Mode Fiber Optic cables between buildings (inter-building backbone) and Cat-6 UTP cables inside each department to connect PCs to switches.',
    diagram: `+-------------------+--------------------+------------------+------------------+
| MEDIA TYPE        | BANDWIDTH          | MAX DISTANCE     | EMI IMMUNITY     |
+-------------------+--------------------+------------------+------------------+
| UTP (Cat-6)       | Up to 10 Gbps      | 100 meters       | Moderate         |
| Coaxial Cable     | 10 - 100 Mbps      | 500 meters       | High             |
| Fiber Optic (SMF) | > 100 Gbps         | 40 - 100 km      | 100% (Immune)    |
| Radio Waves       | 10 - 600 Mbps      | Campus / Global  | Sensitive to EMI |
| Infrared          | < 4 Mbps           | < 10 meters      | High (No RF int.)|
+-------------------+--------------------+------------------+------------------+`,
    followUpQuestions: [
      {
        question: 'Why are wire pairs twisted in UTP cables?',
        answer: 'Twisting ensures both wires are equally exposed to external electromagnetic noise, allowing differential signaling at the receiver to cancel the noise.'
      },
      {
        question: 'What physical principle allows light to travel down a curved fiber optic cable?',
        answer: 'Total Internal Reflection (TIR), which occurs because the core has a higher refractive index than the surrounding cladding and the angle of incidence exceeds the critical angle.'
      }
    ],
    quickRevision: 'Guided media use physical conductors (UTP, Coaxial, Fiber Optic); Unguided media use free-space electromagnetic waves (Radio, Microwave, Infrared).',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.10'
    },
    tags: ['transmission-media', 'fiber-optic', 'utp', 'guided-media', 'wireless']
  },
  {
    id: 'ce0518-u1-q11',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to Computer Networks, Data Link Layer',
    category: 'theory',
    difficulty: 'advanced',
    question: 'What is Hamming Code? Explain how it is useful in error correction.',
    shortAnswer: 'Hamming Code is a linear forward error-correcting block code invented by Richard Hamming. By embedding r redundant parity bits at bit positions corresponding to powers of two (1, 2, 4, 8, ...) into an m-bit dataword, it can detect up to two-bit errors and automatically locate and correct any single-bit error without retransmission.',
    detailedAnswer: 'Forward Error Correction (FEC) allows the receiver to correct corrupted bits autonomously.\n\n1. Parity Bit Formula:\n   To protect m data bits with r parity bits, the relation must hold: 2^r >= m + r + 1.\n   For 4 data bits (m=4), minimum r = 3 (since 2^3 = 8 >= 4 + 3 + 1 = 8), producing a (7,4) Hamming Code.\n\n2. Bit Positioning:\n   - Parity bits occupy powers of 2: P1 (pos 1), P2 (pos 2), P4 (pos 4).\n   - Data bits occupy remaining positions: D3 (pos 3), D5 (pos 5), D6 (pos 6), D7 (pos 7).\n\n3. Parity Coverage (Even Parity):\n   - P1 checks bits with 1 in 1st bit of binary position: 1, 3, 5, 7.\n   - P2 checks bits with 1 in 2nd bit of binary position: 2, 3, 6, 7.\n   - P4 checks bits with 1 in 3rd bit of binary position: 4, 5, 6, 7.\n\n4. Error Detection & Correction (Syndrome Word):\n   Receiver calculates check bits C1, C2, C4 using the same parity equations. The binary string C4 C2 C1 represents the Syndrome:\n   - Syndrome = 000 -> No error.\n   - Syndrome = non-zero value -> Binary index of the corrupted bit! The receiver simply flips that bit to correct it.',
    keyPoints: [
      'Redundancy inequality: 2^r >= m + r + 1.',
      'Parity bits located at bit positions 1, 2, 4, 8, 2^(r-1).',
      'Syndrome binary word directly reveals the exact error bit index.',
      'Can detect up to 2-bit errors and correct 1-bit errors (minimum Hamming distance d_min = 3).'
    ],
    example: 'Data bits = 1011 (D7=1, D6=0, D5=1, D3=1).\nP1 = D3 ^ D5 ^ D7 = 1 ^ 1 ^ 1 = 1.\nP2 = D3 ^ D6 ^ D7 = 1 ^ 0 ^ 1 = 0.\nP4 = D5 ^ D6 ^ D7 = 1 ^ 0 ^ 1 = 0.\nTransmitted codeword: P1 P2 D3 P4 D5 D6 D7 = 1 0 1 0 1 0 1.\nIf bit 5 flips to 0 in transit, calculated syndrome is C4=1, C2=0, C1=1 -> 101 (decimal 5). Receiver flips bit 5 back to 1!',
    diagram: `Bit Positions:   1    2    3    4    5    6    7
Bit Names:       P1   P2   D3   P4   D5   D6   D7
Binary Pos:     001  010  011  100  101  110  111
P1 checks:       *         *         *         *  (positions with bit 1 = 1)
P2 checks:            *    *              *    *  (positions with bit 2 = 1)
P4 checks:                      *    *    *    *  (positions with bit 3 = 1)`,
    followUpQuestions: [
      {
        question: 'What is the minimum Hamming distance required to detect t errors versus correct t errors?',
        answer: 'To detect t errors, d_min >= t + 1. To correct t errors, d_min >= 2t + 1.'
      }
    ],
    quickRevision: 'Hamming code places parity bits at powers of 2 (1, 2, 4); the receiver calculates a syndrome binary word that directly points to the corrupted bit index for auto-correction.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.11'
    },
    tags: ['hamming-code', 'error-correction', 'fec', 'syndrome', 'parity']
  }
];
