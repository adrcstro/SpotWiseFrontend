import React, { useRef, useState } from 'react';
import { Image, StyleSheet, View, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HelloWave } from '@/components/HelloWave';

interface StepProps {
  title: string;
  description: string;
  imageSource: any;
}

const steps: StepProps[] = [
  { title: "Step 1: Capture an Image", description: "Use your camera to take a clear picture of the affected skin area.", imageSource: require('@/assets/images/Step1.png') },
  { title: "Step 2: Analyze the Scan", description: "AI algorithms will analyze the photo to identify potential skin diseases.", imageSource: require('@/assets/images/Step2.png') },
  { title: "Step 3: Analysis Result", description: "Receive detailed information about the identified condition.", imageSource: require('@/assets/images/Step3.png') },
];

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor="#FFFFFF"
      headerImage={<HeaderImage />}
    >
      <WelcomeSection />
      <DescriptionSection />
      <Carousel data={steps} />
    </ParallaxScrollView>
  );
}

// Reusable Carousel Component
const Carousel = ({ data }: { data: StepProps[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);
  const screenWidth = Dimensions.get('window').width;

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(index);
  };

  const navigateToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ animated: true, index });
    setCurrentIndex(index);
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        renderItem={({ item }) => <CarouselItem {...item} />}
        keyExtractor={(_, index) => index.toString()}
      />
      <PaginationDots data={data} currentIndex={currentIndex} onPressDot={navigateToIndex} />
    </View>
  );
};

const CarouselItem = ({ title, description, imageSource }: StepProps) => (
  <ThemedView style={styles.carouselItem}>
    <Image source={imageSource} style={styles.image} />
    <ThemedText type="subtitle" style={styles.title}>{title}</ThemedText>
    <ThemedText style={styles.description}>{description}</ThemedText>
  </ThemedView>
);

const PaginationDots = ({ data, currentIndex, onPressDot }: any) => (
  <View style={styles.pagination}>
    {data.map((_, index) => (
      <TouchableOpacity key={index} onPress={() => onPressDot(index)}>
        <View style={[styles.dot, currentIndex === index && styles.activeDot]} />
      </TouchableOpacity>
    ))}
  </View>
);

const HeaderImage = () => (
  <View style={styles.headerImageContainer}>
    <Image source={require('@/assets/images/Plotwise.png')} style={styles.headerImage} />
  </View>
);

const WelcomeSection = () => (
  <ThemedView style={styles.welcomeContainer}>
    <ThemedText type="title">Welcome!</ThemedText>
    <HelloWave />
  </ThemedView>
);

const DescriptionSection = () => (
  <ThemedView style={styles.descriptionContainer}>
    <ThemedText>
      SpotWise is an AI-powered app designed to help users identify common skin diseases with ease and accuracy.
    </ThemedText>
  </ThemedView>
);

const styles = StyleSheet.create({
  headerImageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerImage: { height: 200, width: 360, alignSelf: 'center', marginTop: 30 },
  welcomeContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  descriptionContainer: { marginBottom: 16, paddingHorizontal: 16 },
  carouselItem: { width: Dimensions.get('window').width, alignItems: 'center', justifyContent: 'center', padding: 16 },
  image: { height: 150, width: 150, marginBottom: 8 },
  title: { textAlign: 'center' },
  description: { textAlign: 'center', maxWidth: '80%', paddingHorizontal: 8 },
  pagination: { flexDirection: 'row', justifyContent: 'center', paddingTop: 16 },
  dot: { height: 8, width: 8, backgroundColor: '#ccc', borderRadius: 4, marginHorizontal: 4 },
  activeDot: { backgroundColor: '#01F0D0' },
});
