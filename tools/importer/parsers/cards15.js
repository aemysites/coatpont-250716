/* global WebImporter */
export default function parse(element, { document }) {
  // From the provided HTML, this element is just a divider (decorative)
  // There are no card elements to extract, so we create a Cards (cards15) block with only the header row
  const cells = [
    ['Cards (cards15)']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
