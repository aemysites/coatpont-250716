/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row exactly as in the example
  const headerRow = ['Hero (hero8)'];

  // Background image row. Not present in this HTML example.
  const bgRow = [''];

  // Content row: Collect all .et_pb_text_inner elements in order for semantic structure
  // It is important NOT to clone or create new nodes, but reference the originals
  const contentInners = Array.from(element.querySelectorAll('.et_pb_text_inner'));
  const contentRow = [contentInners];

  // Create the main block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}