/* global WebImporter */
export default function parse(element, { document }) {
  // This block is for extracting a data table of the form:
  // Header row: Standard Support | Enterprise Success and Support
  // Data row(s): e.g. 1.243 | 1.237
  // The table is visually rendered as a 2-column, 2-row table in the page.
  // The output table must have the block header row: ['Table (table34)'] as the first row.

  // Find the support table block (div[data-testid="table"])
  const tableDiv = element.querySelector('[data-testid="table"]');
  if (!tableDiv) return; // If not found, do nothing

  // Extract the header row labels
  let headerCells = [];
  // Look for the two column labels (inside [role="columnheader"] p)
  const headerPs = tableDiv.querySelectorAll('.strato-table-header-group [role="columnheader"] p');
  if (headerPs.length >= 2) {
    headerCells = [headerPs[0].textContent.trim(), headerPs[1].textContent.trim()];
  } else {
    // Fallback: try just [role="columnheader"] p
    const altHeaderPs = tableDiv.querySelectorAll('[role="columnheader"] p');
    if (altHeaderPs.length >= 2) {
      headerCells = [altHeaderPs[0].textContent.trim(), altHeaderPs[1].textContent.trim()];
    } else {
      // If still not found, skip
      return;
    }
  }

  // Extract the data row(s): [role="row"] .strato-table-cell > p
  const dataRows = [];
  const rowEls = tableDiv.querySelectorAll('.strato-table-row');
  rowEls.forEach(rowEl => {
    // Get all cells within this row
    const cellPs = rowEl.querySelectorAll('[role="cell"] p');
    if (cellPs.length === 2) {
      dataRows.push([
        cellPs[0].textContent.trim(),
        cellPs[1].textContent.trim()
      ]);
    }
  });

  // Fallback: if no rows could be extracted, try a backup selector
  if (dataRows.length === 0) {
    const pCells = tableDiv.querySelectorAll('[role="cell"] p');
    if (pCells.length === 2) {
      dataRows.push([
        pCells[0].textContent.trim(),
        pCells[1].textContent.trim()
      ]);
    }
  }

  // Structure for createTable: first row is block name, second header, then data rows
  const cells = [
    ['Table (table34)'],
    headerCells,
    ...dataRows
  ];

  // Create the block table
  const tableBlock = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original table block in the DOM
  tableDiv.parentNode.replaceChild(tableBlock, tableDiv);
}
