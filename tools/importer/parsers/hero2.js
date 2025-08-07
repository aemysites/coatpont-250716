/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table header, per block definition
  const headerRow = ['Hero (hero2)'];

  // Row 2: Background image (none here, just leave empty)
  const backgroundRow = [''];

  // Row 3: Content (subheading, heading, CTA)
  // Reference the actual nodes from the DOM
  let content = [];

  // Find the main text block
  const textModule = element.querySelector('.et_pb_text_inner');
  if (textModule) {
    // Gather all child nodes that are headings, paragraphs, etc (to preserve their semantic structure)
    // We'll include all children, if any
    for (const node of textModule.children) {
      content.push(node);
    }
  }

  // Find the button module (CTA)
  const button = element.querySelector('.et_pb_button');
  if (button) {
    content.push(button);
  }

  // If nothing was found, insert empty string to avoid empty cell array
  if (content.length === 0) {
    content = [''];
  }

  // Compose the table
  const cells = [headerRow, backgroundRow, [content]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
