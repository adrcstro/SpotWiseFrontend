import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#ffffff', dark: '#ffffff' }}
      headerImage={
        <Image
          source={require('@/assets/images/WelcomeScreen.png')} // Replace with your image path
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">About Us</ThemedText>
      </ThemedView>
      <ThemedText>A reliable companion in understanding and managing skin health! Our mission is to empower individuals by providing accessible, accurate skin condition assessments.</ThemedText>
      <ThemedView style={styles.titleFAQ}>
        <ThemedText type="title">FAQ</ThemedText>
      </ThemedView>
      
      <Collapsible title="How do I take a photo for Spotwise accuracy?">
        <ThemedText style={styles.collapsibleText}>
          Use bright, even lighting and focus closely on the affected area for the best results.
        </ThemedText>
      </Collapsible>

      <Collapsible title="What skin conditions can Spotwise detect?">
        <ThemedText style={styles.collapsibleText}>
          Spotwise can classify Acne, Vitiligo, Shingles, Melanoma, Psoriasis, Chickenpox, and Warts.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Does Spotwise require an internet connection?">
        <ThemedText style={styles.collapsibleText}>
          Yes, Spotwise needs internet access to process and classify the skin condition accurately.
        </ThemedText>
      </Collapsible>

      <Collapsible title="How long does Spotwise take to analyze a photo?">
        <ThemedText style={styles.collapsibleText}>
          Spotwise typically provides results within a few seconds after uploading the image.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Can I Scan more than one photo at a time in Spotwise?">
        <ThemedText style={styles.collapsibleText}>
          No, Spotwise analyzes one image at a time to ensure accurate classification.
        </ThemedText>
      </Collapsible>

      {/* Add the "Get Started" Button here */}

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    height: 200,
    width: 360, // Adjust to your desired height
    alignSelf: 'center',
    marginTop: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  titleFAQ: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  collapsibleText: {
    backgroundColor: '#3C424D', // Set your desired background color here
    padding: 10, // Optional: Add padding for better appearance
    borderRadius: 5, 
    // Optional: Add border radius for rounded corners
  },
});
