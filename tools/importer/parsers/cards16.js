/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const cells = [['Cards (cards16)']];

  // Collect all direct children columns (cards)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  columns.forEach((col) => {
    // Find the blurb content (main card section)
    const blurb = col.querySelector('.et_pb_blurb_content');
    let iconCell = '';
    const textCellContent = [];

    if (blurb) {
      // Icon/"Image" cell
      const icon = blurb.querySelector('.et_pb_main_blurb_image');
      if (icon) {
        iconCell = icon;
      }

      // Text content cell
      const blurbContainer = blurb.querySelector('.et_pb_blurb_container');
      if (blurbContainer) {
        // Heading (keep original element)
        const heading = blurbContainer.querySelector('.et_pb_module_header');
        if (heading) textCellContent.push(heading);
        // Description
        const desc = blurbContainer.querySelector('.et_pb_blurb_description');
        if (desc) textCellContent.push(desc);
      }
    }

    // Call-to-action (optional)
    const cta = col.querySelector('a.et_pb_button');
    if (cta) {
      textCellContent.push(cta);
    }

    // Add row for this card if at least an icon and text content
    if (iconCell && textCellContent.length > 0) {
      cells.push([iconCell, textCellContent]);
    }
  });

  // Only create table if at least header + one row
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
