// frontend/src/data/viva/ce0522_unit2.js
/**
 * CE0522: Web Technology — Unit 2: CSS3 Styling, Bootstrap & JavaScript / Advanced JavaScript
 * Comprehensive Viva Questions & Solutions
 */

export const CE0522_UNIT2_QUESTIONS = [
  {
    id: 'ce0522-u2-q1',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: CSS3 Styling, Animations, Bootstrap & JavaScript Programming',
    category: 'theory',
    difficulty: 'basic',
    questionNumber: 'Q.1',
    question: 'Explain the CSS Box Model with a neat diagram and discuss box-sizing: border-box vs content-box.',
    shortAnswer: 'The CSS Box Model is the structural foundation of web layout where every HTML element is treated as a rectangular box comprising four concentric layers: Content, Padding, Border, and Margin. Under the default `box-sizing: content-box`, padding and border increase the rendered element width; with `box-sizing: border-box`, padding and border are included inside the specified width, preventing layout breakage.',
    detailedAnswer: '1. Concentric Layers of CSS Box Model:\n   - Content: The central area where text, images, or child elements reside (defined by `width` and `height`).\n   - Padding: The transparent spacing clearing an area between the content and its border. Background colors extend into the padding.\n   - Border: A visible or invisible line enclosing the padding and content (`border-width`, `border-style`, `border-color`).\n   - Margin: The transparent exterior clearance separating the element from surrounding neighboring elements. Margins can collapse vertically.\n\n2. Calculation under `content-box` (Default):\n   - Rendered Total Width = `width` + `padding-left` + `padding-right` + `border-left` + `border-right`\n   - Problem: If width is set to 300px, padding to 20px, and border to 2px, the actual element occupies 344px, causing unexpected overflows and column wrapping.\n\n3. Calculation under `border-box`:\n   - Rendered Total Width = `width` (Padding and Border are subtracted from the interior content box).\n   - Advantage: The element is guaranteed to stay exactly 300px wide. This is universally applied by modern CSS resets (`* { box-sizing: border-box; }`).',
    keyPoints: [
      'Four layers from inside out: Content -> Padding -> Border -> Margin.',
      'Margin collapses vertically between adjacent block elements; padding never collapses.',
      '`box-sizing: content-box` (default) adds padding and border to the specified width.',
      '`box-sizing: border-box` includes padding and border within the specified width.',
      'Universal reset: `*, *::before, *::after { box-sizing: border-box; }`.'
    ],
    example: `/* Box-sizing comparison */
.box1 {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  /* Actual rendered width = 200 + 40 + 10 = 250px */
}
.box2 {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  /* Actual rendered width = exactly 200px */
}`,
    diagram: `+-------------------------------------------------------------+
| MARGIN (Transparent space outside border)                   |
|   +-------------------------------------------------------+ |
|   | BORDER (Visible border stroke)                        | |
|   |   +-------------------------------------------------+ | |
|   |   | PADDING (Space between content and border)      | | |
|   |   |   +-------------------------------------------+ | | |
|   |   |   | CONTENT (Text, Image, Inner HTML)         | | | |
|   |   |   | Width x Height                            | | | |
|   |   |   +-------------------------------------------+ | | |
|   |   +-------------------------------------------------+ | |
|   +-------------------------------------------------------+ |
+-------------------------------------------------------------+`,
    followUpQuestions: [
      {
        question: 'What is Margin Collapsing in CSS?',
        answer: 'When two adjacent vertical margins (top and bottom) meet, they combine into a single margin equal to the larger of the two margins rather than adding together.'
      },
      {
        question: 'Does background-color cover the margin area?',
        answer: 'No. Background color fills the content and padding areas, and stops at the outer edge of the border. Margins are always completely transparent.'
      }
    ],
    quickRevision: 'Box model: Content -> Padding -> Border -> Margin. `box-sizing: border-box` makes width include padding and border for predictable layouts.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 2 Syllabus',
      questionNumber: 'Q.1'
    },
    tags: ['css', 'box-model', 'border-box', 'margin', 'padding']
  },
  {
    id: 'ce0522-u2-q2',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: CSS3 Styling, Animations, Bootstrap & JavaScript Programming',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.2',
    question: 'Explain CSS Specificity rules and how the Cascade decides which styles take precedence.',
    shortAnswer: 'CSS Specificity is the scoring weight algorithm used by the browser to resolve conflicting style rules applied to the same element. It is calculated as a 4-part tuple (Inline, IDs, Classes/Attributes/Pseudo-classes, Elements/Pseudo-elements). The rule with the highest specificity score wins; if scores are identical, the rule declared later in the stylesheet takes precedence.',
    detailedAnswer: '1. Specificity Hierarchy (from highest to lowest weight):\n   - `!important` keyword: Overrides all normal specificity rules (should be used sparingly for utility classes).\n   - Inline styles (`style="..."`): Weight = (1, 0, 0, 0).\n   - ID Selectors (`#header`, `#nav`): Weight = (0, 1, 0, 0).\n   - Class Selectors, Attribute Selectors, Pseudo-Classes (`.btn`, `[type="text"]`, `:hover`): Weight = (0, 0, 1, 0).\n   - Type / Element Selectors and Pseudo-elements (`div`, `p`, `::before`): Weight = (0, 0, 0, 1).\n   - Universal selector (`*`), combinators (`+`, `>`, `~`), and `:where()` contribute (0, 0, 0, 0).\n\n2. The Cascade Decision Process:\n   - Step 1: Importance & Origin (User agent defaults vs User styles vs Author stylesheets vs `!important`).\n   - Step 2: Specificity score comparison.\n   - Step 3: Source Order (if specificity is equal, the last rule in the CSS wins).',
    keyPoints: [
      'Specificity tuple: (Inline, IDs, Classes, Elements).',
      'An ID selector always beats any number of combined class selectors.',
      '`!important` overrides normal specificity but makes CSS hard to maintain.',
      'Equal specificity resolves by source order: last rule declared wins.'
    ],
    example: `/* Element: (0, 0, 0, 1) */
p { color: black; }

/* Class: (0, 0, 1, 0) - WINS over element */
.warning { color: orange; }

/* ID: (0, 1, 0, 0) - WINS over class */
#urgent { color: red; }

/* Inline style on <p id="urgent" class="warning" style="color: blue;">:
   (1, 0, 0, 0) - WINS over ID, color is blue! */`,
    diagram: `SPECIFICITY SCORING LADDER:
+-------------------------------------------------------+
| Inline Styles (style="...")             Score: 1000   |
+-------------------------------------------------------+
| ID Selectors (#my-id)                   Score: 0100   |
+-------------------------------------------------------+
| Classes, Attributes, :hover (.nav, [data]) Score: 0010|
+-------------------------------------------------------+
| Elements & Pseudo-elements (div, h1, ::after) Score: 1|
+-------------------------------------------------------+`,
    followUpQuestions: [
      {
        question: 'What is the specificity of the universal selector (*)?',
        answer: 'Zero (0, 0, 0, 0). It matches all elements but has no specificity weight.'
      },
      {
        question: 'How does the :is() pseudo-class calculate specificity?',
        answer: '`:is()` takes on the specificity of its most specific selector argument.'
      }
    ],
    quickRevision: 'Specificity orders rule importance: Inline (1000) > ID (100) > Class (10) > Element (1). Equal scores tiebreak by source order.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 2 Syllabus',
      questionNumber: 'Q.2'
    },
    tags: ['css-specificity', 'cascade', 'inheritance', 'selectors', 'important']
  },
  {
    id: 'ce0522-u2-q3',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: CSS3 Styling, Animations, Bootstrap & JavaScript Programming',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.3',
    question: 'Explain CSS3 Borders, Backgrounds, Text Effects, and Web Fonts (@font-face).',
    shortAnswer: 'CSS3 enhanced visual styling capabilities without image slicing. It introduced rounded corners (`border-radius`), drop shadows (`box-shadow`), gradient backgrounds (`linear-gradient`), multi-column layouts, text shadows (`text-shadow`), overflow truncation (`text-overflow: ellipsis`), and custom web fonts via the `@font-face` directive.',
    detailedAnswer: '1. CSS3 Borders & Shadows:\n   - `border-radius: 12px;`: Rounds the four corners of an element. Setting `border-radius: 50%` transforms a square into a circle.\n   - `box-shadow: h-offset v-offset blur spread color [inset];`: Casts realistic drop shadows on box containers (e.g., `0 4px 6px rgba(0,0,0,0.1)`).\n\n2. CSS3 Backgrounds & Gradients:\n   - Gradients: Eliminates gradient image slices. `background: linear-gradient(45deg, #4f46e5, #06b6d4);` or `radial-gradient(circle, #fff, #999);`.\n   - `background-size: cover | contain`: Scales background image to fill container while maintaining aspect ratio.\n   - Multiple backgrounds: Allows comma-separated layers on a single element.\n\n3. CSS3 Text Effects:\n   - `text-shadow: 2px 2px 4px rgba(0,0,0,0.5);`: Adds shadows to typography.\n   - `text-overflow: ellipsis;`: Truncates overflowing single-line text with trailing `...` (requires `white-space: nowrap; overflow: hidden;`).\n   - `word-break: break-all;` and `overflow-wrap: break-word;`: Prevents long strings from breaking out of containers.\n\n4. Web Fonts with `@font-face`:\n   - Allows websites to download custom typography (WOFF2, TTF) from servers or Google Fonts instead of relying on local OS fonts.',
    keyPoints: [
      '`border-radius: 50%` creates circular avatars.',
      '`box-shadow` creates depth and elevation (Material Design card effect).',
      '`linear-gradient()` produces smooth transitions between colors natively.',
      '`@font-face` imports custom typography formats (WOFF2, WOFF, TTF).'
    ],
    example: `@font-face {\n  font-family: 'Inter';\n  src: url('/fonts/inter.woff2') format('woff2');\n}\n\n.card {\n  font-family: 'Inter', sans-serif;\n  border-radius: 16px;\n  background: linear-gradient(135deg, #1e293b, #0f172a);\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);\n  color: #fff;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);\n}`,
    diagram: `BOX-SHADOW PARAMETERS:
box-shadow: 5px   10px   15px   2px   rgba(0,0,0,0.3);
             |      |      |     |           |
          X-offset Y-offset Blur Spread    Color`,
    followUpQuestions: [
      {
        question: 'Why is WOFF2 preferred over TTF or EOT for web fonts?',
        answer: 'WOFF2 (Web Open Font Format 2.0) uses Brotli compression, resulting in 30% smaller file sizes than WOFF, dramatically improving page load speed.'
      },
      {
        question: 'What three CSS properties are required for text-overflow: ellipsis to work?',
        answer: '1. `white-space: nowrap;` 2. `overflow: hidden;` 3. `text-overflow: ellipsis;`'
      }
    ],
    quickRevision: 'CSS3 borders (`border-radius`, `box-shadow`), backgrounds (`linear-gradient`), text-effects (`ellipsis`), and `@font-face` modernize web UI.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 2 Syllabus',
      questionNumber: 'Q.3'
    },
    tags: ['css3', 'borders', 'box-shadow', 'gradients', 'font-face']
  },
  {
    id: 'ce0522-u2-q4',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: CSS3 Styling, Animations, Bootstrap & JavaScript Programming',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.4',
    question: 'Explain CSS3 2D & 3D Transformations, Transitions, and @keyframes Animations.',
    shortAnswer: 'CSS3 Transformations alter element geometry (translate, rotate, scale, skew) without disturbing document layout. Transitions smoothly animate property changes between two states over time. Keyframe Animations (`@keyframes`) allow complex multi-step choreographed animations with full timeline control, looping, and delay without requiring JavaScript.',
    detailedAnswer: '1. CSS3 Transformations:\n   - 2D Transforms: `transform: translate(x, y)` (moves element), `rotate(45deg)` (rotates around axis), `scale(1.2)` (zooms element), `skew(10deg)` (tilts geometry).\n   - 3D Transforms: Adds Z-axis depth using `rotateX()`, `rotateY()`, `translate3d(x, y, z)`, and `perspective: 1000px` on parent container.\n   - Hardware Acceleration: Transforms execute on the GPU, avoiding CPU reflows.\n\n2. CSS3 Transitions:\n   Smoothly interpolates property changes between initial and hover/active states.\n   Syntax: `transition: property duration timing-function delay;`\n   Example: `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);`\n   Timing functions: `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`.\n\n3. Keyframe Animations (`@keyframes`):\n   Defines intermediate steps along an animation sequence using percentages (`0%` to `100%`) or `from`/`to`.\n   Animation properties: `animation-name`, `animation-duration`, `animation-timing-function`, `animation-delay`, `animation-iteration-count: infinite`, `animation-direction: alternate`.',
    keyPoints: [
      '`transform` executes on GPU without causing reflow/layout recalculation.',
      'Transitions require a trigger (e.g., `:hover`, class change) to animate between 2 states.',
      '`@keyframes` creates autonomous multi-step animations on page load.',
      '3D transforms require `perspective` set on the parent element.'
    ],
    example: `/* Button Pulse Animation */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); box-shadow: 0 0 15px rgba(99, 102, 241, 0.6); }
  100% { transform: scale(1); }
}

.pulsing-btn {
  animation: pulse 2s infinite ease-in-out;
  transition: background-color 0.3s ease;
}`,
    diagram: `TRANSITION vs KEYFRAME TIMELINE:
Transition:
[State A (Normal)] === (User Hovers / 0.3s duration) ===> [State B (Hovered)]

@keyframes Animation:
0% (Scale 1) ---> 25% (Rotate 10deg) ---> 50% (Scale 1.2) ---> 100% (Scale 1)`,
    followUpQuestions: [
      {
        question: 'Why are transforms and opacity preferred for animations over top, left, or margin?',
        answer: 'Transforms and opacity do not trigger browser Reflow (layout recalculation) or Repaint. They composite directly on the GPU, achieving smooth 60 frames-per-second (FPS) performance.'
      },
      {
        question: 'What does animation-fill-mode: forwards do?',
        answer: 'It retains the style values set by the last keyframe (100%) after the animation finishes, rather than reverting to the original pre-animation styles.'
      }
    ],
    quickRevision: 'Transitions smoothly interpolate state changes; `@keyframes` orchestrate autonomous multi-step animations accelerated on the GPU.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 2 Syllabus',
      questionNumber: 'Q.4'
    },
    tags: ['transforms', 'transitions', 'keyframes', 'animations', 'gpu']
  },
  {
    id: 'ce0522-u2-q5',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: CSS3 Styling, Animations, Bootstrap & JavaScript Programming',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.5',
    question: 'Explain Bootstrap responsive 12-column grid system, breakpoints, and container structure.',
    shortAnswer: 'Bootstrap is a mobile-first responsive CSS framework built on a 12-column flexbox grid system. Its hierarchy follows Container -> Row -> Column (`.container` -> `.row` -> `.col-*`). It provides 6 responsive breakpoint tiers (xs, sm, md, lg, xl, xxl) based on media queries to rearrange layouts seamlessly across smartphones, tablets, laptops, and wide monitors.',
    detailedAnswer: '1. Grid System Architecture:\n   - Containers (`.container`, `.container-fluid`): Centers content and provides horizontal padding. Fluid containers span 100% of viewport width.\n   - Rows (`.row`): Flexbox wrappers that negate container padding with negative margins and contain column elements.\n   - Columns (`.col-*`): Children of rows. The grid is partitioned into 12 virtual columns. Individual column widths must sum up to 12 in a single horizontal row.\n\n2. Responsive Breakpoint Tiers:\n   - Extra Small (`xs`): `< 576px` (e.g., `.col-12`)\n   - Small (`sm`): `≥ 576px` (e.g., `.col-sm-6`)\n   - Medium (`md`): `≥ 768px` (tablets, e.g., `.col-md-4`)\n   - Large (`lg`): `≥ 992px` (laptops/desktops, e.g., `.col-lg-3`)\n   - Extra Large (`xl`): `≥ 1200px` (large desktops)\n   - Extra Extra Large (`xxl`): `≥ 1400px`\n\n3. Mobile-First Logic:\n   Classes apply upward. For example, `.col-md-4` applies to screen widths `≥ 768px` and all larger screens (`lg`, `xl`) unless overridden by a larger breakpoint tier.',
    keyPoints: [
      'Hierarchy: Container -> Row -> Column.',
      'Always 12 columns per row; columns exceeding 12 wrap to the next line.',
      'Mobile-first: Smaller breakpoint classes cascade upward to larger screens.',
      'Breakpoints: xs (<576px), sm (≥576px), md (≥768px), lg (≥992px), xl (≥1200px).'
    ],
    example: `<div class="container">\n  <div class="row">\n    <!-- 12 cols on mobile, 6 cols on tablet, 4 cols on desktop -->\n    <div class="col-12 col-md-6 col-lg-4">Card 1</div>\n    <div class="col-12 col-md-6 col-lg-4">Card 2</div>\n    <div class="col-12 col-md-6 col-lg-4">Card 3</div>\n  </div>\n</div>`,
    diagram: `BOOTSTRAP 12-COLUMN BREAKDOWN:
+-------------------------------------------------------------+
|                     CONTAINER (.container)                  |
| +---------------------------------------------------------+ |
| |                      ROW (.row)                         | |
| | +-----------+ +-----------+ +-----------+ +-----------+ | |
| | | .col-md-3 | | .col-md-3 | | .col-md-3 | | .col-md-3 | | |
| | | (3 cols)  | | (3 cols)  | | (3 cols)  | | (3 cols)  | | |
| | +-----------+ +-----------+ +-----------+ +-----------+ | |
| +---------------------------------------------------------+ |
+-------------------------------------------------------------+`,
    followUpQuestions: [
      {
        question: 'What is the difference between .container and .container-fluid?',
        answer: '`.container` has a fixed max-width that steps at each responsive breakpoint tier. `.container-fluid` always stretches across 100% of the viewport width at all times.'
      },
      {
        question: 'Why must columns (.col-*) be immediate children of rows (.row)?',
        answer: 'Rows have negative left and right margins that perfectly counterbalance the horizontal padding (gutters) of containers and columns.'
      }
    ],
    quickRevision: 'Bootstrap 12-column grid uses Container -> Row -> Column hierarchy with mobile-first breakpoints (sm, md, lg, xl).',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 2 Syllabus',
      questionNumber: 'Q.5'
    },
    tags: ['bootstrap', 'css-framework', 'grid-system', 'responsive-design', 'flexbox']
  },
  {
    id: 'ce0522-u2-q6',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: CSS3 Styling, Animations, Bootstrap & JavaScript Programming',
    category: 'theory',
    difficulty: 'basic',
    questionNumber: 'Q.6',
    question: 'Compare var, let, and const in JavaScript with scope, hoisting, and Temporal Dead Zone.',
    shortAnswer: '`var` is function-scoped, can be re-declared, and is hoisted to the top of its scope initialized with `undefined`. `let` and `const` (ES6) are block-scoped (`{ ... }`), cannot be re-declared in the same scope, and are hoisted into a "Temporal Dead Zone" (TDZ) where accessing them prior to their declaration throws a `ReferenceError`. `const` additionally mandates initialization at declaration and prevents variable reassignment.',
    detailedAnswer: '1. Scoping Differences:\n   - `var`: Function-scoped. If declared inside an `if` block or `for` loop, it leaks outside into the enclosing function.\n   - `let` & `const`: Block-scoped. Constrained to the nearest pair of curly braces `{}`.\n\n2. Hoisting & Temporal Dead Zone (TDZ):\n   - `var` is hoisted and initialized to `undefined`. Accessing it before declaration yields `undefined` (no crash).\n   - `let` and `const` declarations are hoisted into memory, but are not initialized. The time between entering scope and reaching the declaration line is the Temporal Dead Zone (TDZ). Accessing them throws `ReferenceError: Cannot access "x" before initialization`.\n\n3. Re-declaration and Re-assignment:\n   - `var`: Can be re-declared and re-assigned freely.\n   - `let`: Cannot be re-declared in same block, but can be re-assigned.\n   - `const`: Cannot be re-declared, cannot be re-assigned. Must be initialized when declared. Note: properties of `const` objects and arrays can still be mutated.',
    keyPoints: [
      '`var` = function-scoped, hoisted as `undefined`, allows re-declaration.',
      '`let` = block-scoped, in TDZ until declared, allows reassignment.',
      '`const` = block-scoped, immutable reference, requires immediate initialization.',
      'Modern standard: use `const` by default; use `let` when reassignment is required; avoid `var`.'
    ],
    example: `console.log(a); // undefined (hoisted var)
var a = 10;

console.log(b); // ReferenceError: Cannot access 'b' before initialization (TDZ)
let b = 20;

const arr = [1, 2];
arr.push(3); // Allowed (array mutation)
// arr = [4, 5]; // TypeError: Assignment to constant variable`,
    diagram: `VARIABLE LIFECYCLE & TEMPORAL DEAD ZONE:
Entering Scope {
  | <--- TDZ starts for let/const (Accessing variable throws ReferenceError)
  | 
  let x = 42; <--- Declaration reached, variable initialized! (TDZ ends)
  |
  console.log(x); // 42
}`,
    followUpQuestions: [
      {
        question: 'Does const make objects completely immutable (deep freeze)?',
        answer: 'No. `const` only protects the variable identifier binding from being reassigned to a new memory address. Internal object properties can still be modified unless `Object.freeze()` is invoked.'
      },
      {
        question: 'What global property does var create in browser environments?',
        answer: 'Declaring `var x = 5` in global scope creates a property on the global `window` object (`window.x === 5`), whereas `let` and `const` do not pollute the window object.'
      }
    ],
    quickRevision: '`var` is function-scoped; `let` and `const` are block-scoped and live in the Temporal Dead Zone until initialized.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 2 Syllabus',
      questionNumber: 'Q.6'
    },
    tags: ['javascript', 'var', 'let', 'const', 'hoisting', 'tdz']
  },
  {
    id: 'ce0522-u2-q7',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: CSS3 Styling, Animations, Bootstrap & JavaScript Programming',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.7',
    question: 'Explain Event Bubbling vs Event Capturing (Event Trickling) and how to stop propagation.',
    shortAnswer: 'Event Bubbling and Event Capturing are the two phases of DOM Event Propagation. In Event Capturing (Trickling), the event travels downwards from the `window` and `document` down to the target element. In Event Bubbling (default phase), the event triggers on the target element and bubbles upwards to root ancestors. Calling `event.stopPropagation()` halts this propagation immediately.',
    detailedAnswer: '1. The 3 Phases of DOM Event Flow:\n   - Phase 1: Capturing Phase (Trickling): The event starts at `Window` -> `Document` -> `<html>` -> `<body>` -> ancestor nodes down to target element.\n   - Phase 2: Target Phase: The event reaches the actual element clicked.\n   - Phase 3: Bubbling Phase: The event bubbles back upwards from target element -> parent -> `<body>` -> `Document` -> `Window`.\n\n2. `addEventListener()` Syntax:\n   `element.addEventListener(eventType, handlerFunction, useCapture);`\n   - If `useCapture` is `false` (default), the listener triggers in the Bubbling phase.\n   - If `useCapture` is `true`, the listener triggers in the Capturing phase.\n\n3. Controlling Event Behavior:\n   - `event.stopPropagation()`: Stops the event from traveling further up (bubbling) or down (capturing) the DOM tree.\n   - `event.stopImmediatePropagation()`: Stops bubbling AND prevents other listeners attached to the exact same element from executing.\n   - `event.preventDefault()`: Cancels the default browser behavior of the element (e.g., stops a form submit or hyperlink jump) without stopping event propagation.',
    keyPoints: [
      'Capturing = top-down (Window to Target); Bubbling = bottom-up (Target to Window).',
      'Default phase is Bubbling (`useCapture: false`).',
      '`event.stopPropagation()` stops event travel through ancestor nodes.',
      '`event.preventDefault()` disables default action (e.g. following link).',
      'Event Delegation leverages bubbling to handle events on dynamic child elements.'
    ],
    example: `// Event Delegation using bubbling on a dynamic list:
document.getElementById('studentList').addEventListener('click', function(e) {
  if (e.target && e.target.nodeName === 'LI') {
    console.log('Clicked student:', e.target.textContent);
  }
});`,
    diagram: `DOM EVENT PROPAGATION:
        Window
        |    ^
Capturing|    | Bubbling
Phase   |    | Phase
        v    |
      Parent Div
        |    ^
        v    |
    [ Target Button ]`,
    followUpQuestions: [
      {
        question: 'What is Event Delegation and why is it useful?',
        answer: 'Event Delegation attaches a single event listener to a common parent element instead of hundreds of listeners to child nodes, using event bubbling to identify which child was clicked (`event.target`). It saves memory and supports dynamically added elements.'
      },
      {
        question: 'What is the difference between event.target and event.currentTarget?',
        answer: '`event.target` is the actual innermost element that was clicked. `event.currentTarget` is the element to which the event listener was attached.'
      }
    ],
    quickRevision: 'Capturing goes down to target; Bubbling flows up to window. `stopPropagation()` stops travel; `preventDefault()` cancels default action.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 2 Syllabus',
      questionNumber: 'Q.7'
    },
    tags: ['event-bubbling', 'event-capturing', 'propagation', 'event-delegation', 'dom']
  },
  {
    id: 'ce0522-u2-q8',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: CSS3 Styling, Animations, Bootstrap & JavaScript Programming',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.8',
    question: 'How do you create, read, and delete Cookies in JavaScript? What are their security attributes?',
    shortAnswer: 'Cookies are small text strings (max 4 KB) stored by the browser for a domain. In client-side JavaScript, cookies are managed through `document.cookie`. Reading returns all cookies as a single semicolon-delimited string. Writing requires assigning `name=value; expires=...; path=/; SameSite=...`. A cookie is deleted by setting its `expires` date to a past date or `max-age=0`.',
    detailedAnswer: '1. Managing Cookies via `document.cookie`:\n   - Create / Update a Cookie:\n     `document.cookie = "username=Manan; max-age=86400; path=/; SameSite=Lax; Secure";`\n   - Read Cookies:\n     `const allCookies = document.cookie; // "username=Manan; theme=dark"`\n     Must be split by `; ` and parsed to retrieve specific keys.\n   - Delete a Cookie:\n     `document.cookie = "username=; max-age=0; path=/";`\n\n2. Key Cookie Attributes:\n   - `expires` / `max-age`: Specifies cookie lifetime in GMT date format or seconds (`max-age=3600`). Without this, it becomes a Session Cookie deleted when browser closes.\n   - `path`: URL path where cookie is sent (default `/`).\n   - `domain`: Subdomains permitted to access the cookie.\n   - `Secure`: Ensures cookie is transmitted only over encrypted HTTPS connections.\n   - `HttpOnly`: Protects cookie from being accessed by client-side JavaScript (`document.cookie` cannot see it). Set by backend server to defend against XSS token theft.\n   - `SameSite`: Controls Cross-Origin Request Forgery (CSRF) behavior (`Strict`, `Lax`, `None`).',
    keyPoints: [
      'Capacity: max 4 KB per cookie.',
      'Set via `document.cookie = "key=val; max-age=sec; path=/";`.',
      'Delete by setting `max-age=0` or past expiration date.',
      '`HttpOnly` cookies cannot be accessed via JavaScript `document.cookie`.',
      '`SameSite` attribute defends against Cross-Site Request Forgery (CSRF).'
    ],
    example: `// Helper function to set cookie
function setCookie(cname, cvalue, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = \`\${cname}=\${encodeURIComponent(cvalue)};expires=\${d.toUTCString()};path=/;SameSite=Lax\`;
}`,
    diagram: `COOKIE LIFECYCLE & STORAGE:
Client (Browser)                              Server (Backend)
     |                                               |
     | ----- 1. POST /login (Credentials) ---------> |
     |                                               |
     | <---- 2. HTTP 200 (Set-Cookie: session=xyz) - |
     |                                               |
     | (Browser stores cookie in local cookie jar)   |
     |                                               |
     | ----- 3. GET /dashboard (Cookie: session=xyz)>|`,
    followUpQuestions: [
      {
        question: 'Can JavaScript read an HttpOnly cookie?',
        answer: 'No. The browser hides `HttpOnly` cookies from JavaScript `document.cookie` entirely to prevent stolen session IDs via Cross-Site Scripting (XSS).'
      },
      {
        question: 'What is the default expiration of a cookie if expires is omitted?',
        answer: 'It becomes a Session Cookie, which is deleted when the user closes the web browser.'
      }
    ],
    quickRevision: 'Cookies store 4KB of state; manipulated client-side via `document.cookie`, deleted with `max-age=0`, protected by `Secure`, `HttpOnly`, and `SameSite`.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 2 Syllabus',
      questionNumber: 'Q.8'
    },
    tags: ['cookies', 'document-cookie', 'httponly', 'samesite', 'sessions']
  },
  {
    id: 'ce0522-u2-q9',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: CSS3 Styling, Animations, Bootstrap & JavaScript Programming',
    category: 'theory',
    difficulty: 'advanced',
    questionNumber: 'Q.9',
    question: 'Explain JavaScript Prototypal Inheritance, Prototype Chain, and the "this" keyword.',
    shortAnswer: 'JavaScript uses Prototypal Inheritance where every object has an internal link to another object called its prototype (`[[Prototype]]` or `__proto__`). When accessing a property on an object, JavaScript searches the object itself; if not found, it traverses up the Prototype Chain until reaching `null`. The `this` keyword refers to the execution context of the function invocation.',
    detailedAnswer: '1. Prototypal Inheritance Mechanics:\n   - Unlike classical class-based languages (Java, C++), JavaScript objects inherit directly from other objects.\n   - Every function in JavaScript has a `prototype` property. When a function is called with `new`, the newly instantiated object links its `__proto__` to that constructor function\'s prototype.\n   - The top of the prototype chain is `Object.prototype`, whose prototype is `null`.\n\n2. ES6 `class` Syntax:\n   - ES6 introduced the `class` keyword and `extends`, but this is syntactic sugar over prototype chains.\n\n3. The `this` Keyword Resolution Rules:\n   - Default Binding: In a standalone function invocation, `this` refers to `window` (or `undefined` in strict mode).\n   - Implicit Binding: When called as an object method (`obj.method()`), `this` refers to `obj`.\n   - Explicit Binding: Using `.call()`, `.apply()`, or `.bind()` sets `this` explicitly.\n   - `new` Binding: Inside a constructor, `this` refers to the newly created instance.\n   - Arrow Functions: Do NOT have their own `this`. They inherit `this` lexically from their enclosing scope.',
    keyPoints: [
      'JavaScript inheritance is prototypal, not classical.',
      'Prototype chain lookup ends at `Object.prototype.__proto__ === null`.',
      'ES6 classes are syntactic sugar over prototypal inheritance.',
      'Arrow functions have lexical `this` (they do not bind their own `this`).'
    ],
    example: `function Student(name, roll) {
  this.name = name;
  this.roll = roll;
}
Student.prototype.study = function() {
  return \`\${this.name} is studying Web Technology.\`;
};

const s1 = new Student('Manan', 101);
console.log(s1.study()); // Found via prototype chain!`,
    diagram: `PROTOTYPE CHAIN LOOKUP:
[ s1 Instance: { name: 'Manan', roll: 101 } ]
       | (has __proto__)
       v
[ Student.prototype: { study: Function } ]
       | (has __proto__)
       v
[ Object.prototype: { toString, hasOwnProperty } ]
       | (has __proto__)
       v
     null  (End of chain)`,
    followUpQuestions: [
      {
        question: 'What is the difference between .call() and .apply()?',
        answer: '`.call()` accepts function arguments individually as a comma-separated list (`fn.call(ctx, arg1, arg2)`), while `.apply()` accepts arguments as a single array (`fn.apply(ctx, [arg1, arg2])`).'
      },
      {
        question: 'Why do arrow functions make great callback handlers in objects?',
        answer: 'Because arrow functions do not create their own `this` context; they capture `this` from the enclosing object scope, preventing `this` from becoming undefined or pointing to `window`.'
      }
    ],
    quickRevision: 'Objects inherit via prototype chains ending at `null`. `this` is determined by how a function is called; arrow functions inherit `this` lexically.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 2 Syllabus',
      questionNumber: 'Q.9'
    },
    tags: ['javascript', 'prototype', 'prototype-chain', 'this-keyword', 'oop']
  },
  {
    id: 'ce0522-u2-q10',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: CSS3 Styling, Animations, Bootstrap & JavaScript Programming',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.10',
    question: 'Explain JavaScript Error Handling using try, catch, finally, and throw with code.',
    shortAnswer: 'JavaScript handles runtime errors using `try...catch...finally` blocks. Code prone to errors is wrapped in `try`. If an exception occurs, execution jumps immediately to `catch`, passing an `Error` object. Custom errors can be triggered using `throw`. The `finally` block always executes regardless of whether an error occurred, used for cleanup operations.',
    detailedAnswer: '1. Syntax and Mechanics:\n   - `try` block: Encloses code that might produce a runtime error.\n   - `catch (error)` block: Catches the exception, preventing script termination. `error.message` gives description, `error.name` gives error type, `error.stack` gives call stack trace.\n   - `finally` block: Executes unconditionally after try/catch, even if an early `return` was called inside try or catch.\n   - `throw` statement: Throws user-defined exceptions (strings, numbers, or `new Error("message")`).\n\n2. Standard JavaScript Error Types:\n   - `TypeError`: Invoking a non-function, or accessing properties on null/undefined.\n   - `ReferenceError`: Referencing an undeclared variable.\n   - `SyntaxError`: Parsing invalid JavaScript code.\n   - `RangeError`: Number out of acceptable range (e.g. invalid array length or infinite recursion).\n   - `URIError`: Malformed URI string in `decodeURI()`.',
    keyPoints: [
      '`try` monitors code; `catch` handles error without crashing the script.',
      '`finally` block always runs (useful for closing loaders, sockets, or cleaning state).',
      '`throw new Error("msg")` creates standard traceable error objects.',
      'Common runtime errors: `TypeError`, `ReferenceError`, `RangeError`.'
    ],
    example: `function divide(a, b) {
  try {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('Both arguments must be numbers');
    }
    if (b === 0) {
      throw new RangeError('Division by zero is not permitted');
    }
    return a / b;
  } catch (err) {
    console.error(\`[\${err.name}]: \${err.message}\`);
    return null;
  } finally {
    console.log('Calculation attempt finalized.');
  }
}`,
    diagram: `ERROR HANDLING FLOW:
  [ try Block ]
        |
    Does an error occur?
       /      \\
     YES       NO
      |         |
      v         |
[ catch(err) ]  |
      |         |
      +----+----+
           |
           v
   [ finally Block ] (Always executes)
           |
           v
  [ Resume Normal Execution ]`,
    followUpQuestions: [
      {
        question: 'Does try...catch handle asynchronous errors inside setTimeout() or Promises?',
        answer: 'No. Synchronous `try...catch` cannot catch errors thrown inside asynchronous callbacks like `setTimeout` because the try block has already finished executing. Promises require `.catch()` or `async/await` with `try...catch`.'
      },
      {
        question: 'Can a finally block override a return statement from the try block?',
        answer: 'Yes! If the `finally` block returns a value, that return value supersedes any return value from the `try` or `catch` blocks.'
      }
    ],
    quickRevision: '`try` wraps risky code; `catch` captures errors; `throw` triggers custom errors; `finally` always runs for resource cleanup.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 2 Syllabus',
      questionNumber: 'Q.10'
    },
    tags: ['error-handling', 'try-catch', 'exceptions', 'throw', 'runtime-errors']
  },
  {
    id: 'ce0522-u2-q11',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: CSS3 Styling, Animations, Bootstrap & JavaScript Programming',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.11',
    question: 'How do you perform client-side Form Validation using JavaScript and Regular Expressions?',
    shortAnswer: 'JavaScript client-side form validation inspects form input values before submission. It uses DOM methods (`document.getElementById()`, `value.trim()`), event listeners (`onsubmit`, `oninput`), and Regular Expressions (`RegExp.test()`) to verify email syntax, password complexity, phone numbers, and required fields, showing contextual error messages and calling `event.preventDefault()` if validation fails.',
    detailedAnswer: '1. Validation Steps:\n   - Listen for form submit: `form.addEventListener("submit", validateForm);`\n   - Prevent submission if invalid: `event.preventDefault();`\n   - Read and sanitize values: `const email = emailInput.value.trim();`\n   - Test against Regular Expressions:\n     * Email Regex: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/`\n     * Phone Number: `/^[6-9]\\d{9}$/` (10-digit Indian mobile standard)\n     * Strong Password: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/`\n   - Provide visual feedback: Highlight invalid inputs with red borders and show descriptive error spans.\n\n2. Real-time vs Submit Validation:\n   - Real-time validation on `input` or `blur` events gives immediate feedback as the user types.\n   - Submit validation ensures complete form integrity before HTTP transmission.',
    keyPoints: [
      'Client validation prevents unnecessary server round-trips and improves UX.',
      'Always call `event.preventDefault()` to halt submission upon validation failure.',
      'Regular expressions (`/pattern/.test(str)`) validate format strings.',
      'Client validation must ALWAYS be paired with server-side validation.'
    ],
    example: `function validateRegistration(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  const errorBox = document.getElementById('emailError');
  
  if (!emailRegex.test(email)) {
    errorBox.textContent = 'Please provide a valid email address.';
    return false;
  }
  errorBox.textContent = '';
  document.getElementById('regForm').submit();
}`,
    diagram: `FORM VALIDATION WORKFLOW:
[ User clicks Submit ]
          |
          v
[ e.preventDefault() ]
          |
          v
[ Check Inputs via Regex ]
       /       \\
    PASS       FAIL
     |           |
     v           v
[ Submit Form ] [ Display Error Messages & Red Borders ]`,
    followUpQuestions: [
      {
        question: 'What is the purpose of the RegExp.test() method in JavaScript?',
        answer: '`regex.test(string)` tests for a match in the string and returns boolean `true` or `false`.'
      },
      {
        question: 'Why is client-side validation not sufficient for web security?',
        answer: 'Because malicious users can disable JavaScript in their browser, inspect and bypass HTML DOM controls, or send direct crafted HTTP POST requests via tools like cURL or Postman.'
      }
    ],
    quickRevision: 'Validate form inputs using JavaScript regex, DOM elements, and `event.preventDefault()` to catch errors prior to HTTP submission.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 2 Syllabus',
      questionNumber: 'Q.11'
    },
    tags: ['form-validation', 'regex', 'javascript', 'dom', 'ux']
  },
  {
    id: 'ce0522-u2-q12',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 2: CSS3 Styling, Animations, Bootstrap & JavaScript Programming',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.12',
    question: 'Explain JavaScript Animation and Multimedia API control (HTML5 Video & Audio APIs).',
    shortAnswer: 'JavaScript provides rich APIs for programmatic multimedia control and smooth animations. Multimedia elements (`<video>` and `<audio>`) expose methods like `.play()`, `.pause()`, and properties like `.currentTime`, `.volume`, and `.playbackRate`. JavaScript animations are best executed using `window.requestAnimationFrame()` instead of `setInterval()`, syncing frame updates with the browser refresh rate.',
    detailedAnswer: '1. JavaScript HTML5 Media APIs:\n   - Controlling Playback: `video.play()` returns a Promise; `video.pause()` halts playback.\n   - Seeking: `video.currentTime = 30;` seeks to 30 seconds into media.\n   - Volume & Mute: `video.volume = 0.5;` (range 0.0 to 1.0); `video.muted = true;`.\n   - Speed Control: `video.playbackRate = 1.5;` for 1.5x fast-forward.\n   - Media Events: `timeupdate`, `ended`, `waiting`, `canplay`, `volumechange`.\n\n2. JavaScript Animations with `requestAnimationFrame()`:\n   - Why `requestAnimationFrame` is superior to `setInterval`:\n     * Automatically matches monitor refresh rate (typically 60Hz or 120Hz).\n     * Automatically pauses when browser tab is inactive, preserving CPU and battery power.\n     * Prevents screen tearing and frame dropping by syncing with GPU vertical blanking (V-sync).',
    keyPoints: [
      'HTML5 media elements expose `.play()`, `.pause()`, `.currentTime`, `.volume`.',
      'Use `requestAnimationFrame(callback)` instead of `setInterval()` for smooth 60fps animations.',
      '`requestAnimationFrame` pauses automatically in inactive tabs.',
      '`video.play()` returns a Promise that can be rejected if browser autoplay policy blocks audio.'
    ],
    example: `// Programmatic Custom Video Player
const vid = document.getElementById('myVideo');

function togglePlay() {
  if (vid.paused) {
    vid.play();
  } else {
    vid.pause();
  }
}

function skipAhead(seconds) {
  vid.currentTime += seconds;
}`,
    diagram: `ANIMATION LOOP WITH requestAnimationFrame:
+-------------------------------------------------------------+
| function animate() {                                        |
|   updateElementPosition();                                  |
|   requestAnimationFrame(animate); // Synchronized with V-Sync|
| }                                                           |
| requestAnimationFrame(animate);                             |
+-------------------------------------------------------------+`,
    followUpQuestions: [
      {
        question: 'Why does video.play() return a Promise in modern browsers?',
        answer: 'To allow developers to handle playback failures when browser autoplay policies reject playback of unmuted media.'
      },
      {
        question: 'What event fires repeatedly as a video or audio file plays?',
        answer: 'The `timeupdate` event, which is used to update the position of custom playback progress bars.'
      }
    ],
    quickRevision: 'Control media using `.play()`, `.pause()`, `.currentTime`, and create efficient animations with `requestAnimationFrame()`.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 2 Syllabus',
      questionNumber: 'Q.12'
    },
    tags: ['multimedia', 'video-api', 'audio-api', 'requestanimationframe', 'animation']
  }
];
