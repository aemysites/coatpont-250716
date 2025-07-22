/* global WebImporter */
export default function parse(element, { document }) {
  // Block table header as in the example
  const headerRow = ['Cards (cardsNoImages14)'];

  // Find all immediate child columns (cards)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, find the .et_pb_text_inner (may be missing for empty columns)
  const rows = columns
    .map(col => {
      const textInner = col.querySelector('.et_pb_text_inner');
      // Only include this card if it has content (matching the example behavior)
      if (textInner) {
        return [textInner];
      }
      return null;
    })
    .filter(Boolean); // Remove nulls (empty columns)

  // Compose the table data
  const tableArray = [headerRow, ...rows];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(tableArray, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
