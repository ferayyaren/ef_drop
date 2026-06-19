// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Efdrop from './screens/efdrop';
import Hosgeldiniz1 from './screens/hosgeldin1';
import Hosgeldiniz2 from './screens/Hosgeldin2';
import UserProfileScreen from './screens/UserProfileScreen';
import HomeScreen from './screens/HomeScreen';
import GenderScreen from './screens/GenderScreen';
import AgeScreen from './screens/AgeScreen';
import WeightScreen from './screens/WeightScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Splash screen'i 3 saniye sonra kapat
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <Efdrop />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Hosgeldiniz1"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false
        }}
      >
        <Stack.Screen name="Hosgeldiniz1" component={Hosgeldiniz1} />
        <Stack.Screen name="Hosgeldiniz2" component={Hosgeldiniz2} />
        <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
        <Stack.Screen name="GenderScreen" component={GenderScreen} />
        <Stack.Screen name="AgeScreen" component={AgeScreen} />
        <Stack.Screen name="WeightScreen" component={WeightScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
