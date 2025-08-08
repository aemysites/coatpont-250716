/* global WebImporter */
export default function parse(element, { document }) {
  // Find the table with headers 'City', 'Country', 'Time Zone'
  const tables = element.querySelectorAll('table');
  let targetTable = null;
  for (const t of tables) {
    const ths = t.querySelectorAll('thead th');
    if (ths.length === 3) {
      const headers = Array.from(ths).map(th => th.textContent.trim());
      if (
        headers[0] === 'City' &&
        headers[1] === 'Country' &&
        headers[2] === 'Time Zone'
      ) {
        targetTable = t;
        break;
      }
    }
  }
  if (!targetTable) return;

  // Build block table cells (critical fix: header row is single cell with block name)
  const cells = [];
  // 1. Block name header row - SINGLE CELL
  cells.push(['Table (table30)']);
  // 2. Table header row (City, Country, Time Zone)
  const ths = targetTable.querySelectorAll('thead th');
  const headerRow = Array.from(ths).map(th => th.textContent.trim());
  cells.push(headerRow);

  // 3. Data rows
  const trs = targetTable.querySelectorAll('tbody tr');
  trs.forEach(tr => {
    const tds = tr.querySelectorAll('td');
    const row = Array.from(tds).map(td => {
      const anchor = td.querySelector('a');
      if (anchor) return anchor;
      return td.textContent.trim();
    });
    if (row.some(cell => cell && String(cell).trim().length > 0)) {
      cells.push(row);
    }
  });

  // Replace element with block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
