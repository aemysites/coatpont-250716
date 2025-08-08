/* global WebImporter */
export default function parse(element, { document }) {
  // Find the release issues table (the only table in Resolved issues section)
  const table = element.querySelector('table');
  if (!table) return;

  // Block header per example
  const headerRow = ['Table (striped)'];

  // Get header row
  const thead = table.querySelector('thead');
  let columnHeaderRow = [];
  if (thead) {
    columnHeaderRow = Array.from(thead.querySelectorAll('th')).map(th => th.textContent.trim());
  }

  // Get data rows
  const tbody = table.querySelector('tbody');
  let dataRows = [];
  if (tbody) {
    dataRows = Array.from(tbody.querySelectorAll('tr')).map(tr => {
      return Array.from(tr.querySelectorAll('td')).map(td => {
        // Prefer existing elements (links) if present
        const a = td.querySelector('a');
        return a ? a : td.textContent.trim();
      });
    });
  }

  // Compose block table
  const cells = [headerRow, columnHeaderRow, ...dataRows];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original table with the block table
  table.replaceWith(block);
}
