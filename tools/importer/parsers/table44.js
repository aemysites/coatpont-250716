/* global WebImporter */
export default function parse(element, { document }) {
  // Find the General Availability (Build 1.223.97) resolved issues table
  const gaHeader = element.querySelector('h3#oneagent-sprint-223-ga');
  if (!gaHeader) return;

  // Find the first table after this header
  let tableDiv = gaHeader.nextElementSibling;
  while (tableDiv && !tableDiv.querySelector('table')) {
    tableDiv = tableDiv.nextElementSibling;
  }
  if (!tableDiv) return;
  const table = tableDiv.querySelector('table');
  if (!table) return;

  // Get header columns (Component, Resolved issues)
  const thead = table.querySelector('thead');
  let colLabels = [];
  if (thead) {
    const headerTr = thead.querySelector('tr');
    if (headerTr) {
      colLabels = Array.from(headerTr.children).map(th => {
        // Preserve formatting
        return th.innerHTML.trim() ? th.cloneNode(true) : th.textContent.trim();
      });
    }
  }

  // Get all table rows (preserve all text and in-cell elements)
  const tbody = table.querySelector('tbody');
  const dataRows = [];
  if (tbody) {
    Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
      const row = Array.from(tr.children).map(td => {
        if (td.children.length > 0) {
          // Return all child nodes (elements and text) for flexibility
          return Array.from(td.childNodes).filter(node => {
            return (node.nodeType === 3 && node.textContent.trim().length > 0) || node.nodeType === 1;
          });
        } else {
          return td.textContent.trim();
        }
      });
      if (row.some(cell => (typeof cell === 'string' ? cell.length > 0 : cell.length > 0))) {
        dataRows.push(row);
      }
    });
  }

  // Compose cells - first row must be a single cell/block name, then header row (with correct number of columns), then data
  const cells = [
    ['Table (table44)'], // Single cell header row
    colLabels,           // The actual table header as second row
    ...dataRows          // Data rows
  ];

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
