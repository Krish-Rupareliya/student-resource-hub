// frontend/src/data/viva/ce0522_unit3.js
/**
 * CE0522: Web Technology — Unit 3: AngularJS MVC Architecture, Directives, Filters, Services & Forms
 * Comprehensive Viva Questions & Solutions
 */

export const CE0522_UNIT3_QUESTIONS = [
  {
    id: 'ce0522-u3-q1',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: AngularJS MVC Architecture, Directives, Filters, Services & Forms',
    category: 'theory',
    difficulty: 'basic',
    questionNumber: 'Q.1',
    question: 'What is AngularJS? Explain its core features and advantages for Single Page Applications (SPAs).',
    shortAnswer: 'AngularJS (Angular 1.x) is an open-source, client-side JavaScript MVC/MVVM framework developed by Google for building dynamic Single Page Applications (SPAs). It extends standard HTML markup with custom attributes called Directives, provides two-way data binding, dependency injection, and client-side templating without page reloads.',
    detailedAnswer: '1. What is a Single Page Application (SPA)?\n   In traditional multi-page web applications, every user interaction requires sending a request to the server, which responds with a full HTML page, causing white-screen flicker and slow navigation. In an SPA, the browser loads a single shell HTML file once. Subsequent interactions fetch only JSON data via AJAX/REST, while the client-side JavaScript framework dynamically updates the DOM without reloading the page.\n\n2. Core Features of AngularJS:\n   - Two-Way Data Binding: Automatic synchronization between the Model (JavaScript data) and the View (HTML UI).\n   - Model-View-Controller (MVC) Separation: Clean architectural decoupling of data, business logic, and presentation.\n   - Directives: Extended HTML attributes (e.g., `ng-model`, `ng-repeat`, `ng-show`) that attach special behavior to DOM nodes.\n   - Dependency Injection (DI): Inversion of control where services (e.g., `$http`, `$timeout`) are injected into controllers automatically.\n   - Declarative UI: HTML is used to define the application UI structure, making views readable and expressive.\n   - Integrated Testing: Designed from the ground up for unit testing via Karma and end-to-end testing with Protractor.',
    keyPoints: [
      'Developed by Google; open-source client-side framework.',
      'Powers Single Page Applications (SPAs) with zero full-page reloads.',
      'Core features: Two-way data binding, MVC architecture, Directives, Dependency Injection, and Filters.',
      'Declarative HTML templates rather than imperative DOM manipulation (unlike jQuery).'
    ],
    example: `<!DOCTYPE html>\n<html ng-app>\n<head>\n  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>\n</head>\n<body>\n  <input type="text" ng-model="userName" placeholder="Enter name">\n  <h3>Hello, {{ userName }}!</h3>\n</body>\n</html>`,
    diagram: `TRADITIONAL MULTI-PAGE vs ANGULARJS SPA:
Traditional Web App:
Browser -------- Request Full HTML --------> Web Server
Browser <------- Full HTML Reload (Flicker) - Web Server

AngularJS SPA:
Browser -------- 1. Initial Shell HTML ------> Web Server
Browser -------- 2. Subsequent JSON Data ----> REST API (Fast!)
                (DOM Updated In-Place via $scope)`,
    followUpQuestions: [
      {
        question: 'What is the difference between AngularJS (Angular 1.x) and Angular (Angular 2+)?',
        answer: 'AngularJS is JavaScript-based and uses `$scope` with controller-driven MVC architecture. Angular 2+ is completely rewritten in TypeScript, uses a component-based architecture, reactive RxJS observables, and replaces `$scope` with component classes.'
      },
      {
        question: 'Why does AngularJS use declarative programming?',
        answer: 'Declarative programming describes WHAT the UI should look like (via HTML directives like `ng-repeat`) rather than imperative code detailing HOW to construct and append DOM nodes line by line.'
      }
    ],
    quickRevision: 'AngularJS is Google\'s client-side MVC framework for SPAs featuring two-way data binding, directives, and dependency injection.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 3 Syllabus',
      questionNumber: 'Q.1'
    },
    tags: ['angularjs', 'spa', 'mvc', 'two-way-binding', 'javascript-framework']
  },
  {
    id: 'ce0522-u3-q2',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: AngularJS MVC Architecture, Directives, Filters, Services & Forms',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.2',
    question: 'Explain the MVC (Model-View-Controller) Architecture in AngularJS with a diagram.',
    shortAnswer: 'AngularJS implements the MVC (Model-View-Controller) pattern to separate concerns. The Model represents the raw data/state. The View is the HTML template containing directives and expressions that render the UI. The Controller contains JavaScript business logic and event handlers. The `$scope` object acts as the glue linking Model and View.',
    detailedAnswer: '1. Model:\n   - The data source representing the current state of the application.\n   - In AngularJS, models are plain JavaScript objects, primitives, or arrays attached as properties to the `$scope` object (e.g., `$scope.student = { name: "Manan", gpa: 9.2 };`).\n\n2. View:\n   - The visual presentation layer rendered in the browser DOM.\n   - Constructed using declarative HTML augmented with AngularJS directives (`ng-model`, `ng-repeat`, `ng-click`) and expressions (`{{ student.name }}`).\n   - Reads data from `$scope` and emits user events back to the Controller.\n\n3. Controller:\n   - JavaScript constructor functions that control the flow and business logic of a specific view slice.\n   - Instantiated via `ng-controller="StudentController"`.\n   - Responsible for initializing state on `$scope`, making API calls via injected services (`$http`), and defining event handler functions (`$scope.saveStudent = function() { ... }`).\n\n4. Role of `$scope` (The Glue):\n   - `$scope` is the execution context for expressions and the mediator between Model and View.\n   - Any property attached to `$scope` is automatically accessible inside the View.',
    keyPoints: [
      'Model = JavaScript data properties on `$scope`.',
      'View = HTML template with Angular directives and expressions.',
      'Controller = Business logic functions manipulating `$scope`.',
      '`$scope` is the execution context and bridge between Model and View.'
    ],
    example: `// Controller (Business Logic)
angular.module('app', []).controller('ExamController', function($scope) {
  // Model
  $scope.subject = 'Web Technology';
  $scope.score = 95;
  
  // Controller Action
  $scope.checkResult = function() {
    return $scope.score >= 40 ? 'Passed' : 'Failed';
  };
});

<!-- View (HTML Template) -->
<div ng-controller="ExamController">
  <h2>Subject: {{ subject }}</h2>
  <p>Result: {{ checkResult() }}</p>
</div>`,
    diagram: `ANGULARJS MVC ARCHITECTURE:
        +----------------------------------------+
        |             CONTROLLER                 |
        |  (Business Logic & Methods in JS)      |
        +-------------------+--------------------+
                            |
                     Manipulates
                            |
                            v
+------------------+     $scope     +------------------+
|      MODEL       |<=============> |       VIEW       |
| (JS Data Objects)|    (The Glue)  | (HTML DOM + UI)  |
+------------------+                +------------------+
         ^                                   |
         |======== User Edits Input =========|
               (Two-Way Data Binding)`,
    followUpQuestions: [
      {
        question: 'What is the controller-as syntax in AngularJS?',
        answer: 'Instead of injecting `$scope`, `ng-controller="ExamController as vm"` binds the controller instance directly to `vm` (view model), making nested controller properties cleaner and avoiding scope inheritance confusion.'
      },
      {
        question: 'Should you manipulate the DOM directly inside an AngularJS Controller?',
        answer: 'Never! Direct DOM manipulation (like jQuery `$("#id")`) violates MVC separation. In AngularJS, DOM manipulation must only occur inside custom Directives.'
      }
    ],
    quickRevision: 'AngularJS MVC separates data (Model on `$scope`), presentation (HTML View), and logic (Controller), glued together by `$scope`.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 3 Syllabus',
      questionNumber: 'Q.2'
    },
    tags: ['mvc', 'angularjs', 'scope', 'controller', 'architecture']
  },
  {
    id: 'ce0522-u3-q3',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: AngularJS MVC Architecture, Directives, Filters, Services & Forms',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.3',
    question: 'Explain Two-Way Data Binding in AngularJS and how the $digest cycle and dirty checking work.',
    shortAnswer: 'Two-Way Data Binding ensures that any change in the Model immediately updates the View, and any user input change in the View immediately updates the Model. AngularJS achieves this through Dirty Checking during the `$digest` cycle, where it loops through registered `$watch` expressions to detect if values have changed without relying on object getters/setters.',
    detailedAnswer: '1. Two-Way Data Binding Concept:\n   - View-to-Model: When a user types into an `<input ng-model="user.name">`, AngularJS updates the `$scope.user.name` property in JavaScript memory immediately.\n   - Model-to-View: When an asynchronous API response or timer alters `$scope.user.name`, the rendered HTML `{{ user.name }}` automatically repaints.\n\n2. How Dirty Checking & the `$digest` Cycle Work:\n   - `$watch` List: Whenever an expression `{{ expr }}` or directive `ng-model` is evaluated in the template, AngularJS registers a watcher in the current scope\'s `$$watchers` array.\n   - Triggering the Cycle: Native Angular events (like `ng-click`, `$http`, `$timeout`) automatically trigger `$scope.$apply()`, which kicks off `$rootScope.$digest()`.\n   - Dirty Checking Loop: The digest cycle runs through every watcher in the scope tree and compares its current value against its previous value.\n   - Re-evaluating: If a watcher\'s value changed (it is "dirty"), its listener is executed. The digest loop runs repeatedly (up to 10 iterations) until all watchers stabilize (a "clean" state).\n   - TTL Exceeded: If watchers continue changing values circularly past 10 iterations, Angular aborts with `10 $digest() iterations reached. Aborting!` to prevent infinite loops.',
    keyPoints: [
      'Two-way data binding connects UI controls to JavaScript models via `ng-model`.',
      'Dirty Checking compares current vs previous values across registered `$watch` listeners.',
      '`$digest` cycle loops until no models change (max 10 iterations TTL).',
      'Third-party asynchronous callbacks (like vanilla `setTimeout`) require wrapping in `$scope.$apply()` to trigger the digest cycle.'
    ],
    example: `<div ng-app="" ng-init="price=100; quantity=2">\n  Price: <input type="number" ng-model="price">\n  Quantity: <input type="number" ng-model="quantity">\n  <h3>Total Bill: {{ price * quantity }}</h3>\n</div>`,
    diagram: `THE $DIGEST CYCLE & DIRTY CHECKING:
User Interaction / $http Event
           |
           v
    $scope.$apply()
           |
           v
+-------------------------------+
|     $digest() Loop Begins     |
|   Iterate through $$watchers   |<----+
|   Is currentVal !== oldVal?   |     | (Re-run if dirty)
|    - Yes: Update DOM (Dirty)  +-----+
|    - No:  All Stable (Clean)  |
+---------------+---------------+
                |
                v
       Browser Paints DOM`,
    followUpQuestions: [
      {
        question: 'Why do vanilla JavaScript setTimeout or DOM event callbacks fail to update AngularJS views?',
        answer: 'Because vanilla callbacks execute outside the AngularJS context and do not trigger `$scope.$apply()`. The developer must use `$timeout` or call `$scope.$apply()` manually.'
      },
      {
        question: 'What is a major performance bottleneck of AngularJS dirty checking?',
        answer: 'Having too many watchers (> 2,000 watchers on a single page) causes the digest cycle to take longer than 16ms, causing UI lag and dropped animation frames.'
      }
    ],
    quickRevision: 'Two-way binding synchronizes Model and View; the `$digest` cycle uses dirty checking over registered watchers to detect state changes.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 3 Syllabus',
      questionNumber: 'Q.3'
    },
    tags: ['data-binding', 'digest-cycle', 'dirty-checking', 'watchers', 'angularjs']
  },
  {
    id: 'ce0522-u3-q4',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: AngularJS MVC Architecture, Directives, Filters, Services & Forms',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.4',
    question: 'Explain Core AngularJS Directives (ng-app, ng-model, ng-bind, ng-repeat, ng-if vs ng-show).',
    shortAnswer: 'Directives are markers on DOM elements that tell AngularJS HTML compiler (`$compile`) to attach specified behaviors or transform the DOM. Key built-in directives include `ng-app` (bootstraps the app), `ng-model` (binds form inputs), `ng-bind` (replaces inner text), `ng-repeat` (loops collections), `ng-if` (conditionally adds/removes elements from DOM), and `ng-show`/`ng-hide` (toggles CSS `display`).',
    detailedAnswer: '1. Primary AngularJS Built-in Directives:\n   - `ng-app`: Defines the root element of an AngularJS application and bootstraps the framework.\n   - `ng-model`: Binds the value of HTML form controls (`<input>`, `<select>`, `<textarea>`) to a property on `$scope`, providing two-way data binding and validation states.\n   - `ng-bind`: Replaces the text content of a DOM element with the value of an expression. Prevents Flash of Unrendered Expressions (`{{ expr }}`) while the page loads.\n   - `ng-init`: Initializes scope variables directly inside the template markup (recommended mainly for demos/aliasing).\n   - `ng-click`: Executes an expression or controller method upon mouse click.\n\n2. `ng-if` vs `ng-show` / `ng-hide` (Critical Distinction):\n   - `ng-show` / `ng-hide`: Toggles visibility using CSS `display: none !important;`. The element remains in the DOM tree, and its watchers remain active in the `$digest` cycle.\n   - `ng-if`: Physically removes the element and its child nodes from the DOM tree when condition is false; recreates and reinserts them when true. Destroys and cleans up internal watchers, saving memory and CPU.',
    keyPoints: [
      '`ng-app` initializes the Angular application.',
      '`ng-model` provides two-way binding on form controls.',
      '`ng-bind` avoids the `{{ expression }}` flash during slow network loads.',
      '`ng-if` creates/destroys DOM nodes; `ng-show` merely toggles CSS `display: none`.',
      '`ng-repeat` repeats an HTML template for each item in an array.'
    ],
    example: `<div ng-app="storeApp" ng-controller="StoreCtrl">\n  <!-- ng-repeat with track by -->\n  <ul>\n    <li ng-repeat="item in products track by item.id">\n      {{ item.name }} - <span ng-show="item.inStock">Available</span>\n      <button ng-if="item.inStock" ng-click="buy(item)">Purchase</button>\n    </li>\n  </ul>\n</div>`,
    diagram: `ng-if vs ng-show COMPARISON:
Condition is FALSE:
+--------------------------------------------------------------+
| ng-show="false"  ===> Element remains in DOM (<div style="display:none">)
| ng-if="false"    ===> Element is completely REMOVED from DOM (<!-- ngIf -->)
+--------------------------------------------------------------+`,
    followUpQuestions: [
      {
        question: 'Why should you use "track by" in ng-repeat?',
        answer: 'By default, `ng-repeat` identifies items by object identity (`$$hashKey`). When the array updates, it destroys and re-renders all DOM nodes. `track by item.id` associates DOM nodes with unique record IDs, re-rendering only modified elements and drastically boosting performance.'
      },
      {
        question: 'What special variables does ng-repeat provide inside its loop template?',
        answer: '`$index` (zero-based index), `$first` (boolean), `$middle` (boolean), `$last` (boolean), `$even` (boolean), and `$odd` (boolean).'
      }
    ],
    quickRevision: 'Directives extend HTML: `ng-app` bootstraps, `ng-model` binds, `ng-repeat` loops, `ng-if` removes from DOM, `ng-show` hides via CSS.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 3 Syllabus',
      questionNumber: 'Q.4'
    },
    tags: ['directives', 'ng-repeat', 'ng-if', 'ng-show', 'ng-model']
  },
  {
    id: 'ce0522-u3-q5',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: AngularJS MVC Architecture, Directives, Filters, Services & Forms',
    category: 'theory',
    difficulty: 'basic',
    questionNumber: 'Q.5',
    question: 'What are AngularJS Expressions? How do they differ from JavaScript expressions?',
    shortAnswer: 'AngularJS expressions are JavaScript-like code snippets written inside double curly braces: `{{ expression }}`. They resolve against the `$scope` object. Unlike standard JavaScript expressions, Angular expressions are forgiving of `null` and `undefined` (printing empty strings instead of throwing ReferenceErrors), do not support control flow (loops, if/else, throw), and can use Filters via the pipe character (`|`).',
    detailedAnswer: '1. Expression Characteristics:\n   - Evaluated by the Angular `$parse` service against the current `$scope` context.\n   - Used for rendering values, simple arithmetic, string concatenation, and object lookups (e.g., `{{ user.firstName + " " + user.lastName }}`).\n\n2. Key Differences between Angular Expressions and JavaScript Expressions:\n   - Context: JS expressions evaluate against the global `window` object; Angular expressions evaluate against the local `$scope` object.\n   - Forgiving of Null/Undefined: In JavaScript, referencing `a.b.c` when `a` is undefined throws a `TypeError`. In Angular expressions, `{{ a.b.c }}` safely evaluates to empty text without any error.\n   - No Control Flow: Angular expressions cannot contain `if-else` statements, `for` loops, `while` loops, or `throw` statements.\n   - Pipe Filters: Angular expressions support pipe filters (`{{ amount | currency }}`), which does not exist in standard JavaScript syntax.\n   - No Comma Operator or Bitwise Shifts.',
    keyPoints: [
      'Written inside `{{ ... }}` and evaluated against `$scope`.',
      'Forgiving: `null` and `undefined` produce blank strings, not runtime exceptions.',
      'No control flow statements (`if`, `for`, `while`) are permitted.',
      'Can be chained with filters using the pipe operator `|`.'
    ],
    example: `<!-- Arithmetic -->\n<p>Cost: {{ 45 * 2 }}</p>\n\n<!-- Safe property access -->\n<p>User: {{ student.profile.bio }}</p> <!-- No crash if profile is null! -->\n\n<!-- Using filters -->\n<p>Enrolled Date: {{ admissionDate | date:'mediumDate' }}</p>`,
    diagram: `EXPRESSION EVALUATION:
Template: {{ price * quantity | currency:"₹" }}
                    |
              Angular $parse
                    |
      Evaluates $scope.price * $scope.quantity
                    |
              Passes to Currency Filter
                    |
Output rendered in DOM: ₹ 500.00`,
    followUpQuestions: [
      {
        question: 'Can you call a function inside an AngularJS expression?',
        answer: 'Yes, e.g., `{{ calculateTotal() }}`. However, it will be executed on every single `$digest` cycle, which can severely harm rendering performance if the function performs complex computations.'
      },
      {
        question: 'How do you avoid displaying raw {{ expression }} braces before Angular loads on slow connections?',
        answer: 'Use the `ng-cloak` directive (with corresponding CSS rule `[ng-cloak] { display: none !important; }`) or replace expressions with the `ng-bind` directive.'
      }
    ],
    quickRevision: 'Angular expressions `{{ expr }}` evaluate against `$scope`, tolerate null/undefined gracefully, support filter pipes, and forbid loops.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 3 Syllabus',
      questionNumber: 'Q.5'
    },
    tags: ['expressions', 'syntax', 'scope', 'parse', 'ng-cloak']
  },
  {
    id: 'ce0522-u3-q6',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: AngularJS MVC Architecture, Directives, Filters, Services & Forms',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.6',
    question: 'Explain AngularJS Filters with built-in examples and show how to write a custom filter.',
    shortAnswer: 'Filters in AngularJS format data for display in the View without modifying the underlying Model data. They are appended to expressions or directives using the pipe symbol (`|`). Built-in filters include `currency`, `date`, `filter` (search), `json`, `limitTo`, `lowercase`, `uppercase`, and `orderBy`. Custom filters are created using `angular.module().filter()`.',
    detailedAnswer: '1. Built-in Filters:\n   - `currency`: Formats numbers as currency (e.g., `{{ price | currency:"$" }}`).\n   - `date`: Formats timestamp integers or Date objects (e.g., `{{ today | date:\'yyyy-MM-dd\' }}`).\n   - `uppercase` / `lowercase`: Transforms string case.\n   - `number`: Formats number with commas and decimal places (e.g., `{{ val | number:2 }}`).\n   - `orderBy`: Sorts arrays by property name (e.g., `ng-repeat="p in products | orderBy:\'price\'"`).\n   - `filter`: Substring search matching elements in an array.\n   - `limitTo`: Limits array or string length.\n\n2. Chaining Filters:\n   Filters can be chained together sequentially:\n   `{{ product.price | currency | lowercase }}`\n\n3. Creating Custom Filters:\n   A custom filter is a factory function returning a worker function that accepts input and optional arguments, returning the transformed output.',
    keyPoints: [
      'Filters format data for UI presentation without altering the raw data in `$scope`.',
      'Applied using pipe operator: `{{ expression | filterName:argument }}`.',
      'Built-in filters: `currency`, `date`, `uppercase`, `lowercase`, `orderBy`, `filter`, `limitTo`.',
      'Custom filters return a function with `(input, ...args)` returning transformed data.'
    ],
    example: `// Custom Filter: Truncate string with ellipsis
angular.module('app', []).filter('truncate', function() {
  return function(input, limit) {
    if (!input) return '';
    limit = limit || 20;
    return input.length > limit ? input.substring(0, limit) + '...' : input;
  };
});

<!-- Usage in HTML View -->
<p>{{ longDescription | truncate:30 }}</p>`,
    diagram: `FILTER PIPELINE:
Raw Data ($scope.fee = 45000)
             |
             v
Pipe Symbol  |
             v
Filter: currency:"₹":2
             |
             v
Formatted Output on Screen: "₹45,000.00"`,
    followUpQuestions: [
      {
        question: 'Can filters be injected and used inside an AngularJS Controller?',
        answer: 'Yes! By injecting `$filter` into the controller, you can execute any filter programmatically: `const formatted = $filter("currency")(100, "$");`'
      },
      {
        question: 'How do you sort an ng-repeat list in descending order using orderBy?',
        answer: 'Prefix the property name with a minus sign or pass boolean `true` as the second argument: `orderBy:"-price"` or `orderBy:"price":true`.'
      }
    ],
    quickRevision: 'Filters format output with the pipe `|` symbol (e.g., `currency`, `date`, `orderBy`) without modifying underlying model data.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 3 Syllabus',
      questionNumber: 'Q.6'
    },
    tags: ['filters', 'custom-filter', 'pipe', 'formatting', 'angularjs']
  },
  {
    id: 'ce0522-u3-q7',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: AngularJS MVC Architecture, Directives, Filters, Services & Forms',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.7',
    question: 'How does Form Validation work in AngularJS? Explain form states and validation classes.',
    shortAnswer: 'AngularJS provides rich client-side form validation by tracking the state of `<form>` elements and input controls. Form controls are monitored via properties (`$pristine`, `$dirty`, `$valid`, `$invalid`, `$error`, `$touched`). AngularJS automatically adds corresponding CSS classes (`ng-valid`, `ng-invalid`, `ng-dirty`, `ng-touched`), enabling instant visual feedback without writing manual DOM manipulation code.',
    detailedAnswer: '1. Form and Input State Properties:\n   - `$pristine`: `true` if user has not yet interacted with or altered the form/field.\n   - `$dirty`: `true` as soon as user modifies the field value.\n   - `$touched`: `true` if field has lost keyboard focus (`blur` event).\n   - `$valid`: `true` if all validation rules are met.\n   - `$invalid`: `true` if at least one validation rule fails.\n   - `$error`: An object hash containing all failed validation rules (e.g., `form.email.$error.required`, `form.email.$error.email`).\n\n2. Automatic CSS Classes Applied to Elements:\n   - `.ng-valid` vs `.ng-invalid`: Added based on validity.\n   - `.ng-pristine` vs `.ng-dirty`: Added based on interaction.\n   - `.ng-touched` vs `.ng-untouched`: Added based on focus.\n\n3. Standard Validation Directives:\n   `required`, `ng-minlength="5"`, `ng-maxlength="20"`, `ng-pattern="/^[0-9]{10}$/"`, and `type="email"`.',
    keyPoints: [
      'Forms require `name="myForm"` and `novalidate` on the `<form>` tag.',
      'Input controls must use `ng-model` and a unique `name`.',
      'States: `$pristine`, `$dirty`, `$valid`, `$invalid`, `$touched`, `$error`.',
      'CSS classes (`.ng-invalid.ng-touched { border-color: red; }`) style validation states.'
    ],
    example: `<form name="regForm" ng-submit="submitForm()" novalidate>\n  <label>Email:</label>\n  <input type="email" name="userEmail" ng-model="email" required>\n  <span style="color:red" ng-show="regForm.userEmail.$dirty && regForm.userEmail.$invalid">\n    <span ng-show="regForm.userEmail.$error.required">Email is required.</span>\n    <span ng-show="regForm.userEmail.$error.email">Invalid email address.</span>\n  </span>\n  <button type="submit" ng-disabled="regForm.$invalid">Register</button>\n</form>`,
    diagram: `ANGULARJS FORM LIFECYCLE:
Page Loads:
Input State: $pristine: true,  $dirty: false, $valid: false, $untouched: true
Classes:     ng-pristine ng-invalid ng-untouched

User Types Invalid Character:
Input State: $pristine: false, $dirty: true,  $valid: false, $touched: true
Classes:     ng-dirty ng-invalid ng-touched (Borders turn Red!)

User Types Valid Format:
Input State: $pristine: false, $dirty: true,  $valid: true,  $touched: true
Classes:     ng-dirty ng-valid ng-touched (Borders turn Green! Submit Button Enables)`,
    followUpQuestions: [
      {
        question: 'Why should novalidate be placed on an AngularJS form tag?',
        answer: 'To disable the browser\'s default native HTML5 popup validation bubbles so that AngularJS custom error messages and CSS classes take full control.'
      },
      {
        question: 'How do you disable the submit button until the form is completely valid?',
        answer: 'By attaching `ng-disabled="myForm.$invalid"` to the `<button type="submit">` element.'
      }
    ],
    quickRevision: 'AngularJS tracks form states ($valid, $invalid, $dirty, $pristine, $touched) and injects CSS classes (ng-valid, ng-invalid) for validation.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 3 Syllabus',
      questionNumber: 'Q.7'
    },
    tags: ['forms', 'form-validation', 'ng-model', 'angularjs', 'css-states']
  },
  {
    id: 'ce0522-u3-q8',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: AngularJS MVC Architecture, Directives, Filters, Services & Forms',
    category: 'theory',
    difficulty: 'advanced',
    questionNumber: 'Q.8',
    question: 'Explain AJAX in AngularJS using the $http service and handling Promises.',
    shortAnswer: 'The `$http` service is a core AngularJS built-in service that facilitates communication with remote HTTP servers via XMLHttpRequest or JSONP. It returns a JavaScript Promise (`.then()`, `.catch()`). Because `$http` integrates directly with the AngularJS lifecycle, incoming HTTP responses automatically trigger the `$digest` cycle, updating the UI immediately without manual intervention.',
    detailedAnswer: '1. The `$http` Service Architecture:\n   - Injected into controllers or services via Dependency Injection.\n   - Supports shortcut methods: `$http.get()`, `$http.post()`, `$http.put()`, `$http.delete()`, `$http.patch()`, `$http.jsonp()`.\n   - Returns standard Promises adhering to the Promises/A+ specification.\n\n2. Handling Responses with `.then()`:\n   - `.then(successCallback, errorCallback)`:\n     The `response` object received contains:\n     * `response.data`: The deserialized JSON body sent by the server.\n     * `response.status`: HTTP status code (e.g., 200, 404).\n     * `response.headers`: Header getter function.\n     * `response.config`: Request configuration options.\n\n3. Comparison with jQuery `$.ajax`:\n   - jQuery `$.ajax` executes outside AngularJS. When data returns, the view will not update unless wrapped in `$scope.$apply()`.\n   - AngularJS `$http` triggers the `$digest` cycle automatically when the Promise resolves or rejects.',
    keyPoints: [
      '`$http` is a singleton service for asynchronous HTTP requests.',
      'Returns a Promise (`.then(successFn).catch(errorFn)`).',
      'Automatically parses incoming JSON response strings into JavaScript objects.',
      'Automatically triggers `$rootScope.$apply()`, keeping views in sync with API responses.'
    ],
    example: `angular.module('app', []).controller('StudentListCtrl', function($scope, $http) {
  $scope.students = [];
  $scope.loading = true;

  $http.get('/api/students')
    .then(function(response) {
      $scope.students = response.data;
    })
    .catch(function(error) {
      console.error('Failed to load students:', error.status);
    })
    .finally(function() {
      $scope.loading = false;
    });
});`,
    diagram: `ANGULARJS $http REQUEST LIFECYCLE:
Controller invokes $http.get('/api/data')
              |
              v
Browser sends XMLHttpRequest over Network
              |
              v
Server returns HTTP 200 + JSON Payload
              |
              v
$http parses JSON and resolves Promise .then()
              |
              v
Triggers $digest cycle ===> View updates instantly!`,
    followUpQuestions: [
      {
        question: 'What service can you use to configure global HTTP interceptors in AngularJS?',
        answer: '`$httpProvider.interceptors.push(...)`, which allows intercepting all outgoing requests (e.g., attaching Bearer JWT tokens) and incoming responses (e.g., handling global 401 redirects).'
      },
      {
        question: 'What is the purpose of the $q service in AngularJS?',
        answer: '`$q` is AngularJS\'s built-in promise library used to construct, resolve, reject, and combine asynchronous operations (`$q.all()`).'
      }
    ],
    quickRevision: '`$http` executes asynchronous HTTP requests, returns promises, parses JSON, and automatically triggers the `$digest` cycle.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 3 Syllabus',
      questionNumber: 'Q.8'
    },
    tags: ['ajax', 'http-service', 'promises', 'rest-api', 'angularjs']
  },
  {
    id: 'ce0522-u3-q9',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: AngularJS MVC Architecture, Directives, Filters, Services & Forms',
    category: 'theory',
    difficulty: 'advanced',
    questionNumber: 'Q.9',
    question: 'Compare factory() vs service() vs provider() in AngularJS with code and architecture.',
    shortAnswer: 'In AngularJS, all services are Singletons (instantiated once per application lifecycle). The difference lies in how they are constructed: `service()` is invoked as a constructor function using the `new` keyword; `factory()` returns an object literal configured manually; and `provider()` is the lowest-level configurable provider that supports configuration during the module\'s `.config()` phase before application run-time.',
    detailedAnswer: '1. Service (`module.service(\'MyService\', Function)`):\n   - Instantiated using the `new` keyword: `new MyService()`.\n   - Methods and properties are attached to `this` inside the constructor function.\n   - Best for classical object-oriented code.\n\n2. Factory (`module.factory(\'MyFactory\', Function)`):\n   - Executes the factory function and returns whatever object or closure you return.\n   - Highly popular and flexible; allows returning object literals, functions, or revealing module patterns with private variables.\n\n3. Provider (`module.provider(\'MyProvider\', Function)`):\n   - The fundamental building block of all services in AngularJS (factory and service are shortcuts for provider).\n   - Must define a `$get()` method that returns the service instance.\n   - The only service type that can be injected into `.config()` blocks to configure global settings before the app runs.\n\n4. Value and Constant:\n   - `value`: Simple injectable value (cannot be injected into `.config()`).\n   - `constant`: Simple injectable constant (CAN be injected into `.config()`).',
    keyPoints: [
      'All services in AngularJS are Singletons (only one instance created).',
      '`service()` uses constructor with `this` (`new Service()`).',
      '`factory()` returns an object or revealing module pattern.',
      '`provider()` requires `$get()` and allows module-level `.config()` customization.',
      'Constants can be injected into config blocks; values and factories cannot.'
    ],
    example: `// 1. Factory Pattern:
angular.module('app', []).factory('MathFactory', function() {
  return {
    square: function(x) { return x * x; }
  };
});

// 2. Service Pattern:
angular.module('app').service('MathService', function() {
  this.square = function(x) { return x * x; };
});

// 3. Provider Pattern:
angular.module('app').provider('ConfigurableMath', function() {
  var multiplier = 1;
  this.setMultiplier = function(val) { multiplier = val; };
  this.$get = function() {
    return {
      calculate: function(x) { return x * multiplier; }
    };
  };
});`,
    diagram: `SERVICE HIERARCHY IN ANGULARJS:
                Provider (Base primitive, configurable in .config())
                    |
          +---------+---------+
          |                   |
       Factory             Service
  (Returns Object)     (Constructor via 'new')
          |                   |
          +---------+---------+
                    |
           Singleton Instance on $injector`,
    followUpQuestions: [
      {
        question: 'Which of factory, service, or provider can be injected into module.config()?',
        answer: 'Only Providers (and Constants). Factories, Services, and Values are not yet instantiated during the configuration phase.'
      },
      {
        question: 'Are AngularJS services singletons or instantiated per controller?',
        answer: 'AngularJS services are strict singletons. Every controller injecting the service receives the exact same shared memory instance.'
      }
    ],
    quickRevision: '`service()` instantiates via `new`; `factory()` returns an object; `provider()` is configurable in `.config()` and requires `$get()`.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 3 Syllabus',
      questionNumber: 'Q.9'
    },
    tags: ['services', 'factory', 'provider', 'dependency-injection', 'singleton']
  },
  {
    id: 'ce0522-u3-q10',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 3: AngularJS MVC Architecture, Directives, Filters, Services & Forms',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.10',
    question: 'Explain Scope hierarchy, Scope inheritance, and the difference between $scope and $rootScope.',
    shortAnswer: '`$rootScope` is the top-most global parent scope created when the application bootstraps (`ng-app`). Each controller or nested directive creates its own child `$scope` inheriting prototypical properties from parent scopes down to `$rootScope`. If a property is not found on a child scope, JavaScript traverses the scope hierarchy up to `$rootScope`.',
    detailedAnswer: '1. What is Scope?\n   `$scope` is the execution context for expressions, holding application model data and methods accessible to the view.\n\n2. Scope Hierarchy:\n   - Every AngularJS application has exactly one `$rootScope`.\n   - Each instance of `ng-controller` or isolating directives creates a child scope that inherits prototypically from its parent scope.\n   - If Controller A encloses Controller B, Controller B can read properties defined on Controller A\'s scope.\n\n3. Modifying Inherited Primitives (The "Dot Rule"):\n   - In JavaScript prototypal inheritance, reading a primitive walks up the chain; but writing (`$scope.name = "New"`) shadows/creates a local property on the child scope without modifying the parent.\n   - Best Practice ("Always have a dot in your ng-model"): Bind models to object properties (`ng-model="user.name"`) rather than bare primitives (`ng-model="name"`), ensuring child scopes mutate the referenced object in the parent.',
    keyPoints: [
      'Only one `$rootScope` per app; attached to the `ng-app` DOM element.',
      'Child `$scope` instances inherit prototypically from ancestor scopes.',
      'Scope inheritance follows JavaScript prototypal inheritance rules.',
      'Best practice: Always use a dot (`user.name`) in `ng-model` to avoid primitive shadowing.'
    ],
    example: `<div ng-app="app" ng-controller="ParentCtrl">\n  Parent Name: {{ user.name }}\n  <div ng-controller="ChildCtrl">\n    <!-- Mutates parent object without shadowing -->\n    Child Input: <input type="text" ng-model="user.name">\n  </div>\n</div>`,
    diagram: `SCOPE HIERARCHY TREE:
         $rootScope (Application Root)
               |
        +------+------+
        |             |
   ParentScope1   ParentScope2
        |
    ChildScope (Inherits from ParentScope1 and $rootScope)`,
    followUpQuestions: [
      {
        question: 'What is an Isolate Scope in custom directives?',
        answer: 'An Isolate Scope is a scope that does NOT prototypically inherit from its parent scope, ensuring the directive is completely encapsulated and reusable without leaking or colliding with outer variables.'
      },
      {
        question: 'How do you emit events up and down the scope hierarchy?',
        answer: '`$scope.$emit(\'eventName\', data)` sends an event upwards to parent scopes; `$scope.$broadcast(\'eventName\', data)` propagates downwards to child scopes.'
      }
    ],
    quickRevision: '`$rootScope` is the application root; child `$scope` instances inherit prototypically. Always bind to objects (`user.name`) to prevent shadowing.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 3 Syllabus',
      questionNumber: 'Q.10'
    },
    tags: ['scope', 'rootscope', 'scope-hierarchy', 'prototypal-inheritance', 'dot-rule']
  }
];
