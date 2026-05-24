import { pipeline } from '@xenova/transformers';

let featureExtractorPromise: Promise<any> | null = null;

async function getFeatureExtractor() {
  if (!featureExtractorPromise) {
    featureExtractorPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }

  return featureExtractorPromise;
}

function normalizeVector(values: number[]) {
  const magnitude = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));
  if (!magnitude) {
    return values;
  }

  return values.map((value) => value / magnitude);
}

export function cosineSimilarity(left: number[], right: number[]) {
  const length = Math.min(left.length, right.length);
  let dotProduct = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < length; index += 1) {
    dotProduct += left[index] * right[index];
    leftMagnitude += left[index] * left[index];
    rightMagnitude += right[index] * right[index];
  }

  if (!leftMagnitude || !rightMagnitude) {
    return 0;
  }

  return dotProduct / Math.sqrt(leftMagnitude * rightMagnitude);
}

export async function embedText(text: string) {
  const extractor = await getFeatureExtractor();
  const output = await extractor(text, {
    pooling: 'mean',
    normalize: true
  });

  const vector = Array.from((output?.data ?? output?.tolist?.()?.[0] ?? []) as number[]);
  return normalizeVector(vector);
}

export async function compareTextSimilarity(left: string, right: string) {
  const [leftEmbedding, rightEmbedding] = await Promise.all([embedText(left), embedText(right)]);
  return cosineSimilarity(leftEmbedding, rightEmbedding);
}