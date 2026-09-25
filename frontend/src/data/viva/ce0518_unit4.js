// frontend/src/data/viva/ce0518_unit4.js
/**
 * CE0518 Unit 4: Transport Layer, Application Layer
 * Indus University End Sem Question Bank
 */

export const CE0518_UNIT4_QUESTIONS = [
  {
    id: 'ce0518-u4-q1',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'Define the socket. List the types of sockets.',
    shortAnswer: 'A socket is an endpoint abstraction of a bidirectional communication link between two processes running across a network. It is uniquely defined by combining an IP address and a Port number (IP:Port). The main types are Stream Sockets (SOCK_STREAM / TCP), Datagram Sockets (SOCK_DGRAM / UDP), and Raw Sockets (SOCK_RAW).',
    detailedAnswer: 'Socket Concepts & Types:\nA socket acts as an Application Programming Interface (API) between the user application and the operating system\'s network protocol stack.\n\nPrimary Types of Sockets:\n1. Stream Sockets (SOCK_STREAM):\n   - Powered by TCP (Transmission Control Protocol).\n   - Connection-oriented, reliable, sequenced, full-duplex byte stream with zero boundary markers.\n   - Provides flow control, error checking, and automatic retransmissions.\n   - Used in HTTP, HTTPS, FTP, SSH, SMTP.\n\n2. Datagram Sockets (SOCK_DGRAM):\n   - Powered by UDP (User Datagram Protocol).\n   - Connection-less, unreliable, best-effort message delivery.\n   - Preserves message boundaries (packet sent = packet received); low latency and minimal overhead.\n   - Used in DNS, VoIP, video streaming, online gaming.\n\n3. Raw Sockets (SOCK_RAW):\n   - Bypasses transport layer protocol formatting (TCP/UDP).\n   - Gives direct access to lower-level Layer 3 IP and ICMP packets.\n   - Requires root/administrator privileges.\n   - Used in network monitoring tools (Wireshark, Nmap, Ping / ICMP echo).\n\n4. Sequenced Packet Sockets (SOCK_SEQPACKET):\n   - Connection-oriented and sequenced like TCP, but preserves message boundaries like UDP (e.g., SCTP).',
    keyPoints: [
      'Socket = IP Address + Port Number (e.g. 192.168.1.10:8080).',
      'SOCK_STREAM (TCP): Connection-oriented, reliable byte stream.',
      'SOCK_DGRAM (UDP): Connection-less, preserves message boundaries, low latency.',
      'SOCK_RAW: Direct access to Layer 3 IP/ICMP headers (requires root).',
      'Operating system syscalls: socket(), bind(), listen(), accept(), connect().'
    ],
    example: 'A web server listening on socket 0.0.0.0:443 accepts incoming connections from client browser socket 192.168.1.50:54321.',
    diagram: `SOCKET ENDPOINT BINDING:
[Client Process]                        [Server Process]
 (Port: 54321)                            (Port: 8080)
       |                                        |
  [Socket FD]                              [Socket FD]
       |                                        |
(192.168.1.5:54321) <== TCP Connection ==> (10.0.0.1:8080)`,
    followUpQuestions: [
      {
        question: 'What is the system call sequence for a TCP server?',
        answer: 'socket() -> bind() -> listen() -> accept() -> recv() / send() -> close().'
      }
    ],
    quickRevision: 'A socket is an IP:Port endpoint; SOCK_STREAM provides reliable TCP streams, SOCK_DGRAM provides lightweight UDP datagrams, and SOCK_RAW gives direct IP access.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.1'
    },
    tags: ['socket', 'tcp', 'udp', 'stream-socket', 'datagram-socket', 'socket-programming']
  },
  {
    id: 'ce0518-u4-q2',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'List the duties of the transport layer and explain each in brief.',
    shortAnswer: 'The Transport Layer (Layer 4) is responsible for true end-to-end (process-to-process) delivery of data. Its primary duties are: 1. Service Point (Port) Addressing, 2. Segmentation and Reassembly, 3. Connection Management, 4. Flow Control, 5. Error Control, and 6. Congestion Control.',
    detailedAnswer: 'Key Duties of Layer 4:\n1. Service Point / Port Addressing: Network layer delivers packets between host machines (IP addresses). Transport layer delivers data to the specific application process running inside the host using 16-bit Port numbers (e.g., port 80 for HTTP, port 22 for SSH).\n\n2. Segmentation & Reassembly: Large messages from the application layer are split into smaller segments with sequence numbers. The receiver reassembles segments in proper chronological order and discards duplicates.\n\n3. Connection Management: In connection-oriented protocols (TCP), establishes sessions via 3-way handshakes and terminates them cleanly via 4-way FIN/ACK handshakes.\n\n4. Flow Control: Employs sliding-window mechanisms with receiver window advertising (rwnd) to prevent a fast transmitter from overflowing a slow receiver\'s memory buffer.\n\n5. Error Control: Computes checksums across headers and payload. Ensures error-free delivery via ACKs and retransmissions upon segment loss or corruption.\n\n6. Congestion Control: Manages network queue saturation using congestion window (cwnd), Slow Start, and Congestion Avoidance algorithms.',
    keyPoints: [
      'Delivers data process-to-process using 16-bit Port numbers.',
      'Segments messages at sender and reassembles them at receiver.',
      'Flow control via sliding window (rwnd) protects receiver buffers.',
      'Error control uses checksums and ARQ retransmissions.',
      'Congestion control protects intermediate network routers.'
    ],
    example: 'When running Spotify and Chrome simultaneously, port addressing ensures Spotify audio segments go to the music player and HTML segments go to the browser window.',
    diagram: `+-------------------------------------------------------------+
|                  DUTIES OF TRANSPORT LAYER                  |
+---------------------+---------------------+-----------------+
| 1. Port Addressing  | 2. Segmentation     | 3. Connection   |
| (Process-to-Process)| (Sequence Numbers)  | (3-Way SYN/ACK) |
+---------------------+---------------------+-----------------+
| 4. Flow Control     | 5. Error Control    | 6. Congestion   |
| (Receiver Window)   | (Checksum & ARQ)    | (Congestion Win)|
+---------------------+---------------------+-----------------+`,
    followUpQuestions: [
      {
        question: 'What is the difference between flow control and congestion control?',
        answer: 'Flow control prevents the sender from overwhelming the receiver (point-to-point buffer issue); congestion control prevents all senders combined from overwhelming the network infrastructure.'
      }
    ],
    quickRevision: 'Transport layer provides process-to-process delivery via ports, segmentation/reassembly, connection setup, flow control (rwnd), error control, and congestion control (cwnd).',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.2'
    },
    tags: ['transport-layer', 'duties', 'port-addressing', 'flow-control', 'error-control']
  },
  {
    id: 'ce0518-u4-q3',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'Compare UDP & TCP.',
    shortAnswer: 'TCP (Transmission Control Protocol) is connection-oriented, reliable, guarantees in-order byte stream delivery with flow and congestion control, and has a 20-60 byte header. UDP (User Datagram Protocol) is connection-less, lightweight, unreliable best-effort message delivery with an 8-byte header and minimal latency, ideal for real-time streaming and DNS.',
    detailedAnswer: 'Comprehensive Side-by-Side Comparison:\n\n1. Connection Paradigm: TCP requires 3-way handshake prior to data transfer. UDP sends datagrams immediately without handshake.\n2. Reliability: TCP tracks every byte via sequence numbers, checksums, and positive ACKs; retransmits lost packets. UDP provides no ACKs and no retransmissions.\n3. Header Overhead: TCP header is 20 to 60 bytes. UDP header is fixed at 8 bytes.\n4. Ordering: TCP guarantees packets arrive in exact order (reassembles out-of-order segments). UDP delivers datagrams as they arrive (may be disordered).\n5. Flow & Congestion Control: TCP regulates speed based on receiver window (rwnd) and network congestion (cwnd). UDP transmits at whatever speed the application generates data.\n6. Use Cases: TCP is for accuracy-critical applications (HTTP/HTTPS, File Transfer/FTP, Email/SMTP, SSH). UDP is for speed-critical real-time applications (DNS, VoIP, Zoom/video conferencing, Online multiplayer gaming).',
    keyPoints: [
      'TCP: Connection-oriented, reliable byte stream, 20-60 byte header.',
      'UDP: Connection-less, unreliable message datagram, 8-byte fixed header.',
      'TCP handles flow/congestion control; UDP has zero rate control.',
      'TCP for Web/Email/File; UDP for Gaming/VoIP/DNS/Streaming.'
    ],
    example: 'Downloading software uses TCP (every bit must be accurate). Watching a live football broadcast uses UDP (if a pixel is dropped, it\'s better to skip it than pause live video).',
    diagram: `+-----------------------+--------------------------+---------------------------+
| FEATURE               | TCP (RFC 793)            | UDP (RFC 768)             |
+-----------------------+--------------------------+---------------------------+
| Connection Type       | Connection-oriented      | Connection-less           |
| Reliability           | Guaranteed (ACKs/Retrans)| Best-effort (No ACKs)     |
| Header Size           | 20 - 60 bytes            | 8 bytes (Fixed)           |
| Data Stream           | Continuous byte stream   | Independent datagrams     |
| Packet Ordering       | Guaranteed in-order      | Out-of-order possible     |
| Flow & Congestion     | Yes (Sliding window/cwnd)| No                        |
| Protocol Overhead     | Higher latency           | Ultra-low latency         |
+-----------------------+--------------------------+---------------------------+`,
    followUpQuestions: [
      {
        question: 'Why does DNS use UDP for queries but TCP for zone transfers?',
        answer: 'DNS queries are small (< 512 bytes) and benefit from UDP\'s zero-handshake speed. Zone transfers involve large database updates between servers requiring TCP\'s guaranteed reliability.'
      }
    ],
    quickRevision: 'TCP guarantees reliable, ordered byte streams with flow control and 20-60B headers; UDP delivers fast, lightweight datagrams with 8B headers and zero connection delay.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.3'
    },
    tags: ['tcp', 'udp', 'comparison', 'transport-layer', 'reliability']
  },
  {
    id: 'ce0518-u4-q4',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'What is meant by congestion (at Transport layer)?',
    shortAnswer: 'At the Transport Layer, congestion occurs when the aggregate volume of data injected by all transmitting processes exceeds the processing capacity or buffer memory of intermediate routers, causing queue delays to escalate, packets to be dropped, and TCP retransmission timeouts to trigger congestion collapse.',
    detailedAnswer: 'Transport Layer Congestion Dynamics:\n1. Origin: Multiple TCP connections share router bottleneck links. When aggregate sender windows inject segments faster than the link can drain, router buffers overflow.\n2. Symptoms at Transport Layer:\n   - Round-Trip Time (RTT) increases dramatically due to queuing delay.\n   - Packet loss occurs when router drop buffers are exceeded.\n   - Retransmission timers expire, causing senders to retransmit duplicate packets, which exacerbates the queue overload.\n3. TCP Congestion Management:\n   - TCP uses an internal state variable: Congestion Window (cwnd).\n   - Effective transmission window = min(cwnd, rwnd), where rwnd is receiver advertised buffer.\n   - Additive Increase / Multiplicative Decrease (AIMD): cwnd increases cautiously under stable conditions and halves upon packet drop, stabilizing the network.',
    keyPoints: [
      'Caused when total load injected > bottleneck bandwidth.',
      'Results in packet drops, high RTT, and repeated retransmission timeouts.',
      'Sender throttles transmission rate using Congestion Window (cwnd).',
      'Effective Window = min(cwnd, rwnd).'
    ],
    example: 'During a college registration event, 5000 students submit forms at the same second. Network routers drop packets, causing TCP timeouts and page loading failures.',
    diagram: `TRANSPORT LAYER WINDOW GOVERNANCE:
Effective Transmission Window = MIN ( cwnd, rwnd )
                                       |      |
                    [Network Congestion]      [Receiver Buffer Capacity]`,
    followUpQuestions: [
      {
        question: 'What is the difference between cwnd and rwnd?',
        answer: 'rwnd (Receive Window) is advertised by the destination receiver to prevent buffer overflow; cwnd (Congestion Window) is calculated by the sender to prevent network router saturation.'
      }
    ],
    quickRevision: 'Transport layer congestion happens when traffic exceeds network capacity; controlled by TCP sizing its window to min(cwnd, rwnd).',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.4'
    },
    tags: ['congestion', 'transport-layer', 'cwnd', 'rwnd', 'tcp-congestion']
  },
  {
    id: 'ce0518-u4-q5',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'What is function of transport layer?',
    shortAnswer: 'The core function of the Transport Layer is to provide reliable, transparent, and cost-effective end-to-end process-to-process data communication between user applications, shielding upper layers from the intricacies of physical network topology, routing, and hardware transmission technologies.',
    detailedAnswer: 'Primary Functions and Responsibilities:\n1. Process-Level Multiplexing & Demultiplexing: Combines streams from multiple concurrent client sockets into IP datagrams (multiplexing) and routes incoming segments to the exact target application port (demultiplexing).\n2. End-to-End Reliability: Guarantees delivery via sequence numbering, checksum verification, acknowledgments, and timers.\n3. End-to-End Flow Control: Adapts data transmission speed to match the receiver\'s processing capacity using sliding window protocols.\n4. End-to-End Congestion Control: Proactively throttles sending rates based on network bottlenecks.\n5. Connection State Tracking: Manages stateful sessions (SYN_SENT, ESTABLISHED, FIN_WAIT, TIME_WAIT).',
    keyPoints: [
      'Provides transparent process-to-process data transport.',
      'Multiplexes and demultiplexes application data via ports.',
      'Guarantees end-to-end data integrity and flow control.',
      'Hides network implementation details from application software.'
    ],
    example: 'Transport layer allows a user to run web browsing, video streaming, and email sync concurrently over a single Wi-Fi connection without data mixing.',
    diagram: `MULTIPLEXING & DEMULTIPLEXING:
[Browser :5201]  [Email Client :5202]  [Spotify :5203]
        \\               |               /
         v              v              v
     +-------------------------------------+
     |    TRANSPORT LAYER MULTIPLEXING     |
     +-------------------------------------+
                        |
                        v
               [Network Layer (IP)]`,
    followUpQuestions: [
      {
        question: 'What is the range of well-known port numbers?',
        answer: '0 to 1023 are Well-Known ports (assigned by IANA); 1024 to 49151 are Registered ports; 49152 to 65535 are Dynamic/Ephemeral ports.'
      }
    ],
    quickRevision: 'The transport layer provides process-to-process multiplexing, segmentation, end-to-end reliability, and flow control over unreliable network links.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.5'
    },
    tags: ['transport-layer', 'multiplexing', 'demultiplexing', 'ports', 'process-to-process']
  },
  {
    id: 'ce0518-u4-q6',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'Give the structure of UDP header.',
    shortAnswer: 'The UDP header is a lightweight, fixed 8-byte (64-bit) structure consisting of exactly 4 fields (each 16 bits / 2 bytes wide): 1. Source Port, 2. Destination Port, 3. Length, and 4. Checksum.',
    detailedAnswer: 'UDP Header Field Details:\n1. Source Port (16 bits): Port number of the sending application process. If not needed, it is set to zero.\n2. Destination Port (16 bits): Port number of the receiving application process on the destination host (e.g., port 53 for DNS).\n3. Length (16 bits): Specifies the total length of the UDP segment (Header + Data payload) in bytes. Minimum value is 8 bytes (header with 0 data); maximum value is 65,535 bytes.\n4. Checksum (16 bits): 16-bit 1s complement checksum covering a pseudo-header (Source IP, Dest IP, protocol 17, length), the UDP header, and the data payload. In IPv4, checksum is optional (set to 0 if unused); in IPv6, checksum is mandatory.',
    keyPoints: [
      'Fixed size: exactly 8 bytes (64 bits).',
      '4 fields: Source Port (16b), Destination Port (16b), Length (16b), Checksum (16b).',
      'Checksum covers pseudo-header + header + data.',
      'Optional in IPv4; mandatory in IPv6.'
    ],
    example: 'A DNS query to 8.8.8.8: Source Port = 53214, Destination Port = 53, Length = 36 bytes, Checksum = 0x2a3f.',
    diagram: `UDP HEADER STRUCTURE (8 BYTES / 64 BITS):
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Source Port          |       Destination Port        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|            Length             |           Checksum            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                             Data ...                          |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+`,
    followUpQuestions: [
      {
        question: 'What is the purpose of the UDP Pseudo-Header in checksum calculation?',
        answer: 'The pseudo-header includes Source IP, Destination IP, and Protocol (17). It ensures that a UDP segment delivered to the wrong IP address by an errant router is rejected.'
      }
    ],
    quickRevision: 'The UDP header is 8 bytes consisting of Source Port, Destination Port, Length, and Checksum.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.6'
    },
    tags: ['udp-header', 'udp', 'ports', 'checksum', 'transport-layer']
  },
  {
    id: 'ce0518-u4-q7',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'advanced',
    question: 'Explain TCP header and the working of the TCP protocol.',
    shortAnswer: 'The TCP header is 20 to 60 bytes wide and contains sequence and acknowledgment numbers, flow control window size, and 9 control flags (URG, ACK, PSH, RST, SYN, FIN, ECE, CWR, NS). TCP works through a 3-Way Handshake for connection establishment, sliding-window flow control, cumulative ACKs, and a 4-Way Handshake for connection teardown.',
    detailedAnswer: '1. TCP Header Fields:\n   - Source & Destination Port (16 bits each): Process addressing.\n   - Sequence Number (32 bits): Byte index of the first data byte in this segment.\n   - Acknowledgment Number (32 bits): Next expected byte number from the other party (cumulative ACK).\n   - Data Offset (4 bits): Number of 4-byte words in header (minimum 5 = 20 bytes; max 15 = 60 bytes).\n   - Control Flags (9 bits): SYN (synchronize seq numbers), ACK (valid ack number), FIN (terminate connection), RST (reset connection), PSH (push data to app), URG (urgent pointer valid).\n   - Window Size (16 bits): Receiver advertised buffer window (rwnd) for flow control.\n   - Checksum (16 bits): Mandatory error detection covering pseudo-header + header + data.\n   - Urgent Pointer (16 bits): Points to urgent data byte.\n\n2. TCP Working Lifecycle:\n   A. Connection Establishment (3-Way Handshake):\n      - Client -> Server: SYN (seq = x)\n      - Server -> Client: SYN-ACK (seq = y, ack = x + 1)\n      - Client -> Server: ACK (seq = x + 1, ack = y + 1)\n   B. Reliable Data Transfer: Full-duplex byte stream, cumulative ACKs, and timeout retransmissions.\n   C. Connection Teardown (4-Way Handshake):\n      - Client -> Server: FIN (seq = u)\n      - Server -> Client: ACK (ack = u + 1) [Server can still transmit remaining data]\n      - Server -> Client: FIN (seq = v)\n      - Client -> Server: ACK (ack = v + 1) [Client enters TIME_WAIT for 2MSL].',
    keyPoints: [
      '20-60 byte header with 32-bit Sequence and Acknowledgment numbers.',
      'Control Flags: SYN, ACK, FIN, RST, PSH, URG.',
      '3-Way Handshake sets up connection; 4-Way Handshake closes it.',
      'TIME_WAIT state lasts 2MSL to ensure final ACK delivery.'
    ],
    example: 'When opening https://google.com, browser sends SYN, Google replies with SYN-ACK, browser sends ACK; connection is ESTABLISHED and HTTP GET request follows.',
    diagram: `TCP 3-WAY HANDSHAKE & 4-WAY CLOSING:
[CLIENT]                                    [SERVER]
   | -------- SYN (seq=x) --------------------> | (LISTEN)
   | <------- SYN-ACK (seq=y, ack=x+1) ------- |
   | -------- ACK (seq=x+1, ack=y+1) ---------> | (ESTABLISHED)
   | <====== Bi-directional Data Stream ======> |
   | -------- FIN (seq=u) --------------------> |
   | <------- ACK (ack=u+1) ------------------- |
   | <------- FIN (seq=v) --------------------- |
   | -------- ACK (ack=v+1) ------------------> |
[TIME_WAIT (2MSL)]                            [CLOSED]`,
    followUpQuestions: [
      {
        question: 'Why does the client enter TIME_WAIT state after closing a TCP connection?',
        answer: 'To ensure the final ACK reaches the server (if lost, server retransmits FIN). TIME_WAIT lasts for 2 × Maximum Segment Lifetime (2MSL ≈ 1-2 minutes) to prevent old duplicate packets from interfering with new connections.'
      }
    ],
    quickRevision: 'TCP uses a 20-60B header, 3-way handshake (SYN, SYN-ACK, ACK) to connect, sliding window flow control, and 4-way handshake (FIN-ACK) to close.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.7'
    },
    tags: ['tcp-header', '3-way-handshake', 'fin-ack', 'time-wait', 'transport-layer']
  },
  {
    id: 'ce0518-u4-q9',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'Explain world wide web.',
    shortAnswer: 'The World Wide Web (WWW or Web) is a global distributed information system of interconnected hypertext documents and resources accessible via the Internet. It was invented in 1989 by Tim Berners-Lee at CERN and is built upon three foundational pillars: 1. Uniform Resource Identifier (URI/URL), 2. HyperText Transfer Protocol (HTTP), and 3. HyperText Markup Language (HTML).',
    detailedAnswer: 'Architecture and Core Components of the Web:\n1. Client-Server Architecture: Web clients (Browsers like Chrome, Firefox) request web resources; Web servers (Apache, Nginx, Node.js) host and serve resources.\n2. Three Pillars:\n   - URI / URL (Addressing): Identifies resources uniquely worldwide (e.g., https://campus.edu/cs/notes.html).\n   - HTTP (Protocol): Stateless request-response application protocol operating over TCP port 80/443.\n   - HTML (Document Format): Standard markup language formatting text, hyperlinks, images, and multimedia.\n3. Hyperlinking: Links embedded inside web pages allow users to traverse from one resource to another with a single click, forming a massive non-linear global information graph.\n4. Web Evolution: Web 1.0 (Static read-only), Web 2.0 (Interactive user-generated social web), and Web 3.0 (Semantic web and decentralized systems).',
    keyPoints: [
      'Invented in 1989 by Tim Berners-Lee at CERN.',
      'Three core technologies: URL (addressing), HTTP (transfer), HTML (formatting).',
      'Client-server architecture: browsers request pages, web servers serve them.',
      'Runs on top of Internet infrastructure (Web is an application on the Internet).'
    ],
    example: 'Entering a URL in a browser queries DNS for the server IP, sends an HTTP GET request, and renders the received HTML, CSS, and JavaScript into a webpage.',
    diagram: `WWW CLIENT-SERVER ARCHITECTURE:
[Web Browser (Client)] <--- 1. HTTP GET /index.html ---> [Web Server (Apache/Nginx)]
[HTML, CSS, Images]    <--- 2. HTTP 200 OK + HTML ------ [Hosts File Assets]`,
    followUpQuestions: [
      {
        question: 'What is the fundamental difference between the Internet and the Web?',
        answer: 'The Internet is the underlying physical global network infrastructure of computers, routers, and cables. The World Wide Web is one of many software applications running ON TOP of the Internet (alongside Email, FTP, and VoIP).'
      }
    ],
    quickRevision: 'The WWW is a global information system built on URLs (addressing), HTTP (transfer protocol), and HTML (document formatting).',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.9'
    },
    tags: ['www', 'world-wide-web', 'http', 'html', 'url', 'application-layer']
  },
  {
    id: 'ce0518-u4-q10',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Explain HyperText Transfer Protocol (HTTP).',
    shortAnswer: 'HyperText Transfer Protocol (HTTP - RFC 2616 / 7230) is a stateless, client-server application layer protocol used to distribute hypermedia documents over the web. Operating over TCP port 80 (HTTP) or port 443 (HTTPS with TLS), it structures communication into HTTP Requests (Method, URI, Headers, Body) and HTTP Responses (Status Code, Headers, Body).',
    detailedAnswer: 'HTTP Architecture & Mechanisms:\n1. Stateless Protocol: Every request-response exchange is independent; the server retains zero memory of past requests. State is maintained artificially using Cookies, Sessions, and JWT tokens.\n2. Standard Request Methods:\n   - GET: Retrieve a resource without side effects (idempotent).\n   - POST: Submit data to create a new resource.\n   - PUT: Replace an existing resource completely.\n   - DELETE: Remove a resource.\n   - HEAD: Retrieve response headers only (no body).\n3. Standard HTTP Status Codes:\n   - 1xx (Informational): 101 Switching Protocols.\n   - 2xx (Success): 200 OK, 201 Created, 204 No Content.\n   - 3xx (Redirection): 301 Moved Permanently, 304 Not Modified.\n   - 4xx (Client Errors): 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found.\n   - 5xx (Server Errors): 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable.\n4. HTTP Evolution:\n   - HTTP/1.0: Closes TCP connection after every single request (high handshake latency).\n   - HTTP/1.1: Persistent connections (Keep-Alive) and pipelining.\n   - HTTP/2: Binary framing, multiplexing multiple streams over 1 TCP connection, header compression (HPACK).\n   - HTTP/3: Operates over UDP using QUIC, eliminating TCP Head-of-Line blocking.',
    keyPoints: [
      'Stateless request-response protocol; uses port 80 (HTTP) and 443 (HTTPS).',
      'Methods: GET (read), POST (create), PUT (update), DELETE (delete).',
      'Status codes: 2xx success, 3xx redirect, 4xx client error, 5xx server error.',
      'HTTP/2 multiplexes streams; HTTP/3 runs over QUIC/UDP.'
    ],
    example: 'Client sends "GET /notes.pdf HTTP/1.1\\r\\nHost: hub.edu\\r\\n\\r\\n". Server replies with "HTTP/1.1 200 OK\\r\\nContent-Type: application/pdf\\r\\n...".',
    diagram: `HTTP REQUEST / RESPONSE FORMAT:
[REQUEST]:
METHOD /path/file.html HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
[Empty Line]
[Optional Body Data]

[RESPONSE]:
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1024
[Empty Line]
<html><body>Hello World</body></html>`,
    followUpQuestions: [
      {
        question: 'What is the difference between HTTP/1.1 and HTTP/2 multiplexing?',
        answer: 'HTTP/1.1 requires sequential requests or multiple parallel TCP connections. HTTP/2 splits messages into binary frames and interleaves multiple simultaneous bidirectional streams across a single TCP connection.'
      }
    ],
    quickRevision: 'HTTP is a stateless request-response protocol; uses methods (GET/POST) and status codes (200, 404, 500); HTTP/2 adds multiplexing and HTTP/3 runs over QUIC/UDP.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.10'
    },
    tags: ['http', 'https', 'methods', 'status-codes', 'http2', 'application-layer']
  },
  {
    id: 'ce0518-u4-q11',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Explain the SMTP.',
    shortAnswer: 'Simple Mail Transfer Protocol (SMTP - RFC 5321) is a text-based, push protocol operating over TCP port 25 (server-to-server) or port 587 (client submission) used to transfer email reliably from a sender\'s Mail User Agent (MUA) to a Mail Transfer Agent (MTA) and between intermediate mail servers.',
    detailedAnswer: 'Architecture and Operation of SMTP:\n1. Push Protocol: SMTP is strictly a push protocol (used to push messages from client to server and between servers). It CANNOT be used by the recipient to pull mail from a mailbox (which requires POP3 or IMAP).\n2. Communication Model: Runs over reliable TCP connections. Uses human-readable ASCII commands and 3-digit numerical responses:\n   - HELO / EHLO: Client introduces its domain name.\n   - MAIL FROM: <sender@domain.com>: Specifies sender envelope address.\n   - RCPT TO: <receiver@domain.com>: Specifies destination recipient.\n   - DATA: Initiates message payload (Subject, Headers, Body); terminated by a single period on a line by itself (".\\r\\n").\n   - QUIT: Terminates the session.\n3. Server Responses: 220 (Service ready), 250 (Action OK / Completed), 354 (Start mail input), 550 (Mailbox unavailable).\n4. Limitations: Originally restricted to 7-bit ASCII text with no attachments; overcome by the MIME (Multipurpose Internet Mail Extensions) standard.',
    keyPoints: [
      'Push protocol for sending email (Port 25 for relay, Port 587 for client submission).',
      'Uses ASCII text commands: HELO, MAIL FROM, RCPT TO, DATA, QUIT.',
      'Recipient downloads email using POP3 (port 110) or IMAP (port 143).',
      'MIME extension allows multimedia attachments and non-ASCII character sets.'
    ],
    example: 'Client connects to mail server: "HELO indus.edu" -> "250 OK" -> "MAIL FROM:<student@indus.edu>" -> "250 OK" -> "RCPT TO:<prof@indus.edu>" -> "250 OK" -> "DATA" -> "354 Start input" -> sends message ending with "." -> "250 OK queued".',
    diagram: `EMAIL ARCHITECTURE (SMTP vs POP3/IMAP):
[Sender PC] --- (SMTP Push) ---> [Sender Mail Server]
                                       |
                               (SMTP Server-to-Server)
                                       v
[Recipient PC] <--- (POP3/IMAP Pull) --- [Recipient Mail Server]`,
    followUpQuestions: [
      {
        question: 'Why can SMTP not be used by a user to retrieve emails from their mailbox?',
        answer: 'SMTP is inherently a push protocol. Mailbox retrieval requires pull protocols like IMAP or POP3, which authenticate the user and permit selective downloading and folder management.'
      }
    ],
    quickRevision: 'SMTP is a push protocol over TCP port 25/587 used to send emails via commands (HELO, MAIL FROM, RCPT TO, DATA); POP3/IMAP pull emails to clients.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.11'
    },
    tags: ['smtp', 'email', 'pop3', 'imap', 'mime', 'mail-transfer']
  },
  {
    id: 'ce0518-u4-q12',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Write a note on DNS.',
    shortAnswer: 'Domain Name System (DNS - RFC 1034/1035) is a hierarchical, distributed database that translates human-friendly domain names (e.g., www.google.com) into machine-routable IP addresses (e.g., 142.250.190.46). It operates primarily over UDP port 53 (queries) and TCP port 53 (zone transfers).',
    detailedAnswer: 'DNS Architecture & Hierarchy:\n1. Tree-Structured Namespace:\n   - Root Domain ("."): Top of hierarchy managed by 13 root server clusters globally.\n   - Top-Level Domains (TLD): Generic TLDs (.com, .org, .edu) and Country-Code TLDs (.in, .uk, .ca).\n   - Second-Level Domains: indus.edu, google.com.\n   - Subdomains: portal.indus.edu, mail.google.com.\n2. Query Resolution Process:\n   - Recursive Query: Client asks Local DNS Resolver: "Find this IP for me." Resolver assumes responsibility to find the answer.\n   - Iterative Query: Resolver queries Root Server (gets TLD referral), queries TLD Server (gets Authoritative Server referral), queries Authoritative Server (gets final IP address).\n3. DNS Record Types:\n   - A Record: Maps hostname to 32-bit IPv4 address.\n   - AAAA Record: Maps hostname to 128-bit IPv6 address.\n   - CNAME (Canonical Name): Alias for another domain name.\n   - MX (Mail Exchange): Directs emails to mail servers.\n   - NS (Name Server): Specifies authoritative servers for a zone.\n   - PTR (Pointer): Reverse DNS lookup (IP to domain name).\n4. Caching: DNS resolvers cache mappings according to Time-To-Live (TTL) values, speeding up subsequent lookups.',
    keyPoints: [
      'Hierarchical namespace: Root (.) -> TLD (.com, .edu) -> Domain -> Subdomain.',
      'Translates hostnames into IP addresses; uses Port 53 (UDP for queries).',
      'Common records: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), NS (nameserver).',
      'Recursive query from client to local resolver; iterative queries to authoritative servers.'
    ],
    example: 'Looking up "portal.indus.edu": Resolver queries Root -> refers to .edu TLD server -> refers to indus.edu authoritative server -> returns IP 103.21.54.12.',
    diagram: `DNS RESOLUTION WORKFLOW:
[Client] ---> 1. Query: portal.indus.edu ---> [Local DNS Resolver]
                                                    |
         +------------------------------------------+
         | 2. Ask Root (".")       -> Returns .edu TLD Server
         | 3. Ask .edu TLD         -> Returns indus.edu Name Server
         | 4. Ask indus.edu Server -> Returns IP: 103.21.54.12
         v
[Client Receives IP 103.21.54.12]`,
    followUpQuestions: [
      {
        question: 'Why does DNS primarily use UDP instead of TCP for queries?',
        answer: 'UDP incurs zero connection-establishment overhead (no 3-way handshake), making DNS lookups fast and lightweight for millions of queries per second.'
      }
    ],
    quickRevision: 'DNS translates domain names to IPs through a distributed hierarchy of Root, TLD, and Authoritative servers using UDP port 53.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.12'
    },
    tags: ['dns', 'domain-name-system', 'dns-records', 'udp-53', 'application-layer']
  },
  {
    id: 'ce0518-u4-q13',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Explain about HTTP.',
    shortAnswer: 'HTTP (HyperText Transfer Protocol) is an application-layer request-response protocol operating over TCP port 80/443. It is stateless, extensible via headers, and defines standard communication methods (GET, POST, PUT, DELETE) and status codes for transferring hypermedia across the Internet.',
    detailedAnswer: 'HTTP Architecture Features:\n1. Client-Server Paradigm: User-Agent initiates an HTTP connection; origin server returns resources.\n2. Connection Modes:\n   - Non-Persistent (HTTP/1.0): 1 TCP connection per resource. Downloading an HTML page with 10 images requires 11 separate TCP 3-way handshakes!\n   - Persistent Connections (HTTP/1.1): A single TCP connection remains open (Connection: keep-alive) for multiple requests, slashing latency.\n3. Request Structure:\n   - Request Line: [Method] [Request-URI] [HTTP-Version] (e.g. GET /index.html HTTP/1.1)\n   - Headers: Host, User-Agent, Accept, Authorization, Cookie\n   - Body: Payload data in POST/PUT requests\n4. Response Structure:\n   - Status Line: [HTTP-Version] [Status-Code] [Reason-Phrase] (e.g. HTTP/1.1 200 OK)\n   - Headers: Content-Type, Content-Length, Set-Cookie, Cache-Control\n   - Entity Body: HTML, JSON, or binary data.',
    keyPoints: [
      'Stateless protocol over TCP port 80 (HTTP) and 443 (HTTPS).',
      'Persistent connections in HTTP/1.1 reuse TCP sockets for multiple requests.',
      'Request consists of Method, URI, Headers, and optional Body.',
      'Response returns Status Code (200, 301, 404, 500), Headers, and Payload.'
    ],
    example: 'Fetching a JSON API: Client sends "GET /api/viva/ce0518 HTTP/1.1\\r\\nHost: hub.com\\r\\n\\r\\n". Server responds with 200 OK and JSON payload.',
    diagram: `HTTP PERSISTENT VS NON-PERSISTENT CONNECTION:
Non-Persistent: [SYN/ACK] -> [GET Page] -> [CLOSE] -> [SYN/ACK] -> [GET Img] -> [CLOSE]
Persistent:     [SYN/ACK] -> [GET Page] -> [GET Img1] -> [GET Img2] -> [CLOSE]`,
    followUpQuestions: [
      {
        question: 'How does HTTPS secure standard HTTP traffic?',
        answer: 'HTTPS encapsulates plaintext HTTP messages inside a Transport Layer Security (TLS) cryptographic tunnel, providing end-to-end encryption, server authentication via digital certificates, and data integrity.'
      }
    ],
    quickRevision: 'HTTP transfers web hypermedia using request-response exchanges; persistent connections keep TCP sockets alive to reuse connections across multiple resources.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.13'
    },
    tags: ['http', 'persistent-connections', 'status-codes', 'request-response', 'application-layer']
  },
  {
    id: 'ce0518-u4-q14',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Write short notes on FTP.',
    shortAnswer: 'File Transfer Protocol (FTP - RFC 959) is a standard network protocol used to transfer computer files between a client and server across an IP network. It is characterized by an "out-of-band" dual-connection architecture using two distinct TCP connections: a Control Connection on port 21 and a Data Connection on port 20.',
    detailedAnswer: 'FTP Architecture & Operation:\n1. Dual-Port Out-of-Band Design:\n   - Control Connection (Port 21): Established first and remains open throughout the session. Used exclusively for administrative commands (USER, PASS, CWD, RETR, STOR) and 3-digit status codes.\n   - Data Connection (Port 20 or dynamic): Created on-demand whenever a file or directory listing is transferred, and closed immediately after transfer completes.\n2. Connection Modes:\n   - Active Mode (PORT): Client connects to port 21, binds an ephemeral port, and sends "PORT" command. Server actively connects from port 20 back to the client\'s port (frequently blocked by client client-side firewalls/NAT).\n   - Passive Mode (PASV): Client sends "PASV". Server opens an unprivileged port and returns the IP:Port to the client. Client initiates the data connection, easily bypassing client-side NAT/firewall blocks.\n3. Security Limitation: FTP transmits credentials and data in cleartext; secured by FTPS (SSL/TLS) or replaced by SFTP (SSH File Transfer Protocol).',
    keyPoints: [
      'Dual connection architecture: Port 21 for Control, Port 20 for Data.',
      'Control connection remains open throughout session; data connection opens per transfer.',
      'Active Mode: Server connects back to client port.',
      'Passive Mode (PASV): Client initiates connection to server\'s ephemeral port (NAT friendly).'
    ],
    example: 'Uploading a lab report to a campus server: Client opens control connection on port 21, authenticates, sends "STOR report.pdf", server opens data connection on port 20 to transfer the PDF bytes, and terminates data connection.',
    diagram: `FTP DUAL-CONNECTION ARCHITECTURE:
[FTP Client] === TCP Port 21 (Commands & Status) ===> [FTP Server: Port 21] (Control)
[FTP Client] <=== TCP Port 20 (Actual File Bytes) === [FTP Server: Port 20] (Data)`,
    followUpQuestions: [
      {
        question: 'Why does Passive Mode (PASV) work better through firewalls than Active Mode?',
        answer: 'In Passive Mode, the client initiates all outbound connections. Firewalls typically permit outbound traffic but block unsolicited incoming connection attempts from external servers (which Active Mode requires).'
      }
    ],
    quickRevision: 'FTP uses two TCP connections: Control on port 21 for commands, and Data on port 20 for file transfers; Passive Mode (PASV) is firewall friendly.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.14'
    },
    tags: ['ftp', 'file-transfer', 'port-21', 'port-20', 'pasv', 'active-mode']
  },
  {
    id: 'ce0518-u4-q15',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Write short notes on FTP (Data vs Control connection).',
    shortAnswer: 'FTP uses an out-of-band architecture with two separate TCP connections: The Control Connection (port 21) transmits administrative commands and server responses throughout the entire session; The Data Connection (port 20 or dynamic) transmits raw file bytes and directory listings, opening on-demand for each transfer and closing immediately upon completion.',
    detailedAnswer: 'Deep Dive: Control Connection vs Data Connection:\n1. Control Connection:\n   - Port: Server listens on well-known TCP port 21.\n   - Lifetime: Established at user login and stays alive until "QUIT" is issued.\n   - Traffic: 7-bit ASCII commands (USER, PASS, LIST, RETR, STOR) and 3-digit reply codes (220, 230, 331, 550).\n   - Low bandwidth, high interactive responsiveness.\n\n2. Data Connection:\n   - Port: Standard port 20 (Active Mode) or negotiated high port > 1024 (Passive Mode).\n   - Lifetime: Ephemeral. Created dynamically when a command requires data transfer (e.g. LIST, RETR, STOR) and torn down immediately upon transfer completion.\n   - Traffic: Raw binary or ASCII file contents.\n   - High throughput, streaming data.\n\nAdvantage of Dual Connections: Control commands can be sent while a multi-gigabyte file transfer is ongoing (e.g. sending an ABOR command to immediately abort an ongoing transfer without terminating the whole session).',
    keyPoints: [
      'Control: Port 21, persistent, carries ASCII commands and reply codes.',
      'Data: Port 20 / dynamic, ephemeral, transfers raw file bytes.',
      'Separation allows out-of-band signaling (like aborting an in-progress transfer).',
      'Data connection closes automatically to signal End of File (EOF).'
    ],
    example: 'Transferring 3 files: Control connection opens once and stays active. Three separate Data connections open and close in succession for each of the 3 files.',
    diagram: `+-----------------------+--------------------------+---------------------------+
| FEATURE               | CONTROL CONNECTION       | DATA CONNECTION           |
+-----------------------+--------------------------+---------------------------+
| Server Port           | TCP Port 21              | TCP Port 20 (or dynamic)  |
| Lifetime              | Persistent entire session| Ephemeral per file/list   |
| Purpose               | Commands & status replies| File byte transfer        |
| Data Format           | 7-bit ASCII text strings | Binary / ASCII data stream|
+-----------------------+--------------------------+---------------------------+`,
    followUpQuestions: [
      {
        question: 'How does the FTP receiver know when a file transfer has finished?',
        answer: 'The sender closes the TCP data connection. The resulting FIN-ACK TCP teardown signals the End-of-File (EOF) to the receiver.'
      }
    ],
    quickRevision: 'FTP separates Control (port 21, persistent commands) from Data (port 20, ephemeral file bytes), enabling out-of-band control during file transfers.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.15'
    },
    tags: ['ftp', 'control-connection', 'data-connection', 'out-of-band', 'tcp-ports']
  },
  {
    id: 'ce0518-u4-q16',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'Explain internet transport protocol.',
    shortAnswer: 'Internet transport protocols operate at Layer 4 of the TCP/IP stack to provide process-to-process communication across IP networks. The two primary foundational protocols are TCP (reliable, connection-oriented, ordered byte stream) and UDP (unreliable, connection-less, low-latency datagrams), supplemented by modern protocols like SCTP and QUIC.',
    detailedAnswer: 'Overview of Internet Transport Protocols:\n1. Transmission Control Protocol (TCP - RFC 793):\n   - Connection-oriented byte stream using 3-way handshakes.\n   - Guarantees reliability via sequence numbers, checksums, selective acknowledgments (SACK), and exponential retransmission timers.\n   - Flow control via sliding receiver window (rwnd).\n   - Congestion control via Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery.\n\n2. User Datagram Protocol (UDP - RFC 768):\n   - Minimal connection-less datagram abstraction.\n   - No handshakes, no acknowledgments, no ordering, no retransmissions.\n   - Ultra-low latency with an 8-byte header.\n\n3. Modern Transport Protocols:\n   - Stream Control Transmission Protocol (SCTP - RFC 4960): Multi-streaming and multi-homing transport protocol used in telecom signaling and WebRTC data channels.\n   - QUIC (RFC 9000): Encrypted transport protocol running over UDP that replaces TCP in HTTP/3, eliminating head-of-line blocking and providing 0-RTT connection resumption.',
    keyPoints: [
      'TCP: Reliable, connection-oriented, ordered byte stream with flow and congestion control.',
      'UDP: Lightweight, connection-less, unordered datagrams with minimal latency.',
      'QUIC: Modern UDP-based encrypted transport replacing TCP in HTTP/3.',
      'SCTP: Multi-streaming transport used in telecom signaling and WebRTC.'
    ],
    example: 'A modern web browser opens HTTP/1.1 and HTTP/2 over TCP (port 443), DNS queries over UDP (port 53), and HTTP/3 web assets over QUIC/UDP (port 443).',
    diagram: `INTERNET TRANSPORT PROTOCOL SPECTRUM:
+--------------------+---------------------+--------------------+
| TCP                | UDP                 | QUIC               |
+--------------------+---------------------+--------------------+
| Reliable Stream    | Fast Datagrams      | Multiplexed Stream |
| Over IP (Proto 6)  | Over IP (Proto 17)  | Built over UDP     |
| 20-60 Byte Header  | 8 Byte Header       | Integrated TLS 1.3 |
+--------------------+---------------------+--------------------+`,
    followUpQuestions: [
      {
        question: 'What is Head-of-Line (HoL) blocking in TCP?',
        answer: 'If a single TCP packet in a stream is lost, all subsequent packets must wait in the buffer until the missing packet is retransmitted and acknowledged, stalling all multiplexed HTTP streams.'
      }
    ],
    quickRevision: 'Internet transport protocols provide process delivery: TCP offers reliable ordered streams, UDP offers low-latency datagrams, and QUIC combines speed with TLS encryption.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.16'
    },
    tags: ['transport-protocols', 'tcp', 'udp', 'quic', 'sctp', 'layer-4']
  },
  {
    id: 'ce0518-u4-q17',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'advanced',
    question: 'Explain TCP segment header.',
    shortAnswer: 'The TCP segment header is a 20-60 byte structure prepended to transport payloads. It features Source & Destination Ports (16b each), Sequence Number (32b), Acknowledgment Number (32b), Data Offset (4b), 9 Control Flags (URG, ACK, PSH, RST, SYN, FIN, ECE, CWR, NS), Window Size (16b), Checksum (16b), Urgent Pointer (16b), and optional Options (e.g. MSS, SACK, Window Scale).',
    detailedAnswer: 'TCP Header In-Depth Field Analysis:\n1. Source Port & Destination Port (16 bits each): Identifies sending and receiving application endpoints.\n2. Sequence Number (32 bits): Tracks the sequence position of the first byte of data in this segment. Initial Sequence Number (ISN) is randomized during handshake.\n3. Acknowledgment Number (32 bits): Cumulative ACK indicating the next byte sequence number the receiver expects to receive.\n4. Data Offset / Header Length (4 bits): Number of 32-bit (4-byte) words in the header (5 words = 20 bytes; 15 words = 60 bytes).\n5. Reserved (3 bits): Reserved for future standardization (set to 0).\n6. Control Flags (9 bits):\n   - URG: Urgent pointer field is significant.\n   - ACK: Acknowledgment field is significant.\n   - PSH: Push function; deliver data to application immediately without buffering.\n   - RST: Reset the connection immediately (fatal error/closed port).\n   - SYN: Synchronize sequence numbers to establish connection.\n   - FIN: No more data from sender; initiates teardown.\n   - ECE: Explicit Congestion Notification Echo (router signaled congestion).\n   - CWR: Congestion Window Reduced (sender reduced cwnd).\n7. Window Size (16 bits): Receive buffer window (rwnd) in bytes for flow control.\n8. Checksum (16 bits): Mandatory 1s complement checksum over header + data + pseudo-header.\n9. Urgent Pointer (16 bits): Offset added to sequence number pointing to end of urgent data.\n10. Options (Variable, 0 to 40 bytes): MSS (Maximum Segment Size), Window Scale (shifts window left up to 1GB), SACK Permitted, Timestamps.',
    keyPoints: [
      '20-byte base size; expandable up to 60 bytes with Options.',
      '32-bit Sequence and Acknowledgment numbers provide byte-level stream tracking.',
      'Flags: SYN (connect), FIN (close), RST (abort), ACK (confirm), PSH (flush), URG (priority).',
      'Window Size field regulates flow control (rwnd).'
    ],
    example: 'An empty TCP ACK segment: Header length = 20 bytes, Data Offset = 5, Flags = 0x010 (ACK bit set), Window = 64240, Checksum = 0x4b2c.',
    diagram: `TCP SEGMENT HEADER STRUCTURE:
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Source Port          |       Destination Port        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                        Sequence Number                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Acknowledgment Number                      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Data |           |U|A|P|R|S|F|                               |
| Offset| Reserved  |R|C|S|S|Y|I|            Window             |
|       |           |G|K|H|T|N|N|                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|           Checksum            |        Urgent Pointer         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Options                    |    Padding    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+`,
    followUpQuestions: [
      {
        question: 'What is the Maximum Segment Size (MSS) option in TCP?',
        answer: 'MSS specifies the maximum payload data (in bytes) a device can receive in a single TCP segment, excluding TCP and IP headers (typically 1460 bytes on 1500-byte Ethernet MTU).'
      }
    ],
    quickRevision: 'The TCP header is 20-60B containing ports, 32-bit sequence/ACK numbers, control flags (SYN/ACK/FIN/RST), receive window size, and options.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.17'
    },
    tags: ['tcp-segment-header', 'sequence-number', 'ack-number', 'flags', 'mss']
  },
  {
    id: 'ce0518-u4-q18',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Difference between absolute domain name and relative domain name.',
    shortAnswer: 'An Absolute Domain Name (Fully Qualified Domain Name - FQDN) specifies the complete path from the host to the DNS root and ends with an explicit trailing period (e.g., "mail.indus.edu.in."). A Relative Domain Name (Partially Qualified Domain Name - PQDN) specifies only a partial host prefix without the root dot (e.g., "mail" or "mail.indus"), which the OS resolver expands using local search domains.',
    detailedAnswer: 'DNS Domain Name Structural Differences:\n1. Absolute Domain Name (FQDN):\n   - Contains the full hierarchical hierarchy down to the root domain.\n   - Always ends with a trailing dot (e.g. "www.google.com." or "portal.indus.edu.").\n   - Unambiguous: Exactly one unique node exists in the global DNS tree matching an FQDN.\n   - Direct lookup: DNS resolver queries the root servers immediately without modifying the string.\n\n2. Relative Domain Name (PQDN):\n   - Omits the root suffix and top-level domain.\n   - Does NOT end with a trailing dot (e.g. "intranet" or "printer.lab").\n   - Ambiguous on its own: Depends entirely on the local client\'s DNS search suffix configuration (defined in /etc/resolv.conf or DHCP).\n   - Resolver expansion: If local search domain is "indus.edu", the resolver appends it automatically: "intranet" -> "intranet.indus.edu." before sending the DNS query.',
    keyPoints: [
      'Absolute (FQDN): Complete path ending with trailing dot (e.g. mail.indus.edu.).',
      'Relative (PQDN): Incomplete host prefix without trailing dot (e.g. mail).',
      'FQDN is globally unique and unambiguous.',
      'PQDN is expanded locally using the operating system\'s DNS search suffix.'
    ],
    example: 'In a college lab with DNS search suffix "cs.indus.edu": Entering "server1" (PQDN) automatically resolves to "server1.cs.indus.edu." (FQDN).',
    diagram: `+-----------------------+--------------------------+---------------------------+
| ATTRIBUTE             | ABSOLUTE DOMAIN (FQDN)   | RELATIVE DOMAIN (PQDN)    |
+-----------------------+--------------------------+---------------------------+
| Trailing Period       | Mandatory (e.g. "edu.")  | Omitted (e.g. "host")     |
| Ambiguity             | Unambiguous globally     | Context-dependent locally |
| Suffix Expansion      | No modification          | Appends local search domain|
| Example               | "web.mit.edu."           | "web" or "web.mit"        |
+-----------------------+--------------------------+---------------------------+`,
    followUpQuestions: [
      {
        question: 'Why don\'t regular users type the trailing dot in web browsers?',
        answer: 'Web browsers and operating system DNS resolver libraries automatically append the root dot to user-typed domains behind the scenes.'
      }
    ],
    quickRevision: 'Absolute domain names (FQDN) end in a trailing dot and are globally unique; relative domain names (PQDN) lack the dot and rely on local search suffixes.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: '.18'
    },
    tags: ['dns', 'fqdn', 'pqdn', 'absolute-domain', 'relative-domain']
  },
  {
    id: 'ce0518-u4-q19',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'What is domain name system?',
    shortAnswer: 'The Domain Name System (DNS) is the Internet\'s decentralized, hierarchical phonebook. It translates alphanumeric hostnames (e.g., indusuni.ac.in) into numerical IP addresses (e.g., 103.21.54.12) required for network routing, using a distributed hierarchy of Root, Top-Level Domain (TLD), and Authoritative nameservers.',
    detailedAnswer: 'Why DNS is Vital:\nComputers route packets using binary IP addresses, whereas humans remember meaningful alphabetical names. DNS bridges this gap seamlessly.\n\nKey Components:\n1. Domain Namespace: Inverted tree structure with root node "." at the top, branching into TLDs (.com, .org, .edu, .in) and Second-Level Domains.\n2. Name Servers: Programs that store DNS resource records and answer queries.\n   - Root Servers (13 logical root server authorities).\n   - TLD Servers (manage specific extensions like .edu).\n   - Authoritative Servers (manage the definitive records for an organization\'s domain).\n3. Resolvers: Client software (in OS/browser) that initiates queries on behalf of applications.\n4. Resource Records (RRs): Database records stored in zone files (A, AAAA, CNAME, MX, TXT, SOA, PTR).',
    keyPoints: [
      'Decentralized hierarchical naming system.',
      'Translates human-readable domain names into machine IP addresses.',
      'Root servers -> TLD servers -> Authoritative servers.',
      'Operates on UDP/TCP port 53.'
    ],
    example: 'When a user opens "google.com", DNS resolves the name to IP 142.250.190.46, allowing the browser to connect.',
    diagram: `DNS HIERARCHICAL TREE STRUCTURE:
                    [ . (Root Zone) ]
                     /       |       \\
                 [.com]    [.edu]    [.in]   <--- Top-Level Domains (TLD)
                  /          |         \\
             [google]     [indus]    [gov]   <--- Second-Level Domains
               /             |
            [www]         [portal]           <--- Subdomains / Hosts`,
    followUpQuestions: [
      {
        question: 'What is the role of the DNS TTL (Time To Live) value?',
        answer: 'TTL specifies the duration in seconds that a resolver or client may cache a DNS record before discarding it and querying the authoritative server again.'
      }
    ],
    quickRevision: 'DNS is the Internet\'s distributed naming directory that translates human hostnames into numerical IP addresses using port 53.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.19'
    },
    tags: ['dns', 'domain-name-system', 'namespace', 'root-servers', 'application-layer']
  },
  {
    id: 'ce0518-u4-q20',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Explain about MIME.',
    shortAnswer: 'Multipurpose Internet Mail Extensions (MIME - RFC 2045-2049) is an application-layer specification that extends traditional 7-bit ASCII SMTP to support multimedia attachments (audio, video, images, PDFs, programs) and international character sets using Base64 or Quoted-Printable encoding and standardized Content-Type headers.',
    detailedAnswer: 'Why MIME was Created:\nOriginal SMTP was designed strictly for 7-bit NVT ASCII text. If binary files or accented European/Asian characters were transmitted, routers corrupted high-order bits.\n\nMIME Architecture:\n1. 5 Core MIME Headers Added to Email:\n   - MIME-Version: Declares version (e.g. "1.0").\n   - Content-Type: Specifies media format and subtype (e.g. "image/jpeg", "application/pdf", "multipart/mixed").\n   - Content-Transfer-Encoding: Defines binary-to-ASCII transformation (Base64, Quoted-Printable, 7bit, 8bit).\n   - Content-Disposition: Indicates inline display or downloadable attachment with filename.\n   - Content-Description: Plaintext description of attachment.\n2. Base64 Encoding Mechanism:\n   - Takes 3 binary bytes (24 bits) and splits them into 4 groups of 6 bits.\n   - Each 6-bit value (0-63) maps to a printable ASCII character (A-Z, a-z, 0-9, +, /).\n   - Expands data size by exactly 33% (4/3 ratio).\n3. Web Adoption: The HTTP protocol adopted MIME\'s "Content-Type" system to declare payload formats (text/html, application/json).',
    keyPoints: [
      'Extends email to transmit non-ASCII text, images, audio, video, and files.',
      'Core header: Content-Type (type/subtype) and Content-Transfer-Encoding.',
      'Base64 encodes 3 binary bytes into 4 printable ASCII characters (33% overhead).',
      'Adopted globally by HTTP to identify web response formats.'
    ],
    example: 'An email with a PDF attachment includes:\nContent-Type: application/pdf; name="report.pdf"\nContent-Transfer-Encoding: base64\nContent-Disposition: attachment; filename="report.pdf"\nJVBERi0xLjQKJcTl8uXr...',
    diagram: `BASE64 ENCODING MECHANISM:
Binary Data:   [ 8 bits ] [ 8 bits ] [ 8 bits ]  (Total 24 bits)
                   \\         /     \\        /
6-bit Groups:  [6 bits]  [6 bits]  [6 bits]  [6 bits]
Mapped ASCII:    'S'       'G'       'V'       's'   (Safe for 7-bit SMTP!)`,
    followUpQuestions: [
      {
        question: 'What is a "multipart/mixed" MIME content type?',
        answer: 'It indicates the email contains multiple independent parts delineated by a unique boundary string, such as a plain text body followed by one or more file attachments.'
      }
    ],
    quickRevision: 'MIME enables SMTP to transmit multimedia attachments and non-ASCII text by encoding binary files into safe ASCII strings using Base64.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.20'
    },
    tags: ['mime', 'email', 'base64', 'content-type', 'smtp']
  },
  {
    id: 'ce0518-u4-q21',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'advanced',
    question: 'Explain Principle of Congestion Control.',
    shortAnswer: 'TCP Congestion Control regulates the rate at which a sender injects data into the network based on bottleneck feedback. It operates using four core phases: 1. Slow Start (exponential window growth), 2. Congestion Avoidance (additive linear growth), 3. Fast Retransmit (retransmit on 3 duplicate ACKs), and 4. Fast Recovery (halving cwnd instead of dropping to 1).',
    detailedAnswer: 'TCP Congestion Control Algorithms (TCP Tahoe & Reno):\n\n1. State Variables:\n   - cwnd (Congestion Window): Sender-calculated transmission capacity in bytes.\n   - ssthresh (Slow Start Threshold): Threshold marking boundary between exponential and linear growth.\n\n2. Phase 1: Slow Start:\n   - Initial cwnd = 1 MSS (or 10 MSS in modern TCP).\n   - For every ACK received, cwnd increments by 1 MSS (effectively doubling cwnd every RTT: 1 -> 2 -> 4 -> 8 -> 16 MSS).\n   - Continues until cwnd reaches ssthresh or packet loss occurs.\n\n3. Phase 2: Congestion Avoidance (Additive Increase):\n   - When cwnd >= ssthresh, exponential growth transitions to linear growth.\n   - cwnd increases by 1 MSS per RTT (or 1/cwnd per ACK).\n   - Probes network capacity conservatively.\n\n4. Packet Loss Reaction:\n   - Severe Loss (Timeout - RTO expires):\n     * ssthresh = cwnd / 2\n     * cwnd = 1 MSS (restarts from Slow Start! - Tahoe behavior)\n   - Mild Loss (3 Duplicate ACKs received):\n     * Indicates network is still forwarding packets (Fast Retransmit).\n     * Retransmits missing segment immediately without waiting for timer.\n     * Fast Recovery (Reno): Sets ssthresh = cwnd / 2, sets cwnd = ssthresh + 3 MSS, and resumes linear Congestion Avoidance.',
    keyPoints: [
      'Four phases: Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery.',
      'Slow Start doubles cwnd every RTT until ssthresh.',
      'Congestion Avoidance increases cwnd linearly (+1 MSS per RTT).',
      'Timeout resets cwnd to 1; 3 duplicate ACKs triggers Fast Recovery (halves cwnd).',
      'Governed by AIMD (Additive Increase Multiplicative Decrease) stability.'
    ],
    example: 'At ssthresh = 16: cwnd grows exponentially (1, 2, 4, 8, 16). At 16, it grows linearly (17, 18, 19, 20). 3 duplicate ACKs arrive at 20 -> ssthresh set to 10, cwnd resumes from 10 linearly.',
    diagram: `TCP CONGESTION CONTROL WINDOW EVOLUTION (RENO):
cwnd ^
     |                   /\\ (Packet Loss!)
     |        ssthresh--+  \\       /\\
     |                 /|   \\_____/  \\ (Additive Increase)
     |       (Linear) / |   (Fast Recovery)
     |               /  |
     |    (Exp)    /    |
     |   __..----''     |
     +------------------+--------------------> Time (RTTs)
       [Slow Start]   [Congestion Avoidance]`,
    followUpQuestions: [
      {
        question: 'Why does receiving 3 duplicate ACKs trigger Fast Retransmit?',
        answer: 'Receiving 3 duplicate ACKs proves that subsequent packets are successfully reaching the receiver and generating ACKs, indicating the loss is an isolated dropped packet rather than total network failure.'
      }
    ],
    quickRevision: 'TCP congestion control doubles cwnd in Slow Start up to ssthresh, increases linearly in Congestion Avoidance, and halves window on packet loss (AIMD).',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.21'
    },
    tags: ['congestion-control', 'slow-start', 'aimd', 'fast-retransmit', 'fast-recovery', 'cwnd']
  },
  {
    id: 'ce0518-u4-q22',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'advanced',
    question: 'Draw and explain TCP Header.',
    shortAnswer: 'The TCP header is 20 to 60 bytes long and structures end-to-end data transfer. It contains 16-bit Source/Destination Ports, 32-bit Sequence Number, 32-bit Acknowledgment Number, 4-bit Data Offset, 9 Control Flags (SYN, ACK, FIN, RST, PSH, URG, ECE, CWR, NS), 16-bit Window Size, 16-bit Checksum, and 16-bit Urgent Pointer.',
    detailedAnswer: 'Full Breakdown of All TCP Header Fields:\n1. Source Port (16 bits): Port number of initiating process.\n2. Destination Port (16 bits): Port number of remote listening process.\n3. Sequence Number (32 bits): Byte stream offset of the first data byte in this segment.\n4. Acknowledgment Number (32 bits): Valid if ACK flag is set. Next expected byte sequence number.\n5. Data Offset / Header Length (4 bits): Header size in 32-bit words (value 5 = 20 bytes; value 15 = 60 bytes).\n6. Reserved (3 bits): Must be zero.\n7. Flags (9 bits):\n   - URG: Urgent pointer active\n   - ACK: Acknowledgment active\n   - PSH: Push data immediately to application\n   - RST: Reset / abort connection\n   - SYN: Synchronize initial sequence numbers\n   - FIN: Gracefully terminate transmission\n   - ECE: Explicit Congestion Notification Echo\n   - CWR: Congestion Window Reduced\n   - NS: Nonce Sum (ECN concealment protection)\n8. Window Size (16 bits): Flow control receive buffer capacity (rwnd).\n9. Checksum (16 bits): Mandatory 1s complement checksum.\n10. Urgent Pointer (16 bits): Points to end of urgent data.\n11. Options & Padding (0 - 40 bytes): MSS, Window Scaling, Selective ACKs (SACK).',
    keyPoints: [
      '20-60 bytes in size.',
      'Sequence and ACK numbers are 32 bits.',
      'Window Size is 16 bits (advertised receive buffer).',
      'Flags include SYN, ACK, FIN, RST, PSH, URG.'
    ],
    example: 'A TCP SYN packet: Source Port = 49152, Dest Port = 80, Seq = 1000, Ack = 0, Flags = 0x002 (SYN=1), Window = 65535.',
    diagram: ` 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Source Port          |       Destination Port        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                        Sequence Number                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Acknowledgment Number                      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Data |           |U|A|P|R|S|F|                               |
| Offset| Reserved  |R|C|S|S|Y|I|            Window             |
|       |           |G|K|H|T|N|N|                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|           Checksum            |        Urgent Pointer         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Options                    |    Padding    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+`,
    followUpQuestions: [
      {
        question: 'What is the maximum window size achievable in TCP with Window Scaling?',
        answer: 'The standard 16-bit window field allows up to 64 KB. With the Window Scale option (up to 14 bits), the effective window can scale up to 2^(16 + 14) = 1 Gigabyte!'
      }
    ],
    quickRevision: 'The TCP header is 20-60B with ports, 32-bit sequence/ACK numbers, 9 flags (SYN/ACK/FIN), 16-bit window size, checksum, and urgent pointer.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.22'
    },
    tags: ['tcp-header', 'diagram', 'tcp', 'transport-layer', 'fields']
  },
  {
    id: 'ce0518-u4-q23',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'Draw and explain UDP Header.',
    shortAnswer: 'The User Datagram Protocol (UDP) header is a compact, fixed 8-byte (64-bit) header comprising four 16-bit fields: Source Port, Destination Port, Total Length (header + payload), and Checksum. It has no sequence numbers, flow control, or connection state flags.',
    detailedAnswer: 'UDP Header Architectural Breakdown:\n1. Source Port (16 bits): Port of the transmitting application process (or 0 if not expecting a reply).\n2. Destination Port (16 bits): Port of the destination receiving service (e.g. 53 for DNS, 67 for DHCP, 69 for TFTP, 123 for NTP).\n3. Length (16 bits): Total length of the UDP segment in bytes (minimum 8 bytes for empty datagram, maximum 65,535 bytes).\n4. Checksum (16 bits): Error-detection field calculated over a 12-byte IP pseudo-header, UDP header, and payload. Optional in IPv4 (set to 0x0000 if omitted); mandatory in IPv6.\n\nWhy UDP has No Options Field: Designed for simplicity and speed; any required metadata is placed inside the application payload.',
    keyPoints: [
      'Fixed 8-byte (64-bit) size.',
      '4 fields: Source Port (16b), Destination Port (16b), Length (16b), Checksum (16b).',
      'No sequence numbers or connection state.',
      'Ultra-fast packet generation and low router parsing overhead.'
    ],
    example: 'An NTP time synchronization request: Source Port = 123, Destination Port = 123, Length = 56 bytes, Checksum = 0x9e12.',
    diagram: `UDP HEADER (FIXED 8 BYTES):
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Source Port          |       Destination Port        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|            Length             |           Checksum            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+`,
    followUpQuestions: [
      {
        question: 'What happens if a UDP checksum error is detected by the receiver?',
        answer: 'The corrupted UDP datagram is silently discarded. No error message or retransmission request is generated at the transport layer.'
      }
    ],
    quickRevision: 'The UDP header is 8 bytes containing Source Port, Destination Port, Length, and Checksum.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.23'
    },
    tags: ['udp-header', 'diagram', 'udp', 'transport-layer', 'ports']
  },
  {
    id: 'ce0518-u4-q24',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Difference between leaky bucket and token bucket.',
    shortAnswer: 'Leaky Bucket enforces a strictly rigid, constant output rate regardless of incoming bursts, discarding packets on buffer overflow. Token Bucket generates tokens at a constant rate; packets can consume accumulated tokens to transmit at maximum wire burst speed up to the token capacity, allowing bursty traffic while bounding long-term average rates.',
    detailedAnswer: 'Comparison Between Traffic Shaping Algorithms:\n\n1. Output Transmission Profile:\n   - Leaky Bucket: Output is strictly uniform and constant. It smooths out traffic completely, eliminating all bursts.\n   - Token Bucket: Output can be bursty up to the token capacity C. If tokens have accumulated, burst packets transmit at full link speed.\n\n2. Token Mechanism:\n   - Leaky Bucket: Packets are placed directly into a queue and leak out at rate r.\n   - Token Bucket: Tokens drip into a bucket at rate r. Packets wait in a queue; to transmit a k-byte packet, k tokens are removed from the bucket. If tokens are available, packet transmits immediately.\n\n3. Packet Loss Behavior:\n   - Leaky Bucket: Discards packets when the packet buffer overflows.\n   - Token Bucket: Discards excess tokens when the token bucket overflows, but packets wait in queue.\n\n4. Real-World Combination: Modern network shapers often place a Token Bucket followed by a Leaky Bucket to allow controlled bursts while capping maximum peak rate.',
    keyPoints: [
      'Leaky Bucket: Rigid constant output rate; zero burst tolerance.',
      'Token Bucket: Permits controlled traffic bursts up to token capacity C.',
      'Leaky bucket discards packets on overflow; token bucket discards tokens.',
      'Token bucket bounds average rate = r and max burst size = C.'
    ],
    example: 'A 10 Mbps connection with a 5 MB Token Bucket allows a web browser to download a 5 MB page instantly at full 100 Mbps LAN speed using saved tokens, then throttles to 10 Mbps.',
    diagram: `+-----------------------+--------------------------+---------------------------+
| ATTRIBUTE             | LEAKY BUCKET             | TOKEN BUCKET              |
+-----------------------+--------------------------+---------------------------+
| Output Rate           | Strictly constant        | Allows bursts up to C     |
| Packet Buffer         | Holds raw packets        | Holds tokens (bytes)      |
| Idle Time Effect      | Idle time is wasted      | Idle time accumulates tokens|
| Burst Handling        | Discards burst packets   | Accommodates bursts       |
| Primary Purpose       | Traffic policing / smooth| Traffic shaping           |
+-----------------------+--------------------------+---------------------------+`,
    followUpQuestions: [
      {
        question: 'What is the maximum burst duration S for a token bucket of capacity C, token rate r, and peak link rate M?',
        answer: 'Maximum burst duration S = C / (M - r) seconds.'
      }
    ],
    quickRevision: 'Leaky Bucket enforces a rigid constant rate with zero burst tolerance; Token Bucket allows controlled bursts up to its token capacity.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.24'
    },
    tags: ['leaky-bucket', 'token-bucket', 'traffic-shaping', 'qos', 'congestion-control']
  },
  {
    id: 'ce0518-u4-q25',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Explain with example working of DHCP.',
    shortAnswer: 'Dynamic Host Configuration Protocol (DHCP - RFC 2131) automatically assigns IP addresses, subnet masks, default gateways, and DNS server IPs to network clients. It operates over UDP (Server port 67, Client port 68) using the 4-step DORA process: Discover, Offer, Request, and Acknowledge.',
    detailedAnswer: 'The DHCP DORA Process Step-by-Step:\n\n1. DHCP Discover (Client -> Broadcast):\n   - Newly booted client has no IP (0.0.0.0).\n   - Broadcasts a DHCPDISCOVER packet to destination 255.255.255.255 on UDP port 67.\n   - Contains client MAC address.\n\n2. DHCP Offer (Server -> Client):\n   - DHCP server reserves an available IP from its address pool.\n   - Sends DHCPOFFER packet containing proposed IP, subnet mask, lease duration, default gateway, and DNS servers.\n\n3. DHCP Request (Client -> Broadcast):\n   - Client chooses the offer (if multiple servers responded) and broadcasts a DHCPREQUEST announcing its acceptance.\n   - Broadcasting informs all other DHCP servers to release their reserved offers back to their pools.\n\n4. DHCP Acknowledge / DHCPACK (Server -> Client):\n   - Server commits the lease in its database and sends a DHCPACK packet confirming the lease.\n   - Client configures its network interface and begins communication.\n\nLease Renewal: At 50% of lease time (T1), client sends a unicast DHCPREQUEST to renew; at 87.5% (T2), it broadcasts to find any available DHCP server.',
    keyPoints: [
      'Automates IP, subnet mask, gateway, and DNS configuration.',
      'DORA: Discover -> Offer -> Request -> Acknowledge.',
      'Uses UDP port 67 (server) and port 68 (client).',
      'Lease timers: T1 (50% renewal), T2 (87.5% rebind).'
    ],
    example: 'Smartphone connects to campus Wi-Fi: Discovers DHCP server, receives Offer for 192.168.1.105 (lease 24h), Requests it, receives DHCPACK, and gains Internet access within 1 second.',
    diagram: `DHCP DORA 4-STEP EXCHANGE:
[DHCP Client]                                           [DHCP Server]
 (0.0.0.0:68)                                            (*:67)
      | --- 1. DHCPDISCOVER (Broadcast: 255.255.255.255) ---> |
      | <--- 2. DHCPOFFER (IP: 192.168.1.105, Mask, GW) ----- |
      | --- 3. DHCPREQUEST (Broadcast: "I accept .105") -----> |
      | <--- 4. DHCPACK ("Lease Confirmed for 24 Hours") ---- |`,
    followUpQuestions: [
      {
        question: 'What is a DHCP Relay Agent?',
        answer: 'Routers do not forward broadcasts. A DHCP Relay Agent configured on a router intercepts client DHCP broadcasts on a local subnet and forwards them as unicast packets to a central DHCP server on a remote subnet.'
      }
    ],
    quickRevision: 'DHCP automates IP assignment via the 4-step DORA process (Discover, Offer, Request, Acknowledge) using UDP ports 67/68.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.25'
    },
    tags: ['dhcp', 'dora', 'ip-configuration', 'udp-67-68', 'application-layer']
  },
  {
    id: 'ce0518-u4-q26',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 4: Transport Layer, Application Layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Explain Leaky Bucket algorithm.',
    shortAnswer: 'The Leaky Bucket algorithm shapes bursty network traffic into a uniform, steady stream. Packets enter a fixed-capacity FIFO buffer at variable, bursty rates and are discharged onto the network at a strictly constant rate. If incoming bursts exceed the buffer capacity, newly arriving packets overflow and are discarded.',
    detailedAnswer: 'Detailed Working Mechanism:\n1. Bucket Analogy: Imagine a bucket with a fixed hole at the bottom. Water is poured into the bucket in irregular, violent bursts, but leaks out through the bottom hole at a smooth, constant rate. If water is poured in faster than the bucket can hold, it overflows the rim.\n2. Implementation Details:\n   - Finite queue of size C bytes.\n   - A timer interrupt fires at regular intervals, releasing n bytes onto the network (leak rate r = n / Δt).\n   - Incoming packets are added to the queue if size(queue) + packet_size <= C.\n   - If the queue is full, packet is dropped (traffic policing).\n3. Trade-off: Completely eliminates network jitter and traffic bursts, but causes packet drops on high bursts even when the network has idle capacity.',
    keyPoints: [
      'Enforces a strictly constant output rate.',
      'Smooths out irregular bursty packet arrivals into a constant stream.',
      'Finite FIFO queue capacity C; drops packets on overflow.',
      'Cannot utilize excess idle channel capacity during bursts.'
    ],
    example: 'An ATM or Frame Relay network where an audio stream must be clocked out at exactly 64 kbps regardless of bursty processing spikes in the transmitting software.',
    diagram: `LEAKY BUCKET FLOW:
Variable Bursty Input -> [ FIFO Buffer Capacity C ] -> Constant Leak Rate r -> Smooth Traffic
                               |
                        (Overflow = Drops!)`,
    followUpQuestions: [
      {
        question: 'What is the main drawback of the Leaky Bucket algorithm compared to Token Bucket?',
        answer: 'Leaky Bucket cannot adapt to bursts: even if the network is completely empty, it limits the transmission rate to the constant leak rate, delaying bursty file transfers.'
      }
    ],
    quickRevision: 'The Leaky Bucket algorithm smooths bursty traffic into a constant output rate by buffering packets in a FIFO queue and dropping excess packets on overflow.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.26'
    },
    tags: ['leaky-bucket', 'traffic-shaping', 'qos', 'traffic-policing', 'transport-layer']
  }
];
