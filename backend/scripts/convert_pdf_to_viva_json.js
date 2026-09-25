// backend/scripts/convert_pdf_to_viva_json.js
/**
 * Universal PDF & Text to Viva Questions JSON Converter
 * 
 * Usage:
 *   node backend/scripts/convert_pdf_to_viva_json.js <input.pdf|input.txt> [output.json]
 * 
 * Converts structured question banks from PDF or TXT into the exact JSON format
 * required by the Student Resource Hub Bulk Import system.
 */

'use strict';

const fs = require('fs');
const path = require('path');

async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === '.pdf') {
    const pdfLib = require('pdf-parse');
    const buffer = fs.readFileSync(filePath);

    if (pdfLib.PDFParse) {
      const parser = new pdfLib.PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      return result.text || '';
    } else if (typeof pdfLib === 'function') {
      const data = await pdfLib(buffer);
      return data.text || '';
    } else {
      throw new Error('Unknown pdf-parse library structure');
    }
  } else if (ext === '.txt' || ext === '.md') {
    return fs.readFileSync(filePath, 'utf8');
  } else {
    throw new Error(`Unsupported file type: ${ext}. Supported formats: .pdf, .txt, .md`);
  }
}

/**
 * Parses raw document text into standardized viva question objects.
 */
function parseVivaText(rawText) {
  // Normalize line endings
  const text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = text.split('\n');

  const questions = [];
  let currentUnitId = 'unit-1';
  let currentSection = 'Unit 1: General Viva Questions';

  let currentQ = null;
  let activeField = null; // 'detailedAnswer', 'diagram', 'quickRevision', 'punchline', 'followup'

  const finalizeCurrentQuestion = () => {
    if (!currentQ) return;
    if (currentQ.question && (currentQ.detailedAnswer || currentQ.shortAnswer)) {
      // Clean up fields
      currentQ.question = currentQ.question.trim();
      currentQ.shortAnswer = currentQ.shortAnswer ? currentQ.shortAnswer.trim() : null;
      currentQ.detailedAnswer = currentQ.detailedAnswer
        ? currentQ.detailedAnswer.trim()
        : currentQ.shortAnswer;
      currentQ.quickRevision = currentQ.quickRevision ? currentQ.quickRevision.trim() : null;
      currentQ.diagram = currentQ.diagram ? currentQ.diagram.trim() : null;
      currentQ.difficulty = (currentQ.difficulty || 'basic').toLowerCase().trim();
      currentQ.category = (currentQ.category || 'theory').toLowerCase().trim();

      if (!['basic', 'intermediate', 'advanced'].includes(currentQ.difficulty)) {
        currentQ.difficulty = 'basic';
      }

      questions.push(currentQ);
    }
    currentQ = null;
    activeField = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Ignore empty lines and PDF page number headers/footers
    if (!trimmed) continue;
    if (
      trimmed.match(/^-{1,2}\s*[0-9]+\s*(?:of|\/)\s*[0-9]+\s*-{1,2}$/i) ||
      trimmed.match(/^Page\s+[0-9]+(?:\s*(?:of|\/)\s*[0-9]+)?$/i) ||
      trimmed.match(/^-{1,2}\s*[0-9]+\s*-{1,2}$/)
    ) {
      continue;
    }

    // 1. Detect Unit / Section Header (e.g. "=== UNIT 1: Introduction ===" or "### Unit 2: CSS" or "Unit 1: ...")
    const unitMatch =
      trimmed.match(/^(?:={2,}\s*)?(?:UNIT|MODULE|SECTION)\s*([0-9]+)\s*[:\-–]\s*(.*?)(?:\s*={2,})?$/i) ||
      trimmed.match(/^#{1,3}\s*(?:UNIT|MODULE|SECTION)\s*([0-9]+)\s*[:\-–]\s*(.*?)$/i);

    if (unitMatch) {
      finalizeCurrentQuestion();
      const unitNum = unitMatch[1];
      const unitTitle = unitMatch[2].replace(/={2,}/g, '').trim();
      currentUnitId = `unit-${unitNum}`;
      currentSection = `Unit ${unitNum}: ${unitTitle}`;
      continue;
    }

    // 2. Detect Question Starter (e.g. "[Q.1] What is ...", "Q1. What is ...", "Question 1: What is ...")
    const qMatch =
      trimmed.match(/^(?:\[\s*(Q\.?\s*[0-9]+)\s*\]|\b(Q\.?\s*[0-9]+)[\.:\)]|\bQuestion\s*([0-9]+)[\.:])\s*(.*)$/i);

    if (qMatch) {
      finalizeCurrentQuestion();
      const qNum = (qMatch[1] || qMatch[2] || `Q.${qMatch[3]}`).replace(/\s+/g, '');
      const qText = qMatch[4] ? qMatch[4].trim() : '';

      currentQ = {
        unitId: currentUnitId,
        section: currentSection,
        category: 'theory',
        difficulty: 'basic',
        questionNumber: qNum,
        question: qText,
        shortAnswer: '',
        detailedAnswer: '',
        quickRevision: '',
        diagram: '',
        tags: [],
        followUpQuestions: [],
        isPublished: true,
      };
      activeField = qText ? null : 'question';
      continue;
    }

    // If no active question being built, skip noise
    if (!currentQ) continue;

    // 3. Question text continuation (if question was on next line)
    if (activeField === 'question') {
      if (trimmed.startsWith('Difficulty:') || trimmed.startsWith('Punchline:') || trimmed.startsWith('Short Answer:')) {
        activeField = null;
      } else {
        currentQ.question += (currentQ.question ? ' ' : '') + trimmed;
        continue;
      }
    }

    // 4. Metadata tags
    const diffMatch = trimmed.match(/^Difficulty\s*:\s*(basic|intermediate|advanced)/i);
    if (diffMatch) {
      currentQ.difficulty = diffMatch[1].toLowerCase();
      activeField = null;
      continue;
    }

    const catMatch = trimmed.match(/^Category\s*:\s*(.*)$/i);
    if (catMatch) {
      currentQ.category = catMatch[1].trim();
      activeField = null;
      continue;
    }

    const tagsMatch = trimmed.match(/^Tags\s*:\s*(.*)$/i);
    if (tagsMatch) {
      currentQ.tags = tagsMatch[1]
        .split(/[,#]/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      activeField = null;
      continue;
    }

    // 5. Short Answer / Punchline
    const punchMatch = trimmed.match(/^(?:Punchline|Short Answer|Direct Recall)\s*:\s*(.*)$/i);
    if (punchMatch) {
      currentQ.shortAnswer = punchMatch[1].trim();
      activeField = 'shortAnswer';
      continue;
    }

    // 6. Detailed Answer
    const detailMatch = trimmed.match(/^(?:Detailed Answer|Explanation|Answer)\s*:\s*(.*)$/i);
    if (detailMatch) {
      currentQ.detailedAnswer = detailMatch[1].trim();
      activeField = 'detailedAnswer';
      continue;
    }

    // 7. Quick Revision
    const revMatch = trimmed.match(/^(?:Quick Revision|Exam Tip|Key Point)\s*:\s*(.*)$/i);
    if (revMatch) {
      currentQ.quickRevision = revMatch[1].trim();
      activeField = 'quickRevision';
      continue;
    }

    // 8. Diagram
    const diagMatch = trimmed.match(/^(?:Diagram|ASCII Diagram|Illustration)\s*:\s*(.*)$/i);
    if (diagMatch) {
      currentQ.diagram = diagMatch[1].trim();
      activeField = 'diagram';
      continue;
    }

    // 9. Follow-up section
    const followMatch = trimmed.match(/^(?:Follow-?up Questions?|Examiner Follow-?ups?)\s*:\s*(.*)$/i);
    if (followMatch) {
      activeField = 'followup';
      continue;
    }

    // 10. Handle Follow-up Q&A lines (Q: ... / A: ...)
    if (activeField === 'followup') {
      const fQMatch = trimmed.match(/^[Q\?]\s*:\s*(.*)$/i);
      const fAMatch = trimmed.match(/^A\s*:\s*(.*)$/i);

      if (fQMatch) {
        currentQ.followUpQuestions.push({ question: fQMatch[1].trim(), answer: '' });
        continue;
      }
      if (fAMatch && currentQ.followUpQuestions.length > 0) {
        currentQ.followUpQuestions[currentQ.followUpQuestions.length - 1].answer = fAMatch[1].trim();
        continue;
      }
    }

    // 11. End of question separator line (e.g. "---" or "___")
    if (trimmed.match(/^-{3,}$/) || trimmed.match(/^_{3,}$/)) {
      finalizeCurrentQuestion();
      continue;
    }

    // 12. Accumulate multiline content into active field
    if (activeField === 'shortAnswer') {
      currentQ.shortAnswer += (currentQ.shortAnswer ? '\n' : '') + line;
    } else if (activeField === 'detailedAnswer') {
      currentQ.detailedAnswer += (currentQ.detailedAnswer ? '\n' : '') + line;
    } else if (activeField === 'quickRevision') {
      currentQ.quickRevision += (currentQ.quickRevision ? '\n' : '') + line;
    } else if (activeField === 'diagram') {
      currentQ.diagram += (currentQ.diagram ? '\n' : '') + line;
    }
  }

  // Finalize last question in document
  finalizeCurrentQuestion();

  return questions;
}

// ─── CLI Entrypoint ─────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
========================================================================
📚 Student Resource Hub — Viva PDF/TXT to JSON Converter
========================================================================

Usage:
  node backend/scripts/convert_pdf_to_viva_json.js <input-file> [output-file.json]

Examples:
  node backend/scripts/convert_pdf_to_viva_json.js notes.pdf viva_import.json
  node backend/scripts/convert_pdf_to_viva_json.js syllabus.txt viva_import.json

Supported Input Formats:
  .pdf, .txt, .md
`);
    process.exit(0);
  }

  const inputFile = path.resolve(args[0]);
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Error: Input file not found: ${inputFile}`);
    process.exit(1);
  }

  const defaultOutName = path.basename(inputFile, path.extname(inputFile)) + '_viva.json';
  const outputFile = path.resolve(args[1] || defaultOutName);

  console.log(`\n📄 Reading and extracting text from: ${path.basename(inputFile)}...`);
  const rawText = await extractTextFromFile(inputFile);

  console.log(`🔍 Parsing questions and units...`);
  const questions = parseVivaText(rawText);

  if (questions.length === 0) {
    console.warn(`⚠️ Warning: No viva questions could be matched from the file.`);
    console.warn(`Please check that questions follow standard headers like "[Q.1] ...", "Punchline: ...", "Detailed Answer: ..."\n`);
    process.exit(1);
  }

  // Group summary by units
  const unitSummary = {};
  questions.forEach((q) => {
    unitSummary[q.section] = (unitSummary[q.section] || 0) + 1;
  });

  fs.writeFileSync(outputFile, JSON.stringify(questions, null, 2), 'utf8');

  console.log(`\n🎉 Success! Successfully converted ${questions.length} questions:`);
  Object.entries(unitSummary).forEach(([sec, count]) => {
    console.log(`   • ${sec}: ${count} questions`);
  });

  console.log(`\n💾 Saved to: ${outputFile}`);
  console.log(`✨ You can now upload this JSON directly in the Admin Panel Bulk Import modal!\n`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ Conversion Error:', err.message);
    process.exit(1);
  });
}

module.exports = {
  extractTextFromFile,
  parseVivaText,
};
