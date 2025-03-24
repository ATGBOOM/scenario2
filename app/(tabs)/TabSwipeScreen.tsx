import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { getUsers } from '@/components/Users';
import { shuffleArray } from '@/components/shuffleArray';
import { useState, useEffect } from 'react';

export default function SwipeScreen() {
  const [userList, setUserList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userIndex, setUserIndex] = useState(0);

  useEffect(() => {
    const getUserList = async () => {
      const userList = await shuffleArray(await getUsers());
      console.log(userList)
      setUserList(userList);
      setLoading(false);
    }
    getUserList();
  }, []);

  const user = userList[userIndex];

  if (loading == true) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (userList.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No more users to show</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Text>Name: {user.name}</Text>
        <Text>Age: {user.age} </Text>
    </View>
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
