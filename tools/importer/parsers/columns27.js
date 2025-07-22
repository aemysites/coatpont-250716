/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell as required
  const headerRow = ['Columns (columns27)'];

  // Content row: one cell for each column in the source html
  // Get all direct child columns (should be 3 as in original)
  const columns = Array.from(element.querySelectorAll(':scope > div.et_pb_column'));
  // fallback: if above selector returns nothing, select all direct divs
  const cols = columns.length ? columns : Array.from(element.querySelectorAll(':scope > div'));

  // Each column's content: if it's empty, empty string; otherwise, all child nodes
  const contentCells = cols.map(col => {
    const nonEmptyNodes = Array.from(col.childNodes).filter(node => {
      return node.nodeType !== Node.TEXT_NODE || node.textContent.trim();
    });
    if (nonEmptyNodes.length === 0) return '';
    if (nonEmptyNodes.length === 1) return nonEmptyNodes[0];
    return nonEmptyNodes;
  });

  // Structure: header row with 1 column, content row with N columns
  const rows = [headerRow, contentCells];

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
