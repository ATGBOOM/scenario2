import { db } from '@/config/firebaseConfig';
import { collection, getDocs, query, orderBy, limit, getDoc, doc } from 'firebase/firestore';

export const getRandomUser = async () => {
  try {
    const usersRef = collection(db, 'users');
    
    const snapshot = await getDocs(usersRef);
    const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const randomUser = usersList[Math.floor(Math.random() * usersList.length)];
    return randomUser;
  } catch (error) {
    console.error('Error getting random user: ', error);
    throw error;
  }
};
