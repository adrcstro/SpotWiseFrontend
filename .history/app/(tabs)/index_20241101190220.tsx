import { Image, StyleSheet, Platform, View, Animated } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useRef } from 'react';

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

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
        <Animated.View style={{ opacity: fadeAnim }}>
          <ThemedText type="title">Welcome!</ThemedText>
        </Animated.View>
        <HelloWave />
      </ThemedView>
      
      <ThemedView style={styles.descriptionContainer}>
        <Animated.Text style={{ opacity: fadeAnim }}>
          <ThemedText>
            SpotWise is an innovative AI-powered application designed to help users identify and understand seven common skin diseases with ease and accuracy.
          </ThemedText>
        </Animated.Text>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <Animated.View style={[styles.step, { opacity: fadeAnim }]}>
          <ThemedText type="subtitle" style={{ color: 'black' }}>Step 1: Capture an Image</ThemedText>
          <ThemedText style={{ color: 'black' }}>
            Open the SpotWise app and use your smartphone's camera to take a clear picture of the affected skin area. Ensure good lighting for optimal image quality.
          </ThemedText>
        </Animated.View>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <Animated.View style={[styles.step, { opacity: fadeAnim }]}>
          <ThemedText type="subtitle" style={{ color: 'black' }}>Step 2: Analyze the Scan</ThemedText>
          <ThemedText style={{ color: 'black' }}>
            After capturing the image, SpotWise's AI algorithms will analyze the photo and identify potential skin diseases. This process takes just a few seconds.
          </ThemedText>
        </Animated.View>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <Animated.View style={[styles.step, { opacity: fadeAnim }]}>
          <ThemedText type="subtitle" style={{ color: 'black' }}>Step 3: Receive Insights</ThemedText>
          <ThemedText style={{ color: 'black' }}>
            Once the analysis is complete, you'll receive detailed information about the identified condition, along with personalized recommendations and next steps for care or treatment.
          </ThemedText>
        </Animated.View>
      </ThemedView>
      
    </ParallaxScrollView>
  );
}

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
    marginBottom: 16,
  },
  step: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f8ff',
  },
  reactLogo: {
    height: 178,
    width: 300,
  },
});
