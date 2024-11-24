import { Image, StyleSheet, Platform, View } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

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
      
      <ThemedView style={styles.stepContainer}>
        <Icon name="camera" size={20} color="#000" /> {/* Icon for Step 1 */}
        <ThemedText type="subtitle">Step 1: Capture an Image</ThemedText>
        <ThemedText>
          Open the SpotWise app and use your smartphone's camera to take a clear picture of the affected skin area. Ensure good lighting for optimal image quality.
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <Icon name="cogs" size={20} color="#000" /> {/* Icon for Step 2 */}
        <ThemedText type="subtitle">Step 2: Analyze the Scan</ThemedText>
        <ThemedText>
          After capturing the image, SpotWise's AI algorithms will analyze the photo and identify potential skin diseases. This process takes just a few seconds.
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <Icon name="info-circle" size={20} color="#000" /> {/* Icon for Step 3 */}
        <ThemedText type="subtitle">Step 3: Receive Insights</ThemedText>
        <ThemedText>
          Once the analysis is complete, you'll receive detailed information about the identified condition, along with personalized recommendations and next steps for care or treatment.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

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
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Center vertically
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 300,
  },
});
