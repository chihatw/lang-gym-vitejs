import { ISentence } from './0-interface';

export function getSentenceIds(
  articleId: string,
  sentences: (ISentence | undefined)[]
) {
  return sentences
    .filter((sentence) => sentence && sentence.articleId === articleId)
    .sort((a, b) => a!.line - b!.line)
    .map((sentence) => sentence!.id);
}
