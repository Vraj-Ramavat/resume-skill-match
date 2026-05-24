import { createWorker } from 'tesseract.js';

let ocrWorkerPromise: Promise<any> | null = null;

async function getOcrWorker() {
  if (!ocrWorkerPromise) {
    ocrWorkerPromise = (async () => {
      const worker = await createWorker('eng');
      return worker;
    })();
  }

  return ocrWorkerPromise;
}

export async function extractTextWithOcr(buffer: Buffer) {
  const worker = await getOcrWorker();
  const result = await worker.recognize(buffer);
  return result.data.text ?? '';
}