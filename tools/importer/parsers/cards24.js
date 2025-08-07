/* global WebImporter */
export default function parse(element, { document }) {
  // Find the swiper-wrapper containing the cards
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;
  // Find all the card elements (cards are .et_pb_blurb)
  const cardElements = Array.from(swiperWrapper.querySelectorAll(':scope > .et_pb_blurb'));
  // To avoid duplicate cards (due to swiper duplicate slides)
  const seenCards = new Set();
  const rows = [];
  cardElements.forEach((card) => {
    // Get the image element (first img descendant)
    const img = card.querySelector('img');
    // Get the text container (title and description)
    const blurbHeader = card.querySelector('h4, .et_pb_module_header');
    const blurbDesc = card.querySelector('.et_pb_blurb_description');
    // Prepare a string key to avoid duplicates
    const key = [
      img ? img.getAttribute('src') : '',
      blurbHeader ? blurbHeader.textContent.trim() : '',
      blurbDesc ? blurbDesc.textContent.trim() : ''
    ].join('|');
    if (seenCards.has(key)) return;
    seenCards.add(key);
    // Build the text cell
    const textCell = document.createElement('div');
    if (blurbHeader && blurbHeader.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = blurbHeader.textContent.trim();
      textCell.appendChild(strong);
      if (blurbDesc) {
        textCell.appendChild(document.createElement('br'));
      }
    }
    if (blurbDesc) {
      // Move all children of description (including formatting)
      Array.from(blurbDesc.childNodes).forEach((node) => {
        textCell.appendChild(node);
      });
    }
    // Add card row: always [img, textCell] (if either is missing, use null)
    rows.push([img, textCell]);
  });
  if (rows.length === 0) return;
  const table = WebImporter.DOMUtils.createTable([
    ['Cards (cards24)'],
    ...rows
  ], document);
  element.replaceWith(table);
}
