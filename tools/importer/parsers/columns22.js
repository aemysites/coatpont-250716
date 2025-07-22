/* global WebImporter */
export default function parse(element, { document }) {
  // Find all columns
  const columns = Array.from(element.children).filter(child => child.classList && child.classList.contains('et_pb_column'));
  const colElements = columns.length > 0 ? columns : Array.from(element.children);

  // Header row with a single cell
  const headerRow = ['Columns (columns22)'];

  // Second row: each cell is the full content of each column
  const contentRow = colElements.map(col => {
    // If column has multiple root children, group them
    if (col.children.length === 1) {
      return col.firstElementChild;
    } else {
      const frag = document.createDocumentFragment();
      Array.from(col.children).forEach(child => frag.appendChild(child));
      return frag;
    }
  });

  // Assemble table
  const tableCells = [
    headerRow, // one cell
    contentRow // n cells
  ];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
