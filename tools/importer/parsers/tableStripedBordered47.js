/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: header row must match spec
  const headerRow = ['Table (striped, bordered, tableStripedBordered47)'];
  // Find the main content area where the release notes tables appear
  // Look for tables with class 'strato-table-contained' directly inside the release notes content
  // We want only those rendered tables showing actual tabular structured data.
  const tables = element.querySelectorAll('table.strato-table-contained');
  tables.forEach(table => {
    // Header extraction
    const thead = table.querySelector('thead');
    let headerCells = [];
    if (thead) {
      headerCells = Array.from(thead.querySelectorAll('th')).map(th => {
        // Always reference the actual <th> element so formatting/links are retained
        return th.childNodes.length > 0 ? Array.from(th.childNodes) : th.textContent.trim();
      });
    }
    // Body extraction
    const tbody = table.querySelector('tbody');
    let cellRows = [];
    if (tbody) {
      cellRows = Array.from(tbody.querySelectorAll('tr')).map(tr => {
        return Array.from(tr.querySelectorAll('td')).map(td => {
          // If cell contains a link, reference it, otherwise all childNodes
          const a = td.querySelector('a');
          if (a) return a;
          // Otherwise, return all childNodes (preserves span, formatting)
          // If no children, use textContent
          if (td.childNodes.length > 0) return Array.from(td.childNodes);
          return td.textContent.trim();
        });
      });
    }
    // Compose table cells, always put header row first
    const cells = [headerRow, headerCells, ...cellRows];
    // Create block table
    const blockTable = WebImporter.DOMUtils.createTable(cells, document);
    // Replace original table with new block table
    table.replaceWith(blockTable);
  });
  // No section metadata block in example, so none is created
  // No <hr> is inserted, as per requirements
  // All table header rows are exact, and all tabular data is extracted dynamically
  // All original document elements are referenced
}
