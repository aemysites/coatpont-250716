/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: always the block name exactly as given
  const headerRow = ['Hero (hero25)'];

  // Row 2: Background image (optional)
  // For this HTML, there is NO <img> or background image; leave blank
  const bgRow = [''];

  // Row 3: Title (optional) - styled as a Heading.
  // Subheading/CTA: not present
  // Find the h1 (title)
  let titleCell = '';
  const h1 = element.querySelector('h1');
  if (h1) {
    titleCell = h1;
  }

  // The final cells array for the table
  const cells = [
    headerRow,   // Row 1: block name
    bgRow,       // Row 2: background image (none)
    [titleCell], // Row 3: content (title only in this case)
  ];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
