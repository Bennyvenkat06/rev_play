import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  Table, 
  TableRow, 
  TableCell, 
  BorderStyle, 
  WidthType, 
  AlignmentType,
  ShadingType
} from 'docx';
import { RevisionNote } from '../types/notes';

/**
 * Generates a clean, safe filename for the .docx export.
 * e.g., RevPlay_Unit-I_Loops_Revision-Notes.docx
 */
export function generateDocxFilename(note: RevisionNote): string {
  const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-');
  const unitLabel = note.unitId === 'lab' ? 'Lab' : note.unitName.split('—')[0].trim().replace(/\s+/g, '-');
  const topicLabel = sanitize(note.title);
  return `RevPlay_${unitLabel}_${topicLabel}_Revision-Notes.docx`;
}

/**
 * Builds and downloads a genuine Office Open XML (.docx) Word Document from authoritative RevisionNote data.
 * Returns a promise that resolves to true upon successful browser download.
 */
export async function downloadRevisionNoteAsDocx(note: RevisionNote): Promise<boolean> {
  try {
    const docSections: Paragraph[] = [];

    // Title Paragraph
    docSections.push(
      new Paragraph({
        text: 'REVPLAY — SYLLABUS REVISION MASTER DOCUMENT',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 }
      })
    );

    // Subtitle / Course Heading
    docSections.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `${note.courseCode}: ${note.courseName}`,
            bold: true,
            size: 24, // 12pt
            color: '0D5C75'
          })
        ],
        spacing: { after: 200 }
      })
    );

    // Metadata Block
    docSections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Syllabus Unit: ', bold: true }),
          new TextRun({ text: `${note.unitName}\n` }),
          new TextRun({ text: 'Topic: ', bold: true }),
          new TextRun({ text: `${note.title}\n` }),
          new TextRun({ text: 'Associated Game: ', bold: true }),
          new TextRun({ text: `${note.associatedGameTitle} (Game ID: ${note.associatedGameId})\n` }),
          new TextRun({ text: 'Official Syllabus Ref: ', bold: true }),
          new TextRun({ text: `${note.officialSyllabusMapping}\n` }),
          new TextRun({ text: 'Status: ', bold: true }),
          new TextRun({ 
            text: note.isSupplemental ? 'Supplemental Practice' : 'Prescribed Official JNTUH R25 Syllabus',
            bold: true,
            color: note.isSupplemental ? 'B45309' : '047857'
          }),
          new TextRun({ text: `\nExport Timestamp: ${new Date().toLocaleString()}` })
        ],
        spacing: { after: 280 }
      })
    );

    // [1] REVISION OBJECTIVE
    docSections.push(
      new Paragraph({
        text: '1. Revision Objective & Coverage Alignment',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: note.objective })],
        spacing: { after: 240 }
      })
    );

    // [2] CORE CONCEPT SUMMARY
    docSections.push(
      new Paragraph({
        text: '2. Core Concept Summary',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 120 }
      })
    );
    note.conceptSummary.forEach((pt) => {
      docSections.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: pt })],
          spacing: { after: 80 }
        })
      );
    });

    // [3] SYNTAX & TERMINOLOGY
    docSections.push(
      new Paragraph({
        text: '3. Key C Syntax & Terminology',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 }
      })
    );
    note.syntaxAndTerminology.forEach((item) => {
      const termChildren = [
        new TextRun({ text: item.term, bold: true, color: '0D5C75' }),
        new TextRun({ text: `: ${item.definition}` })
      ];
      if (item.syntax) {
        termChildren.push(new TextRun({ text: `\nSyntax: `, bold: true }));
        termChildren.push(new TextRun({ text: item.syntax, font: 'Consolas' }));
      }
      docSections.push(
        new Paragraph({
          children: termChildren,
          spacing: { after: 140 }
        })
      );
    });

    // [4] VERIFIED C CODE EXAMPLES
    docSections.push(
      new Paragraph({
        text: '4. Verified C Code Examples & Idioms',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 }
      })
    );
    note.codeExamples.forEach((ex, idx) => {
      docSections.push(
        new Paragraph({
          text: `Example 4.${idx + 1}: ${ex.title}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 160, after: 80 }
        })
      );

      // Monospace code block lines
      ex.code.split('\n').forEach((codeLine) => {
        docSections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: codeLine.replace(/\t/g, '    '),
                font: 'Consolas',
                size: 19 // 9.5pt
              })
            ],
            shading: {
              type: ShadingType.CLEAR,
              fill: 'F1F5F9'
            },
            spacing: { line: 240, after: 0 }
          })
        );
      });

      docSections.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Explanation: ', bold: true }),
            new TextRun({ text: ex.explanation, italics: true })
          ],
          spacing: { before: 100, after: 200 }
        })
      );
    });

    // [5] WORKED EXECUTION TRACE
    if (note.workedTrace) {
      docSections.push(
        new Paragraph({
          text: '5. Step-by-Step Worked Execution Trace',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Description: ', bold: true }),
            new TextRun({ text: note.workedTrace.description })
          ],
          spacing: { after: 140 }
        })
      );

      note.workedTrace.steps.forEach((st) => {
        const varStr = Object.entries(st.variableState)
          .map(([k, v]) => `${k} = ${v}`)
          .join(', ');
        docSections.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: `Step ${st.step}: `, bold: true }),
              new TextRun({ text: st.codeLine, font: 'Consolas' }),
              new TextRun({ text: ` | Variables: [${varStr}] | Note: ${st.explanation}` })
            ],
            spacing: { after: 80 }
          })
        );
      });

      docSections.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Final Cumulative Output: ', bold: true }),
            new TextRun({ text: note.workedTrace.finalOutput, font: 'Consolas', bold: true, color: '047857' })
          ],
          spacing: { before: 100, after: 200 }
        })
      );
    }

    // [6] COMMON MISTAKES & PITFALLS
    docSections.push(
      new Paragraph({
        text: '6. Common Mistakes & C Pitfalls',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 }
      })
    );
    note.commonMistakes.forEach((m, idx) => {
      docSections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Trap 6.${idx + 1}: ${m.pitfall}\n`, bold: true, color: 'B91C1C' }),
            new TextRun({ text: 'Incorrect / Undefined Code:\n', bold: true }),
            new TextRun({ text: `${m.badCode}\n`, font: 'Consolas', color: 'B91C1C' }),
            new TextRun({ text: 'Safe / Correct Idiom:\n', bold: true }),
            new TextRun({ text: `${m.fixedCode}\n`, font: 'Consolas', color: '047857' }),
            new TextRun({ text: `Consequence: ${m.consequence}`, italics: true })
          ],
          spacing: { after: 180 }
        })
      );
    });

    // [7] QUICK REVISION CHECKLIST
    docSections.push(
      new Paragraph({
        text: '7. Quick Revision Checklist (Exam Readiness)',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 }
      })
    );
    note.quickChecklist.forEach((chk) => {
      docSections.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: '[  ] ' }),
            new TextRun({ text: chk })
          ],
          spacing: { after: 80 }
        })
      );
    });

    // [8] JNTUH EXAM TIPS
    docSections.push(
      new Paragraph({
        text: '8. JNTUH Exam Tips & Strategy',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 }
      })
    );
    note.examTips.forEach((tip) => {
      docSections.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: '★ ', bold: true, color: 'B45309' }),
            new TextRun({ text: tip })
          ],
          spacing: { after: 80 }
        })
      );
    });

    // Document Footer Paragraph
    docSections.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: '— Generated by RevPlay Revision Engine — Your Syllabus. Reimagined as a Game. —',
            italics: true,
            size: 18,
            color: '64748B'
          })
        ],
        spacing: { before: 400, after: 100 }
      })
    );

    // Build Word Document
    const doc = new Document({
      title: note.title,
      description: note.objective,
      creator: 'RevPlay Educational Platform',
      sections: [
        {
          properties: {},
          children: docSections
        }
      ]
    });

    // Pack into binary Blob
    const blob = await Packer.toBlob(doc);
    const filename = generateDocxFilename(note);

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();

    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }, 300);

    return true;
  } catch (err) {
    console.error('Failed to generate Word .docx document:', err);
    return false;
  }
}

