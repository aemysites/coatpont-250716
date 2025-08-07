/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row for the block, as per requirements
  const cells = [['Cards (cardsNoImages30)']];

  // Locate the card list section (each article is a card)
  const blogList = element.querySelector('.et_pb_blog_0 .et_pb_ajax_pagination_container');
  if (blogList) {
    const articles = blogList.querySelectorAll('article');
    articles.forEach((article) => {
      const cardContent = [];
      // Heading/title (linked h2)
      const h2 = article.querySelector('h2');
      if (h2) cardContent.push(h2);
      // Meta/date
      const meta = article.querySelector('.post-meta');
      if (meta) cardContent.push(meta);
      // Excerpt/description
      const inner = article.querySelector('.post-content-inner');
      if (inner) cardContent.push(inner);
      // Call-to-action (lire plus link)
      const cta = article.querySelector('.more-link');
      if (cta) cardContent.push(cta);
      cells.push([cardContent]);
    });
  }

  // Only create the table if there is at least the header row
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
