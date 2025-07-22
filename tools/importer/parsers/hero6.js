/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row exactly as specified
  const headerRow = ['Hero (hero6)'];

  // --- Extract the image (background/visual hero asset) ---
  let imgEl = null;
  // The structure is: row > col (image) > module > span > img
  const row = element.querySelector(':scope > .et_pb_row');
  if (row) {
    const columns = row.querySelectorAll(':scope > div');
    if (columns.length > 0) {
      const imageModule = columns[0].querySelector('.et_pb_module.et_pb_image');
      if (imageModule) {
        const imgWrap = imageModule.querySelector('img');
        if (imgWrap) {
          imgEl = imgWrap;
        }
      } else {
        // Fallback: any img in col
        const fallbackImg = columns[0].querySelector('img');
        if (fallbackImg) imgEl = fallbackImg;
      }
    }
  }
  // Fallback: any img in element if not found already
  if (!imgEl) {
    imgEl = element.querySelector('img');
  }

  // If no image is found, keep cell empty (matches optional background image spec)

  // --- Extract the headline and text content ---
  let textCellContent = [];
  if (row) {
    const columns = row.querySelectorAll(':scope > div');
    if (columns.length > 1) {
      // Usually the headline/text is in the second column
      const textBlock = columns[1].querySelector('.et_pb_text_inner');
      if (textBlock) {
        // Collect all children: h2, p, etc.
        // If there are empty <p>, skip them
        Array.from(textBlock.childNodes).forEach(child => {
          // If <p> and only &nbsp;, skip
          if (child.nodeType === 1 && child.tagName === 'P' && child.innerHTML.trim() === '&nbsp;') {
            return;
          }
          // Only add non-empty nodes
          if (child.nodeType === 1 && child.textContent.trim() === '' && !child.querySelector('img')) {
            return;
          }
          if (child.nodeType === 1 || (child.nodeType === 3 && child.textContent.trim())) {
            textCellContent.push(child);
          }
        });
      }
    }
  }
  // Fallback: try to find .et_pb_text_inner anywhere
  if (textCellContent.length === 0) {
    const fallbackTextBlock = element.querySelector('.et_pb_text_inner');
    if (fallbackTextBlock) {
      Array.from(fallbackTextBlock.childNodes).forEach(child => {
        if (child.nodeType === 1 && child.tagName === 'P' && child.innerHTML.trim() === '&nbsp;') {
          return;
        }
        if (child.nodeType === 1 && child.textContent.trim() === '' && !child.querySelector('img')) {
          return;
        }
        if (child.nodeType === 1 || (child.nodeType === 3 && child.textContent.trim())) {
          textCellContent.push(child);
        }
      });
    }
  }

  // If no text, cell must be empty
  if (textCellContent.length === 0) {
    textCellContent = [''];
  }

  // --- Construct table array ---
  const cells = [
    headerRow,
    [imgEl ? imgEl : ''],
    [textCellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
