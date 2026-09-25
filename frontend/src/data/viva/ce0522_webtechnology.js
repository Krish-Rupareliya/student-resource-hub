// frontend/src/data/viva/ce0522_webtechnology.js
/**
 * CE0522: Web Technology (Semester 5)
 * Master Viva Question Bank & Practical Laboratory Solutions
 */

import { CE0522_UNIT1_QUESTIONS } from './ce0522_unit1.js';
import { CE0522_UNIT2_QUESTIONS } from './ce0522_unit2.js';
import { CE0522_UNIT3_QUESTIONS } from './ce0522_unit3.js';
import { CE0522_UNIT4_QUESTIONS } from './ce0522_unit4.js';
import { CE0522_EXPERIMENTS } from './ce0522_experiments.js';

export const CE0522_ALL_QUESTIONS = [
  ...CE0522_UNIT1_QUESTIONS,
  ...CE0522_UNIT2_QUESTIONS,
  ...CE0522_UNIT3_QUESTIONS,
  ...CE0522_UNIT4_QUESTIONS
];

export const CE0522_VIVA = {
  subjectCode: 'CE0522',
  subjectName: 'Web Technology',
  department: 'CE/IT/CSE',
  semester: 5,
  syllabusOverview: 'Comprehensive 4-Unit curriculum covering WWW & HTTP protocols, Web Browsers/Servers, HTML5 semantic markup, Canvas 2D & SVG, CSS3 styling & keyframe animations, Bootstrap responsive framework, JavaScript & Advanced JavaScript (DOM events, prototypal inheritance, cookies, validation), AngularJS client-side MVC framework (two-way binding, directives, filters, services, forms, $http), server-side PHP (syntax, sessions, OOP, exceptions), MySQL database integration (prepared statements, phpMyAdmin), and web hosting.',
  hasPracticals: true,
  sections: [
    { id: 'unit-1', name: 'Unit 1: Introduction to WWW, HTTP Protocol, Web Browsers & HTML5', type: 'theory' },
    { id: 'unit-2', name: 'Unit 2: CSS3 Styling, Animations, Bootstrap & JavaScript Programming', type: 'theory' },
    { id: 'unit-3', name: 'Unit 3: AngularJS MVC Architecture, Directives, Filters, Services & Forms', type: 'theory' },
    { id: 'unit-4', name: 'Unit 4: Server-Side PHP, Session Handling, MySQL Database & Web Hosting', type: 'theory' },
    { id: 'practicals', name: 'Laboratory Practical Experiments', type: 'practical' }
  ],
  experiments: CE0522_EXPERIMENTS,
  questions: CE0522_ALL_QUESTIONS
};
