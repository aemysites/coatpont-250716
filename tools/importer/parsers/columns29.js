/* global WebImporter */
export default function parse(element, { document }) {
  // Get the immediate column divs
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, collect its contents (usually a single child, but might be more)
  const contentRow = columns.map((col) => {
    if (!col.children || col.children.length === 0) return '';
    if (col.children.length === 1) {
      return col.children[0];
    }
    return Array.from(col.children);
  });

  // The header row must have the SAME number of columns as the content row,
  // with only the first cell set, and the rest as empty strings
  const headerRow = ['Columns (columns29)', ...Array(contentRow.length - 1).fill('')];

  const tableRows = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
