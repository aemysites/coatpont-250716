/* global WebImporter */
export default function parse(element, { document }) {
  // Find the release notes table container
  const tableBlock = element.querySelector('[data-testid="table"]');
  if (!tableBlock) return;

  // The table may appear as a set of nested <div>s mimicking a table/grid, not as a true <table>
  // To be robust, let's try to extract the column headers and data rows based on visible structure

  // 1. Get the header row (column titles)
  let headerRow = [];
  const headerGrid = tableBlock.querySelector('.strato-table-header');
  if (headerGrid) {
    const ths = Array.from(headerGrid.querySelectorAll('[role="columnheader"]'));
    headerRow = ths.map(th => {
      // The visible cell text
      const div = th.querySelector('div.sc-14d0d3af-0');
      return div ? div.textContent.trim() : th.textContent.trim();
    });
  }

  // 2. Get all data rows
  let dataRows = [];
  const rowGroup = tableBlock.querySelector('.strato-loading-wrapper > [role="rowgroup"]');
  if (rowGroup) {
    // Each row is a div with role="row"
    const rows = Array.from(rowGroup.querySelectorAll('[role="row"]'));
    dataRows = rows.map(rowDiv => {
      const cells = Array.from(rowDiv.querySelectorAll('[role="cell"]'));
      return cells.map(cell => {
        // Try for most deeply nested div with visible text
        const custom = cell.querySelector('div.sc-14d0d3af-0');
        if (custom) return custom.textContent.trim();
        const fallback = cell.querySelector('div');
        if (fallback) return fallback.textContent.trim();
        return cell.textContent.trim();
      });
    });
  }

  // If, for any reason, we have no table rows, include all text content of the block as fallback
  let tableElem;
  if (headerRow.length && dataRows.length) {
    // Compose a proper table element for data
    const tableArr = [headerRow, ...dataRows];
    tableElem = WebImporter.DOMUtils.createTable(tableArr, document);
  } else {
    // Fallback: include the entire block as a single cell, to never lose content
    tableElem = tableBlock;
  }

  // Compose the Table (table48) block
  const block = WebImporter.DOMUtils.createTable([
    ['Table (table48)'],
    [tableElem]
  ], document);

  element.replaceWith(block);
}
