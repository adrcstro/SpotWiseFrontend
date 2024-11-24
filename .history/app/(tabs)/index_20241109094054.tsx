import React, { useRef, useState } from 'react';
import { Image, StyleSheet, View, FlatList, Animated, Dimensions, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface StepProps {
  title: string;
  description: string;
  iconName: string;
}

const steps: StepProps[] = [
  {
    title: "Step 1: Capture an Image",
    description: "Open the SpotWise app and use your smartphone's camera to take a clear picture of the affected skin area. Ensure good lighting for optimal image quality.",
    iconName: 'camera-outline',
  },
  {
    title: "Step 2: Analyze the Scan",
    description: "After capturing the image, SpotWise's AI algorithms will analyze the photo and identify potential skin diseases. This process takes just a few seconds.",
    iconName: 'magnify',
  },
  {
    title: "Step 3: Analysis Result",
    description: "Once the analysis is complete, you'll receive detailed information about the identified condition, along with personalized recommendations and next steps for care or treatment.",
    iconName: 'information-outline',
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

const Step = ({ title, description, iconName }: StepProps) => (
  <ThemedView style={styles.stepContainer}>
    <View style={styles.stepContent}>
      {/* Use Icon component directly */}
      <Icon name={iconName} size={80} color="#01F0D0" style={styles.stepIcon} />
      <ThemedText type="subtitle" style={styles.stepTitle}>{title}</ThemedText>
      <ThemedText style={styles.stepDescription}>{description}</ThemedText>
    </View>
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
    padding: 16,
  },
  stepContent: {
    backgroundColor: '#3C424D',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '85%',
  },
  stepIcon: {
    marginBottom: 4,
  },
  stepTitle: {
    textAlign: 'center',
    color: 'white',
  },
  stepDescription: {
    textAlign: 'center',
    color: 'white',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
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
    paddingTop: -10,
  },
  dot: {
    height: 4,
    width: 12,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#01F0D0',
  },
  educationalContent: {
    padding: 2,
    marginTop: 20,
    borderRadius: 8,
  },
  educationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  funFactContainer: {
    flexDirection: 'column',
    marginTop: 10,
  },
  funFactBox: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#3C424D',
    borderRadius: 8,
  },
  funFactText: {
    fontSize: 12,
    lineHeight: 18,
    color: 'white',
  },
});
