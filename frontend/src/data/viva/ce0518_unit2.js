// frontend/src/data/viva/ce0518_unit2.js
/**
 * CE0518 Unit 2: Medium Access Sub-layer
 * Indus University End Sem Question Bank
 */

export const CE0518_UNIT2_QUESTIONS = [
  {
    id: 'ce0518-u2-q1',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: Medium Access Sub-layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'Name and categorizes different multiple access protocols.',
    shortAnswer: 'Multiple Access Protocols coordinate access to a shared broadcast channel among multiple competing stations. They are categorized into three primary classes: 1. Random Access Protocols (ALOHA, CSMA, CSMA/CD, CSMA/CA), 2. Controlled Access Protocols (Reservation, Polling, Token Passing), and 3. Channelization Protocols (FDMA, TDMA, CDMA).',
    detailedAnswer: 'When multiple stations share a single broadcast link, an access protocol is required to arbitrate channel ownership and handle collisions:\n\n1. Random Access (Contention) Protocols:\n   - No station is superior; no station controls another.\n   - Stations transmit whenever data is ready (contention).\n   - Collisions may occur and are resolved via backoff.\n   - Examples: Pure ALOHA, Slotted ALOHA, CSMA (1-persistent, Non-persistent, p-persistent), CSMA/CD (Ethernet), CSMA/CA (Wi-Fi).\n\n2. Controlled Access Protocols:\n   - Stations consult one another to determine which station has the right to transmit, completely preventing collisions.\n   - Examples: Reservation (reservation mini-slots), Polling (Primary master polls secondary devices), Token Passing (circulating token ring).\n\n3. Channelization Protocols:\n   - The available channel bandwidth is divided by frequency, time, or orthogonal mathematical codes.\n   - Examples: FDMA (Frequency Division), TDMA (Time Division), CDMA (Code Division Multiple Access using orthogonal Walsh codes).',
    keyPoints: [
      'Random Access: Contention-based, collision prone, excellent for bursty low-load traffic.',
      'Controlled Access: Deterministic, collision free, high efficiency under heavy load.',
      'Channelization: Fixed static allocation by frequency, time, or orthogonal coding.',
      'Ethernet uses CSMA/CD; Wi-Fi uses CSMA/CA; Cellular 3G/4G/5G use CDMA/OFDMA.'
    ],
    example: 'Ethernet LAN workstations use CSMA/CD to transmit packets over copper cables, while cellular cell towers use TDMA/CDMA to divide radio frequencies among multiple mobile callers.',
    diagram: `+-------------------------------------------------------------+
|                  MULTIPLE ACCESS PROTOCOLS                  |
+----------------------+--------------------+-----------------+
| RANDOM ACCESS        | CONTROLLED ACCESS  | CHANNELIZATION  |
+----------------------+--------------------+-----------------+
| - Pure ALOHA         | - Reservation      | - FDMA (Freq)   |
| - Slotted ALOHA      | - Polling          | - TDMA (Time)   |
| - CSMA (1/p/non)     | - Token Passing    | - CDMA (Code)   |
| - CSMA/CD (Ethernet) |                    |                 |
| - CSMA/CA (Wi-Fi)    |                    |                 |
+----------------------+--------------------+-----------------+`,
    followUpQuestions: [
      {
        question: 'Under what network load does Controlled Access outperform Random Access?',
        answer: 'Under high network load, Controlled Access excels because collisions are eliminated and throughput stays near 100%, whereas Random Access suffers from frequent collisions and throughput degradation.'
      }
    ],
    quickRevision: 'Multiple access protocols are split into Random Access (contention), Controlled Access (polling/tokens), and Channelization (FDMA/TDMA/CDMA).',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.1'
    },
    tags: ['mac', 'multiple-access', 'aloha', 'csma', 'fdma', 'tdma', 'cdma']
  },
  {
    id: 'ce0518-u2-q2',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: Medium Access Sub-layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Compare and explain the pure and slotted ALOHA system.',
    shortAnswer: 'Pure ALOHA allows stations to transmit at any continuous point in time, resulting in a vulnerable period of 2 × T_fr and a maximum theoretical throughput of 18.4% (at G=0.5). Slotted ALOHA divides time into discrete synchronized slots equal to T_fr, restricting transmissions to slot boundaries; this halves the vulnerable period to T_fr and doubles maximum throughput to 36.8% (at G=1.0).',
    detailedAnswer: 'Developed at the University of Hawaii for packet radio broadcasting:\n\n1. Pure ALOHA:\n   - Completely uncoordinated: whenever a station has a frame, it transmits immediately.\n   - If any other station transmits during [t - T_fr, t + T_fr], a collision destroys both frames.\n   - Vulnerable time = 2 × T_fr.\n   - Throughput formula: S = G × e^(-2G). Max throughput occurs at G = 0.5: S_max = 1 / (2e) ≈ 0.184 (18.4%).\n\n2. Slotted ALOHA:\n   - Time is sliced into discrete intervals (slots) matching frame duration T_fr.\n   - Stations can only transmit at the start of a clock slot. If a packet arrives mid-slot, the station must wait until the next slot boundary.\n   - Any collision is confined entirely within that single slot; no overlap can spill into adjacent slots.\n   - Vulnerable time = T_fr.\n   - Throughput formula: S = G × e^(-G). Max throughput occurs at G = 1.0: S_max = 1 / e ≈ 0.368 (36.8%).',
    keyPoints: [
      'Pure ALOHA: Transmit anytime; vulnerable time = 2 T_fr; max throughput = 18.4%.',
      'Slotted ALOHA: Transmit at slot boundary; vulnerable time = T_fr; max throughput = 36.8%.',
      'Slotted ALOHA doubles efficiency by eliminating partial frame overlaps.',
      'Trade-off: Slotted ALOHA requires precise global clock synchronization among all stations.'
    ],
    example: 'Satellite uplink channels use Slotted ALOHA where GPS-synchronized clocks align earth stations to transmit exclusively at microsecond slot edges.',
    diagram: `PURE ALOHA (Vulnerable Period = 2 * T_fr):
[Other Frame]------> [Our Frame Starts at t0] <------[Other Frame]
|<- - - - - - - - - - - - - - 2 * T_fr - - - - - - - - - - - - - ->|

SLOTTED ALOHA (Vulnerable Period = T_fr):
Slot 1        | Slot 2 (Collision)  | Slot 3 (Success)
[Frame A]     | [Frame B] [Frame C] | [Frame D]
              |   <--- COLLISION --->| (Clean delivery)`,
    followUpQuestions: [
      {
        question: 'What is the variable G in ALOHA throughput formulas?',
        answer: 'G is the traffic load, defined as the average number of frame transmission attempts generated by all stations during one frame transmission time T_fr.'
      }
    ],
    quickRevision: 'Pure ALOHA transmits anytime (18.4% max throughput, vulnerable time 2T); Slotted ALOHA transmits at slot boundaries (36.8% max throughput, vulnerable time T).',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.2'
    },
    tags: ['pure-aloha', 'slotted-aloha', 'throughput', 'vulnerable-time', 'mac']
  },
  {
    id: 'ce0518-u2-q3',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: Medium Access Sub-layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Explain different CSMA protocols.',
    shortAnswer: 'Carrier Sense Multiple Access (CSMA) follows the "Listen Before Talk" principle. Stations sense the channel before transmitting. The three primary variants differ in behavior when the channel is found busy: 1-Persistent CSMA (transmits immediately with probability 1 once idle), Non-Persistent CSMA (waits a random backoff before re-sensing), and p-Persistent CSMA (transmits with probability p in slotted systems).',
    detailedAnswer: 'CSMA reduces collisions compared to ALOHA by verifying medium state before sending:\n\n1. 1-Persistent CSMA:\n   - Senses medium. If idle, transmits immediately (probability = 1).\n   - If busy, listens continuously until channel becomes idle, then transmits immediately.\n   - Advantage: Zero channel idle delay.\n   - Disadvantage: If two stations were waiting while a third was transmitting, both will detect the channel becoming idle simultaneously and transmit, causing a guaranteed collision.\n\n2. Non-Persistent CSMA:\n   - Senses medium. If idle, transmits immediately.\n   - If busy, does NOT wait continuously. Instead, it backs off for a random period before sensing the medium again.\n   - Advantage: Drastically reduces collisions because stations wake up at different times.\n   - Disadvantage: Wastes channel capacity if the channel becomes idle during the backoff period.\n\n3. p-Persistent CSMA (Used in slotted channels):\n   - Senses medium. If idle, transmits with probability p; with probability (1 - p), it waits for the next time slot.\n   - If next slot is still idle, repeats the p-test. If busy, treats it as a collision and runs backoff algorithm.\n   - Balances low collisions with high channel throughput.',
    keyPoints: [
      '1-Persistent: Continuous sensing; transmits immediately when idle (high collisions on release).',
      'Non-Persistent: Random wait if busy (lowest collisions, higher idle latency).',
      'p-Persistent: Transmits with probability p when idle; optimal balance for slotted channels.',
      'All CSMA protocols are constrained by propagation delay: collisions occur if two stations sense idle before signal propagates.'
    ],
    example: 'In a conference call, 1-persistent is someone waiting for a speaker to finish and immediately speaking (often talking over someone else). Non-persistent is someone waiting a few seconds before trying again.',
    diagram: `CSMA PERSISTENCE COMPARISON:
              [Sense Channel]
                     |
         +-----------+-----------+
         | Idle?                 | Busy?
         v                       v
[1-Persistent]   -> Transmit!    -> Sense continuously until idle, then transmit.
[Non-Persistent] -> Transmit!    -> Wait random timer, re-sense later.
[p-Persistent]   -> With prob p: -> Wait for next slot; repeat test.
                    Transmit!`,
    followUpQuestions: [
      {
        question: 'Why can collisions still happen in CSMA if stations listen before talking?',
        answer: 'Due to propagation delay. If station A starts transmitting at t=0, station B at the opposite end of the wire won\'t detect the carrier until t=T_prop. If B senses at t < T_prop, it thinks the channel is idle and transmits, causing a collision.'
      }
    ],
    quickRevision: 'CSMA listens before talking: 1-persistent sends immediately when idle; non-persistent backs off if busy; p-persistent transmits with probability p.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.3'
    },
    tags: ['csma', '1-persistent', 'non-persistent', 'p-persistent', 'carrier-sense']
  },
  {
    id: 'ce0518-u2-q4',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: Medium Access Sub-layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'What is CSMA/CA?',
    shortAnswer: 'Carrier Sense Multiple Access with Collision Avoidance (CSMA/CA) is a random access protocol used in wireless networks (IEEE 802.11 Wi-Fi). Because wireless transceivers cannot detect collisions while transmitting (due to signal attenuation), CSMA/CA proactively avoids collisions using Interframe Spaces (DIFS/SIFS), random backoff timers, and optional RTS/CTS virtual channel reservation.',
    detailedAnswer: 'Why Collision Detection fails in Wireless:\nIn wired Ethernet, colliding electrical signals double the voltage, which is easy to detect. In wireless networks, signal power falls off with the square of distance (inverse-square law). A transmitter\'s local signal drowns out any weak incoming collided signal (near-far problem), making CSMA/CD impossible.\n\nCSMA/CA Mechanics:\n1. Interframe Spacing: Before transmitting, station senses channel. If idle, it must wait for a DCF Interframe Space (DIFS).\n2. Contention Window & Backoff: After DIFS, station picks a random backoff integer from [0, CW]. It decrements the counter while the channel is idle. If channel becomes busy, timer pauses.\n3. RTS/CTS Handshake (Virtual Carrier Sensing):\n   - Sender transmits short Request to Send (RTS) packet.\n   - Access Point responds with Clear to Send (CTS) packet.\n   - Surrounding stations read the duration field in RTS/CTS and set their Network Allocation Vector (NAV) timer to sleep during the data transfer, solving the Hidden Terminal Problem.\n4. Positive ACK: The receiver must send an explicit ACK after SIFS; if sender gets no ACK, it assumes collision and doubles its contention window.',
    keyPoints: [
      'Used in IEEE 802.11 Wi-Fi because collision detection is physically unfeasible in RF.',
      'DIFS (Distributed IFS) and SIFS (Short IFS) establish priority.',
      'RTS / CTS exchange provides virtual carrier sensing.',
      'NAV (Network Allocation Vector) prevents hidden nodes from transmitting.',
      'Requires explicit MAC acknowledgments for every data frame.'
    ],
    example: 'A laptop at a coffee shop sends an RTS to the Wi-Fi router. The router broadcasts CTS with a duration timer. Another laptop in the corner hears the CTS, sets its NAV timer to wait, and avoids transmitting simultaneously.',
    diagram: `CSMA/CA PROTOCOL SEQUENCE:
Sender:   |--DIFS--| [Backoff] |--RTS--|                    |--DATA FRAME--|
Receiver:                              |--SIFS--|--CTS--|                  |--SIFS--|--ACK--|
Other:    <-------------- NAV (Channel Reserved - Do Not Transmit) ------------->`,
    followUpQuestions: [
      {
        question: 'What is the Hidden Terminal Problem in wireless networks?',
        answer: 'Station A and Station C can both communicate with central Access Point B, but cannot hear each other due to distance or obstacles. If both transmit simultaneously to B, their signals collide at B. RTS/CTS solves this.'
      }
    ],
    quickRevision: 'CSMA/CA avoids collisions in Wi-Fi using DIFS, random backoff, RTS/CTS handshakes, NAV timers, and mandatory ACKs.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.4'
    },
    tags: ['csma-ca', 'wifi', 'rts-cts', 'nav', 'hidden-terminal', 'wireless']
  },
  {
    id: 'ce0518-u2-q6',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: Medium Access Sub-layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Explain Manchester encoding for the bit stream 1001110100.',
    shortAnswer: 'Manchester encoding is a digital bi-phase line coding scheme where every bit duration is split into two equal halves with a mandatory mid-bit transition. In standard IEEE 802.3 Ethernet convention: bit \'1\' is represented by a High-to-Low transition, and bit \'0\' is represented by a Low-to-High transition. For bitstream 1001110100, transitions occur at the center of each bit interval, ensuring continuous clock synchronization.',
    detailedAnswer: 'Principles of Manchester Encoding:\n1. Mandatory Mid-Bit Transition: Every bit period has a voltage transition at the exact center (t = T_b / 2). This serves as both clock synchronization and data signal (self-clocking), eliminating DC component and baseline wander.\n2. Standards:\n   - IEEE 802.3 (Standard Ethernet): Bit 1 = High to Low (HL); Bit 0 = Low to High (LH).\n   - G.E. Thomas Convention: Bit 1 = Low to High (LH); Bit 0 = High to Low (HL).\n\nStep-by-Step Encoding for 1001110100 (IEEE 802.3 standard):\n- Bit 1 (1st bit): High-to-Low (HL)\n- Bit 0 (2nd bit): Low-to-High (LH)\n- Bit 0 (3rd bit): Low-to-High (LH) [Transition at boundary from High to Low to prepare for LH]\n- Bit 1 (4th bit): High-to-Low (HL)\n- Bit 1 (5th bit): High-to-Low (HL) [Transition at boundary from Low to High]\n- Bit 1 (6th bit): High-to-Low (HL)\n- Bit 0 (7th bit): Low-to-High (LH)\n- Bit 1 (8th bit): High-to-Low (HL)\n- Bit 0 (9th bit): Low-to-High (LH)\n- Bit 0 (10th bit): Low-to-High (LH)\n\nBaud Rate: Because there are 2 signal elements per data bit, Baud Rate = 2 × Bit Rate. 10 Mbps Ethernet requires a 20 MHz signaling rate.',
    keyPoints: [
      'Self-clocking bi-phase code: mandatory transition at center of every bit.',
      'IEEE 802.3: \'1\' = High-to-Low; \'0\' = Low-to-High.',
      'Baud rate is twice the bit rate (50% efficiency).',
      'Eliminates DC bias voltage and loss of synchronization on long runs of 0s or 1s.'
    ],
    example: 'Encoding 1001110100 in IEEE 802.3:\nBits:       1    0    0    1    1    1    0    1    0    0\nSignal:    H->L L->H L->H H->L H->L H->L L->H H->L L->H L->H',
    diagram: `MANCHESTER ENCODING WAVEFORM (IEEE 802.3):
Bit:     1      0      0      1      1      1      0      1      0      0
High:  +--+      +--+   +--+  +--+   +--+   +--+      +--+  +--+      +--+
       |  |      |  |   |  |  |  |   |  |   |  |      |  |  |  |      |  |
Low:   +  +---+--+  +---+  +--+  +---+  +---+  +---+--+  +--+  +---+--+  +--
Trans: (H->L) (L->H) (L->H) (H->L) (H->L) (H->L) (L->H) (H->L) (L->H) (L->H)`,
    followUpQuestions: [
      {
        question: 'What is Differential Manchester encoding?',
        answer: 'Differential Manchester retains the mid-bit transition for clocking, but data is encoded by the presence or absence of a transition at the START of the bit interval (transition at start = 0, no transition = 1). Used in Token Ring.'
      }
    ],
    quickRevision: 'Manchester encoding splits each bit with a mandatory center transition (1 = High-to-Low, 0 = Low-to-High in IEEE 802.3); doubles baud rate to ensure clock sync.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.6'
    },
    tags: ['manchester-encoding', 'line-coding', 'physical-layer', 'ethernet', 'self-clocking']
  },
  {
    id: 'ce0518-u2-q7',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: Medium Access Sub-layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'How CSMA/CA differs from CSMA/CD. Explain in brief.',
    shortAnswer: 'CSMA/CD (Collision Detection) is used in wired Ethernet (IEEE 802.3); stations transmit and listen simultaneously, aborting transmission immediately if an electrical voltage collision is detected. CSMA/CA (Collision Avoidance) is used in wireless networks (IEEE 802.11); because wireless nodes cannot detect collisions during transmission, they proactively prevent collisions using DIFS/SIFS intervals, backoff counters, and RTS/CTS handshakes.',
    detailedAnswer: 'Key Architectural Differences:\n1. Operational Medium: CSMA/CD is engineered for guided copper cables (coaxial, twisted pair). CSMA/CA is designed for unguided wireless RF communication.\n2. Strategy: CD detects a collision while transmitting, immediately jams the channel with a 32-bit jam signal, aborts, and backs off. CA works to prevent collisions from occurring in the first place.\n3. Minimum Frame Size: CSMA/CD requires a minimum frame size (64 bytes in Ethernet) to ensure transmission time exceeds round-trip propagation delay (T_trans >= 2 × T_prop). CSMA/CA has no minimum frame constraint.\n4. Acknowledgments: CSMA/CD does not require MAC-layer acknowledgments (absence of collision implies delivery). CSMA/CA mandates an explicit MAC ACK for every uncorrupted data frame.\n5. Channel State Sensing: CSMA/CD relies exclusively on physical voltage sensing. CSMA/CA uses both physical sensing and virtual sensing (NAV timers).',
    keyPoints: [
      'CSMA/CD: Collision Detection (Wired Ethernet 802.3); aborts on collision.',
      'CSMA/CA: Collision Avoidance (Wireless Wi-Fi 802.11); prevents collisions.',
      'CSMA/CD requires minimum frame size (64 bytes); CSMA/CA does not.',
      'CSMA/CD uses Jam signal; CSMA/CA uses RTS/CTS and NAV timers.',
      'CSMA/CA mandates explicit MAC-layer ACKs.'
    ],
    example: 'CSMA/CD is two people in a room speaking; if they start at the same time, both stop speaking immediately. CSMA/CA is raising your hand (RTS) and waiting for the moderator to point at you (CTS) before speaking.',
    diagram: `+----------------------+--------------------------+---------------------------+
| FEATURE              | CSMA/CD (Wired)          | CSMA/CA (Wireless)        |
+----------------------+--------------------------+---------------------------+
| Standard             | IEEE 802.3 (Ethernet)    | IEEE 802.11 (Wi-Fi)       |
| Collision Handling   | Detects and aborts       | Avoids before transmit    |
| Medium Action        | Transmits Jam Signal     | Transmits RTS / CTS       |
| MAC ACKs             | Not required             | Mandatory ACK required    |
| Min Frame Size       | 64 bytes (L >= 2*R*Tp)   | No minimum restriction    |
+----------------------+--------------------------+---------------------------+`,
    followUpQuestions: [
      {
        question: 'Why is CSMA/CD obsolete in modern gigabit switched networks?',
        answer: 'Modern Ethernet operates in full-duplex mode over dedicated switch ports with separate transmit and receive pairs (Rx/Tx). Collisions are physically impossible in full-duplex switched connections.'
      }
    ],
    quickRevision: 'CSMA/CD aborts when collisions are detected on wired links; CSMA/CA proactively prevents collisions in wireless links using RTS/CTS and backoff.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.7'
    },
    tags: ['csma-cd', 'csma-ca', 'ethernet', 'wifi', 'collision-detection']
  },
  {
    id: 'ce0518-u2-q8',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: Medium Access Sub-layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Explain Reservation, Token Passing and POLLING.',
    shortAnswer: 'These are the three major Controlled Access protocols where stations coordinate to eliminate collisions entirely: In Reservation, stations reserve transmission slots in advance using mini-slots. In Polling, a primary master controller polls secondary devices in sequence. In Token Passing, a special permission token circulates around a logical ring; only the token holder is authorized to transmit.',
    detailedAnswer: '1. Reservation Method:\n   - Time is divided into intervals comprising an N-bit Reservation Frame followed by M data slots.\n   - If station k wants to transmit in the upcoming data interval, it sets bit k = 1 in the reservation frame.\n   - Stations read the reservation bits and know the exact order in which they may transmit without collision.\n\n2. Polling (Primary-Secondary Model):\n   - Functions in centralized master-slave networks.\n   - Poll Function: Primary station sends a Poll message to secondary device A: "Do you have data?" If yes, A sends data; if no, A sends NAK, and primary polls B.\n   - Select Function: When primary has data for secondary device C, it sends a Select message to verify C is ready to receive.\n\n3. Token Passing (Distributed Peer Model):\n   - Stations are arranged in a logical ring (Token Ring / FDDI).\n   - A special 3-byte bit pattern called the Token circulates around the ring.\n   - When a station with queued data captures the token, it holds it, changes its state to a data frame, transmits data, and releases the token upon completion or Token Hold Time (THT) expiration.\n   - Extremely predictable and deterministic under heavy network loads.',
    keyPoints: [
      'Controlled access guarantees zero data collisions on shared channels.',
      'Reservation: Pre-announces transmission intentions via mini-slots.',
      'Polling: Centralized controller sends Poll/Select commands to slave terminals.',
      'Token Passing: Decentralized circulation of a permission token in a logical ring.',
      'High overhead at low load; 100% efficient under heavy saturated loads.'
    ],
    example: 'Automated factory floor industrial networks (Profibus, Token Ring) use Token Passing to guarantee deterministic real-time response times for robotic arms.',
    diagram: `CONTROLLED ACCESS MECHANISMS:
[Reservation]:  [Mini-Slots: 1|0|1|0] ==> [Data Slot 1] [Data Slot 3]

[Polling]:      [Primary Controller] --- Poll A? ---> [Device A: NAK]
                [Primary Controller] --- Poll B? ---> [Device B: Data Frame]

[Token Passing]: (Station 1) ---- Token ---> (Station 2 [Transmits!])
                      ^                             |
                      |------- (Station 3) <--------+`,
    followUpQuestions: [
      {
        question: 'What happens if the token is corrupted or lost in a Token Ring network?',
        answer: 'A designated Monitor Station runs a timer. If no token passes within the maximum ring circulation time, the monitor purges the ring and regenerates a fresh token.'
      }
    ],
    quickRevision: 'Controlled access eliminates collisions: Reservation reserves slots in advance; Polling uses a master controller; Token Passing circulates a permission token.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.8'
    },
    tags: ['controlled-access', 'reservation', 'polling', 'token-passing', 'token-ring']
  },
  {
    id: 'ce0518-u2-q9',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: Medium Access Sub-layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Explain Binary back off algorithm.',
    shortAnswer: 'The Truncated Binary Exponential Backoff (BEB) algorithm dynamically calculates the random wait time for transmitting stations after a collision in CSMA/CD (Ethernet). After the k-th collision, the station picks a random integer r from the range [0, 2^k - 1] (capped at k=10) and waits r × Slot Time (51.2 μs in 10 Mbps Ethernet) before re-sensing the channel.',
    detailedAnswer: 'Detailed Working in IEEE 802.3 Ethernet:\n1. On Collision Detection: Station aborts transmission, broadcasts 32-bit jam signal, and increments collision counter k by 1.\n2. Random Range Determination:\n   - Collision 1 (k=1): r ∈ [0, 2^1 - 1] = {0, 1}\n   - Collision 2 (k=2): r ∈ [0, 2^2 - 1] = {0, 1, 2, 3}\n   - Collision 3 (k=3): r ∈ [0, 2^3 - 1] = {0, 1, 2, 3, 4, 5, 6, 7}\n   - Collision 10 (k=10): r ∈ [0, 1023]\n3. Truncation: For collisions between 11 and 15, the exponent is frozen at 10 (range remains [0, 1023]).\n4. Wait Calculation: Backoff delay = r × Slot Time (where Slot Time = 2 × T_prop = 51.2 μs in 10 Mbps Ethernet).\n5. Maximum Retries: If collisions reach k = 16, the algorithm gives up, reports a network failure, and discards the frame.',
    keyPoints: [
      'Dynamically adapts to network congestion: contention window doubles on each collision.',
      'Random range: [0, 2^k - 1] where k = min(collision_count, 10).',
      'Slot time = 51.2 μs (time required to transmit 64 bytes at 10 Mbps).',
      'Aborts transmission and throws error after 16 consecutive collisions.'
    ],
    example: 'Two PCs collide for the 3rd time (k=3). Station A randomly picks r = 2; Station B randomly picks r = 6. Station A waits 2 × 51.2 μs = 102.4 μs, senses the idle channel, and transmits cleanly before Station B wakes up!',
    diagram: `BINARY EXPONENTIAL BACKOFF EXPANSION:
Collision #1:  [0, 1]              (2 slots)
Collision #2:  [0, 1, 2, 3]        (4 slots)
Collision #3:  [0 .. 7]            (8 slots)
Collision #4:  [0 .. 15]           (16 slots)
...
Collision #10: [0 .. 1023]         (1024 slots - Capped!)
Collision #16: GIVES UP & ABORTS!`,
    followUpQuestions: [
      {
        question: 'What is the "Capture Effect" in binary exponential backoff?',
        answer: 'A station that successfully transmits a frame resets its collision counter to k=0. A competing station that recently collided has a larger k and larger backoff window. The successful station can monopolize (capture) the channel.'
      }
    ],
    quickRevision: 'Binary exponential backoff doubles the random wait range [0, 2^k - 1] on each collision up to k=10; drops the frame after 16 failed attempts.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.9'
    },
    tags: ['binary-backoff', 'csma-cd', 'ethernet', 'contention-window', 'beb']
  },
  {
    id: 'ce0518-u2-q10',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: Medium Access Sub-layer',
    category: 'theory',
    difficulty: 'basic',
    question: 'Explain controlled Access protocols.',
    shortAnswer: 'Controlled access protocols eliminate data collisions on shared broadcast channels by enforcing orderly transmission authorization. Stations either take turns via a central master (Polling), negotiate mini-slot time allocations in advance (Reservation), or circulate an authorization token (Token Passing), ensuring zero collision overhead.',
    detailedAnswer: 'In random access systems, collision probabilities rise exponentially with traffic load. Controlled access protocols replace contention with deterministic scheduling:\n\n1. Reservation: Channels use a reservation interval before every transmission round. Stations flag their intention in a mini-slot bitmap. All nodes learn the schedule and wait their designated turn without conflict.\n\n2. Polling: Designed for master-slave network topologies. The primary controller cycles through secondary devices via "Poll" queries. If a secondary has data, it transmits; otherwise, it replies with NAK. Centralized, simple, but vulnerable to single-point-of-failure at the controller.\n\n3. Token Passing: Distributed peer-to-peer ring topology. A 3-byte token frame circulates constantly. Stations without data simply forward the token. A station with data captures the token, transmits its data frame, and releases the token once the frame completes the loop or its Token Hold Time (THT) expires.',
    keyPoints: [
      'No contention, no collisions, no backoff wait times.',
      'High channel efficiency under heavy traffic.',
      'Polling uses a master controller; Token Passing is decentralized peer-to-peer.',
      'Reservation uses pre-transmission reservation mini-slots.'
    ],
    example: 'High-reliability aircraft avionics and industrial robotics bus systems use controlled access protocols to guarantee strict deterministic latency bounds.',
    diagram: `+-------------------------------------------------------------+
|               CONTROLLED ACCESS CLASSIFICATION              |
+-------------------+--------------------+--------------------+
| RESERVATION       | POLLING            | TOKEN PASSING      |
+-------------------+--------------------+--------------------+
| Pre-allocated     | Master/Slave       | Circulating Token  |
| mini-slot bitmap  | Central Controller | Distributed Ring   |
| Zero collisions   | Poll / Select msgs | Token Hold Time    |
+-------------------+--------------------+--------------------+`,
    followUpQuestions: [
      {
        question: 'What is the main drawback of controlled access protocols under low network traffic?',
        answer: 'High polling or token-circulation latency overhead: a station must wait for the token or poll message even when the entire network is completely idle.'
      }
    ],
    quickRevision: 'Controlled access protocols eliminate collisions through deterministic scheduling using reservation, master polling, or token passing.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.10'
    },
    tags: ['controlled-access', 'mac', 'polling', 'reservation', 'token-ring']
  },
  {
    id: 'ce0518-u2-q11',
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: Medium Access Sub-layer',
    category: 'theory',
    difficulty: 'intermediate',
    question: 'Compare static vs dynamic channel allocation.',
    shortAnswer: 'Static channel allocation (FDM/TDM) divides channel capacity permanently into fixed frequency bands or time slots among N users; it provides zero contention but wastes capacity if users are idle. Dynamic channel allocation allocates bandwidth on-demand using packet switching or contention protocols; it achieves high statistical multiplexing efficiency but incurs queuing and contention delays.',
    detailedAnswer: '1. Static Channel Allocation:\n   - Traditional telecom approach (FDMA, TDMA).\n   - Total channel bandwidth C is split among N users into slices of C/N.\n   - If a user has no traffic, their allocated slot/band stays idle (100% wasted).\n   - If user traffic surges, they cannot exceed C/N even if all other N-1 channels are empty.\n   - Mean delay T = 1 / (μC/N - λ/N) = N / (μC - λ), which is N times worse than a single pooled channel!\n\n2. Dynamic Channel Allocation:\n   - Modern computer networking approach (Ethernet, Wi-Fi, IP).\n   - Channel is shared on-demand; stations grab bandwidth when transmitting.\n   - Maximizes statistical multiplexing: bursty computer traffic shares the full link speed C.\n   - Trade-off: Requires contention resolution, queuing, and protocol headers.',
    keyPoints: [
      'Static: Fixed FDM/TDM division; simple, deterministic, but highly wasteful for bursty traffic.',
      'Dynamic: On-demand allocation; statistical multiplexing provides high utilization.',
      'Computer traffic has a peak-to-average ratio of 1000:1, making dynamic allocation essential.',
      'Static delay is N times worse than pooled dynamic channel delay under bursty load.'
    ],
    example: 'Static allocation is reserving a personal highway lane for every car (most lanes sit empty). Dynamic allocation is opening all lanes to everyone with traffic signals and merge lanes.',
    diagram: `STATIC ALLOCATION (FDM):
Channel 1 (User A) [Active Data  ]
Channel 2 (User B) [---- IDLE ---] (Wasted bandwidth!)
Channel 3 (User C) [Active Data  ]

DYNAMIC ALLOCATION (Statistical Multiplexing):
[User A Packet] [User C Packet] [User A Packet] [User B Packet]
(100% of channel used at full wire speed!)`,
    followUpQuestions: [
      {
        question: 'Why is static channel allocation poor for computer network traffic?',
        answer: 'Computer traffic is inherently bursty. A user downloading a file needs full bandwidth for a few seconds, then stays idle for minutes while reading, wasting static allocations.'
      }
    ],
    quickRevision: 'Static allocation divides bandwidth into rigid, wasteful slices (FDM/TDM); dynamic allocation shares full link capacity on-demand via statistical multiplexing.',
    source: {
      type: 'question-bank',
      name: 'Indus University CE0518 End Sem Exam Question Bank',
      questionNumber: 'Q.11'
    },
    tags: ['channel-allocation', 'static-allocation', 'dynamic-allocation', 'fdm', 'tdm', 'statistical-multiplexing']
  }
];
