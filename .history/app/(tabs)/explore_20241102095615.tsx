import React from 'react';
import { StyleSheet, Image, Platform } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#ffffff', dark: '#ffffff' }}
      headerImage={
        <Image
          source={require('@/assets/images/Plotwise.png')} // Replace with your image path
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">About Us</ThemedText>
      </ThemedView>
      <ThemedText>
        Welcome to Spotwise – your reliable companion in understanding and managing skin health. Spotwise classifies seven common skin conditions: Acne, Vitiligo, Shingles, Melanoma, Psoriasis, Chickenpox, and Warts. We aim to empower users with accessible, accurate insights for better skin health management.
      </ThemedText>

      <Collapsible title="Why Choose Spotwise">
        <ThemedText>- Comprehensive Skin Condition Detection</ThemedText>
        <ThemedText>- Cutting-Edge AI Technology</ThemedText>
        <ThemedText>- User-Centric Design</ThemedText>
        <ThemedText>- Privacy First</ThemedText>
      </Collapsible>

      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens: <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>

      {/* Other collapsible sections */}

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    height: 200,
    width: 360, 
    alignSelf: 'center',
    marginTop: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

