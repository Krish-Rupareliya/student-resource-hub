// frontend/src/data/viva/ce0522_experiments.js
/**
 * CE0522: Web Technology Practical Laboratory Experiments & Lab Viva Questions
 */

export const CE0522_EXPERIMENTS = [
  {
    id: 'wt-exp-1',
    experimentNumber: 1,
    title: 'Responsive Academic Portal Webpage using HTML5 Semantic Elements and CSS3',
    aim: 'To design and implement a modern, responsive multi-page academic portal webpage using HTML5 semantic elements (<header>, <nav>, <main>, <article>, <aside>, <footer>) and CSS3 Flexbox/Grid layouts.',
    shortTheory: 'HTML5 semantic tags impart explicit contextual meaning to document structure, facilitating screen reader accessibility and search engine indexing. CSS3 Flexbox manages 1-dimensional content distribution, while CSS Grid manages 2-dimensional grid systems with media queries enabling mobile-first responsiveness.',
    requiredTools: ['VS Code / Sublime Text', 'Modern Web Browser (Chrome/Firefox/Edge)', 'HTML5 & CSS3 Validator'],
    procedure: [
      'Create the base HTML5 skeleton with <!DOCTYPE html> and <meta name="viewport" content="width=device-width, initial-scale=1.0">.',
      'Structure the document semantically using <header>, <nav>, <main>, <section>, <article>, <aside>, and <footer>.',
      'Implement a responsive horizontal navigation bar in <nav> using Flexbox (display: flex; justify-content: space-between).',
      'Create a two-column layout for <main> and <aside> using CSS Grid (grid-template-columns: 3fr 1fr).',
      'Add CSS media queries (@media (max-width: 768px)) to stack navigation links and sidebar columns vertically on mobile screens.',
      'Validate markup using the W3C Markup Validation Service.'
    ],
    expectedOutput: 'A clean, modern academic portal webpage displaying header, navigation, articles, sidebar notices, and footer that gracefully reorganizes into a single-column layout on mobile viewports.',
    commonErrors: [
      {
        error: 'Webpage fails to scale down on mobile screens (desktop view zoomed out)',
        cause: 'Missing or misconfigured viewport meta tag in the HTML <head>.',
        solution: 'Include <meta name="viewport" content="width=device-width, initial-scale=1.0"> inside <head>.'
      },
      {
        error: 'Sidebar overlaps or drops below content on medium screens',
        cause: 'Using fixed pixel widths without box-sizing: border-box.',
        solution: 'Add * { box-sizing: border-box; } and utilize CSS Grid with fr units or Flexbox with flex-wrap: wrap.'
      }
    ],
    questions: [
      {
        id: 'wtexp1-q1',
        question: 'Why are HTML5 semantic tags preferred over generic <div> tags?',
        answer: 'Semantic tags convey explicit document structure and meaning to web browsers, screen readers (accessibility for visually impaired users), and search engine crawlers (SEO), replacing ambiguous <div class="nav"> with clear <nav>.'
      },
      {
        id: 'wtexp1-q2',
        question: 'What is the difference between CSS Flexbox and CSS Grid?',
        answer: 'Flexbox is designed for 1-dimensional layouts (either in a row OR a column). CSS Grid is designed for 2-dimensional layouts (handling rows AND columns simultaneously).'
      },
      {
        id: 'wtexp1-q3',
        question: 'What does the viewport meta tag do?',
        answer: 'It instructs mobile browsers to set the screen width of the page to the physical width of the device screen (`width=device-width`) and sets initial zoom level to 100% (`initial-scale=1.0`).'
      }
    ]
  },
  {
    id: 'wt-exp-2',
    experimentNumber: 2,
    title: 'Client-Side Form Validation and Dynamic DOM Manipulation using Vanilla JavaScript',
    aim: 'To develop an interactive student registration form with real-time client-side validation using Vanilla JavaScript and Regular Expressions, providing dynamic DOM error indicators.',
    shortTheory: 'Client-side validation verifies user input integrity before network transmission, reducing server load. The Document Object Model (DOM) represents the page hierarchy as a tree of objects that JavaScript can manipulate dynamically using query selectors, classList modifications, and event listeners.',
    requiredTools: ['VS Code', 'Google Chrome Developer Tools (Console & Elements Inspector)'],
    procedure: [
      'Construct an HTML form with fields for Full Name, Enrollment Number, College Email, Mobile Number, Password, and Confirm Password.',
      'Attach an onsubmit event listener to the form and prevent default submission using event.preventDefault().',
      'Define Regular Expressions for Email (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/) and Phone (/^[6-9]\\d{9}$/).',
      'Check that password length is at least 8 characters with at least one uppercase, one lowercase, one digit, and one special symbol.',
      'Compare Password and Confirm Password fields for equality.',
      'Dynamically add .is-invalid CSS classes and populate corresponding <span> error messages if tests fail.',
      'Allow form submission when all validations pass.'
    ],
    expectedOutput: 'Interactive registration form displaying immediate red border highlights and helpful error messages beneath invalid fields; switches to green indicators upon correct input.',
    commonErrors: [
      {
        error: 'Form submits and page reloads even when inputs are completely blank',
        cause: 'Forgetting to call event.preventDefault() inside the submit event listener handler.',
        solution: 'Ensure event.preventDefault() is executed on the form submit event object.'
      },
      {
        error: 'Regex pattern fails valid email addresses with subdomains',
        cause: 'Overly restrictive regex pattern that does not permit dots in domain names.',
        solution: 'Use standard RFC-compliant email regular expression or HTML5 input type="email".'
      }
    ],
    questions: [
      {
        id: 'wtexp2-q1',
        question: 'What is the difference between event.preventDefault() and event.stopPropagation()?',
        answer: '`event.preventDefault()` stops the default browser action for the event (e.g. form submission or hyperlink navigation). `event.stopPropagation()` stops the event from bubbling up through parent ancestor DOM elements.'
      },
      {
        id: 'wtexp2-q2',
        question: 'Why is client-side validation alone not sufficient for application security?',
        answer: 'Because client-side validation can be easily bypassed by disabling JavaScript in browser settings or by crafting direct HTTP POST requests via tools like cURL or Postman. Server-side validation is mandatory.'
      }
    ]
  },
  {
    id: 'wt-exp-3',
    experimentNumber: 3,
    title: 'Interactive 2D Graphics and Animation using HTML5 Canvas and CSS3 Keyframes',
    aim: 'To create an interactive graphical web application comparing HTML5 2D Canvas rendering with CSS3 Keyframe animations.',
    shortTheory: 'HTML5 Canvas provides an immediate-mode 2D rendering surface drawn dynamically via JavaScript pixel manipulation methods (arc, rect, fillStyle, requestAnimationFrame). CSS3 Keyframe animations run on the browser compositor thread via GPU acceleration.',
    requiredTools: ['Text Editor', 'Web Browser with Hardware Acceleration enabled'],
    procedure: [
      'Create an HTML <canvas id="paintCanvas" width="600" height="400"> element.',
      'Obtain the 2D rendering context in JavaScript using canvas.getContext("2d").',
      'Draw primitive shapes: rectangles with fillRect(), circles with arc() and fill(), and lines with beginPath(), moveTo(), lineTo(), and stroke().',
      'Create a bouncing ball animation using requestAnimationFrame() updating (x, y) coordinates and reversing velocity upon collision with canvas borders.',
      'Create a side-by-side CSS3 animated pulse/spinner card using @keyframes and transform: scale() and rotate().',
      'Compare CPU/GPU utilization using Chrome Task Manager.'
    ],
    expectedOutput: 'A smoothly animating 60fps bouncing ball inside the HTML5 Canvas alongside a spinning/pulsing CSS3 animated badge.',
    commonErrors: [
      {
        error: 'Canvas ball leaves a solid continuous line smear trail instead of moving',
        cause: 'Forgetting to clear previous frame pixels before drawing the new frame position.',
        solution: 'Call ctx.clearRect(0, 0, canvas.width, canvas.height) at the start of each animation loop iteration.'
      },
      {
        error: 'Canvas drawing appears distorted or stretched',
        cause: 'Setting canvas dimensions via CSS (width: 600px) instead of canvas HTML attributes (width="600").',
        solution: 'Set width and height directly on the <canvas> element attributes to set the internal bitmap resolution.'
      }
    ],
    questions: [
      {
        id: 'wtexp3-q1',
        question: 'Why is window.requestAnimationFrame() better than setInterval() for animations?',
        answer: '`requestAnimationFrame()` synchronizes frame painting with the display refresh rate (typically 60Hz), prevents frame dropping, and automatically pauses when the browser tab is hidden or minimized, conserving CPU and battery.'
      },
      {
        id: 'wtexp3-q2',
        question: 'How do you draw a circle on an HTML5 canvas?',
        answer: 'Use `ctx.beginPath(); ctx.arc(x, y, radius, 0, 2 * Math.PI); ctx.fill();`.'
      }
    ]
  },
  {
    id: 'wt-exp-4',
    experimentNumber: 4,
    title: 'Responsive Student Dashboard UI Design using Bootstrap Framework',
    aim: 'To build a responsive Student Resource and Analytics Dashboard using the Bootstrap 5 framework, incorporating the 12-column grid, navbar, cards, tables, and modal dialogs.',
    shortTheory: 'Bootstrap is an open-source CSS framework featuring a 12-column flexbox grid system, responsive utility classes, and pre-built components (navbar, modal, cards, accordion) enabling rapid responsive web design across mobile, tablet, and desktop devices.',
    requiredTools: ['Bootstrap 5 CDN (CSS & JS Bundle)', 'VS Code', 'Modern Browser'],
    procedure: [
      'Include Bootstrap 5 CSS in <head> and Bootstrap JS bundle before closing </body>.',
      'Construct a responsive top navigation bar using <nav class="navbar navbar-expand-lg navbar-dark bg-dark"> with a collapsible hamburger menu for mobile screens.',
      'Create a container (.container-fluid) with a two-column layout: sidebar (.col-lg-2) and main content area (.col-lg-10).',
      'In the main content, place KPI summary statistic cards using .card, .card-body, and grid classes (.col-12 .col-md-6 .col-lg-3).',
      'Render a student grades table with Bootstrap table styles: .table, .table-striped, .table-hover, .table-responsive.',
      'Add a "Create Resource" button that triggers a Bootstrap Modal dialog (.modal) with form controls.'
    ],
    expectedOutput: 'A responsive dashboard interface with dark navbar, collapsible sidebar, KPI metrics cards, styled table, and interactive modal dialog.',
    commonErrors: [
      {
        error: 'Modal dialog does not open or dropdown does not toggle on click',
        cause: 'Bootstrap JS Bundle (bootstrap.bundle.min.js containing Popper.js) is not linked or is loaded before the HTML elements.',
        solution: 'Include the Bootstrap bundle script tag immediately before the closing </body> tag.'
      }
    ],
    questions: [
      {
        id: 'wtexp4-q1',
        question: 'What is the role of Popper.js in Bootstrap?',
        answer: 'Popper.js is a lightweight positioning engine used by Bootstrap to calculate the dynamic positions of popups, tooltips, and dropdown menus.'
      },
      {
        id: 'wtexp4-q2',
        question: 'Explain the Bootstrap class "col-md-4 col-12".',
        answer: 'It instructs the element to span all 12 columns (100% width) on mobile screens (< 768px), and 4 columns (33.33% width, 3 cards per row) on medium screens and larger (≥ 768px).'
      }
    ]
  },
  {
    id: 'wt-exp-5',
    experimentNumber: 5,
    title: 'Single Page Application (SPA) with Two-Way Data Binding and Filters using AngularJS',
    aim: 'To design a Single Page Application for Student Grade Management using AngularJS, implementing MVC architecture, two-way data binding (ng-model), dynamic list rendering (ng-repeat), and built-in/custom filters.',
    shortTheory: 'AngularJS is a client-side MVC framework. It automatically binds JavaScript model data to HTML views using dirty checking in the $digest cycle. Directives (ng-app, ng-controller, ng-repeat) define dynamic UI behavior without manual DOM code.',
    requiredTools: ['AngularJS 1.8.x CDN', 'VS Code', 'Web Browser'],
    procedure: [
      'Initialize an AngularJS module and controller: angular.module("gradeApp", []).controller("GradeCtrl", function($scope) { ... }).',
      'Define a model array of student objects with properties (id, name, course, marks, fees) in $scope.',
      'Bind an input search box using ng-model="searchText".',
      'Render student table rows dynamically using <tr ng-repeat="s in students | filter:searchText | orderBy:\'name\'">.',
      'Format fees using the currency filter ({{ s.fees | currency:"₹" }}) and student names using uppercase filter.',
      'Add a form with ng-submit to append new students to the $scope.students array in real-time.'
    ],
    expectedOutput: 'An interactive AngularJS SPA where typing into the search box instantly filters table rows in real-time, fee columns display currency formatting, and adding a student updates the table without page reloads.',
    commonErrors: [
      {
        error: 'Expressions like {{ student.name }} appear as raw text on the webpage for a second',
        cause: 'Flash of Unrendered Content (FOUC) while the AngularJS library is downloading.',
        solution: 'Use the ng-cloak directive on the root element with appropriate CSS or use ng-bind.'
      },
      {
        error: 'Filter does not work when typing into search box',
        cause: 'The ng-model variable name on the search input does not match the filter expression parameter.',
        solution: 'Ensure the search input has ng-model="searchText" and the filter is declared as | filter:searchText.'
      }
    ],
    questions: [
      {
        id: 'wtexp5-q1',
        question: 'What is the $scope object in AngularJS?',
        answer: '`$scope` is the execution context and mediator connecting the Controller (JavaScript business logic) to the View (HTML template). Any property attached to `$scope` is automatically accessible in template expressions.'
      },
      {
        id: 'wtexp5-q2',
        question: 'How does AngularJS two-way data binding work?',
        answer: 'Changes in the View (user typing in `ng-model`) immediately update the `$scope` model property in memory; changes in the Model automatically update the DOM View via Dirty Checking in the `$digest` cycle.'
      }
    ]
  },
  {
    id: 'wt-exp-6',
    experimentNumber: 6,
    title: 'Server-Side Form Processing, Session Authentication, and Cookies in PHP',
    aim: 'To develop a secure user authentication system using PHP, managing user sessions with session_start(), storing login state in $_SESSION, and persisting user preferences via HTTP Cookies.',
    shortTheory: 'HTTP is stateless. Server-side session management maintains user state across requests by storing session data in server files and tracking clients using a unique PHPSESSID cookie. Cookies store small preference key-value pairs in the client browser.',
    requiredTools: ['XAMPP / WAMP / Apache PHP Stack', 'Web Browser', 'VS Code'],
    procedure: [
      'Create a login.php page containing an HTML form with username and password submitting via method="POST".',
      'In login_process.php, start the session with session_start() as the very first line of code.',
      'Validate credentials against secure hashed values; if valid, set $_SESSION["authenticated"] = true and $_SESSION["user"] = $username.',
      'If "Remember Me" is checked, set a persistent cookie using setcookie("user_login", $username, time() + (86400 * 30), "/", "", false, true).',
      'Create dashboard.php which checks if isset($_SESSION["authenticated"]); if not, redirect using header("Location: login.php").',
      'Create logout.php to wipe $_SESSION, expire session cookies, and call session_destroy().'
    ],
    expectedOutput: 'Secure login flow where valid credentials grant access to dashboard.php. Attempting to directly visit dashboard.php without logging in redirects to login.php. Logging out completely terminates the session.',
    commonErrors: [
      {
        error: 'Warning: session_start(): Cannot start session when headers already sent',
        cause: 'HTML markup, spaces, or echo statements occurred before the session_start() call.',
        solution: 'Place session_start() at line 1 of the PHP file before any HTML tags, echo statements, or leading whitespace.'
      }
    ],
    questions: [
      {
        id: 'wtexp6-q1',
        question: 'What is the function of the HttpOnly flag in setcookie()?',
        answer: 'The `HttpOnly` flag prevents client-side JavaScript (via `document.cookie`) from reading the cookie, mitigating the risk of session hijacking via Cross-Site Scripting (XSS).'
      },
      {
        id: 'wtexp6-q2',
        question: 'What is the difference between session_unset() and session_destroy()?',
        answer: '`session_unset()` frees all session variables currently registered in the `$_SESSION` array in memory. `session_destroy()` deletes the session data file stored on the server disk.'
      }
    ]
  },
  {
    id: 'wt-exp-7',
    experimentNumber: 7,
    title: 'Database-Driven CRUD Web Application using PHP and MySQL with Prepared Statements',
    aim: 'To develop a complete database-driven CRUD (Create, Read, Update, Delete) web application using PHP, MySQLi/PDO prepared statements, and PHPMyAdmin for database administration.',
    shortTheory: 'Relational databases store structured data. PHP interacts with MySQL using parameterized queries (Prepared Statements), which separate executable SQL code from user data parameters, completely preventing SQL Injection vulnerabilities.',
    requiredTools: ['XAMPP (Apache + MySQL + PHPMyAdmin)', 'MySQL Database Server', 'VS Code'],
    procedure: [
      'Open PHPMyAdmin (http://localhost/phpmyadmin) and create a database college_db with table students (id INT AUTO_INCREMENT PRIMARY KEY, roll_no VARCHAR(20), name VARCHAR(100), email VARCHAR(100), gpa DECIMAL(3,2)).',
      'Create db_connect.php to establish connection using new mysqli("localhost", "root", "", "college_db").',
      'Implement CREATE: Add student via HTML form using $stmt = $conn->prepare("INSERT INTO students (roll_no, name, email, gpa) VALUES (?, ?, ?, ?)") followed by bind_param() and execute().',
      'Implement READ: Query all students with SELECT * FROM students and render an HTML table with Edit and Delete links.',
      'Implement UPDATE: Fetch single student by id into an edit form and execute UPDATE students SET name=?, email=?, gpa=? WHERE id=?.',
      'Implement DELETE: Execute DELETE FROM students WHERE id=? upon clicking delete button with confirmation dialog.'
    ],
    expectedOutput: 'A fully functional student database management portal capable of creating, viewing, updating, and deleting student records with real-time MySQL database synchronization and immunity to SQL Injection.',
    commonErrors: [
      {
        error: 'Fatal error: Uncaught mysqli_sql_exception: Access denied for user "root"@"localhost"',
        cause: 'Incorrect MySQL username or password in db_connect.php.',
        solution: 'Verify database credentials in XAMPP (default user is "root" with blank password "").'
      },
      {
        error: 'SQL syntax error during INSERT operation',
        cause: 'Mismatched parameter count or type definition string in bind_param() (e.g., "sssd" for string, string, string, double).',
        solution: 'Ensure the count and order of types in bind_param match the question mark placeholders in the prepared SQL query.'
      }
    ],
    questions: [
      {
        id: 'wtexp7-q1',
        question: 'Why are Prepared Statements essential in PHP database applications?',
        answer: 'Prepared Statements pre-compile the SQL query structure on the database server before binding user data parameters. Because the query syntax tree is already compiled, user inputs can never alter the query logic, completely neutralizing SQL Injection attacks.'
      },
      {
        id: 'wtexp7-q2',
        question: 'What do the letters "sssd" mean in $stmt->bind_param("sssd", $a, $b, $c, $d)?',
        answer: 'They specify the data types of the variables: "s" for string, "i" for integer, "d" for double/float, and "b" for blob.'
      }
    ]
  },
  {
    id: 'wt-exp-8',
    experimentNumber: 8,
    title: 'Asynchronous AJAX Live Search using JavaScript fetch() / AngularJS $http and PHP-MySQL JSON API',
    aim: 'To develop an asynchronous live search and autocomplete system using JavaScript fetch() / AngularJS $http to communicate with a PHP backend returning JSON records from MySQL.',
    shortTheory: 'AJAX (Asynchronous JavaScript and XML/JSON) enables web pages to update content asynchronously by exchanging data with a web server in the background without reloading the entire page, providing a fast, app-like user experience.',
    requiredTools: ['XAMPP Stack (Apache & MySQL)', 'Modern Web Browser', 'VS Code'],
    procedure: [
      'Create a backend PHP script (search_api.php) that reads the query parameter ?q=keyword from $_GET.',
      'Sanitize the query, execute a MySQL prepared statement with LIKE clause: SELECT id, name, roll_no FROM students WHERE name LIKE CONCAT("%", ?, "%").',
      'Fetch results as an associative array and output as JSON using header("Content-Type: application/json") and echo json_encode($results).',
      'In the frontend HTML, attach an oninput event listener to the search input.',
      'Use the JavaScript fetch() API (or AngularJS $http) to make an asynchronous GET request to search_api.php?q=keyword.',
      'Parse the JSON response and dynamically construct and insert suggestion list items into the DOM.'
    ],
    expectedOutput: 'Real-time autocomplete dropdown that updates results dynamically below the search input as each character is typed, without full page refreshes.',
    commonErrors: [
      {
        error: 'CORS policy blocked access to XMLHttpRequest / fetch',
        cause: 'Frontend and backend are hosted on different origins/ports without CORS headers.',
        solution: 'Add header("Access-Control-Allow-Origin: *"); at the top of search_api.php or serve frontend and backend from the same Apache host.'
      },
      {
        error: 'JSON.parse unexpected token < in JSON at position 0',
        cause: 'PHP script output an error warning or HTML notice before json_encode(), breaking JSON validity.',
        solution: 'Check PHP error logs, ensure error_reporting is clean, and verify Content-Type is set to application/json.'
      }
    ],
    questions: [
      {
        id: 'wtexp8-q1',
        question: 'What is the role of header("Content-Type: application/json") in PHP APIs?',
        answer: 'It instructs the client browser or HTTP client that the response payload format is JSON rather than standard HTML or plain text, allowing browsers to parse it correctly.'
      },
      {
        id: 'wtexp8-q2',
        question: 'What is Debouncing and why is it important in live search inputs?',
        answer: 'Debouncing delays the execution of the API call until the user stops typing for a specified interval (e.g. 300ms). It prevents firing an HTTP request on every single keystroke, saving server resources and network bandwidth.'
      }
    ]
  }
];
