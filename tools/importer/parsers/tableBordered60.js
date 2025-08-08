/* global WebImporter */
export default function parse(element, { document }) {
  // The required header row as per the example
  const headerRow = ['Table (bordered, tableBordered60)'];

  // Find the Resolved Issues section
  const resolvedIssuesHeading = element.querySelector('h2#resolved-issues');
  if (!resolvedIssuesHeading) return;

  // Find the General Availability H3 under Resolved Issues
  let gaSection = resolvedIssuesHeading.nextElementSibling;
  while (gaSection && !(gaSection.tagName === 'H3' && gaSection.id.startsWith('saas-sprint-'))) {
    gaSection = gaSection.nextElementSibling;
  }
  if (!gaSection) return;

  // Find summary paragraph after General Availability heading
  let summaryP = gaSection.nextElementSibling;
  let summaryRow;
  if (summaryP && summaryP.tagName === 'P') {
    summaryRow = [summaryP];
  }

  // Find the table (component/issue counts)
  let tableEl = gaSection.nextElementSibling;
  while (tableEl && tableEl.tagName !== 'DIV') {
    tableEl = tableEl.nextElementSibling;
  }
  // The table is inside a div in this HTML
  let summaryTable = tableEl ? tableEl.querySelector('table') : null;

  // Compose rows for the block
  const rows = [];
  rows.push(headerRow); // Always use the correct header row

  // General Availability heading (as a cell)
  rows.push([gaSection]);
  // Summary paragraph
  if (summaryRow) rows.push(summaryRow);
  // Table row
  if (summaryTable) rows.push([summaryTable]);

  // After the table, process each H4 and its UL of issues
  let node = tableEl ? tableEl.nextElementSibling : null;
  while (node) {
    if (node.tagName === 'H4') {
      // Add the H4 heading (reference the heading element)
      rows.push([node]);
      // Find the next div containing UL (the block for the component)
      let listContainer = node.nextElementSibling;
      if (
        listContainer &&
        listContainer.classList.contains('sc-afe78283-0') &&
        listContainer.querySelector('ul')
      ) {
        const ul = listContainer.querySelector('ul');
        rows.push([ul]);
      }
    }
    // Stop at next major H2/H3 or end of resolved issues section
    if (
      node.tagName === 'H2' ||
      node.tagName === 'H3' ||
      (node.tagName === 'DIV' && node.classList.contains('search-exclude'))
    ) {
      break;
    }
    node = node.nextElementSibling;
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
