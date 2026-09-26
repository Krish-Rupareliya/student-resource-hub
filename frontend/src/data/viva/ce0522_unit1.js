// frontend/src/data/viva/ce0522_unit1.js
/**
 * CE0522: Web Technology — Unit 1: Introduction to WWW, HTTP Protocol, Web Browsers & HTML5
 * Comprehensive Viva Questions & Solutions
 */

export const CE0522_UNIT1_QUESTIONS = [
  {
    id: 'ce0522-u1-q1',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to WWW, HTTP Protocol, Web Browsers & HTML5',
    category: 'theory',
    difficulty: 'basic',
    questionNumber: 'Q.1',
    question: 'What is the difference between the Internet and the World Wide Web (WWW)?',
    shortAnswer: 'The Internet is the global physical infrastructure of interconnected computer networks, hardware, cables, and routers communicating via TCP/IP. The World Wide Web (WWW) is an information-sharing service built on top of the Internet that uses HTTP/HTTPS to access linked hypertext documents (webpages).',
    detailedAnswer: '1. Definition & Foundation:\n   - Internet: A massive network of networks. It is the physical and logical infrastructure consisting of computers, copper wires, fiber-optic cables, wireless links, switches, and routers connecting millions of devices worldwide using the TCP/IP protocol suite.\n   - World Wide Web (WWW): An application-level service operating over the Internet. It is a collection of interconnected multimedia documents and resources identified by URLs and linked via hyperlinks.\n\n2. Origin & History:\n   - Internet: Originated in the late 1960s as ARPANET, funded by the US Department of Defense.\n   - WWW: Invented in 1989 by Sir Tim Berners-Lee at CERN to allow scientists to share research information automatically.\n\n3. Protocols:\n   - Internet uses network/transport protocols like IP, TCP, UDP, ICMP, BGP, ARP.\n   - WWW uses application layer protocols such as HTTP, HTTPS, and formats like HTML, CSS, JavaScript, and XML.\n\n4. Analogy:\n   - If the Internet is the physical highway system (roads, bridges, tunnels), the World Wide Web is the vehicular traffic and delivery trucks carrying information across those roads.',
    keyPoints: [
      'Internet = physical network infrastructure (hardware, cables, TCP/IP).',
      'WWW = software service and collection of web pages accessible via HTTP over the Internet.',
      'Internet was born from ARPANET (1969); WWW was invented by Tim Berners-Lee at CERN (1989).',
      'Other services running on the Internet besides WWW include Email (SMTP/IMAP), FTP, VoIP, and SSH.',
      'WWW relies on URLs, HTML, and HTTP.'
    ],
    example: 'When you send an email via an SMTP client or initiate an SSH session into a remote server, you are using the Internet without using the World Wide Web.',
    diagram: `+---------------------------------------------------------------+
|                    THE INTERNET INFRASTRUCTURE                 |
|       (Global Physical Network of Routers, Fibers, TCP/IP)    |
+---------------------------------------------------------------+
       |                     |                     |
       v                     v                     v
+---------------+     +---------------+     +---------------+
|   WWW (Web)   |     |     Email     |     |   VoIP / P2P  |
|  (HTTP/HTTPS) |     |  (SMTP/IMAP)  |     |   (SIP/RTP)   |
|  HTML, Browsers|    | Outlook/Gmail |     |  Zoom/Skype   |
+---------------+     +---------------+     +---------------+`,
    followUpQuestions: [
      {
        question: 'Can the Internet exist without the World Wide Web?',
        answer: 'Yes. The Internet functioned for over two decades before the Web was invented, running email, Telnet, Usenet, and FTP.'
      },
      {
        question: 'Who oversees web standards today?',
        answer: 'The World Wide Web Consortium (W3C) and WHATWG (Web Hypertext Application Technology Working Group).'
      }
    ],
    quickRevision: 'The Internet is the physical network network; the Web is an application layer document system using HTTP.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 1 Syllabus',
      questionNumber: 'Q.1'
    },
    tags: ['www', 'internet', 'networking', 'tim-berners-lee', 'architecture']
  },
  {
    id: 'ce0522-u1-q2',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to WWW, HTTP Protocol, Web Browsers & HTML5',
    category: 'theory',
    difficulty: 'basic',
    questionNumber: 'Q.2',
    question: 'Explain the anatomy of a URL with a neat diagram and example.',
    shortAnswer: 'A URL (Uniform Resource Locator) is a specific type of URI that specifies the network address and mechanism used to retrieve a resource over the web. Its components are: Scheme/Protocol, Subdomain, Domain/Hostname, Port, Path, Query String, and Fragment/Anchor.',
    detailedAnswer: 'A URL is composed of several distinct syntactic components:\n\n1. Scheme / Protocol: Specifies how data is transmitted (e.g., `https://`, `http://`, `ftp://`). HTTPS ensures TLS/SSL encrypted communication.\n2. Subdomain: A subdivision of the main domain (e.g., `www`, `api`, `blog`, `portal`).\n3. Domain Name / Host: The registered human-friendly domain or IP address (e.g., `indusuni.ac.in`). Resolved to an IP by DNS.\n4. Port: Numerical port identifying the specific server process. Default for HTTP is 80, HTTPS is 443. Can be explicitly declared (e.g., `:8080`, `:3001`).\n5. Path: Hierarchical file or virtual route on the server (e.g., `/students/resources`).\n6. Query String: Key-value parameter pairs preceded by `?` and delimited by `&` used to send parameters to dynamic server scripts (e.g., `?sem=5&sub=wt`).\n7. Fragment Identifier / Hash: Preceded by `#`, references an internal anchor element (`id`) within the webpage, processed purely client-side by the browser without being sent to the web server.',
    keyPoints: [
      'Syntax: scheme://[user:pass@]host[:port]/path[?query][#fragment]',
      'Default ports: HTTP = 80, HTTPS = 443.',
      'Query strings send data to the server via GET method.',
      'The fragment identifier (#) is processed entirely by the browser and never transmitted to the web server.'
    ],
    example: 'https://www.campus.edu:443/courses/view.php?sem=5&code=CE0522#syllabus',
    diagram: `https://www.campus.edu:443/courses/view.php?sem=5&code=CE0522#syllabus
|---|   |---| |--------| |--| |---------------| |-------------| |-------|
  |       |       |       |           |                |           |
Scheme Subdomain Domain  Port       Path         Query String   Fragment
(HTTPS)         (Host)  (Default)              (Parameters)    (Anchor)`,
    followUpQuestions: [
      {
        question: 'What is the difference between URI, URL, and URN?',
        answer: 'URI (Uniform Resource Identifier) is the superclass. URL specifies WHERE the resource is located and HOW to access it. URN (Uniform Resource Name) names an identity without specifying location (e.g., urn:isbn:0451450523).'
      },
      {
        question: 'Does the web server receive the fragment (#) portion of a URL?',
        answer: 'No. The browser strips the fragment identifier before sending the HTTP request; it is used locally by the browser engine to scroll to the target element ID.'
      }
    ],
    quickRevision: 'A URL specifies scheme, host, port, path, query parameters (?key=val), and client fragment (#id).',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 1 Syllabus',
      questionNumber: 'Q.2'
    },
    tags: ['url', 'uri', 'http', 'domain', 'dns']
  },
  {
    id: 'ce0522-u1-q3',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to WWW, HTTP Protocol, Web Browsers & HTML5',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.3',
    question: 'Explain the HTTP Protocol, its characteristics, and compare HTTP/1.1 vs HTTP/2.',
    shortAnswer: 'Hypertext Transfer Protocol (HTTP) is an application-layer, stateless, client-server protocol used for transmitting hypermedia documents. Key characteristics include request-response architecture, statelessness, and support for media-type negotiation. HTTP/2 introduces binary framing, multiplexing over a single TCP connection, header compression (HPACK), and server push, eliminating HTTP/1.1 head-of-line blocking.',
    detailedAnswer: '1. Core Characteristics of HTTP:\n   - Client-Server Architecture: Client (browser) initiates requests; server processes and returns responses.\n   - Stateless: The server does not retain session state between successive requests. Statefulness is achieved using Cookies, Sessions, and Web Storage.\n   - Media-Independent: Any content type (HTML, JSON, Images, Video) can be exchanged using MIME types specified in the `Content-Type` header.\n   - Connectionless (historically): In HTTP/1.0, each request closed the TCP connection. HTTP/1.1 introduced persistent connections (`Connection: keep-alive`).\n\n2. HTTP/1.1 vs HTTP/2 Comparison:\n   - Protocol Format: HTTP/1.1 is plain textual; HTTP/2 is binary framing.\n   - Multiplexing: HTTP/1.1 suffers from Head-of-Line (HoL) blocking (requests are pipelined sequentially or require up to 6 separate TCP connections per domain). HTTP/2 interleaves multiple bidirectional streams over a single TCP connection concurrently.\n   - Header Optimization: HTTP/1.1 sends verbose plain-text headers on every request; HTTP/2 uses HPACK compression.\n   - Server Push: HTTP/2 allows servers to send assets (like CSS and JS) to the client cache proactively before the client parses the HTML and asks for them.',
    keyPoints: [
      'HTTP operates over TCP (port 80 for HTTP, port 443 for HTTPS).',
      'Stateless protocol: No built-in memory between requests.',
      'HTTP/1.1 has textual headers and suffers from Head-of-Line blocking.',
      'HTTP/2 features binary framing, stream multiplexing over 1 TCP connection, HPACK header compression, and Server Push.'
    ],
    example: 'When loading an e-commerce page with 50 product images, HTTP/1.1 must open multiple TCP connections and download them sequentially. HTTP/2 streams all 50 images concurrently over a single TCP handshake.',
    diagram: `HTTP/1.1 (Sequential / Multiple TCP Connections)
TCP Conn 1: [Req 1] ----> [Resp 1] ----> [Req 2] ----> [Resp 2] (HoL Blocking)

HTTP/2 (Single TCP Connection with Binary Multiplexing)
Single TCP: === [Stream 1 (HTML)] === [Stream 2 (CSS)] === [Stream 3 (JS)] ===>`,
    followUpQuestions: [
      {
        question: 'What is HTTP/3 and what underlying transport does it use?',
        answer: 'HTTP/3 uses QUIC (Quick UDP Internet Connections) over UDP instead of TCP, eliminating TCP-level packet loss Head-of-Line blocking and enabling faster zero-RTT handshakes.'
      },
      {
        question: 'Why is HTTP called a stateless protocol?',
        answer: 'Because the server handles each request independently without retaining memory or context of previous transactions from the same client.'
      }
    ],
    quickRevision: 'HTTP is a stateless client-server protocol. HTTP/2 improves on HTTP/1.1 via binary multiplexing, HPACK compression, and single TCP connections.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 1 Syllabus',
      questionNumber: 'Q.3'
    },
    tags: ['http', 'http1', 'http2', 'multiplexing', 'stateless']
  },
  {
    id: 'ce0522-u1-q4',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to WWW, HTTP Protocol, Web Browsers & HTML5',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.4',
    question: 'Explain common HTTP request methods (GET, POST, PUT, DELETE) and HTTP response status code categories.',
    shortAnswer: 'HTTP methods define the desired action to be performed on a web resource. The primary methods are GET (retrieve), POST (submit/create), PUT (replace/update), and DELETE (remove). HTTP status codes are 3-digit integers categorized into 1xx (Informational), 2xx (Success), 3xx (Redirection), 4xx (Client Error), and 5xx (Server Error).',
    detailedAnswer: '1. Primary HTTP Methods:\n   - GET: Requests representation of the specified resource. Parameters are appended in the URL query string. Must be idempotent and safe (does not alter server state).\n   - POST: Submits entity payload to the server for processing (e.g., creating a new user or submitting form data). Neither safe nor idempotent.\n   - PUT: Replaces all current representations of the target resource with the uploaded payload. Idempotent.\n   - PATCH: Applies partial modifications to a resource.\n   - DELETE: Deletes the specified resource. Idempotent.\n   - HEAD: Identical to GET but returns only response headers without the message body (used for checking resource existence or headers).\n   - OPTIONS: Describes the communication options and CORS permissions supported by the server.\n\n2. HTTP Status Code Classes:\n   - 1xx (Informational): Request received, continuing process (e.g., 101 Switching Protocols).\n   - 2xx (Success): Action successfully received, understood, and accepted.\n     * 200 OK: Standard success response.\n     * 201 Created: Resource created (typical for POST).\n     * 204 No Content: Success but no response body returned.\n   - 3xx (Redirection): Further action needed to fulfill request.\n     * 301 Moved Permanently: URL permanently updated.\n     * 302 Found / 307 Temporary Redirect: Temporary redirect.\n     * 304 Not Modified: Cached copy is valid (ETag/If-Modified-Since).\n   - 4xx (Client Error): Request contains bad syntax or cannot be fulfilled.\n     * 400 Bad Request: Malformed syntax or invalid JSON.\n     * 401 Unauthorized: Authentication required.\n     * 403 Forbidden: Authenticated but unauthorized (no permission).\n     * 404 Not Found: Resource does not exist.\n     * 405 Method Not Allowed: HTTP method not supported on endpoint.\n   - 5xx (Server Error): Server failed to fulfill an apparently valid request.\n     * 500 Internal Server Error: Unhandled backend exception or crash.\n     * 502 Bad Gateway: Proxy/gateway received invalid response from upstream server.\n     * 503 Service Unavailable: Server overloaded or undergoing maintenance.',
    keyPoints: [
      'Idempotent methods: GET, PUT, DELETE, HEAD (multiple identical requests yield identical server state).',
      'Non-idempotent: POST (multiple requests create multiple records).',
      '2xx = Success (200, 201, 204).',
      '3xx = Redirect (301, 304).',
      '4xx = Client error (400, 401, 403, 404).',
      '5xx = Server error (500, 502, 503).'
    ],
    example: 'When logging into a portal, the browser makes a POST request to `/api/login`. If credentials match, the server returns 200 OK with a session token; if password is wrong, it returns 401 Unauthorized.',
    diagram: `HTTP STATUS CODE SPECTRUM:
+-------------------------------------------------------------+
| 1xx: Informational (100 Continue, 101 Switching Protocols) |
| 2xx: Success       (200 OK, 201 Created, 204 No Content)   |
| 3xx: Redirection   (301 Moved Permanently, 304 Not Modified)|
| 4xx: Client Error  (400 Bad Req, 401 Unauth, 404 Not Found)|
| 5xx: Server Error  (500 Internal Error, 502 Bad Gateway)   |
+-------------------------------------------------------------+`,
    followUpQuestions: [
      {
        question: 'What is the exact difference between 401 Unauthorized and 403 Forbidden?',
        answer: '401 means unauthenticated (the server does not know who you are; login is required). 403 means forbidden (the server knows your identity, but your account lacks permission to access the resource).'
      },
      {
        question: 'What is an idempotent HTTP method?',
        answer: 'An HTTP method is idempotent if executing it multiple times consecutively produces the exact same result and server state as executing it once (e.g., GET, PUT, DELETE).'
      }
    ],
    quickRevision: 'Methods define actions (GET reads, POST creates, PUT updates, DELETE drops). Status codes: 2xx success, 3xx redirect, 4xx client error, 5xx server crash.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 1 Syllabus',
      questionNumber: 'Q.4'
    },
    tags: ['http-methods', 'status-codes', 'rest-api', 'crud', 'networking']
  },
  {
    id: 'ce0522-u1-q5',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to WWW, HTTP Protocol, Web Browsers & HTML5',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.5',
    question: 'How do Web Browsers and Web Servers interact? Explain the Critical Rendering Path of a browser.',
    shortAnswer: 'Web browsers (clients) and web servers communicate via HTTP request-response transactions. The browser sends an HTTP request, the web server (Apache, Nginx, Node.js) processes the request and sends back HTML, CSS, JavaScript, and assets. The browser executes the Critical Rendering Path: Parsing HTML to construct DOM -> Parsing CSS to construct CSSOM -> Combining into Render Tree -> Layout (reflow) -> Painting pixels to screen.',
    detailedAnswer: '1. Web Server vs Web Browser Roles:\n   - Web Server: Listens on port 80/443 for incoming HTTP connections. Serves static files or passes requests to backend application engines (PHP, Python, Node). Examples: Apache HTTP Server, Nginx, Microsoft IIS.\n   - Web Browser: User agent client that translates raw HTML, CSS, and JS into interactive visual interfaces. Contains Rendering Engine (Blink in Chrome/Edge, Gecko in Firefox, WebKit in Safari) and JavaScript Engine (V8, SpiderMonkey).\n\n2. The Critical Rendering Path Steps:\n   - Step 1: DOM Construction: The browser parses raw HTML bytes -> characters -> tokens -> nodes -> Document Object Model (DOM) tree.\n   - Step 2: CSSOM Construction: External and internal CSS styles are parsed into the CSS Object Model (CSSOM) tree.\n   - Step 3: Render Tree Generation: The browser combines visible nodes from DOM and CSSOM into a Render Tree (elements with `display: none` are omitted).\n   - Step 4: Layout / Reflow: Computes the exact geometry, coordinates, and dimensions of each node on the viewport.\n   - Step 5: Paint & Composite: Converts vector layout boxes into actual screen pixels and composites multiple layers onto the display.',
    keyPoints: [
      'Web Server processes incoming HTTP requests and delivers responses.',
      'Web Browser executes the Critical Rendering Path: DOM -> CSSOM -> Render Tree -> Layout -> Paint.',
      'JavaScript execution can block DOM construction unless loaded with `async` or `defer`.',
      'Reflow (layout) is computationally expensive compared to repainting.'
    ],
    example: 'When you type `indusuni.ac.in`, DNS resolves the domain to an IP, TCP handshake establishes a socket, an HTTP GET request fetches `index.html`, and Google Chrome Blink engine constructs the DOM/CSSOM tree to paint the homepage.',
    diagram: `CRITICAL RENDERING PATH:
HTML Bytes ===> Tokens ===> DOM Tree ----+
                                         |---> Render Tree ===> Layout ===> Paint
CSS Bytes  ===> Tokens ===> CSSOM Tree --+`,
    followUpQuestions: [
      {
        question: 'What is the difference between Reflow and Repaint?',
        answer: 'Reflow (Layout) recalculates the dimensions and positions of elements on the page. Repaint occurs when visual appearances change without altering geometry (e.g., color, background, visibility).'
      },
      {
        question: 'Why should CSS stylesheets be placed in the <head> and scripts at the bottom?',
        answer: 'Stylesheets in <head> prevent FOUC (Flash of Unstyled Content). Scripts at the bottom prevent parser-blocking JavaScript from delaying DOM construction and initial page render.'
      }
    ],
    quickRevision: 'Browser Critical Rendering Path converts HTML and CSS into DOM + CSSOM -> Render Tree -> Layout -> Paint.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 1 Syllabus',
      questionNumber: 'Q.5'
    },
    tags: ['browser-rendering', 'web-server', 'dom', 'cssom', 'critical-rendering-path']
  },
  {
    id: 'ce0522-u1-q6',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to WWW, HTTP Protocol, Web Browsers & HTML5',
    category: 'theory',
    difficulty: 'basic',
    questionNumber: 'Q.6',
    question: 'What is HTML5? Discuss the evolution of HTML and compare HTML4 vs HTML5.',
    shortAnswer: 'HTML5 is the fifth and current major revision of the Hypertext Markup Language standard, published by W3C and WHATWG. It transitioned the web from a document-sharing platform to a rich web application runtime environment by introducing native multimedia (`<audio>`, `<video>`), semantic elements, Canvas 2D graphics, Web Storage, and geolocation without third-party plugins like Flash.',
    detailedAnswer: '1. Evolution of HTML:\n   - HTML 1.0 (1991): Basic text tags by Tim Berners-Lee.\n   - HTML 2.0 (1995): Added form elements and table support.\n   - HTML 4.01 (1999): Standardized styling via external CSS stylesheets, introduced Strict, Transitional, and Frameset doctypes.\n   - XHTML 1.0 (2000): Strict XML reformulation requiring lowercase tags and closed tags.\n   - HTML5 (2014 - Present): Developed by WHATWG and W3C to eliminate proprietary browser plugins, simplify doctypes, and support mobile devices.\n\n2. HTML4 vs HTML5 Differences:\n   - DOCTYPE: HTML4 had a long, complex SGML DTD declaration (`<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"...>`). HTML5 is simple: `<!DOCTYPE html>`.\n   - Multimedia: HTML4 required external plugins (Adobe Flash, Silverlight). HTML5 supports native `<audio>` and `<video>` tags.\n   - Semantics: HTML4 relied heavily on generic `<div id="header">` or `<div class="footer">`. HTML5 provides semantic tags (`<header>`, `<nav>`, `<article>`, `<section>`, `<footer>`).\n   - Vector Graphics: HTML4 had no direct drawing capability. HTML5 includes native `<canvas>` (raster) and `<svg>` (vector).\n   - Client Storage: HTML4 used small 4 KB cookies sent with every request. HTML5 provides Web Storage (`localStorage` and `sessionStorage`) with 5-10 MB capacity.\n   - Character Encoding: HTML4: `<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">`. HTML5: `<meta charset="UTF-8">`.',
    keyPoints: [
      'HTML5 eliminated the need for external plugins like Flash for video/audio.',
      'Simplified DOCTYPE: `<!DOCTYPE html>`.',
      'Introduced native semantic elements (`<nav>`, `<header>`, `<article>`, `<footer>`).',
      'Added Canvas 2D, SVG, Web Storage, Geolocation, and Web Workers.'
    ],
    example: 'In HTML4, embedding video required: `<object type="application/x-shockwave-flash" data="player.swf">...`. In HTML5: `<video src="movie.mp4" controls></video>`.',
    diagram: `HTML4 vs HTML5 PAGE STRUCTURE:
HTML4:                              HTML5 Semantic:
+-----------------------------+     +-----------------------------+
| <div id="header">           |     | <header>                    |
+-----------------------------+     +-----------------------------+
| <div id="nav">              |     | <nav>                       |
+-----------------------------+     +-----------------------------+
| <div id="content">          |     | <main>                      |
|   <div class="article">     |     |   <article> / <section>     |
|   <div class="sidebar">     |     |   <aside>                   |
+-----------------------------+     +-----------------------------+
| <div id="footer">           |     | <footer>                    |
+-----------------------------+     +-----------------------------+`,
    followUpQuestions: [
      {
        question: 'Why is <!DOCTYPE html> required in HTML5 if HTML5 is not based on SGML?',
        answer: 'To prevent browsers from triggering "Quirks Mode". `<!DOCTYPE html>` forces modern browsers into "Standards Mode".'
      },
      {
        question: 'What is WHATWG?',
        answer: 'Web Hypertext Application Technology Working Group, founded by engineers from Apple, Mozilla, and Opera to maintain the living HTML standard.'
      }
    ],
    quickRevision: 'HTML5 introduced native multimedia, semantic tags, Canvas/SVG, Web Storage, and simple `<!DOCTYPE html>`, obsoleting Flash.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 1 Syllabus',
      questionNumber: 'Q.6'
    },
    tags: ['html5', 'evolution', 'doctype', 'multimedia', 'semantics']
  },
  {
    id: 'ce0522-u1-q7',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to WWW, HTTP Protocol, Web Browsers & HTML5',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.7',
    question: 'List deprecated tags in HTML5 and explain new HTML5 semantic tags with their purposes.',
    shortAnswer: 'HTML5 deprecated presentational and frame-based tags in favor of CSS styling and modern UX. Deprecated tags include `<font>`, `<center>`, `<marquee>`, `<strike>`, `<big>`, `<basefont>`, and `<frameset>`. New semantic tags provide meaningful structure: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`, `<figure>`, `<figcaption>`, and `<time>`.',
    detailedAnswer: '1. Deprecated Tags in HTML5 (and their modern replacements):\n   - `<font>`: Replaced by CSS `font-family`, `color`, `font-size`.\n   - `<center>`: Replaced by CSS `text-align: center` or Flexbox/Grid centering.\n   - `<marquee>`: Replaced by CSS3 `@keyframes` transitions.\n   - `<strike>` / `<s>`: Replaced by `<del>` (deleted text) or CSS `text-decoration: line-through`.\n   - `<big>`: Replaced by CSS `font-size: larger`.\n   - `<frameset>`, `<frame>`, `<noframes>`: Deprecated due to usability, accessibility, and bookmarking issues; replaced by `<iframe>` or AJAX/SPA components.\n\n2. HTML5 Semantic Tags & Their Purposes:\n   - `<header>`: Represents introductory content or navigation links for a document or section.\n   - `<nav>`: Contains primary site navigation links.\n   - `<main>`: Specifies the unique dominant content of the document `<body>` (must only appear once per page).\n   - `<article>`: Self-contained, independently distributable composition (e.g., blog post, forum post, product card).\n   - `<section>`: Thematic grouping of content, typically with a heading.\n   - `<aside>`: Content tangentially related to surrounding content (sidebars, callout boxes, advertisements).\n   - `<footer>`: Footer containing author copyright, contact info, and sitemaps.\n   - `<figure>` & `<figcaption>`: Encapsulates self-contained media (images, diagrams, code listings) with an explanatory caption.',
    keyPoints: [
      'Deprecated tags were removed because HTML handles structure, while CSS handles presentation.',
      'Semantic tags improve Search Engine Optimization (SEO) and web accessibility (screen readers).',
      '`<article>` is self-contained; `<section>` is a thematic grouping.',
      '`<main>` must be unique to the document.'
    ],
    example: `<article>\n  <h2>Understanding HTML5</h2>\n  <p>HTML5 provides clean semantics...</p>\n  <figure>\n    <img src="chart.png" alt="Architecture">\n    <figcaption>Fig 1. Browser Architecture</figcaption>\n  </figure>\n</article>`,
    diagram: `SEMANTIC PAGE HIERARCHY:
+-------------------------------------------------------------+
| <header> (Logo, University Name, Search)                   |
+-------------------------------------------------------------+
| <nav> (Home | Subjects | Viva Questions | Resources)        |
+-------------------------------------------------------------+
| <main>                                                      |
|   <section>                                                 |
|     <article> Primary Article Content </article>            |
|   </section>                                                |
|   <aside> Related Links & Advertisements </aside>           |
+-------------------------------------------------------------+
| <footer> (Copyright 2026, Privacy Policy, Contact)          |
+-------------------------------------------------------------+`,
    followUpQuestions: [
      {
        question: 'What is the main difference between <section> and <article>?',
        answer: 'An `<article>` is an independent, self-contained piece of content that makes sense on its own if syndicated (like an RSS feed item). A `<section>` is a generic thematic grouping of content, usually containing a heading.'
      },
      {
        question: 'Why were framesets deprecated in HTML5?',
        answer: 'They broke URL bookmarking, back-button navigation, search engine indexation, and created severe accessibility barriers for screen readers.'
      }
    ],
    quickRevision: 'Presentational tags (<font>, <center>, <marquee>) were deprecated for CSS; semantic tags (<header>, <nav>, <article>, <main>) clarify document meaning.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 1 Syllabus',
      questionNumber: 'Q.7'
    },
    tags: ['deprecated-tags', 'semantic-elements', 'article', 'section', 'seo']
  },
  {
    id: 'ce0522-u1-q8',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to WWW, HTTP Protocol, Web Browsers & HTML5',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.8',
    question: 'Discuss new HTML5 Form input types, validation attributes, and their advantages.',
    shortAnswer: 'HTML5 introduced native client-side form controls and validation, reducing the need for custom JavaScript. New input types include `email`, `url`, `number`, `range`, `date`, `time`, `color`, and `tel`. New attributes include `required`, `pattern` (regex), `placeholder`, `autofocus`, `autocomplete`, `min`, `max`, `step`, and `novalidate`.',
    detailedAnswer: '1. New HTML5 Form Input Types:\n   - `email`: Automatically validates email format (user@domain) and displays email keyboard on mobile devices.\n   - `url`: Validates absolute URL format (http:// or https://).\n   - `number`: Restricts input to numerical characters with spinner controls and `min`, `max`, `step` boundaries.\n   - `range`: Renders a slider control for selecting a number between `min` and `max`.\n   - `date`, `time`, `datetime-local`: Provides native OS date/time pickers without requiring jQuery UI.\n   - `color`: Displays an operating-system color picker returning hex codes (e.g., `#ff5733`).\n   - `search`: Styled specifically for search queries with a quick clear icon.\n\n2. New Form Validation Attributes:\n   - `required`: Mandates that the field must not be empty before form submission.\n   - `pattern="[A-Z0-9]{6}"`: Enforces input to match a specified Regular Expression.\n   - `placeholder`: Displays temporary gray instructional hint text.\n   - `autofocus`: Automatically moves keyboard focus to the input upon page load.\n   - `novalidate`: Attribute on `<form>` to bypass browser-native HTML5 validation when testing.\n   - `autocomplete="on|off"`: Controls browser autofill behavior.\n\n3. Advantages:\n   - Native browser validation is faster and runs before JavaScript loads.\n   - Mobile keyboards automatically adapt (e.g., numeric pad for `type="number"`, `.com` key for `email`).\n   - Provides accessible tooltip popups for errors without writing custom JavaScript.',
    keyPoints: [
      'Input types: `email`, `url`, `number`, `date`, `color`, `range`.',
      'Attributes: `required`, `pattern`, `placeholder`, `autofocus`, `min`, `max`.',
      'Native validation runs before form submission event.',
      'Mobile operating systems adjust virtual keyboards to match input type.'
    ],
    example: `<form action="/register" method="POST">\n  <input type="email" placeholder="Enter college email" required>\n  <input type="password" pattern=".{8,}" placeholder="Min 8 chars" required>\n  <input type="number" min="1" max="8" value="5">\n  <input type="submit" value="Register">\n</form>`,
    diagram: `HTML5 FORM VALIDATION PIPELINE:
User clicks Submit Button
       |
       v
Browser checks HTML5 constraints (required, pattern, type="email")
       |
  +----+----+
  |         |
Valid    Invalid
  |         |
  v         v
Form     Browser halts submit & displays native tooltip:
Submits  "Please enter an email address." / "Please fill out this field."`,
    followUpQuestions: [
      {
        question: 'Should client-side HTML5 validation replace backend validation in PHP/Node?',
        answer: 'Never! Client-side validation improves user experience, but malicious users can bypass it by disabling JavaScript or using cURL/Postman. Server-side validation is mandatory for security.'
      },
      {
        question: 'How do you check form validity programmatically using JavaScript?',
        answer: 'Using the Constraint Validation API methods: `inputElement.checkValidity()` and `inputElement.reportValidity()`.'
      }
    ],
    quickRevision: 'HTML5 forms introduce email, date, number, range inputs, and required, pattern attributes for native client-side validation.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 1 Syllabus',
      questionNumber: 'Q.8'
    },
    tags: ['forms', 'html5-forms', 'validation', 'regex', 'input-types']
  },
  {
    id: 'ce0522-u1-q9',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to WWW, HTTP Protocol, Web Browsers & HTML5',
    category: 'theory',
    difficulty: 'advanced',
    questionNumber: 'Q.9',
    question: 'Compare HTML5 Canvas vs SVG in detail with architecture, use cases, and code.',
    shortAnswer: 'HTML5 Canvas is a procedural, pixel/raster-based drawing surface manipulated via JavaScript 2D/3D Context API (immediate mode). SVG (Scalable Vector Graphics) is a declarative, XML-based vector graphics format integrated directly into the DOM (retained mode). Canvas is superior for high-performance graphics and game rendering with thousands of moving objects; SVG is superior for resolution-independent scalable icons, interactive UI charts, and elements requiring DOM event handlers.',
    detailedAnswer: '1. Architectural Differences:\n   - Rendering Paradigm: Canvas uses Immediate Mode (draws pixels to bitmap; forgets shapes once drawn). SVG uses Retained Mode (every shape is a DOM node remembered by the browser).\n   - DOM Integration: Canvas has only 1 DOM node (`<canvas>`). SVG creates separate DOM nodes for every element (`<rect>`, `<circle>`, `<path>`).\n   - Event Handling: Canvas does not support per-shape event listeners (requires manual coordinate hit-testing). SVG supports standard DOM events (`onclick`, `:hover`) directly on any shape.\n   - Resolution / Scaling: Canvas is resolution-dependent and pixels become blurry/pixelated when zoomed. SVG is mathematical vector and resolution-independent at any zoom.\n\n2. Performance Trade-off:\n   - Canvas: Performance depends on canvas pixel dimensions. Fast when rendering 10,000+ moving particles or complex games.\n   - SVG: Performance degrades if there are thousands of DOM nodes because the browser layout engine must manage each element in the DOM tree.\n\n3. Use Cases:\n   - Canvas: 2D/3D video games, physics simulations, real-time video manipulation, data heatmaps.\n   - SVG: Logos, UI icons, responsive diagrams, interactive geographical maps (D3.js), business charts.',
    keyPoints: [
      'Canvas = Raster / Pixel-based, Immediate mode, JavaScript API driven, resolution-dependent.',
      'SVG = Vector / XML-based, Retained mode, DOM elements, resolution-independent.',
      'Canvas has no built-in DOM event listeners for individual shapes; SVG attaches `onClick` directly to `<circle>` or `<path>`.',
      'Canvas is best for high-object-count animations and games; SVG is best for scalable icons and charts.'
    ],
    example: `// Canvas Example (JS Procedural):
const ctx = document.getElementById('myCanvas').getContext('2d');
ctx.fillStyle = 'blue';
ctx.fillRect(10, 10, 100, 50);

<!-- SVG Example (Declarative XML): -->
<svg width="200" height="100">
  <rect x="10" y="10" width="100" height="50" fill="blue" onclick="alert('Clicked!')"/>
</svg>`,
    diagram: `CANVAS vs SVG COMPARISON:
+------------------------+-------------------------------------+
| Feature                | HTML5 Canvas         | SVG          |
+------------------------+----------------------+--------------+
| Rendering Type         | Raster (Pixels)      | Vector (Math)|
| Mode                   | Immediate Mode       | Retained Mode|
| DOM Nodes              | 1 (<canvas> only)    | Many (<path>)|
| Event Listeners        | No (manual math)     | Yes (DOM)    |
| Resolution             | Degrades on zoom     | Infinite crisp|
| Best For               | Games, Simulations   | Icons, Charts|
+------------------------+----------------------+--------------+`,
    followUpQuestions: [
      {
        question: 'How do you obtain the 2D rendering context of an HTML5 canvas element?',
        answer: '`const ctx = canvasElement.getContext("2d");`'
      },
      {
        question: 'What rendering context is used for 3D graphics in HTML5 Canvas?',
        answer: 'WebGL (`canvasElement.getContext("webgl")` or `"webgl2"`).'
      }
    ],
    quickRevision: 'Canvas renders pixels via JavaScript for games; SVG creates scalable XML vector elements in the DOM with event listeners.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 1 Syllabus',
      questionNumber: 'Q.9'
    },
    tags: ['canvas', 'svg', 'graphics', 'webgl', 'vector-vs-raster']
  },
  {
    id: 'ce0522-u1-q10',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to WWW, HTTP Protocol, Web Browsers & HTML5',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.10',
    question: 'Explain HTML5 Web Storage API and compare localStorage vs sessionStorage vs Cookies.',
    shortAnswer: 'HTML5 Web Storage provides client-side key-value storage mechanisms: `localStorage` (persists indefinitely until explicitly cleared) and `sessionStorage` (persists only for the duration of the browser tab session). Both offer 5-10 MB storage and are never sent automatically to the server, outperforming legacy 4 KB HTTP cookies in capacity, performance, and security.',
    detailedAnswer: '1. Why Web Storage was introduced:\n   Prior to HTML5, web developers used Cookies to store client data. However, cookies are limited to 4 KB, are transmitted in every HTTP request header (wasting bandwidth), and require complex string parsing.\n\n2. Storage Mechanisms Compared:\n   - `localStorage`:\n     * Capacity: ~5MB to 10MB per origin.\n     * Lifetime: Permanent. Data survives browser restarts and OS reboots until explicitly cleared by user or script.\n     * Scope: Shared across all tabs and windows of the same origin (protocol + host + port).\n   - `sessionStorage`:\n     * Capacity: ~5MB per origin.\n     * Lifetime: Scoped to the current tab session. Cleared immediately when the browser tab is closed.\n     * Scope: Isolated to that specific tab; opening the same URL in a new tab creates a fresh session.\n   - `Cookies`:\n     * Capacity: 4 KB maximum per cookie.\n     * Lifetime: Configurable via `Expires` or `Max-Age` header.\n     * Data Transfer: Automatically transmitted to the web server in every HTTP request header (`Cookie: name=val`).\n     * Security flags: Supports `HttpOnly` (inaccessible to JavaScript, prevents XSS) and `Secure` (HTTPS only).\n\n3. Web Storage API Methods:\n   - `localStorage.setItem("key", "value")`: Stores key-value string.\n   - `localStorage.getItem("key")`: Retrieves value string (or null).\n   - `localStorage.removeItem("key")`: Deletes item.\n   - `localStorage.clear()`: Wipes all keys for origin.\n   - `localStorage.length`: Number of stored items.',
    keyPoints: [
      '`localStorage`: Persists indefinitely, 5-10 MB, shared across tabs of same origin.',
      '`sessionStorage`: Destroyed when tab closes, 5 MB, isolated per tab.',
      '`Cookies`: 4 KB, sent with every HTTP request, supports `HttpOnly` flag.',
      'Web Storage only stores strings; JavaScript objects must be serialized using `JSON.stringify()`.'
    ],
    example: `// Storing user preference:\nconst userTheme = { mode: 'dark', fontSize: 16 };\nlocalStorage.setItem('settings', JSON.stringify(userTheme));\n\n// Retrieving preference:\nconst settings = JSON.parse(localStorage.getItem('settings'));\nconsole.log(settings.mode); // 'dark'`,
    diagram: `STORAGE COMPARISON TABLE:
+--------------------+----------------+-------------------+----------------+
| Characteristic     | localStorage   | sessionStorage    | Cookies        |
+--------------------+----------------+-------------------+----------------+
| Storage Capacity   | 5 - 10 MB      | ~5 MB             | 4 KB           |
| Expiration         | Never          | On tab close      | Set by header  |
| Sent to Server     | No             | No                | Yes (Every Req)|
| Accessible via JS  | Yes            | Yes               | Yes (unless    |
|                    |                |                   |  HttpOnly)     |
+--------------------+----------------+-------------------+----------------+`,
    followUpQuestions: [
      {
        question: 'Can you store sensitive authentication tokens (like JWTs) in localStorage?',
        answer: 'It is risky because any Cross-Site Scripting (XSS) vulnerability allows malicious scripts to execute `localStorage.getItem()` and steal the token. Secure `HttpOnly` cookies are safer for auth tokens.'
      },
      {
        question: 'What happens if you store a JavaScript Object directly in localStorage without JSON.stringify()?',
        answer: 'JavaScript converts it to the string `"[object Object]"`, destroying the data properties.'
      }
    ],
    quickRevision: 'localStorage persists permanently (5-10MB); sessionStorage dies on tab close; cookies (4KB) are transmitted with every HTTP request.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 1 Syllabus',
      questionNumber: 'Q.10'
    },
    tags: ['web-storage', 'localstorage', 'sessionstorage', 'cookies', 'security']
  },
  {
    id: 'ce0522-u1-q11',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to WWW, HTTP Protocol, Web Browsers & HTML5',
    category: 'theory',
    difficulty: 'basic',
    questionNumber: 'Q.11',
    question: 'Explain HTML5 Audio and Video elements with their attributes and code examples.',
    shortAnswer: 'HTML5 introduced native `<audio>` and `<video>` elements to embed media without external plugins. Key attributes include `controls` (displays playback buttons), `autoplay`, `loop`, `muted`, `poster` (thumbnail image for video), and `<source>` tags to provide cross-browser format fallbacks (MP4, WebM, Ogg, MP3).',
    detailedAnswer: '1. The `<video>` Element:\n   Used for embedding video streams in web pages.\n   Key Attributes:\n   - `controls`: Renders native browser UI controls (play/pause, timeline slider, volume, fullscreen).\n   - `autoplay`: Starts playback automatically upon page load (modern browsers require `muted` for autoplay to work).\n   - `loop`: Restarts playback from beginning when finished.\n   - `muted`: Sets audio volume to silent by default.\n   - `poster="url"`: Specifies a preview image displayed while video is downloading or before play starts.\n   - `width` and `height`: Video display dimensions in pixels.\n   - `preload="auto|metadata|none"`: Informs browser about caching strategy.\n\n2. The `<audio>` Element:\n   Embeds sound files and podcasts. Uses the same attributes (`controls`, `autoplay`, `loop`, `muted`, `preload`).\n\n3. Cross-Browser Media Support via `<source>`:\n   Different browsers support different audio/video codecs. Multiple `<source>` elements allow the browser to pick the first format it understands.',
    keyPoints: [
      'Eliminated requirement for proprietary plugins like Adobe Flash or QuickTime.',
      '`controls` attribute enables play, pause, volume, and progress sliders.',
      'Modern browsers block video `autoplay` unless `muted` is also present to prevent user disruption.',
      'Supported video formats: MP4 (H.264 + AAC), WebM (VP8/VP9 + Vorbis), Ogg (Theora + Vorbis).'
    ],
    example: `<video width="640" height="360" controls poster="thumb.jpg">\n  <source src="lecture.mp4" type="video/mp4">\n  <source src="lecture.webm" type="video/webm">\n  Your browser does not support the video tag.\n</video>\n\n<audio controls>\n  <source src="podcast.mp3" type="audio/mpeg">\n  <source src="podcast.ogg" type="audio/ogg">\n</audio>`,
    diagram: `HTML5 VIDEO ELEMENT STRUCTURE:
<video controls poster="preview.jpg">
  +---> <source src="video.mp4" type="video/mp4">  (Checked 1st)
  +---> <source src="video.webm" type="video/webm"> (Checked 2nd)
  +---> Fallback plain text message for outdated browsers
</video>`,
    followUpQuestions: [
      {
        question: 'Why does autoplay not work on most mobile and modern desktop browsers?',
        answer: 'Browser autoplay policies prevent unsolicited audio from disrupting users and consuming mobile bandwidth. Video will only autoplay if it has the `muted` attribute set.'
      },
      {
        question: 'What is the role of the <track> element inside <video>?',
        answer: 'The `<track>` element specifies timed text tracks such as subtitles, closed captions, and chapter titles using WebVTT format (`.vtt`).'
      }
    ],
    quickRevision: 'HTML5 `<video>` and `<audio>` tags natively play media using controls, autoplay, loop, poster, and multiple `<source>` fallback formats.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 1 Syllabus',
      questionNumber: 'Q.11'
    },
    tags: ['audio', 'video', 'html5-media', 'codecs', 'webvtt']
  },
  {
    id: 'ce0522-u1-q12',
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    section: 'Unit 1: Introduction to WWW, HTTP Protocol, Web Browsers & HTML5',
    category: 'theory',
    difficulty: 'intermediate',
    questionNumber: 'Q.12',
    question: 'Explain HTML Event categories and event handler attributes.',
    shortAnswer: 'HTML events are signals triggered by user interactions (mouse clicks, typing, scrolling) or browser lifecycle actions (page loading, resizing). Event handlers are attributes (`onclick`, `onsubmit`, `onload`) attached to HTML elements that execute JavaScript code when the event fires.',
    detailedAnswer: '1. Major Categories of HTML Events:\n   - Window / Document Events: Occur at the browser window level.\n     * `onload`: Triggered when the entire page including DOM, images, and stylesheets has completed loading.\n     * `onresize`: Fires when browser window dimensions change.\n     * `onscroll`: Fires when the user scrolls the viewport.\n     * `onunload` / `onbeforeunload`: Triggered when closing or navigating away.\n   - Form Events: Triggered by user interaction with form controls.\n     * `onsubmit`: Fires when a `<form>` is submitted (can return `false` to abort submission).\n     * `onchange`: Fires when an input element loses focus and its value has changed.\n     * `oninput`: Fires immediately in real-time as the user types into an input/textarea.\n     * `onfocus` / `onblur`: Fires when element receives or loses keyboard focus.\n   - Mouse Events:\n     * `onclick`, `ondblclick`: Single / double click.\n     * `onmouseover`, `onmouseout`: Mouse cursor enters or leaves element.\n     * `onmouseenter`, `onmouseleave`: Enter/leave without bubbling.\n   - Keyboard Events:\n     * `onkeydown`: Fires when a physical key is pressed down.\n     * `onkeyup`: Fires when a released key returns up.\n\n2. HTML Attribute vs DOM Event Listener:\n   - Inline HTML handler: `<button onclick="doAction()">Click</button>` (mixes markup and logic).\n   - Modern Best Practice: `document.getElementById("btn").addEventListener("click", doAction);` (separates concerns and supports multiple listeners).',
    keyPoints: [
      'Events notify code of user actions (clicks, keypresses) or browser states (load, resize).',
      'Form events: `onsubmit`, `onchange`, `oninput`, `onfocus`, `onblur`.',
      '`onload` fires after all external assets finish loading; `DOMContentLoaded` fires when HTML DOM is parsed.',
      'Modern web standards favor `addEventListener()` over inline HTML event attributes.'
    ],
    example: `<form id="loginForm" onsubmit="return validateForm()">\n  <input type="text" id="uname" oninput="showLiveCharCount()">\n  <button type="submit">Log In</button>\n</form>`,
    diagram: `EVENT EXECUTION FLOW:
[User Types into <input>] ===> Browser Fires 'input' Event ===> Triggers oninput Handler ===> Updates Character Counter`,
    followUpQuestions: [
      {
        question: 'What is the difference between onload and DOMContentLoaded?',
        answer: '`DOMContentLoaded` fires as soon as the HTML document has been completely parsed into the DOM tree (without waiting for stylesheets, images, or subframes). `onload` waits until all images, stylesheets, and external assets have fully finished downloading.'
      },
      {
        question: 'What is the purpose of returning false from an onsubmit handler?',
        answer: 'Returning `false` cancels the default browser behavior, preventing the form from submitting and reloading the page.'
      }
    ],
    quickRevision: 'HTML events handle user interaction and browser states; best handled via JavaScript `addEventListener()` rather than inline attributes.',
    source: {
      type: 'syllabus',
      name: 'CE0522 Web Technology Unit 1 Syllabus',
      questionNumber: 'Q.12'
    },
    tags: ['events', 'dom-events', 'onload', 'onsubmit', 'event-handling']
  }
];
