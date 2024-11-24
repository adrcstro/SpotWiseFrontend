import React, { useRef } from 'react';
import { Image, StyleSheet, View, Dimensions } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Carousel from 'react-native-snap-carousel';

const { width: screenWidth } = Dimensions.get('window');

const steps = [
  {
    title: 'Step 1: Capture an Image',
    description: 'Open the SpotWise app and use your smartphone\'s camera to take a clear picture of the affected skin area. Ensure good lighting for optimal image quality.',
  },
  {
    title: 'Step 2: Analyze the Scan',
    description: 'After capturing the image, SpotWise\'s AI algorithms will analyze the photo and identify potential skin diseases. This process takes just a few seconds.',
  },
  {
    title: 'Step 3: Receive Insights',
    description: 'Once the analysis is complete, you\'ll receive detailed information about the identified condition, along with personalized recommendations and next steps for care or treatment.',
  },
];

export default function HomeScreen() {
  const carouselRef = useRef(null);

  const renderItem = ({ item }) => (
    <ThemedView style={styles.stepContainer}>
      <ThemedText type="subtitle">{item.title}</ThemedText>
      <ThemedText>{item.description}</ThemedText>
    </ThemedView>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFFFFF', dark: '#FFFFFF' }} // Set background to white for both light and dark modes
      headerImage={
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/WelcomeScreen.png')}
            style={styles.reactLogo}
          />
        </View>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.descriptionContainer}>
        <ThemedText>
          SpotWise is an innovative AI-powered application designed to help users identify and understand seven common skin diseases with ease and accuracy.
        </ThemedText>
      </ThemedView>

      <Carousel
        ref={carouselRef}
        data={steps}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth - 40} // Adjust based on your layout
        layout={'default'}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  descriptionContainer: {
    marginBottom: 16, // Add some margin for spacing below the description
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    padding: 16,
    backgroundColor: '#f9f9f9', // Background color for better visibility
    borderRadius: 8,
    elevation: 2, // Shadow effect for Android
  },
  reactLogo: {
    height: 178,
    width: 300,
  },
});
