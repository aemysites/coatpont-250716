/* global WebImporter */
export default function parse(element, { document }) {
  // Find the summary table element
  const summaryTable = element.querySelector('.sc-b8d13023-1 table');
  if (!summaryTable) return;

  const cells = [["Table (bordered, tableBordered57)"]];

  // Get all rows
  const rows = Array.from(summaryTable.rows);
  if (rows.length === 0) return;

  // Second row: header row, reference <th> elements directly (NOT wrapped in <td>)
  const headerRow = Array.from(rows[0].cells).map(cell => cell); // Use the original <th> elements
  cells.push(headerRow);

  // Data rows: reference <td> elements directly (NOT wrapped in <td>)
  for (let i = 1; i < rows.length; i++) {
    const dataRow = Array.from(rows[i].cells).map(cell => cell); // Use the original <td> elements
    cells.push(dataRow);
  }

  // Create the block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  summaryTable.replaceWith(block);
}
