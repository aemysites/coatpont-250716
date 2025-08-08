/* global WebImporter */
export default function parse(element, { document }) {
  // Find the summary table with the required headers
  const tables = element.querySelectorAll('table');
  let issuesTable = null;
  for (const tbl of tables) {
    const ths = tbl.querySelectorAll('thead th');
    if (
      ths.length === 2 &&
      ths[0].textContent.trim() === 'Component' &&
      ths[1].textContent.trim().startsWith('Resolved')
    ) {
      issuesTable = tbl;
      break;
    }
  }
  if (!issuesTable) return;

  const cells = [];
  // First row: block name, as a single string
  cells.push(['Table (bordered, tableBordered37)']);

  // Second row: header cells, as simple strings
  const theadRow = issuesTable.querySelector('thead tr');
  if (theadRow) {
    const headerCells = Array.from(theadRow.children).map(th => th.textContent.trim());
    cells.push(headerCells);
  }

  // Data rows: Insert the original cell content directly (not wrapped)
  const tbodyRows = issuesTable.querySelectorAll('tbody tr');
  tbodyRows.forEach(tr => {
    const rowCells = Array.from(tr.children).map(td => {
      // Use the content of the cell, not the <td> itself
      // But preserve formatting/links, so reference the contents as an array
      if (td.childNodes.length === 1 && td.childNodes[0].nodeType === Node.TEXT_NODE) {
        return td.textContent;
      } else {
        // If the cell contains elements, put all children into an array
        return Array.from(td.childNodes);
      }
    });
    cells.push(rowCells);
  });

  // Build the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  issuesTable.replaceWith(block);
}
