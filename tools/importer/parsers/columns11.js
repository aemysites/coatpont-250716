/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child columns (should be two)
  const columns = Array.from(element.querySelectorAll(':scope > .et_pb_column'));
  // Prepare cells for the table's second row
  const rowCells = columns.map(col => {
    const blurbContent = col.querySelector('.et_pb_blurb_content');
    return blurbContent || col;
  });
  // Table: first row is a single-cell header, second row is two columns
  const cells = [
    ['Columns (columns11)'], // Header row: one cell only
    rowCells                 // Data row: as many columns as needed
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}