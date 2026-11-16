import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProductsProvider, GREEN } from '../context/ProductsContext';
import HomeScreen from '../screens/HomeScreen';
import AddProductScreen from '../screens/AddProductScreen';
import SummaryScreen from '../screens/SummaryScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          height: 62,
          paddingBottom: 8,
          paddingTop: 5,
        },

        tabBarIcon: ({ color, size }) => {
          const iconName =
            route.name === 'Início'
              ? 'list-outline'
              : 'stats-chart-outline';

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Resumo" component={SummaryScreen} />
    </Tab.Navigator>
  );
}

// APLICAÇÃO
export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <ProductsProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ProductsProvider>
    </SafeAreaProvider>
  );
}


