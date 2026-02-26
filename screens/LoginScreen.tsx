import React, { useState, useContext } from 'react'; 
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 
import { UserContext } from '../context/UserContext';

type LoginScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setUser } = useContext(UserContext) as { setUser: (user: any) => void };

    const handleLogin = async () => {
        const res = await fetch('http://localhost:3000/user');
        const users = await res.json();
        const found = users.find((u: { email: string; password: string }) => u.email === email && u.password === password);

        if (!found) {
            setError('Invalid email or password');
        } else {
            setUser(found);
            navigation.navigate('DashboardScreen');
        }
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: 'https://camo.githubusercontent.com/8c34ba76c493e7fe32fe58497e631543daec451ab10bb704c3b59df9910df10a/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f616c6f68652f617661746172732f706e672f6d656d6f5f33342e706e67' }} style={styles.logo} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
            <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Log In" onPress={handleLogin} />
        </View>);
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    logo: { width: 120, height: 120, marginBottom: 20 },
    input: { borderWidth: 1, width: '80%', marginBottom: 10, padding: 8 },
    error: { color: 'red', marginBottom: 10 }
});