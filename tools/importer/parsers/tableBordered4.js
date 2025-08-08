/* global WebImporter */
export default function parse(element, { document }) {
  // Find the table section within the element
  const tableWrapper = element.querySelector('[data-testid="table"]');
  if (!tableWrapper) return;

  // Find the actual table div, which should have role="table"
  const tableDiv = tableWrapper.querySelector('[role="table"]');
  if (!tableDiv) return;

  // Extract header row (using the visible header cell text)
  const headerRowDiv = tableDiv.querySelector('.strato-table-header');
  let headerCells = [];
  if (headerRowDiv) {
    const headerCellEls = headerRowDiv.querySelectorAll('[role="columnheader"]');
    headerCells = Array.from(headerCellEls).map(cell => {
      // Try to get the first <p>, or the full element if not
      const p = cell.querySelector('p');
      return p ? p : cell.textContent.trim();
    });
  }

  // Extract data rows: each row has [role="row"], cells have [role="cell"]
  const dataRows = [];
  const rowDivs = tableDiv.querySelectorAll('[role="row"]');
  rowDivs.forEach(rowDiv => {
    const cellDivs = rowDiv.querySelectorAll('[role="cell"]');
    if (cellDivs.length > 0) {
      const row = Array.from(cellDivs).map(cell => {
        // Try to preserve formatting: if there's a <p>, use it; else, use text
        const p = cell.querySelector('p');
        return p ? p : cell.textContent.trim();
      });
      dataRows.push(row);
    }
  });

  // Build cells array: 1. header (block name), 2. table header, 3+. data rows
  const cells = [
    ['Table (bordered, tableBordered4)'],
    headerCells,
    ...dataRows
  ];

  // Only replace if the table structure is complete
  if (headerCells.length && dataRows.length) {
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
