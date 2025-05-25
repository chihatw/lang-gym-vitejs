import { collection, getDocs, query } from 'firebase/firestore';

import { db } from 'infrastructure/firebase';
import { IUser } from '../core/0-interface';

const COLLECTION = 'users';

export const fetchUsers = async () => {
  console.log(`%cfetch ${COLLECTION}`, 'color:red');

  const q = query(collection(db, COLLECTION));

  const querySnapshot = await getDocs(q);
  const users: IUser[] = [];

  querySnapshot.forEach((doc) => {
    const { displayname } = doc.data();
    users.push({
      uid: doc.id,
      displayName: displayname,
    });
  });

  return users;
};
