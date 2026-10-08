import fs from 'fs';
import { getLogger } from '../core/logger';

const logger = getLogger('pdf-text-extractor');

interface PdfTextItem {
  str?: string;
}

/**
 * Extracts a PDF's actual embedded text using pdfjs-dist's Node-compatible
 * "legacy" build (the same library the app itself uses to render PDFs in
 * PdfJsViewer.vue) — no browser/DOM involved, just direct parsing of the
 * PDF's text content stream. Works for any local PDF file.
 */
export class PdfTextExtractor {
  static async extractText(filePath: string): Promise<string> {

    logger.info(`Parsing source PDF text: ${filePath}`);

    // pdfjs-dist ships ESM-only (.mjs) — dynamic import() is required to
    // load it from this CommonJS-compiled project.
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const data = new Uint8Array(fs.readFileSync(filePath));

    const loadingTask = pdfjsLib.getDocument({
      data,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdfDocument = await loadingTask.promise;

    try {
      const pageTexts: string[] = [];

      for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
        const page = await pdfDocument.getPage(pageNumber);
        const textContent = await page.getTextContent();

        const pageText = (textContent.items as PdfTextItem[])
          .map((item) => item.str ?? '')
          .join(' ');

        pageTexts.push(pageText);
      }

      const fullText = pageTexts.join('\n').trim();

      if (!fullText) {
        throw new Error(
          `PDF parsing returned no text for ${filePath}. It may be a scanned image with no embedded text layer.`
        );
      }

      logger.info(`Extracted ${fullText.length} characters of source PDF text across ${pdfDocument.numPages} page(s)`);

      return fullText;
    } finally {
      await pdfDocument.destroy();
    }
  }
}
