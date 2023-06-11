import { collection, getDocs, query } from 'firebase/firestore';

import { USER_STORE_COLLECTION } from '../core/1-constants';
import { db } from 'infrastructure/firebase';

export const fetchUsers = async () => {
  console.log(`%cfetch ${USER_STORE_COLLECTION}`, 'color:red');

  let q = query(collection(db, USER_STORE_COLLECTION));

  const querySnapshot = await getDocs(q);
  const users: { [id: string]: string } = {};

  querySnapshot.forEach((doc) => {
    const { displayname } = doc.data();
    users[doc.id] = displayname;
  });

  return users;
};
