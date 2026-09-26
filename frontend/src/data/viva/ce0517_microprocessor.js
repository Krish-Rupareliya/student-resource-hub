// frontend/src/data/viva/ce0517_microprocessor.js
/**
 * Subject 2: CE0517 — Microprocessor and Interfacing (Semester 5)
 * Universal Viva Preparation module demonstration for hardware/embedded engineering courses.
 */

export const CE0517_VIVA = {
  subjectCode: 'CE0517',
  subjectName: 'Microprocessor and Interfacing',
  department: 'CE/IT/CSE',
  semester: 5,
  syllabusOverview: '8085 and 8086 Microprocessor architectures, bus timing diagrams, assembly language programming, memory & I/O interfacing, interrupts, and programmable peripheral controllers (8255 PPI, 8259 PIC, 8254 PIT).',
  hasPracticals: true,
  sections: [
    { id: 'unit-1', name: 'Unit 1: 8085 Microprocessor Architecture & Bus Organization', type: 'theory' },
    { id: 'unit-2', name: 'Unit 2: 8086 Microprocessor Architecture & Memory Segmentation', type: 'theory' },
    { id: 'unit-3', name: 'Unit 3: Assembly Language Programming & Instruction Sets', type: 'theory' },
    { id: 'unit-4', name: 'Unit 4: Interrupts & Programmable Peripheral Interfaces (8255, 8259, 8254)', type: 'theory' },
    { id: 'practicals', name: 'Laboratory Practical Experiments', type: 'practical' }
  ],
  experiments: [
    {
      id: 'mp-exp-1',
      experimentNumber: 1,
      title: '8-bit and 16-bit Addition and Subtraction in 8085 Assembly Language',
      aim: 'To write, execute, and verify an 8085 assembly language program for adding and subtracting two 8-bit and 16-bit hexadecimal numbers with carry flag handling.',
      shortTheory: 'The 8085 is an 8-bit accumulator-based microprocessor. Arithmetic instructions (ADD, SUB, DAD, ADC, SBB) implicitly use the Accumulator (Register A) as one operand and store the result back in Register A, updating the Sign (S), Zero (Z), Auxiliary Carry (AC), Parity (P), and Carry (CY) flags.',
      requiredTools: ['8085 Microprocessor Training Kit or GNU 8085 Simulator', 'Hex Keypad / Assembler'],
      procedure: [
        'Load the first 8-bit number from memory location 2050H into Accumulator using LDA 2050H.',
        'Load the second 8-bit number into Register B using MOV B, M or LXI H, 2051H.',
        'Execute ADD B (adds contents of B to Accumulator).',
        'Store the sum at memory location 2052H using STA 2052H.',
        'Check Carry flag (JC label); if set, store 01H in 2053H, else store 00H.',
        'Execute HLT (76H) to stop execution and inspect memory registers.'
      ],
      expectedOutput: 'Input at 2050H: 95H, 2051H: 8AH. Output at 2052H (Sum): 1FH, Output at 2053H (Carry): 01H (95H + 8AH = 11FH).',
      commonErrors: [
        {
          error: 'Carry flag not recorded in memory',
          cause: 'Overwriting accumulator with carry status without saving the addition sum first.',
          solution: 'Save sum to memory with STA 2052H immediately before performing any MVI A, 00H or INR operations.'
        }
      ],
      questions: [
        {
          id: 'mpexp1-q1',
          question: 'What is the function of the DAD instruction in 8085?',
          answer: 'DAD (Double Addition) adds the 16-bit contents of the specified register pair (BC, DE, or SP) to the HL register pair, storing the 16-bit result in HL. Only the Carry flag is affected.'
        },
        {
          id: 'mpexp1-q2',
          question: 'Why is the Accumulator so critical in 8085 microprocessor programming?',
          answer: 'Register A (Accumulator) is the primary 8-bit working register. All ALU arithmetic, logical operations, I/O instructions (IN, OUT), and data transfers to/from external chips must pass through the Accumulator.'
        }
      ]
    },
    {
      id: 'mp-exp-2',
      experimentNumber: 2,
      title: 'Interfacing Stepper Motor with 8085 / 8086 using 8255 PPI',
      aim: 'To interface a 4-phase unipolar stepper motor to an 8085 microprocessor using the 8255 Programmable Peripheral Interface and rotate it in clockwise and counter-clockwise directions with variable speed.',
      shortTheory: 'A stepper motor converts electrical pulses into discrete mechanical angular movements (steps). The 8255 PPI Port A outputs 4-bit excitation sequences (Full-Step: 09H -> 0CH -> 06H -> 03H) through a ULN2003 Darlington transistor array driver to energize motor coils sequentially.',
      requiredTools: ['8085 Microprocessor Trainer Kit', '8255 PPI Interface Board', '4-Phase Stepper Motor', 'ULN2003 Driver IC', '5V/12V Power Supply'],
      procedure: [
        'Initialize 8255 Control Word Register (CWR) for Mode 0: Port A as output (CW = 80H).',
        'Load initial step excitation code (09H) into Accumulator and output to Port A (OUT PortA_Addr).',
        'Call delay subroutine to regulate rotational speed.',
        'Rotate the excitation pattern right (RRC) for clockwise rotation or left (RLC) for counter-clockwise rotation.',
        'Repeat sequence in an infinite loop to achieve continuous smooth rotation.'
      ],
      expectedOutput: 'Stepper motor rotates smoothly clockwise at controlled step angles (1.8 degrees per step). Adjusting the delay register alters RPM.',
      commonErrors: [
        {
          error: 'Motor vibrates rapidly in place without rotating',
          cause: 'Phase sequence excitation order is incorrect or step delay is too short (pulses faster than motor rotor mechanical inertia).',
          solution: 'Verify coil wire connections (A, B, C, D) and increase the delay loop counter.'
        }
      ],
      questions: [
        {
          id: 'mpexp2-q1',
          question: 'What is the step angle of a 200-step stepper motor?',
          answer: 'Step Angle = 360° / Number of Steps = 360° / 200 = 1.8 degrees per step.'
        }
      ]
    }
  ],
  questions: [
    {
      id: 'ce0517-u1-q1',
      subjectCode: 'CE0517',
      subjectName: 'Microprocessor and Interfacing',
      department: 'CE/IT/CSE',
      semester: 5,
      section: 'Unit 1: 8085 Microprocessor Architecture & Bus Organization',
      category: 'theory',
      difficulty: 'basic',
      question: 'Explain the internal architecture of 8085 microprocessor with its functional blocks.',
      shortAnswer: 'The Intel 8085 is an 8-bit NMOS microprocessor operating at 3 MHz with a 16-bit address bus (64 KB addressable memory). Its primary functional units are: 1. Arithmetic & Logic Unit (ALU), 2. Timing and Control Unit, 3. General-Purpose Register Array (B, C, D, E, H, L), 4. Special Purpose Registers (Accumulator, Flags, PC, SP), and 5. Interrupt & Serial I/O Controller.',
      detailedAnswer: 'Key Functional Units of 8085:\n1. ALU: Performs 8-bit arithmetic (ADD, SUB), logical (ANA, ORA, XRA), and bit-manipulation operations. Contains the temporary register and Accumulator.\n2. Flag Register (F): 5 flip-flops indicating ALU status:\n   - Sign (S), Zero (Z), Auxiliary Carry (AC for BCD), Parity (P - even parity), Carry (CY).\n3. Register Array:\n   - Six 8-bit general purpose registers: B, C, D, E, H, L (can be combined as 16-bit pairs: BC, DE, HL).\n   - HL pair functions as the standard Memory Pointer (M).\n4. Special Purpose Registers:\n   - Program Counter (PC - 16 bits): Holds memory address of the next instruction to be fetched.\n   - Stack Pointer (SP - 16 bits): Holds top memory address of the LIFO stack in RAM.\n   - Instruction Register (IR) & Decoder: Stores fetched opcode and decodes machine cycles.\n5. Multiplexed Bus System:\n   - AD0-AD7: Time-multiplexed Address/Data bus demultiplexed by ALE (Address Latch Enable).\n   - A8-A15: Higher-order unidirectional address bus.',
      keyPoints: [
        '8-bit processor, 16-bit address bus (64 KB memory space).',
        'Clock frequency: 3.072 MHz (crystal frequency = 6.144 MHz, divided by 2).',
        'Five flags: S, Z, AC, P, CY.',
        'Multiplexed lower address/data bus (AD0-AD7) demultiplexed by 74LS373 latch via ALE.',
        'HL register pair acts as the memory pointer register.'
      ],
      example: 'Executing "MOV A, M" uses the 16-bit address in HL pair to fetch data into Accumulator from external RAM.',
      diagram: `8085 BUS DEMULTIPLEXING:
[8085 Microprocessor]
  AD0 - AD7 ====> [74LS373 Latch] ===> Lower Address Bus (A0 - A7)
        |                ^
       ALE -------------+
  AD0 - AD7 ==========================> Bi-directional Data Bus (D0 - D7)
  A8 - A15  ==========================> Higher Address Bus (A8 - A15)`,
      followUpQuestions: [
        {
          question: 'Why is AD0-AD7 multiplexed in 8085?',
          answer: 'To reduce the physical pin count of the IC package to 40 pins. ALE (Address Latch Enable) is pulsed HIGH during T1 state to latch the address into an external 74LS373 chip.'
        }
      ],
      quickRevision: 'The 8085 is an 8-bit processor with a 16-bit address bus (64 KB memory), 5 flags, HL memory pointer, and multiplexed AD0-AD7 bus demultiplexed by ALE.',
      source: {
        type: 'question-bank',
        name: 'Indus University CE0517 Microprocessor Question Bank',
        questionNumber: 'Q.1'
      },
      tags: ['8085', 'architecture', 'ale', 'accumulator', 'flags']
    },
    {
      id: 'ce0517-u2-q1',
      subjectCode: 'CE0517',
      subjectName: 'Microprocessor and Interfacing',
      department: 'CE/IT/CSE',
      semester: 5,
      section: 'Unit 2: 8086 Microprocessor Architecture & Memory Segmentation',
      category: 'theory',
      difficulty: 'intermediate',
      question: 'Explain the Memory Segmentation architecture of 8086 microprocessor and its advantages.',
      shortAnswer: 'The 8086 possesses a 20-bit address bus capable of addressing 1 Megabyte (2^20 bytes) of memory. Memory segmentation partitions this 1 MB physical memory into logical segments of 64 KB each: Code Segment (CS), Data Segment (DS), Stack Segment (SS), and Extra Segment (ES). Physical Address is calculated as: Physical Address = (Segment Register × 10H) + Offset.',
      detailedAnswer: '1. Why Segmentation is Necessary:\n   The 8086 internal registers (IP, SP, BP, SI, DI) are 16 bits wide (addressing max 64 KB), but its external address bus is 20 bits wide (addressing 1 MB). Segmentation bridges this by combining a 16-bit Segment Base with a 16-bit Offset.\n\n2. Four Dedicated Segment Registers (16-bit each):\n   - Code Segment (CS): Contains machine instructions; paired with Instruction Pointer (IP).\n   - Data Segment (DS): Holds program data variables; paired with Source Index (SI) or Displacement.\n   - Stack Segment (SS): Manages LIFO stack; paired with Stack Pointer (SP) and Base Pointer (BP).\n   - Extra Segment (ES): Destination segment for string operations; paired with Destination Index (DI).\n\n3. Physical Address Generation Formula:\n   Physical Address (20 bits) = (Segment Register × 16) + Offset = (Segment Register << 4) + Offset.\n\n4. Advantages of Segmentation:\n   - Relocatable Code: Programs can be loaded anywhere in RAM by updating segment base registers without re-assembling.\n   - Modular Memory Protection: Code, data, and stack are isolated, preventing stack overflows from corrupting executable code.\n   - Concurrent Sharing: Multiple processes can share a single read-only Code Segment while maintaining private Data Segments.',
      keyPoints: [
        '20-bit physical address space (1 MB RAM); segments are 64 KB each.',
        'Formula: Physical Address = (Segment Base × 10H) + Offset.',
        'Four segments: CS:IP (code), DS:SI/BX (data), SS:SP/BP (stack), ES:DI (string).',
        'Enables relocatable code and modular memory protection.'
      ],
      example: 'If CS = 348AH and IP = 4214H:\nShift CS left by 4 bits: 348A0H\nAdd Offset IP:          + 04214H\n--------------------------------\nPhysical Address:         38AB4H',
      diagram: `8086 PHYSICAL ADDRESS CALCULATION:
Segment Register (16 bits): [ 3 4 8 A ]
Append 4 zero bits (x10H):  [ 3 4 8 A 0 ]
Add Offset Register (16b):  + [ 0 4 2 1 4 ]
-------------------------------------------
20-bit Physical Address:    [ 3 8 A B 4 ]`,
      followUpQuestions: [
        {
          question: 'What is the maximum and minimum size of a segment in 8086?',
          answer: 'Maximum segment size is 64 KB (bounded by 16-bit offset: FFFFH); minimum segment size is 16 bytes (1 paragraph).'
        }
      ],
      quickRevision: '8086 memory segmentation divides 1 MB into 64 KB segments; Physical Address = (Segment × 10H) + Offset, providing code relocatability and memory protection.',
      source: {
        type: 'question-bank',
        name: 'Indus University CE0517 Microprocessor Question Bank',
        questionNumber: 'Q.2'
      },
      tags: ['8086', 'segmentation', 'physical-address', 'cs-ip', 'memory-management']
    },
    {
      id: 'ce0517-u4-q1',
      subjectCode: 'CE0517',
      subjectName: 'Microprocessor and Interfacing',
      department: 'CE/IT/CSE',
      semester: 5,
      section: 'Unit 4: Interrupts & Programmable Peripheral Interfaces (8255, 8259, 8254)',
      category: 'theory',
      difficulty: 'intermediate',
      question: 'Compare hardware interrupts of 8085 microprocessor in terms of priority, masking, and vector addresses.',
      shortAnswer: 'The 8085 has 5 hardware interrupts arranged in descending priority: TRAP (highest, non-maskable, vectored at 0024H), RST 7.5 (vectored at 003CH), RST 6.5 (vectored at 0034H), RST 5.5 (vectored at 002CH), and INTR (lowest, maskable, non-vectored). Masking is controlled via EI, DI, and the SIM (Set Interrupt Mask) instruction.',
      detailedAnswer: '8085 Hardware Interrupt Hierarchy & Characteristics:\n\n1. TRAP (RST 4.5):\n   - Priority: 1 (Highest)\n   - Maskability: Non-Maskable (cannot be disabled by DI or SIM instruction).\n   - Triggering: Both Edge-and-Level sensitive (prevents false noise triggers).\n   - Vector Address: 4.5 × 8 = 36 = 0024H.\n   - Purpose: Catastrophic hardware emergencies (power failure, emergency shutdown).\n\n2. RST 7.5:\n   - Priority: 2\n   - Maskability: Maskable via SIM; disabled by DI.\n   - Triggering: Positive Edge-sensitive (latched internally in a flip-flop).\n   - Vector Address: 7.5 × 8 = 60 = 003CH.\n\n3. RST 6.5 & RST 5.5:\n   - Priority: 3 & 4\n   - Maskability: Maskable via SIM; disabled by DI.\n   - Triggering: Level-sensitive (input pin must remain HIGH until acknowledged).\n   - Vector Addresses: RST 6.5 -> 0034H; RST 5.5 -> 002CH.\n\n4. INTR:\n   - Priority: 5 (Lowest)\n   - Maskability: Maskable; disabled by DI.\n   - Triggering: Level-sensitive, Non-vectored.\n   - Operation: When acknowledged via INTA, external hardware (e.g. 8259 PIC) places an RST instruction opcode or CALL address on the data bus.',
      keyPoints: [
        'Priority sequence: TRAP > RST 7.5 > RST 6.5 > RST 5.5 > INTR.',
        'TRAP is Non-Maskable (NMI) and edge+level triggered; vector address = 0024H.',
        'RST 7.5, 6.5, 5.5 are maskable using the SIM instruction.',
        'INTR is non-vectored; requires external opcode placed on data bus during INTA pulse.'
      ],
      example: 'Configuring interrupt masks: MVI A, 0BH followed by SIM enables RST 7.5 and masks RST 6.5 and RST 5.5.',
      diagram: `+------------+----------+--------------+------------------+----------------+
| INTERRUPT  | PRIORITY | MASKABLE?    | TRIGGER TYPE     | VECTOR ADDRESS |
+------------+----------+--------------+------------------+----------------+
| TRAP       | 1 (High) | Non-Maskable | Edge + Level     | 0024H          |
| RST 7.5    | 2        | Maskable     | Rising Edge      | 003CH          |
| RST 6.5    | 3        | Maskable     | High Level       | 0034H          |
| RST 5.5    | 4        | Maskable     | High Level       | 002CH          |
| INTR       | 5 (Low)  | Maskable     | High Level       | Non-vectored   |
+------------+----------+--------------+------------------+----------------+`,
      followUpQuestions: [
        {
          question: 'How do you calculate the vector address for RST n in 8085?',
          answer: 'Vector Address = n × 8, converted into hexadecimal. For RST 7.5: 7.5 × 8 = 60 = 003CH.'
        }
      ],
      quickRevision: '8085 interrupt priority: TRAP (NMI, 0024H) > RST 7.5 (003CH) > RST 6.5 (0034H) > RST 5.5 (002CH) > INTR (non-vectored).',
      source: {
        type: 'question-bank',
        name: 'Indus University CE0517 Microprocessor Question Bank',
        questionNumber: 'Q.3'
      },
      tags: ['8085-interrupts', 'trap', 'rst7.5', 'sim-instruction', 'vector-address']
    }
  ]
};
