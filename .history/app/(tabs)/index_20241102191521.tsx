import React, { useRef, useState } from 'react';
import { Image, StyleSheet, View, FlatList, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons'; // Import the icons

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
  {
    title: "Deep Learning Algorithm",
    content: "We are using Deep Learning algorithms such as WGAN-GP to improve the accuracy of skin disease identification and generate synthetic datasets for better training.",
  },
  {
    title: "AI-Powered Analysis",
    content: "SpotWise uses advanced AI techniques to analyze skin conditions quickly, providing reliable insights and recommendations.",
  },
  {
    title: "User-Friendly Interface",
    content: "Our application is designed to be user-friendly, making it easy for anyone to identify skin conditions with just a few clicks.",
  },
];

export default function HomeScreen() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event) => {
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

      {/* Fun Facts Section */}
      <ThemedView style={styles.funFactsContainer}>
        <ThemedText type="title">Fun Facts</ThemedText>
        {funFacts.map((fact, index) => (
          <View key={index} style={styles.funFact}>
            <Ionicons name="information-circle" size={24} color="black" style={styles.icon} />
            <View>
              <ThemedText type="subtitle" style={styles.funFactTitle}>{fact.title}</ThemedText>
              <ThemedText style={styles.funFactContent}>{fact.content}</ThemedText>
            </View>
          </View>
        ))}
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
  funFactsContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    marginTop: 20,
    borderRadius: 8,
  },
  funFact: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  funFactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  funFactContent: {
    fontSize: 14,
    lineHeight: 20,
    color: 'black',
  },
});
