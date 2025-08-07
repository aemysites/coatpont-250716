/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per spec
  const headerRow = ['Hero (hero7)'];

  // Background image row (none present in this HTML, so empty string as cell)
  const bgImageRow = [''];

  // Content row: Needs to include heading, subheading, CTA (button/link), preserving original elements
  // Get the row (et_pb_row) inside the section
  const row = element.querySelector('.et_pb_row');
  if (!row) return;
  // Get the single column (et_pb_column) inside the row
  const col = row.querySelector('.et_pb_column');
  if (!col) return;

  // We'll collect the content modules (text blocks and button) in their original order
  const contentElems = [];
  // Get all direct child modules (text blocks, button modules) in their DOM order
  col.querySelectorAll(':scope > .et_pb_module').forEach((mod) => {
    contentElems.push(mod);
  });

  // If for some reason there is no content, just skip replacing
  if (contentElems.length === 0) return;

  // Compose the block table
  const cells = [
    headerRow,
    bgImageRow,
    [contentElems]
  ];

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
