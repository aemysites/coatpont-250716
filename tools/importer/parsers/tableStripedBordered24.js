/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the resolved issues table under 'General Availability (Build 1.245.94)'.
  // The example block is a single table with block header, table header row, and data rows.

  // Find heading for General Availability section
  const gaHeading = element.querySelector('h3#saas-sprint-245-ga');
  if (!gaHeading) return;

  // Find the first table after the heading (it's inside a .sc-b8d13023-1)
  let tableDiv = gaHeading.nextElementSibling;
  while (tableDiv && !(tableDiv.querySelector && tableDiv.querySelector('table'))) {
    tableDiv = tableDiv.nextElementSibling;
  }
  if (!tableDiv) return;
  const htmlTable = tableDiv.querySelector('table');
  if (!htmlTable) return;

  // Extract header row (the only <th>s)
  const firstRow = htmlTable.querySelector('thead tr');
  let headerCells = [];
  if (firstRow) {
    headerCells = Array.from(firstRow.children).map(th => th.textContent.trim());
  }
  // Extract data rows (from <tbody>)
  const bodyRows = Array.from(htmlTable.querySelectorAll('tbody tr'));
  const dataRows = bodyRows.map(row => {
    return Array.from(row.children).map(td => {
      const a = td.querySelector('a');
      if (a) return a; // reference the anchor
      return td.textContent.trim();
    });
  });

  // Compose the table cells array
  // Header row: block name (matches example exactly)
  // Second row: table headers
  // Following rows: data
  const cells = [
    ['Table (striped, bordered, tableStripedBordered24)'],
    headerCells,
    ...dataRows
  ];

  // Create and replace with the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tableDiv.parentNode.replaceChild(block, tableDiv);
}
