/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row with a single cell
  const headerRow = ['Columns (columns17)'];

  // Get immediate column children
  const columns = Array.from(element.querySelectorAll(':scope > .et_pb_column'));

  // For each column, gather all meaningful content
  const contentCells = columns.map((col) => {
    // Collect all child elements with content
    const children = Array.from(col.children).filter((child) => {
      return child.textContent.trim().length > 0 || child.querySelector('img, a, p, div');
    });
    if (children.length === 0) return col;
    if (children.length === 1) return children[0];
    return children;
  });

  // The second row contains one cell per column (can be >1 cell)
  const tableRows = [headerRow, contentCells];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
