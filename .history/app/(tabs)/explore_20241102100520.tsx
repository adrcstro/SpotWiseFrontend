import React from 'react';
import { StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#ffffff', dark: '#ffffff' }}
      headerImage={
        <Image
          source={require('@/assets/images/Plotwise.png')} // Replace with your image path
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">About Us</ThemedText>
      </ThemedView>
      <ThemedText>A reliable companion in understanding and managing skin health! Our mission is to empower individuals by providing accessible, accurate skin condition assessments.</ThemedText>

      <Collapsible title="How do I take a photo for Spotwise accuracy?">
        <ThemedText>
        Use bright, even lighting and focus closely on the affected area for the best results.
        </ThemedText>
      </Collapsible>

      <Collapsible title="What skin conditions can Spotwise detect?">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
           in the terminal running this project.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities.
        </ThemedText>
        <Image 
          source={require('@/assets/images/react-logo.png')} 
          style={styles.image} 
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Custom fonts">
        <ThemedText>
          Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText> to see how to load{' '}
          <ThemedText style={{ fontFamily: 'SpaceMono' }}>
            custom fonts such as this one.
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user's current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText> library
          to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>

      {/* Add the "Get Started" Button here */}

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    height: 200,
    width: 360, // Adjust to your desired height
    alignSelf: 'center',
    marginTop: 30,
  },
  image: {
    width: '80%', // Set width to 80% for responsiveness
    height: undefined, // Allow height to be calculated based on aspect ratio
    aspectRatio: 1, // Maintain the aspect ratio
    alignSelf: 'center',
    marginVertical: 20, // Add vertical margin for spacing
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },

});