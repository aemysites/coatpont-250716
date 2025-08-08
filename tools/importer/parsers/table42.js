/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the summary table within the element
  const table = element.querySelector('table');
  if (!table) return;

  // 1. Block header row (must match example exactly)
  const blockHeaderRow = ['Table (table42)'];

  // 2. Extract header row from the table (should use the first row, which could be in thead or tbody)
  let headerRow = [];
  const thead = table.querySelector('thead');
  if (thead && thead.rows.length > 0) {
    headerRow = Array.from(thead.rows[0].cells).map(cell => cell.textContent.trim());
  } else if (table.rows.length > 0) {
    headerRow = Array.from(table.rows[0].cells).map(cell => cell.textContent.trim());
  } else {
    // Defensive: if no header found, abort
    return;
  }

  // 3. Extract data rows (all rows except the header)
  let dataRows = [];
  const tbody = table.querySelector('tbody');
  let bodyRows = [];
  if (tbody) {
    bodyRows = Array.from(tbody.rows);
    // Remove header row if tbody contains it
    if (bodyRows.length && headerRow.every((txt, i) => bodyRows[0].cells[i]?.textContent.trim() === txt)) {
      bodyRows = bodyRows.slice(1);
    }
  } else {
    // No tbody: all rows except first
    bodyRows = Array.from(table.rows).slice(1);
  }
  dataRows = bodyRows.map(row => {
    return Array.from(row.cells).map(cell => {
      // Prefer to retain semantic HTML structure if present
      if (cell.children.length > 0) {
        const contents = [];
        cell.childNodes.forEach(node => {
          if (node.nodeType === 3) {
            const txt = node.textContent.trim();
            if (txt) contents.push(txt);
          } else if (node.nodeType === 1) {
            contents.push(node);
          }
        });
        // If only one content, pass it as-is, else as array
        return contents.length === 1 ? contents[0] : contents;
      } else {
        return cell.textContent.trim();
      }
    });
  });

  // Compose the final cell data structure
  const cells = [blockHeaderRow, headerRow, ...dataRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
