/* global WebImporter */
export default function parse(element, { document }) {
  // The block header, must be exactly as in the example and only one column
  const blockHeader = ['Table (bordered, tableBordered18)'];

  // Find the first table element inside the given element
  const sourceTable = element.querySelector('table');

  // If there is no table, do nothing
  if (!sourceTable) return;

  // Reference the source table directly, ensuring all content, formatting, and structure is preserved
  // This ensures all text, links, and semantic structure from the HTML is included
  // Do not clone or create a new table - reference the existing table element
  
  // Compose the block as specified: header row, then the table as a single cell
  const cells = [
    blockHeader,
    [sourceTable]
  ];
  
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block
  element.replaceWith(block);
}
