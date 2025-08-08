/* global WebImporter */
export default function parse(element, { document }) {
  // Find the heading for GA (General Availability) resolved issues block
  const gaHeading = element.querySelector('h3#oneagent-sprint-221-ga');
  if (!gaHeading) return;

  // Find the GA table following the heading
  let gaTable = null;
  let nextSibling = gaHeading.nextElementSibling;
  while (nextSibling) {
    if (nextSibling.querySelector && nextSibling.querySelector('table')) {
      gaTable = nextSibling.querySelector('table');
      break;
    }
    nextSibling = nextSibling.nextElementSibling;
  }
  if (!gaTable) return;

  // Extract header row (column titles) as text
  let headerRow = [];
  const headerTr = gaTable.querySelector('thead tr');
  if (headerTr) {
    headerRow = Array.from(headerTr.children).map(th => th.textContent.trim());
  }

  // Extract data rows (each as an array of the TDs' CONTENT, not the TD elements themselves)
  const bodyRows = [];
  const trs = gaTable.querySelectorAll('tbody tr');
  trs.forEach(tr => {
    const row = Array.from(tr.children).map(td => {
      // Directly reference all child nodes in the TD (elements and text nodes)
      const children = Array.from(td.childNodes).filter(node => {
        // Only include text nodes with content or element nodes
        return (node.nodeType === Node.ELEMENT_NODE) || (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '');
      });
      // If only one node, use it directly; if multiple, return array; if none, use textContent
      if (children.length === 1) {
        return children[0];
      } else if (children.length > 1) {
        return children;
      } else {
        return td.textContent.trim();
      }
    });
    bodyRows.push(row);
  });

  // Compose cells: 1st row block name, 2nd row headers, then data rows
  const cells = [
    ['Table (table23)'],
    headerRow,
    ...bodyRows
  ];

  // Create table and replace element
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
