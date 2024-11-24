import React, { useState } from 'react';
import { Image, StyleSheet, View, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width: screenWidth } = Dimensions.get('window');

interface StepProps {
  title: string;
  description: string;
  imageSource: any;
}

const stepsData: StepProps[] = [
  {
    title: "Step 1: Capture an Image",
    description:
      "Open the SpotWise app and use your smartphone's camera to take a clear picture of the affected skin area. Ensure good lighting for optimal image quality.",
    imageSource: require('@/assets/images/Step1.png'),
  },
  {
    title: "Step 2: Analyze the Scan",
    description:
      "After capturing the image, SpotWise's AI algorithms will analyze the photo and identify potential skin diseases. This process takes just a few seconds.",
    imageSource: require('@/assets/images/Applogo.png'),
  },
  {
    title: "Step 3: Receive Insights",
    description:
      "Once the analysis is complete, you'll receive detailed information about the identified condition, along with personalized recommendations and next steps for care or treatment.",
    imageSource: require('@/assets/images/Applogo.png'),
  },
];

export default function HomeScreen() {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const renderItem = ({ item }: { item: StepProps }) => (
    <Step
      title={item.title}
      description={item.description}
      imageSource={item.imageSource}
    />
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFFFFF', dark: '#FFFFFF' }}
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

      {/* Carousel for Steps */}
      <Carousel
        data={stepsData}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth * 0.8}
        layout="default"
        onSnapToItem={(index) => setCarouselIndex(index)}
      />

      {/* Custom Pagination Dots */}
      <View style={styles.paginationContainer}>
        {stepsData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              carouselIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </ParallaxScrollView>
  );
}

// Define the Step component with the defined props type
const Step = ({ title, description, imageSource }: StepProps) => (
  <ThemedView style={styles.stepContainer}>
    <Image source={imageSource} style={styles.stepImage} />
    <ThemedText type="subtitle">{title}</ThemedText>
    <ThemedText>{description}</ThemedText>
  </ThemedView>
);

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
    gap: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  stepImage: {
    height: 150,
    width: 150,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 300,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#01F0D0',
  },
  inactiveDot: {
    backgroundColor: '#C4C4C4',
  },
});
