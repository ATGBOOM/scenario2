import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';  // Added Image import
import { db } from '@/config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function Swipe() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomUser = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);

        if (snapshot.empty) {
          console.log('No users found in Firestore');
          setLoading(false);
          return;
        }

        const usersList = snapshot.docs.map((doc) => doc.data());
        console.log('Fetched users:', usersList);

        if (usersList.length === 0) {
          setLoading(false);
          return;
        }

        const randomUser = usersList[Math.floor(Math.random() * usersList.length)];
        console.log('Random User:', JSON.stringify(randomUser, null, 2));

        setUser(randomUser);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching random user: ', error);
        setLoading(false);
      }
    };

    fetchRandomUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No user found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.userName}>{user.name}</Text>
      <Text style={styles.userDetails}>{user.age} years old</Text>
      <View style={styles.buttonsContainer}>
        <Button title="Swipe Left"/>
        <Button title="Swipe Right"/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userDetails: {
    fontSize: 18,
    marginVertical: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 20,
  },
});
