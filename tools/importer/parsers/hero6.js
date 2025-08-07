/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header: always 'Hero (hero6)'
  const headerRow = ['Hero (hero6)'];

  // 2. Get all direct .et_pb_row > .et_pb_column children
  const row = element.querySelector('.et_pb_row');
  let columns = [];
  if (row) {
    columns = row.querySelectorAll(':scope > .et_pb_column');
  }

  // 3. Background image: look for the first <img> in the left column
  let backgroundImg = null;
  if (columns.length > 0) {
    const img = columns[0].querySelector('img');
    if (img) backgroundImg = img;
  }

  // 4. Text content: right column, get heading(s) and paragraph(s)
  let textContent = [];
  if (columns.length > 1) {
    const textInner = columns[1].querySelector('.et_pb_text_inner');
    if (textInner) {
      // preserve only <h1>-<h6> and <p> children
      textContent = Array.from(textInner.childNodes).filter(node => {
        return node.nodeType === Node.ELEMENT_NODE &&
          (/^H[1-6]$/.test(node.tagName) || node.tagName === 'P');
      });
      // If all <p>s are empty (like <p>&nbsp;</p>), remove them
      textContent = textContent.filter(node => {
        if (node.tagName === 'P') {
          return node.textContent.trim().replace(/\u00a0/g, '') !== '';
        }
        return true;
      });
    }
  }

  // 5. Build table rows
  const tableRows = [
    headerRow,
    [backgroundImg],
    [textContent]
  ];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // 6. Replace the original element
  element.replaceWith(block);
}
