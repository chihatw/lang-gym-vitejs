import {
  DocumentData,
  collection,
  getDocs,
  orderBy,
  query,
  where,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from 'infrastructure/firebase';
import { ARTICLE_STORE_COLLECTION } from '../core/1-constants';
import { IArticle } from '../core/0-interface';

export const fetchArticles = async (
  uid: string,
  rows: number,
  _startAfter?: number
): Promise<{ [id: string]: IArticle }> => {
  console.log(`%cfetch ${ARTICLE_STORE_COLLECTION}`, 'color:red');
  let q = query(
    collection(db, ARTICLE_STORE_COLLECTION),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(rows)
  );

  if (!!_startAfter) {
    q = query(q, startAfter(_startAfter));
  }
  const querySnapshot = await getDocs(q);

  const articles: { [id: string]: IArticle } = {};
  querySnapshot.forEach((doc) => {
    const article = buildArticle(doc);
    articles[doc.id] = article;
  });

  return articles;
};

const buildArticle = (doc: DocumentData) => {
  const { uid, title, createdAt, downloadURL, isShowAccents } = doc.data();
  const article: IArticle = {
    id: doc.id,
    uid: uid || '',
    title: title || '',
    createdAt: createdAt || 0,
    downloadURL: downloadURL || '',
    isShowAccents: isShowAccents || false,
  };
  return article;
};
