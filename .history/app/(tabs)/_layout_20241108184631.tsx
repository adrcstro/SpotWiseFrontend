import { Stack, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  useEffect(() => {
    // You can add logic here to persist the onboarding state
    // e.g., checking AsyncStorage for an onboarding flag
    setIsFirstLaunch(false); // Set this to false to skip onboarding
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isFirstLaunch ? (
        // Render Onboarding screen if it's the first launch
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      ) : (
        // Otherwise, render the Tabs layout
        <Stack.Screen name="tabs" options={{ headerShown: false }}>
          {() => (
            <Tabs
              screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
              }}
            >
              <Tabs.Screen
                name="index"
                options={{
                  title: 'Home',
                  tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon
                      name={focused ? 'home' : 'home-outline'}
                      color={color}
                    />
                  ),
                }}
              />
              <Tabs.Screen
                name="explore"
                options={{
                  title: 'About',
                  tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon
                      name={focused ? 'people' : 'people-outline'}
                      color={color}
                    />
                  ),
                }}
              />
              <Tabs.Screen
                name="scan"
                options={{
                  title: 'Scan',
                  tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon
                      name={focused ? 'scan' : 'scan-outline'}
                      color={color}
                    />
                  ),
                }}
              />
            </Tabs>
          )}
        </Stack.Screen>
      )}
    </Stack>
  );
}
