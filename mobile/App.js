import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaLogin from './src/pages/TelaLogin';
import ListaFichas from './src/pages/ListaFichas';
import Configuracoes from './src/pages/Configuracoes';
import Usuarios from './src/pages/Usuarios';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={TelaLogin} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={ListaFichas} 
          options={{ title: 'Fichas Médicas' }}
        />
        <Stack.Screen 
          name="Configuracoes" 
          component={Configuracoes} 
          options={{ title: 'Configurações' }}
        />
        <Stack.Screen 
          name="Usuarios" 
          component={Usuarios} 
          options={{ title: 'Usuários' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
