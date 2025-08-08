/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns section: look for a container with two columns (data-testid="column")
  let columnsSection = element.querySelector('.sc-16922d56-0.fDoQHY');
  if (!columnsSection) columnsSection = element;

  // Find all immediate children that are columns
  let columnElements = Array.from(columnsSection.querySelectorAll(':scope > [data-testid="column"]'));
  // If not found, fallback to immediate div children
  if (!columnElements.length) {
    columnElements = Array.from(columnsSection.querySelectorAll(':scope > div'));
  }
  // If still not found, fallback to using the main section as one column
  if (!columnElements.length) {
    columnElements = [columnsSection];
  }

  // Build the table manually to ensure header spans all columns
  const table = document.createElement('table');
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = 'Columns';
  headerTh.setAttribute('colspan', columnElements.length);
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);

  // Create the content row
  const contentTr = document.createElement('tr');
  columnElements.forEach(col => {
    const td = document.createElement('td');
    // Reference all direct children so text content is preserved
    Array.from(col.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const txt = node.textContent.trim();
        if (txt) td.appendChild(document.createTextNode(txt));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        td.appendChild(node);
      }
    });
    // If cell is empty, fallback to full column element
    if (!td.hasChildNodes()) {
      td.appendChild(col);
    }
    contentTr.appendChild(td);
  });
  table.appendChild(contentTr);

  element.replaceWith(table);
}
