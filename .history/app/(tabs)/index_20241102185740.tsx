import React, { useRef, useState } from 'react';
import { Image, StyleSheet, View, FlatList, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface StepProps {
  title: string;
  description: string;
  imageSource: any;
}

const steps: StepProps[] = [
  {
    title: "Step 1: Capture an Image",
    description: "Open the SpotWise app and use your smartphone's camera to take a clear picture of the affected skin area. Ensure good lighting for optimal image quality.",
    imageSource: require('@/assets/images/Step1.png'),
  },
  {
    title: "Step 2: Analyze the Scan",
    description: "After capturing the image, SpotWise's AI algorithms will analyze the photo and identify potential skin diseases. This process takes just a few seconds.",
    imageSource: require('@/assets/images/Step2.png'),
  },
  {
    title: "Step 3: Analysis Result",
    description: "Once the analysis is complete, you'll receive detailed information about the identified condition, along with personalized recommendations and next steps for care or treatment.",
    imageSource: require('@/assets/images/Step3.png'),
  },
];

export default function HomeScreen() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<any>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(index);
  };

  const navigateToStep = (index: number) => {
    flatListRef.current?.scrollToIndex({ animated: true, index });
    setCurrentIndex(index);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFFFFF', dark: '#FFFFFF' }}
      headerImage={
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/Plotwise.png')}
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

      {/* Carousel Section */}
      <FlatList
        ref={flatListRef}
        data={steps}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({ item }) => <Step {...item} />}
        keyExtractor={(item, index) => index.toString()}
        snapToAlignment="center"
        snapToInterval={screenWidth}
      />

      {/* Navigation Dots */}
      <View style={styles.pagination}>
        {steps.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => navigateToStep(index)}>
            <View style={[styles.dot, currentIndex === index && styles.activeDot]} />
          </TouchableOpacity>
        ))}
      </View>
    </ParallaxScrollView>
  );
}

const Step = ({ title, description, imageSource }: StepProps) => (
  <ThemedView style={styles.stepContainer}>
    <Image source={imageSource} style={styles.stepImage} />
    <ThemedText type="subtitle" style={styles.stepTitle}>{title}</ThemedText>
    <ThemedText style={styles.stepDescription}>{description}</ThemedText>
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
    paddingHorizontal: 16,
  },
  stepContainer: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
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
    maxWidth: '80%',
    paddingHorizontal: 8,
  },
  reactLogo: {
    height: 200,
    width: 360,
    alignSelf: 'center',
    marginTop: 30,
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
    backgroundColor: '#01F0D0',
  },
});