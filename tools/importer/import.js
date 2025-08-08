/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import accordion2Parser from './parsers/accordion2.js';
import table9Parser from './parsers/table9.js';
import table7Parser from './parsers/table7.js';
import table5Parser from './parsers/table5.js';
import table13Parser from './parsers/table13.js';
import tableStripedBordered15Parser from './parsers/tableStripedBordered15.js';
import tableBordered4Parser from './parsers/tableBordered4.js';
import tableStripedBordered11Parser from './parsers/tableStripedBordered11.js';
import tableBordered6Parser from './parsers/tableBordered6.js';
import cardsNoImages21Parser from './parsers/cardsNoImages21.js';
import table14Parser from './parsers/table14.js';
import table1Parser from './parsers/table1.js';
import tableBordered20Parser from './parsers/tableBordered20.js';
import tableStripedBordered24Parser from './parsers/tableStripedBordered24.js';
import table19Parser from './parsers/table19.js';
import table3Parser from './parsers/table3.js';
import tableBordered10Parser from './parsers/tableBordered10.js';
import table26Parser from './parsers/table26.js';
import tableStriped29Parser from './parsers/tableStriped29.js';
import tableBordered22Parser from './parsers/tableBordered22.js';
import table33Parser from './parsers/table33.js';
import table23Parser from './parsers/table23.js';
import tableBordered25Parser from './parsers/tableBordered25.js';
import table30Parser from './parsers/table30.js';
import table28Parser from './parsers/table28.js';
import tableBordered35Parser from './parsers/tableBordered35.js';
import accordion31Parser from './parsers/accordion31.js';
import tableBordered17Parser from './parsers/tableBordered17.js';
import columns40Parser from './parsers/columns40.js';
import tableBordered16Parser from './parsers/tableBordered16.js';
import tableBordered37Parser from './parsers/tableBordered37.js';
import table39Parser from './parsers/table39.js';
import tableBordered32Parser from './parsers/tableBordered32.js';
import table42Parser from './parsers/table42.js';
import table45Parser from './parsers/table45.js';
import tableStripedBordered47Parser from './parsers/tableStripedBordered47.js';
import table34Parser from './parsers/table34.js';
import table48Parser from './parsers/table48.js';
import tableBordered18Parser from './parsers/tableBordered18.js';
import table50Parser from './parsers/table50.js';
import table38Parser from './parsers/table38.js';
import table44Parser from './parsers/table44.js';
import tableBordered53Parser from './parsers/tableBordered53.js';
import table49Parser from './parsers/table49.js';
import accordion41Parser from './parsers/accordion41.js';
import tableBordered51Parser from './parsers/tableBordered51.js';
import accordion56Parser from './parsers/accordion56.js';
import tableBordered55Parser from './parsers/tableBordered55.js';
import tableBordered60Parser from './parsers/tableBordered60.js';
import table46Parser from './parsers/table46.js';
import tableBordered57Parser from './parsers/tableBordered57.js';
import table52Parser from './parsers/table52.js';
import tableBordered43Parser from './parsers/tableBordered43.js';
import table36Parser from './parsers/table36.js';
import table54Parser from './parsers/table54.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import sectionsTransformer from './transformers/sections.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  accordion2: accordion2Parser,
  table9: table9Parser,
  table7: table7Parser,
  table5: table5Parser,
  table13: table13Parser,
  tableStripedBordered15: tableStripedBordered15Parser,
  tableBordered4: tableBordered4Parser,
  tableStripedBordered11: tableStripedBordered11Parser,
  tableBordered6: tableBordered6Parser,
  cardsNoImages21: cardsNoImages21Parser,
  table14: table14Parser,
  table1: table1Parser,
  tableBordered20: tableBordered20Parser,
  tableStripedBordered24: tableStripedBordered24Parser,
  table19: table19Parser,
  table3: table3Parser,
  tableBordered10: tableBordered10Parser,
  table26: table26Parser,
  tableStriped29: tableStriped29Parser,
  tableBordered22: tableBordered22Parser,
  table33: table33Parser,
  table23: table23Parser,
  tableBordered25: tableBordered25Parser,
  table30: table30Parser,
  table28: table28Parser,
  tableBordered35: tableBordered35Parser,
  accordion31: accordion31Parser,
  tableBordered17: tableBordered17Parser,
  columns40: columns40Parser,
  tableBordered16: tableBordered16Parser,
  tableBordered37: tableBordered37Parser,
  table39: table39Parser,
  tableBordered32: tableBordered32Parser,
  table42: table42Parser,
  table45: table45Parser,
  tableStripedBordered47: tableStripedBordered47Parser,
  table34: table34Parser,
  table48: table48Parser,
  tableBordered18: tableBordered18Parser,
  table50: table50Parser,
  table38: table38Parser,
  table44: table44Parser,
  tableBordered53: tableBordered53Parser,
  table49: table49Parser,
  accordion41: accordion41Parser,
  tableBordered51: tableBordered51Parser,
  accordion56: accordion56Parser,
  tableBordered55: tableBordered55Parser,
  tableBordered60: tableBordered60Parser,
  table46: table46Parser,
  tableBordered57: tableBordered57Parser,
  table52: table52Parser,
  tableBordered43: tableBordered43Parser,
  table36: table36Parser,
  table54: table54Parser,
  ...customParsers,
};

const transformers = {
  cleanup: cleanupTransformer,
  images: imageTransformer,
  links: linkTransformer,
  sections: sectionsTransformer,
  ...customTransformers,
};

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    Object.values(transformers).forEach((transformerFn) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        uuid: instance.uuid,
        section: instance.section,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  const defaultContentElements = inventory.outliers
    .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
    .map((instance) => ({
      ...instance,
      element: WebImporter.Import.getElementByXPath(document, instance.xpath),
    }));

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  // transform all elements using parsers
  [...defaultContentElements, ...blockElements, ...pageElements]
    // sort elements by order in the page
    .sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999))
    // filter out fragment elements
    .filter((item) => !fragmentElements.includes(item.element))
    .forEach((item, idx, arr) => {
      const { element = main, ...pageBlock } = item;
      const parserName = WebImporter.Import.getParserName(pageBlock);
      const parserFn = parsers[parserName];
      try {
        let parserElement = element;
        if (typeof parserElement === 'string') {
          parserElement = main.querySelector(parserElement);
        }
        // before parse hook
        WebImporter.Import.transform(
          TransformHook.beforeParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
            nextEl: arr[idx + 1],
          },
        );
        // parse the element
        if (parserFn) {
          parserFn.call(this, parserElement, { ...source });
        }
        // after parse hook
        WebImporter.Import.transform(
          TransformHook.afterParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
          },
        );
      } catch (e) {
        console.warn(`Failed to parse block: ${parserName}`, e);
      }
    });
}

/**
* Fragment transformation function
*/
function transformFragment(main, { fragment, inventory, ...source }) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          parserFn.call(this, element, source);
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (source) => {
    const { document, params: { originalURL } } = source;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...source, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, { ...source, fragment, inventory });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...source, inventory });
      path = generateDocumentPath(source, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...source, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
