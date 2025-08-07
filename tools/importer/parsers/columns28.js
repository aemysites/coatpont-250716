/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell exactly matching the example
  const headerRow = ['Columns (columns28)'];

  // Get all direct child columns
  const columns = Array.from(element.querySelectorAll(':scope > .et_pb_column'));

  // For each column, gather the blurb and button, preserving order
  const contentRow = columns.map(col => {
    const cellContent = [];
    const children = Array.from(col.children);
    children.forEach(child => {
      if (child.classList.contains('et_pb_blurb') || child.classList.contains('et_pb_button_module_wrapper')) {
        cellContent.push(child);
      }
    });
    // fallback: if nothing matched, include all children
    if (cellContent.length === 0) {
      cellContent.push(...children);
    }
    if (cellContent.length === 1) return cellContent[0];
    if (cellContent.length > 1) return cellContent;
    return '';
  });

  // Final table: first row header (one cell), second row is columns
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
