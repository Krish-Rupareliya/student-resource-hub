import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'frontend', 'src');

console.log('--- RALPH MOBILE RESPONSIVENESS & SPACING VERIFICATION SUITE ---');

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
    failedTests++;
  }
}

// 1. Check for single <main> tag (no child pages should declare <main>)
const pagesDir = path.join(srcDir, 'pages');
function getFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(filePath);
    }
  });
  return results;
}

const pageFiles = getFilesRecursively(pagesDir);
let pagesWithMain = [];

pageFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  // Match <main as a JSX tag
  if (/<main[\s>]/i.test(content)) {
    pagesWithMain.push(path.relative(projectRoot, file));
  }
});

assert(
  pagesWithMain.length === 0,
  `Semantic HTML check: No child page components contain nested <main> tags (found in: ${pagesWithMain.join(', ') || 'none'})`
);

// 2. Check for zero unicode emojis in pages and components
const componentFiles = getFilesRecursively(path.join(srcDir, 'components'));
const allSourceFiles = [...pageFiles, ...componentFiles];

// Pictorial emoji regex range (excluding standard typographic dingbats like ★, ✕, ✓)
const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FAFF}]/u;

let filesWithEmoji = [];
allSourceFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // Exclude comments if any, or check literal emojis
    if (emojiRegex.test(line)) {
      filesWithEmoji.push({
        file: path.relative(projectRoot, file),
        line: idx + 1,
        snippet: line.trim()
      });
    }
  });
});

assert(
  filesWithEmoji.length === 0,
  `Design Guidelines check: Zero unicode emojis across pages and components (found: ${filesWithEmoji.length} occurrences)`
);
if (filesWithEmoji.length > 0) {
  console.log('Emoji details:', filesWithEmoji);
}

// 3. Verify Specific Mobile Responsive Patterns
// 3a. HeroSection responsive button stacking
const heroContent = fs.readFileSync(path.join(pagesDir, 'Home', 'components', 'HeroSection.jsx'), 'utf-8');
assert(
  heroContent.includes('flex-col sm:flex-row') && heroContent.includes('w-full sm:w-auto'),
  'HeroSection: CTA buttons have responsive mobile stacking (flex-col sm:flex-row w-full sm:w-auto)'
);

// 3b. ExamCountdownAndCalculator responsive inputs
const examContent = fs.readFileSync(path.join(pagesDir, 'Home', 'components', 'ExamCountdownAndCalculator.jsx'), 'utf-8');
assert(
  examContent.includes('w-full sm:w-auto') && examContent.includes('sm:hidden'),
  'ExamCountdownAndCalculator: Grade rows and sample buttons have mobile-friendly wrapping and responsive labels'
);

// 3c. Opportunities card title padding
const oppContent = fs.readFileSync(path.join(pagesDir, 'Opportunities', 'Opportunities.jsx'), 'utf-8');
assert(
  oppContent.includes('pr-6 sm:pr-36'),
  'Opportunities: Card title padding uses responsive mobile spacing (pr-6 sm:pr-36)'
);

// 3d. Community referendum grid
const commContent = fs.readFileSync(path.join(pagesDir, 'Community', 'Community.jsx'), 'utf-8');
assert(
  commContent.includes('grid-cols-1 sm:grid-cols-3'),
  'Community: Referendum impact blocks adapt to single-column on mobile viewports'
);

// 3e. StudyBuddyWidget mobile sizing
const studyBuddyContent = fs.readFileSync(path.join(srcDir, 'components', 'common', 'StudyBuddyWidget.jsx'), 'utf-8');
assert(
  studyBuddyContent.includes('w-[calc(100vw-24px)]') && studyBuddyContent.includes('max-w-[340px]'),
  'StudyBuddyWidget: Floating popover has viewport-bounded responsive width for 320px screens'
);

console.log(`\n==========================================`);
console.log(`Total Passed: ${passedTests} | Total Failed: ${failedTests}`);
console.log(`==========================================\n`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL RALPH MOBILE RESPONSIVENESS CHECKS PASSED SUCCESSFULLY!');
}
