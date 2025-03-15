// components/RegisterForm.js
import React from 'react';
import { View, TextInput, Button } from 'react-native';

const RegisterForm = ({
  name,
  email,
  password,
  setName,
  setEmail,
  setPassword,
  onRegister,
}) => {
  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
      />
      <TextInput
        placeholder="Enter your UCL email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
      />
      <TextInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
      />
      <Button title="Register" onPress={onRegister} />
    </View>
  );
};

export default RegisterForm;