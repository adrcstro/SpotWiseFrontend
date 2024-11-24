import React, { useRef, useState } from 'react';
import { 
  Image, 
  StyleSheet, 
  View, 
  FlatList, 
  Animated, 
  Dimensions, 
  TouchableOpacity, 
  NativeSyntheticEvent, 
  NativeScrollEvent 
} from 'react-native';
import { HelloWave } from '@/components/HelloWave'; // Custom component for wave animation
import ParallaxScrollView from '@/components/ParallaxScrollView'; // Custom parallax scroll view
import { ThemedText } from '@/components/ThemedText'; // Custom themed text component
import { ThemedView } from '@/components/ThemedView'; // Custom themed view component

// Interface for step properties
interface StepProps {
  title: string; // Step title
  description: string; // Step description
  imageSource: any; // Step image source
}

// Step data array
const steps: StepProps[] = [
  {
    title: "Step 1: Capture an Image",
    description: "Open the SpotWise app and use your smartphone's camera to take a clear picture of the affected skin area. Ensure good lighting for optimal image quality.",
    imageSource: require('@/assets/images/Step1.png'), // Image for Step 1
  },
  {
    title: "Step 2: Analyze the Scan",
    description: "After capturing the image, SpotWise's AI algorithms will analyze the photo and identify potential skin diseases. This process takes just a few seconds.",
    imageSource: require('@/assets/images/Step2.png'), // Image for Step 2
  },
  {
    title: "Step 3: Analysis Result",
    description: "Once the analysis is complete, you'll receive detailed information about the identified condition, along with personalized recommendations and next steps for care or treatment.",
    imageSource: require('@/assets/images/Step3.png'), // Image for Step 3
  },
];

// Main HomeScreen component
export default function HomeScreen() {
  // State and ref management
  const scrollX = useRef(new Animated.Value(0)).current; // Animated value for scroll position
  const [currentIndex, setCurrentIndex] = useState(0); // Current step index

  // Function to handle scroll event
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get('window').width); // Calculate index
    setCurrentIndex(index); // Update current index
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFFFFF', dark: '#FFFFFF' }} // Header background color
      headerImage={
        <View style={styles.imageContainer}> 
          <Image
            source={require('@/assets/images/WelcomeScreen.png')} // Header image
            style={styles.reactLogo} // Image style
          />
        </View>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText> // Welcome text
        <HelloWave /> // Wave animation
      </ThemedView>
      <ThemedView style={styles.descriptionContainer}>
        <ThemedText>
          SpotWise is an innovative AI-powered application designed to help users identify and understand seven common skin diseases with ease and accuracy. // App description
        </ThemedText>
      </ThemedView>

      {/* Carousel Section */}
      <FlatList
        data={steps} // Data for FlatList
        horizontal // Horizontal scroll
        pagingEnabled // Enables paging
        showsHorizontalScrollIndicator={false} // Hides scroll indicator
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }], // Animated scroll event
          { useNativeDriver: false } // Use native driver
        )}
        onMomentumScrollEnd={handleScroll} // Handle scroll end event
        renderItem={({ item }) => <Step {...item} />} // Render each step
        keyExtractor={(item, index) => index.toString()} // Key extractor
        snapToAlignment="center" // Snap alignment to center
        snapToInterval={Dimensions.get('window').width} // Snap to screen width
      />

      {/* Navigation Dots */}
      <View style={styles.pagination}>
        {steps.map((_, index) => ( // Render dots for pagination
          <TouchableOpacity key={index} onPress={() => {
            scrollX.setValue(index * Dimensions.get('window').width); // Scroll to the corresponding step
          }}>
            <View
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot, // Active dot style
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ParallaxScrollView>
  );
}

// Step Component
const Step = ({ title, description, imageSource }: StepProps) => (
  <ThemedView style={styles.stepContainer}>
    <Image source={imageSource} style={styles.stepImage} /> // Step image
    <ThemedText type="subtitle" style={styles.stepTitle}>{title}</ThemedText> // Step title
    <ThemedText style={styles.stepDescription}>{description}</ThemedText> // Step description
  </ThemedView>
);

// Styles
const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  stepContainer: {
    width: Dimensions.get('window').width, // Full width for each step
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepImage: {
    height: 150,
    width: 150,
    marginBottom: 8,
  },
  stepTitle: {
    textAlign: 'center',
  },
  stepDescription: {
    textAlign: 'center',
    maxWidth: '80%', // Maximum width for description
    paddingHorizontal: 8, // Optional padding
  },
  reactLogo: {
    height: 178,
    width: 300,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
  },
  dot: {
    height: 8,
    width: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#01F0D0', // Active dot color
  },
});
