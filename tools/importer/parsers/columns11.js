/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct child columns (each column is a direct child div)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length === 0) return;

  // For each column, find the main content block
  const columnContents = columns.map((col) => {
    const blurb = col.querySelector('.et_pb_blurb_content');
    return blurb || col;
  });

  // Header row: only one cell, matching the example exactly
  const headerRow = ['Columns (columns11)'];
  // Content row: one cell per column
  const contentRow = columnContents;

  // The table data: header row of 1 cell, then a row with N cells
  const tableData = [
    headerRow,
    contentRow
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  // Replace the original element
  element.replaceWith(table);
}