import React, { useRef, useState } from 'react';
import { Image, StyleSheet, View, FlatList, Animated, Dimensions, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
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

const funFacts = [
  "Skin health is essential for overall well-being. SpotWise provides insights into common skin conditions such as eczema, psoriasis, acne, and more. Understanding early symptoms can lead to faster treatments and better outcomes.",
  "Our AI-driven technology not only identifies visible symptoms but also provides tailored recommendations. Learn more about skin health and preventive care to keep your skin in optimal condition.",
  "For more detailed guidance on maintaining skin health and understanding common issues, please consult trusted health resources or a certified dermatologist.",
];

export default function HomeScreen() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get('window').width);
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
        data={steps}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => <Step {...item} />}
        keyExtractor={(item, index) => index.toString()}
        snapToAlignment="center"
        snapToInterval={Dimensions.get('window').width}
      />

      {/* Navigation Dots */}
      <View style={styles.pagination}>
        {steps.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => {
            scrollX.setValue(index * Dimensions.get('window').width);
          }}>
            <View
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Educational Content Section */}
      <ThemedView style={styles.educationalContent}>
        <ThemedText type="subtitle" style={styles.educationTitle}>Fun Fact!</ThemedText>
        <View style={styles.funFactContainer}>
          {funFacts.map((fact, index) => (
            <View key={index} style={styles.funFactBox}>
              <ThemedText style={styles.funFactText}>{fact}</ThemedText>
            </View>
          ))}
        </View>
      </ThemedView>
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
  },
  stepContainer: {
    width: Dimensions.get('window').width,
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
    maxWidth: '80%',
    paddingHorizontal: 8,
    fontSize: 15,
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
  educationalContent: {
    padding: 16,
  
    marginTop: 20,
    borderRadius: 8,
  },
  educationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white', // Set title text color to white
  },
  funFactContainer: {
    flexDirection: 'column', // Change this to 'column' to stack boxes vertically
    marginTop: 10,
  },
  funFactBox: {
    marginBottom: 10, // Add spacing between boxes
    padding: 10,
    backgroundColor: '#3C424D',
    borderRadius: 8,
  },
  funFactText: {
    fontSize: 12,
    lineHeight: 18,
    color: 'white', // Set text color to white
  },
});
