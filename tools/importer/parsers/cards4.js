/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Cards (cards4)'];
  // Get direct card columns
  const cardColumns = element.querySelectorAll(':scope > div');
  const rows = [];
  cardColumns.forEach((col) => {
    // Each card is a column
    const blurb = col.querySelector('.et_pb_blurb_content');
    if (!blurb) return; // skip if missing
    // Icon cell: the icon or image (as-is, including wrappers)
    const icon = blurb.querySelector('.et_pb_main_blurb_image');
    // Text cell: header (h2) and description (div)
    const blurbContainer = blurb.querySelector('.et_pb_blurb_container');
    if (!blurbContainer) return;
    const title = blurbContainer.querySelector('h2');
    const desc = blurbContainer.querySelector('.et_pb_blurb_description');
    // Clean: Remove empty spans in description
    if (desc) {
      desc.querySelectorAll('span').forEach(span => {
        if (!span.textContent.trim()) span.remove();
      });
    }
    // Compose text cell
    const textCell = [];
    if (title) textCell.push(title);
    if (desc) textCell.push(desc);
    rows.push([icon, textCell]);
  });
  // Compose full table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
