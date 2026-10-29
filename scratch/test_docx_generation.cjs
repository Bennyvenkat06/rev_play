const docx = require('docx');
const fs = require('fs');

const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType, ShadingType } = docx;

async function testDocx() {
  console.log('Testing docx creation with Packer.toBuffer...');
  
  const doc = new Document({
    title: 'Test Note',
    description: 'Verifying docx generation',
    creator: 'RevPlay Educational Platform',
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'REVPLAY — SYLLABUS REVISION MASTER DOCUMENT',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'CS103ES: Programming for Problem Solving', bold: true, color: '0D5C75' })
            ]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Term', bold: true })] })],
                    shading: { fill: 'E2E8F0', type: ShadingType.CLEAR }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Definition', bold: true })] })],
                    shading: { fill: 'E2E8F0', type: ShadingType.CLEAR }
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'malloc()' })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Dynamic heap allocation with NULL check' })]
                  })
                ]
              })
            ]
          })
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('scratch/test_output.docx', buffer);
  console.log('Successfully generated scratch/test_output.docx. Size:', buffer.length, 'bytes');
}

testDocx().catch(err => {
  console.error('Docx generation error:', err);
  process.exit(1);
});

