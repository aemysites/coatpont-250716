/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main row inside the section
  const row = element.querySelector('.et_pb_row');
  if (!row) return;

  // Collect all columns (direct children of row)
  const columns = row.querySelectorAll(':scope > .et_pb_column');

  // Header row must be a single cell, matching the markdown example
  const headerRow = ['Columns (columns13)'];

  // Prepare the cells for each column by referencing all top-level children (modules)
  const contentRow = [];
  columns.forEach((col) => {
    // Collect all direct children (modules) of column
    const children = Array.from(col.children);
    if (children.length > 0) {
      const fragment = document.createDocumentFragment();
      children.forEach((child) => {
        fragment.appendChild(child);
      });
      contentRow.push(fragment);
    } else {
      contentRow.push('');
    }
  });

  // Compose the block table, ensuring the header is a single-cell row
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
