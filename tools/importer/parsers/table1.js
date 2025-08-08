/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract table rows from a table element
  function extractTableRows(tableEl) {
    const rows = [];
    const thead = tableEl.querySelector('thead');
    if (thead) {
      const ths = Array.from(thead.querySelectorAll('th'));
      // Actual header row (multi-column)
      rows.push(ths.map(th => th.textContent.trim()));
    }
    const tbody = tableEl.querySelector('tbody');
    if (tbody) {
      Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
        const tds = Array.from(tr.querySelectorAll('td'));
        rows.push(tds.map(td => {
          if (td.children.length === 1 && td.children[0].tagName === 'A') {
            return td.children[0]; // reference the original link element
          }
          if (!td.children.length) {
            return td.textContent.trim();
          }
          return Array.from(td.childNodes);
        }));
      });
    }
    return rows;
  }

  // Find all summary tables with two columns and correct headers
  const tables = element.querySelectorAll('table');
  tables.forEach(table => {
    const thead = table.querySelector('thead');
    if (!thead) return;
    const ths = Array.from(thead.querySelectorAll('th'));
    const headers = ths.map(th => th.textContent.trim());
    // Only match the block table type: ['Component', 'Resolved issues']
    if (headers.length === 2 && headers[0] === 'Component' && headers[1] === 'Resolved issues') {
      // Compose cells array as per requirements
      // First row: single cell with block name
      const blockNameRow = ['Table (table1)'];
      // Second row: headers as they appear in the table
      const headerRow = headers;
      // Then all data rows
      const dataRows = extractTableRows(table).slice(1); // skip the first which is already headerRow
      const cells = [blockNameRow, headerRow, ...dataRows];
      const blockTable = WebImporter.DOMUtils.createTable(cells, document);
      table.replaceWith(blockTable);
    }
  });
}
