/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cardsNoImages1): 1 column, multiple rows, first row is header
  const headerRow = ['Cards (cardsNoImages1)'];

  // Get all immediate child columns (assume :scope > div)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, find .et_pb_text_inner (holds card content)
  const cardRows = columns.map(col => {
    const textInner = col.querySelector('.et_pb_text_inner');
    // If .et_pb_text_inner exists, use it; otherwise, fallback to the column itself
    return [textInner ? textInner : col];
  });

  // Construct the table: header, then one row per card
  const tableRows = [headerRow, ...cardRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the table
  element.replaceWith(block);
}
