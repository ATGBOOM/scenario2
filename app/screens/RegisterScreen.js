import React, { useState } from 'react';
import { Alert } from 'react-native';
import RegisterForm from '../../components/RegisterForm';
import { auth, db } from '../../config/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email.toLowerCase().endsWith('@ucl.ac.uk')) {
      Alert.alert('error', 'Please use ucl email');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      // save the user data in the database
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: name,
        createdAt: new Date(),
      });

      Alert.alert('Registration Successful', '请Please check your email to verify your account!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <RegisterForm
      name={name}
      email={email}
      password={password}
      setName={setName}
      setEmail={setEmail}
      setPassword={setPassword}
      onRegister={handleRegister}
    />
  );
};

export default RegisterScreen;
