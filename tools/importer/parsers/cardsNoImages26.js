/* global WebImporter */
export default function parse(element, { document }) {
  // The block header, as in the example, exactly:
  const headerRow = ['Cards (cardsNoImages26)'];
  const rows = [headerRow];

  // Find all .et_pb_blurb elements in order
  const blurbs = element.querySelectorAll('.et_pb_blurb');

  blurbs.forEach(blurb => {
    // We will assemble a DocumentFragment for this card's cell
    const frag = document.createDocumentFragment();

    // 1. Heading: .et_pb_module_header (usually h2 > span or h2 direct)
    const heading = blurb.querySelector('.et_pb_module_header');
    if (heading) {
      // As per example, bold the heading, preserving any spans
      // Instead of creating a new <strong>, just use the heading element itself, preserving tag
      // But if it's h2, we want the content only, as h2 is not allowed in table cell in example
      // So wrap heading's innerHTML in <strong>
      const strong = document.createElement('strong');
      strong.innerHTML = heading.innerHTML;
      frag.appendChild(strong);
      frag.appendChild(document.createElement('br'));
    }

    // 2. Description: first <p> (if any, with <em> child), then the <ul>
    const blurbDesc = blurb.querySelector('.et_pb_blurb_description');
    if (blurbDesc) {
      // Sometimes the first <p> is an italic subtitle (with <em>), sometimes empty
      const paragraphs = Array.from(blurbDesc.querySelectorAll('p'));
      for (const p of paragraphs) {
        // Only use non-empty paragraphs
        if (p.textContent && p.textContent.trim() !== '') {
          frag.appendChild(p);
        }
      }
      // Now lists, if present
      const ul = blurbDesc.querySelector('ul');
      if (ul) {
        frag.appendChild(ul);
      }
    }
    // Add this fragment to table rows
    rows.push([frag]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
