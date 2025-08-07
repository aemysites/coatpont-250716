/* global WebImporter */
export default function parse(element, { document }) {
  // The block header must match exactly
  const headerRow = ['Cards (cardsNoImages14)'];

  // Get all direct child columns in the row
  const columns = element.querySelectorAll(':scope > div');
  const cardRows = [];

  columns.forEach((col) => {
    // Only process columns that are not empty
    if (!col.classList.contains('et_pb_column_empty')) {
      // Try to find the inner content that represents the card body
      const textModule = col.querySelector('.et_pb_text_inner');
      if (textModule && textModule.textContent.trim() !== '') {
        cardRows.push([textModule]);
      }
    }
  });

  // Compose table: header row first, then all cards (one per row)
  const cells = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
