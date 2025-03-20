import React, { useState } from 'react';
import { Alert } from 'react-native';
import RegisterForm from '../../components/RegisterForm';
import { auth, db } from '../../config/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleRegister = async () => {
    if (!email.toLowerCase().endsWith('@ucl.ac.uk')) {
      Alert.alert('Error', 'Please use UCL email');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user: User = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: name,
        createdAt: new Date(),
      });

      Alert.alert('Registration Successful', 'Please check your email to verify your account!');
      router.push('/login');
    } catch (error: any) {
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
