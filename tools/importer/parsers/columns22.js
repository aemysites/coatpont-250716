/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all column divs
  const columns = Array.from(element.querySelectorAll(':scope > div.et_pb_column'));

  // For each column, gather all direct children (modules)
  const contentRow = columns.map(col => {
    const modules = Array.from(col.children);
    if (modules.length === 1) {
      return modules[0];
    } else {
      return modules;
    }
  });

  // Compose the table rows:
  // - Header row: one cell/column only
  // - Content row: as many columns as needed
  const rows = [
    ['Columns (columns22)'],
    contentRow
  ];

  // Create the table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
