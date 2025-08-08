/* global WebImporter */
export default function parse(element, { document }) {
  // The required block header row, always a single item
  const headerRow = ['Table (table45)'];

  // Find the summary table under 'Resolved issues' -> 'General Availability (Build ...)'
  let summaryTable = null;
  const resolvedIssuesH2 = element.querySelector('h2#resolved-issues');
  if (resolvedIssuesH2) {
    let next = resolvedIssuesH2.nextElementSibling;
    let gaHeading = null;
    while (next) {
      if (next.tagName === 'H3' && next.id && next.id.startsWith('oneagent-sprint-231-ga')) {
        gaHeading = next;
        break;
      }
      next = next.nextElementSibling;
    }
    if (gaHeading) {
      let tableDiv = gaHeading.nextElementSibling;
      while (tableDiv && !tableDiv.querySelector('table')) {
        tableDiv = tableDiv.nextElementSibling;
      }
      if (tableDiv) {
        summaryTable = tableDiv.querySelector('table');
      }
    }
  }

  // Now build the cells array
  const cells = [headerRow];

  if (summaryTable) {
    // Parse the summary table header and rows as content rows (not as block header)
    const thead = summaryTable.querySelector('thead');
    if (thead) {
      const ths = thead.querySelectorAll('th');
      // The table header should be a row with multiple columns (not block header)
      const headerCells = Array.from(ths).map(th => th);
      if (headerCells.length > 0) {
        cells.push(headerCells);
      }
    }
    // Add each table row
    const tbody = summaryTable.querySelector('tbody');
    if (tbody) {
      const trs = tbody.querySelectorAll('tr');
      trs.forEach(tr => {
        const tds = Array.from(tr.querySelectorAll('td')).map(td => {
          // Use the <a> directly if present
          const link = td.querySelector('a');
          return link ? link : td.textContent.trim();
        });
        if (tds.length > 0) {
          cells.push(tds);
        }
      });
    }
  }

  // Only replace if there is actual table data
  if (cells.length > 1) {
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
