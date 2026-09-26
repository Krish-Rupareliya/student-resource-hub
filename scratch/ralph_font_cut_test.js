import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const folderCardFile = path.join(
  projectRoot,
  'frontend',
  'src',
  'components',
  'subjects',
  'FolderSubjectCard.jsx'
);

console.log('--- RALPH FONT CUT & TYPOGRAPHY CLIPPING VERIFICATION SUITE ---');

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

const folderContent = fs.readFileSync(folderCardFile, 'utf-8');

// 1. Check for dedicated right padding protection on the italic title
assert(
  folderContent.includes('inline-block pl-0.5 pr-3') || folderContent.includes('pr-3 sm:pr-4'),
  'FolderSubjectCard: Title span includes dedicated right padding (pr-3/pr-4) preventing slanted glyph edge clipping'
);

// 2. Check for vertical clearance (leading-tight and py-0.5)
assert(
  folderContent.includes('leading-tight') && folderContent.includes('py-0.5'),
  'FolderSubjectCard: Title heading provides vertical clearance (leading-tight py-0.5) preventing ascender/descender slicing'
);

// 3. Check for dynamic font size scaling for long titles (7+ chars like MATHS-1)
assert(
  folderContent.includes('titleSizeClass') && folderContent.includes('shortTitle.length >= 7'),
  'FolderSubjectCard: Title size dynamically scales down for titles >= 7 chars (e.g. MATHS-1)'
);

// 4. Check for accessible tooltip title attribute
assert(
  folderContent.includes('title={shortTitle}'),
  'FolderSubjectCard: Title element has title={shortTitle} accessibility attribute'
);

// 5. Scan all files in frontend/src/ for unpadded italic line-clamp headings
const srcDir = path.join(projectRoot, 'frontend', 'src');
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

const allFiles = getFilesRecursively(srcDir);
let riskyElements = [];

allFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // Check if line has both italic and line-clamp-1 without padding
    if (line.includes('italic') && line.includes('line-clamp-1') && !line.includes('pr-')) {
      riskyElements.push({
        file: path.relative(projectRoot, file),
        line: idx + 1,
        snippet: line.trim()
      });
    }
  });
});

assert(
  riskyElements.length === 0,
  `Typography Audit: Zero unpadded italic line-clamp elements in codebase (found: ${riskyElements.length})`
);

console.log(`\n==========================================`);
console.log(`Total Passed: ${passedTests} | Total Failed: ${failedTests}`);
console.log(`==========================================\n`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL RALPH FONT CUT VERIFICATION CHECKS PASSED SUCCESSFULLY!');
}
