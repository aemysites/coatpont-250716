/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name per specification
  const rows = [
    ['Cards (cardsNoImages10)'],
  ];

  // Select all direct column children (each with a testimonial)
  const columns = element.querySelectorAll(':scope > div');
  columns.forEach(col => {
    const testimonial = col.querySelector('.et_pb_testimonial');
    if (testimonial) {
      // We'll gather the content in order: testimonial text (em), author (span), position (in p > span)
      const cellContent = [];
      // Testimonial text
      const contentEm = testimonial.querySelector('.et_pb_testimonial_content em');
      if (contentEm) {
        // Wrap in <p> for structure, as in the example
        const p = document.createElement('p');
        p.append(contentEm);
        cellContent.push(p);
      }
      // Author (name)
      const authorSpan = testimonial.querySelector('.et_pb_testimonial_author');
      if (authorSpan) {
        const strong = document.createElement('strong');
        strong.append(authorSpan);
        cellContent.push(strong);
      }
      // Author position (meta)
      const positionSpan = testimonial.querySelector('.et_pb_testimonial_position');
      if (positionSpan) {
        const p = document.createElement('p');
        p.append(positionSpan);
        cellContent.push(p);
      }
      // Only push non-empty cards
      if (cellContent.length) {
        rows.push([cellContent]);
      }
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
