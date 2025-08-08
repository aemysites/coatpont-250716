/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the heading for Update 73 (Build 1.309.73)
  const h3 = element.querySelector('h3[id="oneagent-sprint-309-73"]');
  if (!h3) return;

  // 2. Find the next <table> that contains the desired data
  let table = null;
  let sibling = h3.nextElementSibling;
  while (sibling && !table) {
    // Table may be directly present or inside a container div
    if (sibling.tagName === 'TABLE') {
      table = sibling;
      break;
    }
    if (sibling.querySelector) {
      table = sibling.querySelector('table');
      if (table) break;
    }
    sibling = sibling.nextElementSibling;
  }
  if (!table) return;

  // 3. Extract the column headers (second row in our table block) as strings
  const theadTr = table.querySelector('thead tr');
  let columnHeaders = [];
  if (theadTr) {
    columnHeaders = Array.from(theadTr.children).map((cell) => cell.textContent.trim());
  }

  // 4. Extract data rows, referencing elements or string content
  const dataRows = [];
  const tbody = table.querySelector('tbody');
  if (tbody) {
    Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
      const cols = Array.from(tr.children).map(td => {
        // If cell contains a single element (like <a>), use the element itself
        if (td.children.length === 1 && td.firstElementChild) {
          return td.firstElementChild;
        }
        // Otherwise, use the text content
        return td.textContent.trim();
      });
      dataRows.push(cols);
    });
  }

  // 5. Compose the block table array
  const blockRows = [
    ['Table (bordered, tableBordered51)'], // header row, single column
    columnHeaders,                        // column header row, n columns
    ...dataRows                           // rows, n columns
  ];

  // 6. Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(blockRows, document);
  // 7. Replace the original table with the block table
  table.replaceWith(blockTable);
}
