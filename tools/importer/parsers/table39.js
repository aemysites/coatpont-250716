/* global WebImporter */
export default function parse(element, { document }) {
  // Find the table container
  const tableContainer = element.querySelector('[data-testid="table"]');
  if (!tableContainer) return;
  const tableDiv = tableContainer.querySelector('[role="table"]');
  if (!tableDiv) return;

  // Build the cells array, starting with the required block name header row.
  const cells = [['Table (table39)']]; // Single-column header row as required

  // Find all rowgroups (header and body)
  const rowGroups = tableDiv.querySelectorAll('.strato-table-virtualization-container > [role="rowgroup"]');
  if (rowGroups.length < 2) return;

  // Table header row (column headers)
  const headerRow = rowGroups[0].querySelector('[role="row"]');
  if (headerRow) {
    // Get all direct columnheader children
    const headerCells = Array.from(headerRow.children).filter(cell => cell.getAttribute('role') === 'columnheader');
    // Get their text content for the header row
    const headerTexts = headerCells.map(cell => cell.textContent.trim());
    cells.push(headerTexts);
  }

  // Table body rows
  const dataRows = Array.from(rowGroups[1].querySelectorAll('[role="row"]'));
  dataRows.forEach(row => {
    const cellNodes = Array.from(row.children).filter(cell => cell.getAttribute('role') === 'cell');
    const rowTexts = cellNodes.map(cell => cell.textContent.trim());
    if (rowTexts.length && rowTexts.some(text => text.length > 0)) {
      cells.push(rowTexts);
    }
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
