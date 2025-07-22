/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for accordion block
  const headerRow = ['Accordion'];
  const rows = [];

  // Find all immediate .et_pb_toggle elements (accordion items)
  const toggles = Array.from(element.querySelectorAll(':scope > div > div > .et_pb_toggle'));

  toggles.forEach(toggle => {
    // Title: h5.et_pb_toggle_title (required)
    const title = toggle.querySelector('.et_pb_toggle_title, h5, h4, h3');
    if (!title) return; // skip if no title

    // Content: .et_pb_toggle_content
    const content = toggle.querySelector('.et_pb_toggle_content');
    if (!content) return; // skip if no content

    // For semantic/robustness, reference the actual .et_pb_toggle_content element (not clones)
    rows.push([title, content]);
  });

  // Create the Accordion block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
