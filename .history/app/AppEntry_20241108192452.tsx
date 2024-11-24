// app/AppEntry.tsx
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot, useRouter } from 'expo-router';

export default function AppEntry() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const onboardingStatus = await AsyncStorage.getItem('hasCompletedOnboarding');
      setHasCompletedOnboarding(Boolean(onboardingStatus));
      setIsLoading(false);
    };

    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (hasCompletedOnboarding) {
        router.replace('/tabs');
      } else {
        router.replace('/tabs/onboarding');
      }
    }
  }, [isLoading, hasCompletedOnboarding]);

  if (isLoading) {
    // Show a loading indicator while checking onboarding status
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}
