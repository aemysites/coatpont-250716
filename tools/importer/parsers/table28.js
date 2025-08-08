/* global WebImporter */
export default function parse(element, { document }) {
  // The correct block header row: single cell
  const headerRow = ['Table (table28)'];

  // Find the relevant table: look for a table with 'Component' and 'Resolved issues' in header
  let table = null;
  const allTables = element.querySelectorAll('table');
  for (const t of allTables) {
    const ths = t.querySelectorAll('thead th');
    if (
      ths.length === 2 &&
      ths[0].textContent.trim() === 'Component' &&
      ths[1].textContent.trim() === 'Resolved issues'
    ) {
      table = t;
      break;
    }
  }
  if (!table) return;

  // Extract the header cells for the second row
  const headerCells = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());

  // Extract all body rows (as text, exactly)
  const dataRows = Array.from(table.querySelectorAll('tbody tr')).map(tr =>
    Array.from(tr.children).map(td => td.textContent.trim())
  );

  // Compose final block table: first row is block name, next is actual table header, then data
  const cells = [headerRow, headerCells, ...dataRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
