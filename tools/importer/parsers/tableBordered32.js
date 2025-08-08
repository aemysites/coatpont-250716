/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Block header row (single cell)
  const blockHeader = ['Table (bordered, tableBordered32)'];

  // Step 2: Find the main table: must have 'Component'/'Resolved issues' headers
  let mainTable = null;
  const tables = element.querySelectorAll('table');
  for (const table of tables) {
    const headingCells = table.querySelectorAll('thead tr th');
    if (
      headingCells.length === 2 &&
      headingCells[0].textContent.trim() === 'Component' &&
      headingCells[1].textContent.trim().startsWith('Resolved')
    ) {
      mainTable = table;
      break;
    }
  }
  if (!mainTable) return;

  // Step 3: Create a single-cell header row containing array of column header text
  const tableHeaderCells = mainTable.querySelectorAll('thead tr th');
  const columnHeaderArray = Array.from(tableHeaderCells).map(th => th.textContent.trim());
  const columnHeaderRow = [columnHeaderArray]; // single cell, array of header names

  // Step 4: Get all table data rows (arrays of strings)
  const tableRows = mainTable.querySelectorAll('tbody tr');
  const dataRows = [];
  for (const row of tableRows) {
    const tds = row.querySelectorAll('td');
    const rowData = Array.from(tds).map(td => td.textContent.trim());
    if (rowData.some(cell => cell.length > 0)) {
      dataRows.push(rowData);
    }
  }

  // Step 5: Compose block table
  const cells = [
    blockHeader,
    columnHeaderRow,
    ...dataRows
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
