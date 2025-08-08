/* global WebImporter */
export default function parse(element, { document }) {
  // Find General Availability section heading
  const gaHeading = element.querySelector('h3#oneagent-sprint-297-ga');
  if (!gaHeading) return;

  // Find the resolved issues summary table after the heading
  let htmlTable = null;
  let node = gaHeading.nextElementSibling;
  while (node && !htmlTable) {
    htmlTable = node.querySelector && node.querySelector('table');
    if (!htmlTable) node = node.nextElementSibling;
  }
  if (!htmlTable) return;

  // Extract column headers exactly as they appear
  const thead = htmlTable.querySelector('thead');
  const headerRow = thead ? thead.querySelector('tr') : null;
  const colHeaders = headerRow
    ? Array.from(headerRow.children).map(th => th.textContent.trim())
    : [];

  // Extract each data row as array of elements or text
  const tbody = htmlTable.querySelector('tbody');
  const dataRows = [];
  if (tbody) {
    tbody.querySelectorAll('tr').forEach(tr => {
      const tds = Array.from(tr.children).map(td => {
        // If there is a link, use the existing a element
        const a = td.querySelector('a');
        if (a) return a;
        // If there are multiple child nodes, include the td to preserve formatting
        if (td.childNodes.length > 1) return td;
        // Otherwise, use text content
        return td.textContent.trim();
      });
      dataRows.push(tds);
    });
  }

  // Build the block table: header row, column row, data
  const cells = [
    ['Table (table3)'],
    colHeaders,
    ...dataRows
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the whole resolved issues heading section with the block table
  gaHeading.parentElement.replaceWith(block);
}
