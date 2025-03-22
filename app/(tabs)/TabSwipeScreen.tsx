import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { db } from '@/config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25; // Distance needed for a swipe

// Function to shuffle an array
const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);

export default function Swipe() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const translateX = useSharedValue(0); // Position of the card

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);

        if (snapshot.empty) {
          console.log('No users found in Firestore');
          setLoading(false);
          return;
        }

        let usersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        usersList = shuffleArray(usersList); // Shuffle users randomly

        setUsers(usersList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users: ', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle mouse dragging (works as swiping)
  const handleSwipe = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      translateX.value = 0; // Reset position
    } else {
      setCurrentIndex(-1); // No more users
    }
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        // Dragged right (Swipe right)
        runOnJS(handleSwipe)();
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Dragged left (Swipe left)
        runOnJS(handleSwipe)();
      } else {
        // Not enough movement, reset position
        translateX.value = withSpring(0);
      }
    });

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (currentIndex === -1 || users.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No more users to show</Text>
      </View>
    );
  }

  const user = users[currentIndex];

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, { transform: [{ translateX }] }]}>
          {user.image && <Image source={{ uri: user.image }} style={styles.profileImage} />}
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userDetails}>{user.age} years old</Text>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '50%',
    height: '50%',  // This ensures that height is equal to the width, making it square
    backgroundColor: '#ffd3f2',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center', // To center the content inside the square card
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  userDetails: {
    fontSize: 18,
    marginVertical: 10,
  },
  profileImage: {
    width: 100,  // Adjust this for better image fitting
    height: 100, // Adjust this for better image fitting
    borderRadius: 50, // Circular image
  },
});
