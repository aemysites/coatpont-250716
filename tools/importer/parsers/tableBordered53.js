/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main table for 'oldest supported OneAgent versions.'
  // Look for the div[data-testid="table"] within this element
  const tableSection = element.querySelector('div[data-testid="table"]');
  if (!tableSection) return;

  // Find the table grid (role="table")
  const tableRoot = tableSection.querySelector('[role="table"]');
  if (!tableRoot) return;

  // Get the header row (find cells with role="columnheader")
  const headerRow = tableRoot.querySelector('.strato-table-header');
  let headerLabels = [];
  if (headerRow) {
    const ths = headerRow.querySelectorAll('[role="columnheader"]');
    headerLabels = Array.from(ths).map(th => th.textContent.trim());
  }

  // Get data rows from .strato-loading-wrapper
  const rowContainer = tableRoot.querySelector('.strato-loading-wrapper');
  let dataRows = [];
  if (rowContainer) {
    const rows = rowContainer.querySelectorAll('[role="row"]');
    rows.forEach(row => {
      const cells = row.querySelectorAll('[role="cell"]');
      const rowArr = [];
      cells.forEach(cell => {
        // If the cell contains an <a>, use the <a> element (reference it)
        const a = cell.querySelector('a');
        if (a) {
          rowArr.push(a);
        } else {
          // Use the cell's text content trimmed
          const txt = cell.textContent.trim();
          rowArr.push(txt);
        }
      });
      if (rowArr.length) dataRows.push(rowArr);
    });
  }

  // Build the block table cells
  const cells = [];
  // First row: block name header
  cells.push(['Table (bordered, tableBordered53)']);
  // Second row: actual table headers (from the HTML)
  cells.push(headerLabels);
  // Remaining rows: actual data rows
  dataRows.forEach(row => cells.push(row));

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  tableSection.replaceWith(blockTable);
}
