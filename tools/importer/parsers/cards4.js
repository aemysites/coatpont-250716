/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row
  const headerRow = ['Cards (cards4)'];
  const cells = [headerRow];

  // Find the immediate child columns (each card is one column)
  const columns = element.querySelectorAll(':scope > div');
  columns.forEach((col) => {
    // Card variables
    let imageOrIcon = null;
    let textPart = [];

    // Find the blurb module (wrapper for a card)
    const blurb = col.querySelector('.et_pb_blurb');
    if (!blurb) return;

    // Icon or image
    const iconWrap = blurb.querySelector('.et_pb_main_blurb_image');
    if (iconWrap) {
      imageOrIcon = iconWrap;
    } else {
      imageOrIcon = '';
    }

    // Title (heading)
    const heading = blurb.querySelector('.et_pb_module_header');
    if (heading) {
      textPart.push(heading);
    }

    // Description
    const desc = blurb.querySelector('.et_pb_blurb_description');
    if (desc) {
      textPart.push(desc);
    }

    // Push only if there is at least one visual or text element
    if (imageOrIcon || textPart.length) {
      cells.push([imageOrIcon, textPart]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
