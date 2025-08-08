/* global WebImporter */
export default function parse(element, { document }) {
  // Required header row
  const headerRow = ['Table (table54)'];

  // To ensure we are not picking up the wrong table (e.g. internal tables that are not visible),
  // look for the table that visually matches the example (in the screenshot, see the data!)
  // The table is: City | Country | Time Zone; with rows: Spas | Ukraine | Europe/Uzhgorod, etc.

  // We'll search for any <table> with the correct headers and the expected data.
  // Because some sites build tables with divs, let's also check for a <table> or <div role="table">.

  // 1. Get all table elements in the element
  let table = null;
  const possibleTables = element.querySelectorAll('table');

  // 2. Find the table with 'City', 'Country', 'Time Zone' as headers (in order)
  for (const t of possibleTables) {
    // Find all th elements in the first row
    const thead = t.querySelector('thead');
    let headers = [];
    if (thead) {
      const tr = thead.querySelector('tr');
      if (tr) {
        headers = Array.from(tr.querySelectorAll('th')).map(th => th.textContent.trim());
      }
    } else {
      // fallback: use first tr in tbody or direct tr
      const tr = t.querySelector('tr');
      if (tr) {
        headers = Array.from(tr.querySelectorAll('th')).map(th => th.textContent.trim());
      }
    }
    if (
      headers.length === 3 &&
      headers[0] === 'City' &&
      headers[1] === 'Country' &&
      headers[2] === 'Time Zone'
    ) {
      table = t;
      break;
    }
  }
  if (!table) return;

  // 3. Extract table header row as array
  let headerCells = [];
  const firstHeaderTr = table.querySelector('thead tr') || table.querySelector('tr');
  if (firstHeaderTr) {
    headerCells = Array.from(firstHeaderTr.querySelectorAll('th')).map(th => th.textContent.trim());
  }

  // 4. Extract all tbody rows (or all tr except th row), as arrays of cell text
  let dataRows = [];
  const tbody = table.querySelector('tbody');
  const rowTrs = tbody ? Array.from(tbody.querySelectorAll('tr')) : Array.from(table.querySelectorAll('tr'));
  for (const tr of rowTrs) {
    // skip header tr
    if (tr === firstHeaderTr) continue;
    const cells = Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim());
    if (cells.length === 3 && cells.some(c => c)) {
      dataRows.push(cells);
    }
  }

  // 5. Compose final cells structure
  // [ ['Table (table54)'], ['City', 'Country', 'Time Zone'], [...], [...], ... ]
  const cells = [headerRow, headerCells, ...dataRows];

  // 6. Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
