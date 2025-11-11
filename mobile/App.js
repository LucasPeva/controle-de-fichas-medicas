import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaLogin from './pages/TelaLogin';
import ListaFichas from './pages/ListaFichas';
import Configuracoes from './pages/Configuracoes';
import Usuarios from './pages/Usuarios';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Login" 
          component={TelaLogin} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={ListaFichas} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Configuracoes" 
          component={Configuracoes} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Usuarios" 
          component={Usuarios} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
