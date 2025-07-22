/* global WebImporter */
export default function parse(element, { document }) {
  // Find the swiper-wrapper: the container holding all cards
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Collect the direct card elements (swiper-slide)
  const cardElements = Array.from(swiperWrapper.children).filter(
    (el) => el.classList.contains('et_pb_blurb')
  );

  // Dedupe cards by title (sometimes there are duplicates due to swiper's carousel mechanics)
  const seenTitles = new Set();
  const cards = [];
  cardElements.forEach(card => {
    const titleEl = card.querySelector('.et_pb_module_header span');
    const title = titleEl ? titleEl.textContent.trim() : '';
    if (title && !seenTitles.has(title)) {
      seenTitles.add(title);
      cards.push(card);
    }
  });

  // Build rows for the table
  const rows = [['Cards (cards24)']]; // Header row exactly matching the example

  cards.forEach(card => {
    // --- First cell: image (if present) ---
    const imgEl = card.querySelector('img');

    // --- Second cell: text block (title and description) ---
    const textCell = document.createElement('div');

    // Title: use <strong> for semantic emphasis and visual match
    const titleContainer = card.querySelector('.et_pb_module_header');
    if (titleContainer && titleContainer.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleContainer.textContent.trim();
      textCell.appendChild(strong);
      textCell.appendChild(document.createElement('br'));
    }

    // Description: preserve all children and inline markup
    const descEl = card.querySelector('.et_pb_blurb_description');
    if (descEl) {
      Array.from(descEl.childNodes).forEach(node => {
        textCell.appendChild(node.cloneNode(true));
      });
    }

    // Remove empty <br> at end if present (optional tidy)
    if (textCell.lastChild && textCell.lastChild.nodeName === 'BR' && !textCell.lastChild.nextSibling) {
      textCell.removeChild(textCell.lastChild);
    }

    rows.push([
      imgEl || '',
      textCell
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
