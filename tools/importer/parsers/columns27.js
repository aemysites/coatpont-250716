/* global WebImporter */
export default function parse(element, { document }) {
  // Get all columns (immediate children)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, find the main content (the image module)
  const contentRow = columns.map(col => {
    const imgModule = col.querySelector('.et_pb_module.et_pb_image');
    return imgModule || '';
  });

  // Ensure the header row is a single cell, per the example
  const headerRow = ['Columns (columns27)'];

  // Compose table array with single-cell header
  const table = [
    headerRow,
    contentRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(table, document);
  // Replace the original element
  element.replaceWith(block);
}
