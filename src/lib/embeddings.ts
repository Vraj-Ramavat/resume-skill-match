function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+./\s-]/g, ' ');
}

function tokenize(value: string) {
  return normalizeText(value)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function addFeature(vector: number[], feature: string, weight = 1) {
  const index = hashString(feature) % vector.length;
  vector[index] += weight;
}

function normalizeVector(values: number[]) {
  const magnitude = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));

  if (!magnitude) {
    return values;
  }

  return values.map((value) => value / magnitude);
}

export function embedText(text: string) {
  const vector = new Array(256).fill(0);
  const tokens = tokenize(text);

  for (const token of tokens) {
    addFeature(vector, `token:${token}`, 1);

    if (token.length > 3) {
      for (let index = 0; index < token.length - 2; index += 1) {
        addFeature(vector, `gram:${token.slice(index, index + 3)}`, 0.5);
      }
    }
  }

  for (let index = 0; index < tokens.length - 1; index += 1) {
    addFeature(vector, `bigram:${tokens[index]}_${tokens[index + 1]}`, 1.5);
  }

  return normalizeVector(vector);
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

export async function compareTextSimilarity(left: string, right: string) {
  const [leftEmbedding, rightEmbedding] = [embedText(left), embedText(right)];
  return cosineSimilarity(leftEmbedding, rightEmbedding);
}