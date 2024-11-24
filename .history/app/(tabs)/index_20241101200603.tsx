import { Image, StyleSheet, Platform, View } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Define the props type for the Step component
interface StepProps {
  title: string;
  description: string;
  imageSource: any; // Use 'any' if you're unsure about the image type, or replace it with a more specific type if you know it (like ImageSourcePropType).
}

export default function HomeScreen() {
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
      
      <Step
        title="Step 1: Capture an Image"
        description="Open the SpotWise app and use your smartphone's camera to take a clear picture of the affected skin area. Ensure good lighting for optimal image quality."
        imageSource={require('@/assets/images/Step1.png')}
      />
      
      <Step
        title="Step 2: Analyze the Scan"
        description="After capturing the image, SpotWise's AI algorithms will analyze the photo and identify potential skin diseases. This process takes just a few seconds."
        imageSource={require('@/assets/images/Step2.png')}
      />
      
      <Step
        title="Step 3: Analysis Result"
        description="Once the analysis is complete, you'll receive detailed information about the identified condition, along with personalized recommendations and next steps for care or treatment."
        imageSource={require('@/assets/images/Step3.png')}
      />
    </ParallaxScrollView>
  );
}

// Define the Step component with the defined props type
// Define the Step component with the defined props type
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
    marginBottom: 16,
    alignItems: 'center', // Center images and text in the step container
  },
  stepImage: {
    height: 150, // Adjust the height as needed
    width: 150,  // Adjust the width as needed
    marginBottom: 8, // Add some space between the image and text
  },
  stepTitle: {
    textAlign: 'center', // Center the title text horizontally
  },
  stepDescription: {
    textAlign: 'center', // Center the description text horizontally
  },
  reactLogo: {
    height: 178,
    width: 300,
  },
});
