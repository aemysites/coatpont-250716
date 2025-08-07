/* global WebImporter */
export default function parse(element, { document }) {
  // Header for columns31 block: Must be a single cell
  const headerRow = ['Columns (columns31)'];

  // Get all direct child columns (divs with class et_pb_column)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, collect its entire module (usually a single child)
  const contentCells = columns.map((col) => {
    // The content is the first child div with class et_pb_module...
    const module = col.querySelector(':scope > div');
    return module || col;
  });

  // The content row must have one array item per column (be a row of N cells),
  // but the header row must be a single cell array
  const tableData = [
    headerRow,         // 1 cell in header row
    contentCells       // N cells in second row, one per column
  ];

  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
