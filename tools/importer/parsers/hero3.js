/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example exactly
  const headerRow = ['Hero (hero3)'];

  // Background image: There is none in this source, but code should handle it if present
  let bgImageUrl = null;
  // Check inline style on section
  if (element.style && element.style.backgroundImage) {
    const urlMatch = element.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (urlMatch) bgImageUrl = urlMatch[1];
  }
  // Or first <img> inside element
  if (!bgImageUrl) {
    const img = element.querySelector('img');
    if (img && img.src) {
      bgImageUrl = img.src;
    }
  }
  let bgRow = null;
  if (bgImageUrl) {
    const img = document.createElement('img');
    img.src = bgImageUrl;
    bgRow = [img];
  }

  // Gather the main content: headline(s), subheading(s), etc. as per example
  // The HTML has a row > col > (several) .et_pb_module (each with .et_pb_text_inner)
  // We want the content (headings, etc) in the third row in the same column
  // We'll get all .et_pb_text_inner descendants in document order
  const contentElements = [];
  const textInners = element.querySelectorAll('.et_pb_text_inner');
  textInners.forEach(node => {
    // only add if it contains content (skip empty)
    if (node.textContent.trim().length > 0) {
      contentElements.push(node);
    }
  });

  // Compose table rows as per requirement: header, (optional background img), content
  const cells = [
    headerRow,
  ];
  if (bgRow) {
    cells.push(bgRow);
  }
  // Only add content row if there is content
  if (contentElements.length) {
    cells.push([contentElements]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
