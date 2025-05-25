import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { db } from 'infrastructure/firebase';

import { IArticle } from '../core/0-interface';

const COLLECTION = 'articles';

export const fetchArtice = async (
  uid: string,
  articleId: string
): Promise<IArticle | undefined> => {
  console.log(`%cfetch ${COLLECTION}`, 'color:red');

  const docSnapshot = await getDoc(doc(db, COLLECTION, articleId));
  if (!docSnapshot.exists()) {
    console.log(`%cno articles found`, 'color:red');
    return;
  }

  // uidチェックはbuildArticle前にdoc.data()から直接参照
  const docData = docSnapshot.data();
  if (docData.uid !== uid) {
    console.log(
      `%cincorrect uid article.uid: ${docData.uid}, user.uid: ${uid}`,
      'color:red'
    );
    return;
  }
  const article = buildArticle(docSnapshot);

  return article;
};

export const fetchArticles = async (
  uid: string,
  rows: number,
  _startAfter?: number
): Promise<IArticle[]> => {
  console.log(`%cfetch ${COLLECTION}`, 'color:red');
  let q = query(
    collection(db, COLLECTION),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(rows)
  );

  if (!!_startAfter) {
    q = query(q, startAfter(_startAfter));
  }
  const querySnapshot = await getDocs(q);

  const articles: IArticle[] = [];
  querySnapshot.forEach((doc) => {
    const article = buildArticle(doc);
    articles.push(article);
  });

  return articles;
};

const buildArticle = (doc: DocumentData) => {
  const { uid, title, createdAt, isShowAccents } = doc.data();
  const article: IArticle = {
    id: doc.id,
    title: title || '',
    createdAt: createdAt || 0,
    isShowAccents: isShowAccents || false,
  };
  return article;
};
