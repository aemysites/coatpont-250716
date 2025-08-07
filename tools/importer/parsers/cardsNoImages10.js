/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as in the markdown example
  const headerRow = ['Cards (cardsNoImages10)'];
  const rows = [headerRow];

  // Find each column (each is a card)
  const columns = element.querySelectorAll(':scope > div');
  columns.forEach((col) => {
    // Each column contains a .et_pb_testimonial block
    const testimonial = col.querySelector('.et_pb_testimonial');
    if (!testimonial) return;
    const cellContent = [];
    // Content (the quote)
    const content = testimonial.querySelector('.et_pb_testimonial_content');
    if (content) {
      // Use a <div> to wrap the content (may contain <em> etc.)
      const div = document.createElement('div');
      // Move all child nodes (not clone) for reference
      while (content.childNodes.length > 0) {
        div.appendChild(content.childNodes[0]);
      }
      cellContent.push(div);
    }
    // Author name (bold)
    const author = testimonial.querySelector('.et_pb_testimonial_author');
    if (author && author.textContent.trim() !== '') {
      const strong = document.createElement('strong');
      strong.textContent = author.textContent;
      cellContent.push(strong);
    }
    // Position/job - always below author, not bold
    const position = testimonial.querySelector('.et_pb_testimonial_position');
    if (position && position.textContent.trim() !== '') {
      const posDiv = document.createElement('div');
      posDiv.textContent = position.textContent;
      cellContent.push(posDiv);
    }
    // Only add row if there's something to show
    if (cellContent.length > 0) {
      rows.push([cellContent]);
    }
  });
  // Create the table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
