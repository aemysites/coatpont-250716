/* global WebImporter */
export default function parse(element, { document }) {
  // Find the target table with header: City | Country | Time Zone
  let targetTable = null;
  const tables = element.querySelectorAll('table');
  for (const table of tables) {
    let headers = table.querySelectorAll('thead tr th');
    if (headers.length === 0) {
      // Sometimes header row may not be in <thead>
      const firstTr = table.querySelector('tr');
      if (firstTr) {
        headers = firstTr.querySelectorAll('th');
      }
    }
    if (
      headers.length === 3 &&
      headers[0].textContent.trim().toLowerCase() === 'city' &&
      headers[1].textContent.trim().toLowerCase() === 'country' &&
      headers[2].textContent.trim().toLowerCase().startsWith('time zone')
    ) {
      targetTable = table;
      break;
    }
  }
  if (!targetTable) return;

  // Prepare the cells array: [['Table (table5)'], [city, country, timezone], ...]
  const cells = [['Table (table5)']];

  // Find the data rows (should be in <tbody> but fallback to all <tr> except header)
  let rows = targetTable.querySelectorAll('tbody tr');
  if (rows.length === 0) {
    // Fallback: get all tr except thead
    rows = Array.from(targetTable.querySelectorAll('tr')).filter(tr => tr.querySelectorAll('th').length !== 3);
  }

  for (const tr of rows) {
    const tds = tr.querySelectorAll('td');
    if (tds.length === 3) {
      cells.push([
        tds[0].textContent.trim(),
        tds[1].textContent.trim(),
        tds[2].textContent.trim(),
      ]);
    }
  }
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(block);
}
