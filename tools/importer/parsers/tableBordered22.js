/* global WebImporter */
export default function parse(element, { document }) {
  // Find the summary table for resolved issues in the release notes section
  const resolvedIssuesSection = element.querySelector('[data-testid="release-notes-resolved-issues"]');
  if (!resolvedIssuesSection) return;

  const summaryTable = resolvedIssuesSection.querySelector('table');
  if (!summaryTable) return;

  // Table (bordered, tableBordered22) block header - exactly as in the prompt
  const headerRow = ['Table (bordered, tableBordered22)'];
  // Second row is the entire summary table as a single cell
  const tableRow = [summaryTable];

  const cells = [
    headerRow,
    tableRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
