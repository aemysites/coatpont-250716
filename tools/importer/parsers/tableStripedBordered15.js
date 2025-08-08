/* global WebImporter */
export default function parse(element, { document }) {
  // Find the block containing the release notes support table (the first instance of the table pattern)
  const tableDiv = element.querySelector('div[data-testid="table"]');
  if (!tableDiv) return;

  // Find the header row
  const headerRow = tableDiv.querySelector('.strato-table-header-group [role="row"]');
  let colHeaders = [];
  if (headerRow) {
    // Each cell in the header row
    const headerCells = Array.from(headerRow.children).filter(cell => cell.getAttribute('role') === 'columnheader' || cell.tagName === 'DIV');
    colHeaders = headerCells.map(cell => {
      // Prefer <p>, fallback to text
      const p = cell.querySelector('p');
      return p ? p.textContent.trim() : cell.textContent.trim();
    });
  }

  // Find all data rows
  const loadingWrapper = tableDiv.querySelector('.strato-loading-wrapper');
  let bodyRows = [];
  if (loadingWrapper) {
    // Each data row
    const dataRows = Array.from(loadingWrapper.querySelectorAll('[role="row"]'));
    bodyRows = dataRows.map(row => {
      // Get all data cells in this row
      const cells = Array.from(row.querySelectorAll('[role="cell"]'));
      // If the cell contains nodes, collect all (not just a single <a> or <span>)
      return cells.map(cell => {
        // If cell has children, use all child nodes (retaining formatting and links etc)
        if (cell.childNodes && cell.childNodes.length > 0) {
          // Remove empty text nodes
          const childNodes = Array.from(cell.childNodes).filter(node => {
            if (node.nodeType === Node.TEXT_NODE) {
              return node.textContent.trim() !== '';
            }
            return true;
          });
          return childNodes.length === 1 ? childNodes[0] : childNodes;
        }
        // Otherwise, fallback to text content
        return cell.textContent.trim();
      });
    });
  }

  // Compose table block with single header row
  // The FIRST row must be a single cell header
  const blockHeader = ['Table (striped, bordered, tableStripedBordered15)'];
  // The rest of the rows should match the table data structure
  const cells = [blockHeader, colHeaders, ...bodyRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
