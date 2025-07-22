/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header row
  const headerRow = ['Cards (cardsNoImages1)'];
  const rows = [headerRow];

  // Select all columns (cards)
  const columns = element.querySelectorAll(':scope > div');
  columns.forEach((col) => {
    // Find the .et_pb_text_inner container inside each column
    const textInner = col.querySelector('.et_pb_text_inner');
    // Only push non-empty cards
    if (textInner && textInner.textContent.trim().length > 0) {
      rows.push([textInner]);
    }
  });

  // Only create the table if we have at least one card
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
  // If no cards found, remove the element
  else {
    element.remove();
  }
}
