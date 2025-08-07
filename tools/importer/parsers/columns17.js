/* global WebImporter */
export default function parse(element, { document }) {
  // Find immediate columns
  const columns = element.querySelectorAll(':scope > div');
  // Collect main module from each column, fallback to the column itself
  const colContent = Array.from(columns).map((col) => {
    const mainModule = col.querySelector(':scope > .et_pb_module');
    return mainModule || col;
  });
  // The header row must be a single cell (one column)
  const cells = [
    ['Columns (columns17)'], // header row: single cell
    colContent // content row: one cell per column
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
