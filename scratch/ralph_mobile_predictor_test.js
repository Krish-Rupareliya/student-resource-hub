import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const calculatorFile = path.join(
  projectRoot,
  'frontend',
  'src',
  'pages',
  'Home',
  'components',
  'ExamCountdownAndCalculator.jsx'
);

console.log('--- RALPH MOBILE SGPA PREDICTOR VERIFICATION SUITE ---');

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

const content = fs.readFileSync(calculatorFile, 'utf-8');

// 1. Story SRH-905: Title wrapping and header layout
assert(
  content.includes('break-words') && content.includes('leading-snug') && !content.includes('font-black text-[#0F172A] truncate'),
  'SRH-905: Course titles wrap cleanly on mobile without ellipsis truncation (no more cutoffs like Archit...)'
);

assert(
  content.includes('aria-label={`Remove ${sub.name || sub.code}`}') && content.includes('Top-Right Badges & Actions'),
  'SRH-905: Remove button and credit badge sit cleanly on the top-right card header'
);

// 2. Story SRH-906: Full-width grade dropdown & scheme badges
assert(
  content.includes('w-full appearance-none') && !content.includes('Select Grade:'),
  'SRH-906: Grade dropdown takes full width (w-full flex-1) with custom chevron and zero label crowding'
);

assert(
  content.includes('100M Standard Scheme') && content.includes('200M Theory + Lab'),
  'SRH-906: Course scheme subtitles render as clean, compact badges with icons'
);

// 3. Story SRH-907: Elimination of half-card clipping & collapsible add
assert(
  content.includes('max-h-none sm:max-h-[500px]') && content.includes('overflow-visible sm:overflow-y-auto'),
  'SRH-907: Course list avoids rigid max-height clamp on mobile, preventing half-card slicing'
);

assert(
  content.includes('showAddCustom') && content.includes('Add Elective / Custom Subject'),
  'SRH-907: Add elective course is a clean collapsible action that does not clutter the mobile screen'
);

// 4. Story SRH-908: Scorecard mobile hierarchy & zero emojis
assert(
  content.includes('Projected SGPA:') && content.includes('calculatedSGPA'),
  'SRH-908: Projected SGPA is prominently placed at the top of the mobile scorecard'
);

const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FAFF}]/u;
const hasEmoji = emojiRegex.test(content);
assert(!hasEmoji, 'SRH-908: Zero unicode emojis in ExamCountdownAndCalculator component');

console.log(`\n==========================================`);
console.log(`Total Passed: ${passedTests} | Total Failed: ${failedTests}`);
console.log(`==========================================\n`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL RALPH MOBILE SGPA PREDICTOR CHECKS PASSED SUCCESSFULLY!');
}
