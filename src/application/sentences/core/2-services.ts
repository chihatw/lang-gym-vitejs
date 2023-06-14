import { ISentence } from './0-interface';

export function getSentenceIds(
  articleId: string,
  sentences: { [id: string]: ISentence }
) {
  return Object.values(sentences)
    .filter((sentence) => sentence.articleId === articleId)
    .sort((a, b) => a.line - b.line)
    .map((s) => s.id);
}
