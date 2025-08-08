/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the 'General Availability (Build ...)' resolved issues table for the release notes
  // Make sure we reference the correct table and preserve the semantic block structure

  // The example displays a single table with a header: 'Table (bordered, tableBordered35)'
  // The content row contains the table from the source HTML (with three columns: Component | Resolved issues)

  // Locate the resolved issues section
  const resolvedIssuesHeader = element.querySelector('h2#resolved-issues');
  if (!resolvedIssuesHeader) return;

  // Find the correct table: look for the h3 General Availability heading, then the first <table> after it
  let gaTable = null;
  let gaHeader = null;
  let cur = resolvedIssuesHeader.nextElementSibling;
  while (cur) {
    if (cur.tagName && cur.tagName.toLowerCase() === 'h3' && cur.textContent.includes('General Availability')) {
      gaHeader = cur;
    }
    if (gaHeader && cur.tagName && cur.tagName.toLowerCase() === 'div') {
      // Search for the first table in this div
      gaTable = cur.querySelector('table');
      if (gaTable) break;
    }
    cur = cur.nextElementSibling;
  }

  if (!gaTable) return;

  // The block header row (matches the requirements)
  const headerRow = ['Table (bordered, tableBordered35)'];
  // All content in the table cell is referenced by table element
  const cells = [headerRow, [gaTable]];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the block table
  element.parentNode.replaceChild(block, element);
}