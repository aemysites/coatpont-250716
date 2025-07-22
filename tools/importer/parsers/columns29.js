/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, find its main module (text or image)
  const colCells = columns.map((col) => {
    const mainModule = col.querySelector(':scope > .et_pb_module');
    return mainModule ? mainModule : col;
  });

  // The header row must have exactly 1 cell, regardless of the number of columns
  const headerRow = ['Columns (columns29)'];

  // The content row has as many columns as found
  const contentRow = colCells;

  // Compose the table rows as per spec
  const tableRows = [headerRow, contentRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
