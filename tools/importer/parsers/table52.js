/* global WebImporter */
export default function parse(element, { document }) {
  // Find the table containing City/Country/Time Zone
  // Looking for a table with header City, Country, Time Zone
  const tables = element.querySelectorAll('table');
  let match = null;
  for (const table of tables) {
    const firstRow = table.querySelector('thead tr, tr');
    if (firstRow) {
      const ths = Array.from(firstRow.querySelectorAll('th'));
      const headers = ths.map(th => th.textContent.trim());
      if (
        headers.length === 3 &&
        headers[0] === 'City' &&
        headers[1] === 'Country' &&
        headers[2] === 'Time Zone'
      ) {
        match = table;
        break;
      }
    }
  }
  if (!match) return;

  // Prepare the block header row
  const headerRow = ['Table (table52)'];

  // Gather table rows for reproduction
  const rows = [];
  // Get header row as actual th elements
  const firstRow = match.querySelector('thead tr, tr');
  if (firstRow) {
    const ths = Array.from(firstRow.querySelectorAll('th'));
    if (ths.length === 3) {
      rows.push(ths);
    }
  }
  // Get each data row as actual td elements
  let trRows = [];
  const tbody = match.querySelector('tbody');
  if (tbody) {
    trRows = Array.from(tbody.querySelectorAll('tr'));
  } else {
    trRows = Array.from(match.querySelectorAll('tr'));
    // Remove the header row (first tr with th)
    if (trRows.length && trRows[0].querySelectorAll('th').length > 0) {
      trRows = trRows.slice(1);
    }
  }
  for (const tr of trRows) {
    const tds = Array.from(tr.querySelectorAll('td'));
    if (tds.length === 3) {
      rows.push(tds);
    }
  }

  // Compose block table: single block header row, then cell with table
  const blockCells = [
    headerRow,
    [WebImporter.DOMUtils.createTable(rows, document)]
  ];
  const blockTable = WebImporter.DOMUtils.createTable(blockCells, document);
  element.replaceWith(blockTable);
}
