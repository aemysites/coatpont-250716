/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns in the row
  const row = element.querySelector('.et_pb_row');
  if (!row) return;
  const columns = row.querySelectorAll(':scope > .et_pb_column');
  if (columns.length < 2) return;

  // First column: left content (heading, paragraph, button)
  const leftCol = columns[0];
  const leftContent = [];
  // Text block (keep the .et_pb_text_inner div: contains h2 and p)
  const textBlock = leftCol.querySelector('.et_pb_text_inner');
  if (textBlock) leftContent.push(textBlock);
  // Button: use the actual <a> (not the wrapper div)
  const button = leftCol.querySelector('.et_pb_button_module_wrapper a');
  if (button) leftContent.push(button);

  // Second column: right content (image)
  const rightCol = columns[1];
  const rightContent = [];
  const img = rightCol.querySelector('img');
  if (img) rightContent.push(img);

  // Prepare the table as per the block definition
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns13)'],
    [leftContent, rightContent]
  ], document);

  element.replaceWith(table);
}
