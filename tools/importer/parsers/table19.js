/* global WebImporter */
export default function parse(element, { document }) {
  // Find the strato table with header City | Country | Time Zone
  const tables = element.querySelectorAll('table');
  let matchTable = null;
  tables.forEach(tbl => {
    const ths = tbl.querySelectorAll('thead th');
    if (
      ths.length === 3 &&
      ths[0].textContent.trim() === 'City' &&
      ths[1].textContent.trim() === 'Country' &&
      ths[2].textContent.trim() === 'Time Zone'
    ) {
      matchTable = tbl;
    }
  });
  if (!matchTable) return;

  const cells = [];
  // Block name header row
  cells.push(['Table (table19)']);

  // Table header row as 3 columns
  const headerCells = Array.from(matchTable.querySelectorAll('thead th'));
  cells.push(headerCells);

  // Table data rows as 3 columns
  const bodyRows = matchTable.querySelectorAll('tbody tr');
  for (const tr of bodyRows) {
    const tds = Array.from(tr.querySelectorAll('td'));
    if (tds.length === 3) {
      cells.push(tds);
    }
  }

  // Replace the ENTIRE matchTable (not the containing element!)
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  matchTable.replaceWith(blockTable);
}
