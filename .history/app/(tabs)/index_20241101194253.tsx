import React, { useState } from 'react';
import { Image, StyleSheet, View, Dimensions, Text } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import HelloWave from '@/components/HelloWave';

const { width: screenWidth } = Dimensions.get('window');

// Define steps data array
const stepsData = [
  {
    title: "Step 1: Capture an Image",
    description: "Open the SpotWise app and use your smartphone's camera...",
    imageSource: require('@/assets/images/Step1.png'),
  },
  {
    title: "Step 2: Analyze the Scan",
    description: "After capturing the image, SpotWise's AI algorithms...",
    imageSource: require('@/assets/images/Applogo.png'),
  },
  {
    title: "Step 3: Receive Insights",
    description: "Once the analysis is complete, you'll receive detailed...",
    imageSource: require('@/assets/images/Applogo.png'),
  },
];

// Define main HomeScreen component
export default function HomeScreen() {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const renderItem = ({ item }) => (
    <Step title={item.title} description={item.description} imageSource={item.imageSource} />
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
      }
    >
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Welcome!</Text>
        <HelloWave />
      </View>

      <View style={styles.descriptionContainer}>
        <Text>
          SpotWise is an innovative AI-powered application designed to help users identify...
        </Text>
      </View>

      {/* Carousel */}
      <Carousel
        data={stepsData}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth * 0.8}
        onSnapToItem={(index) => setCarouselIndex(index)}
      />

      {/* Pagination Dots */}
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

// Define Step component
const Step = ({ title, description, imageSource }) => (
  <View style={styles.stepContainer}>
    <Image source={imageSource} style={styles.stepImage} />
    <Text style={styles.subtitleText}>{title}</Text>
    <Text>{description}</Text>
  </View>
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
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
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
  subtitleText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
