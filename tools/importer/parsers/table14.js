/* global WebImporter */
export default function parse(element, { document }) {
  // Find the resolved issues summary table in the release notes
  const resolvedIssuesSection = element.querySelector('[data-testid="release-notes-resolved-issues"]');
  if (!resolvedIssuesSection) return;

  // The summary table is always the first table in the section
  const table = resolvedIssuesSection.querySelector('table');
  if (!table) return;

  // Extract the table header row from thead
  const thead = table.querySelector('thead');
  const headerRow = thead ? Array.from(thead.querySelectorAll('th')).map(th => th.textContent.trim()) : [];

  // Extract each data row
  const tbody = table.querySelector('tbody');
  const dataRows = tbody
    ? Array.from(tbody.querySelectorAll('tr')).map(tr =>
        Array.from(tr.querySelectorAll('td')).map(td => {
          // If the cell contains an <a>, reference it directly, else include the text
          const a = td.querySelector('a');
          if (a) {
            return a;
          }
          return td.textContent.trim();
        })
      )
    : [];

  // Build the final cells array
  // - First row: single cell with block name ('Table')
  // - Second row: header columns from table
  // - Subsequent rows: all data rows
  const cells = [
    ['Table'], // Fix: Only 'Table', not 'Table (table14)'
    headerRow,
    ...dataRows
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the section with the new block table
  resolvedIssuesSection.replaceWith(block);
}
