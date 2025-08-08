/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first table under this element
  const mainTable = element.querySelector('table');
  if (!mainTable) return;

  // Get header texts from the first row of thead
  const thead = mainTable.querySelector('thead');
  let headers = [];
  if (thead) {
    const ths = thead.querySelectorAll('th');
    headers = Array.from(ths).map(th => th.textContent.trim());
  }

  // Should match ['Component', 'Resolved issues']
  if (headers.length !== 2 || headers[0] !== 'Component' || headers[1] !== 'Resolved issues') return;

  // Prepare cells array: block row, header row, all table rows
  const cells = [
    ['Table (table13)'],
    headers
  ];

  // Process each row in tbody
  const tbody = mainTable.querySelector('tbody');
  if (tbody) {
    const trs = tbody.querySelectorAll('tr');
    trs.forEach(tr => {
      const tds = tr.querySelectorAll('td');
      if (tds.length !== 2) return;
      // For the first column: preserve link if present, else plain text
      const a = tds[0].querySelector('a');
      let firstCell = a ? a : tds[0].textContent.trim();
      let secondCell = tds[1].textContent.trim();
      cells.push([firstCell, secondCell]);
    });
  }

  // Create the new block table and replace the original
  const block = WebImporter.DOMUtils.createTable(cells, document);
  mainTable.replaceWith(block);
}
