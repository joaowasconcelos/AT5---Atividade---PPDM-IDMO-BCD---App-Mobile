import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './src/pages/Home';
import Cadastro from './src/pages/Cadastro';
import Editar from './src/pages/Editar';
import PesquisaClientes from './src/pages/PesquisaClientes';
import TodosClientes from './src/pages/TodosClientes';

const Stack = createNativeStackNavigator()

export default function stackRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen
          name="home"
          component={Home}
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen
          name="Cadastro"
          component={Cadastro}

        />

        <Stack.Screen
          name="Editar"
          component={Editar}

        />

        <Stack.Screen
          name="PesquisaClientes"
          component={PesquisaClientes}

        />

        <Stack.Screen
          name="TodosClientes"
          component={TodosClientes}

        />

      </Stack.Navigator>
    </NavigationContainer>

  )
}