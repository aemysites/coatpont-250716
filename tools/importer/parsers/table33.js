/* global WebImporter */
export default function parse(element, { document }) {
  // The block in question is the resolved issues summary table for General Availability (Build 1.273.138):
  // The table with Component | Resolved issues

  // 1. Find the heading for 'General Availability (Build 1.273.138)'
  const heading = element.querySelector('h3#oneagent-sprint-273-ga');
  if (!heading) return;

  // 2. Find the associated summary table, which is immediately after this heading within a div.sc-b8d13023-1
  let summaryTableDiv = heading.nextElementSibling;
  while (summaryTableDiv && !summaryTableDiv.classList.contains('sc-b8d13023-1')) {
    summaryTableDiv = summaryTableDiv.nextElementSibling;
  }
  if (!summaryTableDiv) return;

  // 3. Get the actual table element
  const table = summaryTableDiv.querySelector('table');
  if (!table) return;

  // 4. Get all table rows
  const rows = Array.from(table.querySelectorAll('tr'));
  if (rows.length === 0) return;

  // 5. Build the 2D cells array for the block table
  const cells = [];
  // Block header
  cells.push(['Table (table33)']);

  // 6. Find the first row with at least one th; that's the column header row
  let headerRowIdx = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].querySelector('th')) {
      headerRowIdx = i;
      break;
    }
  }
  if (headerRowIdx === -1) return;
  // Extract column header row
  const headerCells = Array.from(rows[headerRowIdx].querySelectorAll('th')).map(th => th.textContent.trim());
  cells.push(headerCells);

  // 7. Add data rows after the header row
  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const tds = Array.from(rows[i].querySelectorAll('td'));
    if (tds.length === 0) continue; // skip empty rows
    const rowCells = tds.map(td => {
      // If cell contains a link, use the actual element
      const link = td.querySelector('a');
      if (link) return link;
      // Otherwise, use its text
      return td.textContent.trim();
    });
    cells.push(rowCells);
  }

  // 8. Create and replace the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  summaryTableDiv.parentNode.replaceChild(blockTable, summaryTableDiv);
}
