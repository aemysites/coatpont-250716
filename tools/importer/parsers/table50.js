/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual table block
  let dataTableDiv = element.querySelector('[data-testid="table"]');
  if (!dataTableDiv) {
    dataTableDiv = element.querySelector('table');
  }

  // Compose table rows
  const cells = [];
  // 1. Block header row - single cell
  cells.push(['Table (table50)']);

  // 2. Gather all rows (include header and data) as arrays
  // Try grid layout with [role=row] and [role=cell]
  let foundRows = false;
  if (dataTableDiv) {
    const rowDivs = dataTableDiv.querySelectorAll('[role="row"]');
    rowDivs.forEach(rowDiv => {
      const cellDivs = rowDiv.querySelectorAll('[role="cell"]');
      if (cellDivs.length > 0) {
        // Gather all cell text (trims spaces)
        const row = Array.from(cellDivs).map(cell => cell.textContent.trim());
        // Only add non-empty rows
        if (row.length && row.every(cell => cell)) {
          cells.push(row);
          foundRows = true;
        }
      }
    });
    // Fallback for <tr> in a <table>
    if (!foundRows) {
      const trs = dataTableDiv.querySelectorAll('tr');
      trs.forEach(tr => {
        const tds = tr.querySelectorAll('td,th');
        if (tds.length > 0) {
          const row = Array.from(tds).map(td => td.textContent.trim());
          if (row.length && row.every(cell => cell)) {
            cells.push(row);
          }
        }
      });
    }
  }

  // Replace original element with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
