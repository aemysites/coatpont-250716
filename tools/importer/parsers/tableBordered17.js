/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'Resolved issues' section
  const resolvedIssuesHeading = Array.from(element.querySelectorAll('h2'))
    .find(h => h.textContent.trim() === 'Resolved issues');
  if (!resolvedIssuesHeading) return;

  // Find the 'General Availability' h3 and the resolved issues table
  let gaHeading = resolvedIssuesHeading;
  let blockTable = null;
  while (gaHeading && gaHeading.nextElementSibling) {
    gaHeading = gaHeading.nextElementSibling;
    if (gaHeading.tagName === 'H3' && gaHeading.textContent.includes('General Availability')) {
      let sib = gaHeading;
      while (sib && sib.nextElementSibling) {
        sib = sib.nextElementSibling;
        if (sib.tagName === 'TABLE') {
          blockTable = sib;
          break;
        }
        if (sib.tagName && sib.tagName.match(/^H[1-6]$/)) break;
      }
      break;
    }
  }
  if (!blockTable) return;

  // Compose the block header row (exactly one cell)
  const headerRow = ['Table (bordered, tableBordered17)'];

  // Get the table column headers as STRINGS
  let columnHeaderRow = [];
  const thead = blockTable.querySelector('thead');
  if (thead) {
    const ths = thead.querySelectorAll('th');
    columnHeaderRow = Array.from(ths).map(th => th.textContent.trim());
  }
  if (columnHeaderRow.length === 0) return;

  // Get the data rows as arrays of elements
  const tbody = blockTable.querySelector('tbody');
  const dataRows = [];
  if (tbody) {
    Array.from(tbody.rows).forEach(tr => {
      const dataCells = Array.from(tr.cells).map(td => td);
      if (dataCells.length > 0) {
        dataRows.push(dataCells);
      }
    });
  }
  if (dataRows.length === 0) return;

  // Compose final cells array, each row is an array
  const cells = [headerRow, columnHeaderRow, ...dataRows];
  // Only build the table if each row is a valid array and not empty
  if (cells.length < 3 || !cells.every(row => Array.isArray(row) && row.length > 0)) return;

  const block = WebImporter.DOMUtils.createTable(cells, document);
  if (block) element.replaceWith(block);
}
