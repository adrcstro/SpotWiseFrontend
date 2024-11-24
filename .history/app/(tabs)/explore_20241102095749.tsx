import React from 'react';
import { StyleSheet, Image, Platform, View } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#f0f4f8', dark: '#1c1c1e' }}
      headerImage={
        <Image
          source={require('@/assets/images/Spotwise.png')} // Replace with your image path
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.container}>
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={styles.titleText}>About Us</ThemedText>
        </View>
        <ThemedText style={styles.aboutText}>
          Welcome to Spotwise – your companion in understanding and managing skin health. Spotwise classifies seven common skin conditions: Acne, Vitiligo, Shingles, Melanoma, Psoriasis, Chickenpox, and Warts. Our app empowers you with accessible, accurate insights to better manage your skin health.
        </ThemedText>

        <Collapsible title="Why Choose Spotwise" style={styles.collapsible}>
          <ThemedText style={styles.listItem}>• Comprehensive Skin Condition Detection</ThemedText>
          <ThemedText style={styles.listItem}>• Cutting-Edge AI Technology</ThemedText>
          <ThemedText style={styles.listItem}>• User-Centric Design</ThemedText>
          <ThemedText style={styles.listItem}>• Privacy First</ThemedText>
        </Collapsible>

        {/* Other collapsible sections */}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f4f8', // Subtle background for a clean look
  },
  headerImage: {
    height: 220,
    width: '100%',
    resizeMode: 'cover',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  collapsible: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  listItem: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 4,
  },
});

