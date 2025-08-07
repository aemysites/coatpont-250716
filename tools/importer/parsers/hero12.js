/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row for the block, as per table header guideline
  const headerRow = ['Hero (hero12)'];

  // 2. Background image row: This HTML block does NOT have a background image, so keep cell empty
  const backgroundRow = [''];

  // 3. Content row: place all of the icon, heading, and description in a single cell
  //    The content lives within .et_pb_blurb_content
  //    It's best to reference the .et_pb_blurb_content element directly for resilience
  const blurbContent = element.querySelector('.et_pb_blurb_content');
  // Defensive: if not found, use an empty string
  const contentRow = [blurbContent || ''];

  // Compose the rows for the table
  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
