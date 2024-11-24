import React, { useRef, useState } from 'react';
import { Image, StyleSheet, View, FlatList, Animated, Dimensions, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const HomeScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(index);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor="#FFFFFF"
      headerHeight={screenHeight} // Make header occupy full screen initially
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      headerImage={
        <View style={styles.headerContainer}> 
          <Image
            source={require('@/assets/images/Plotwise.png')}
            style={styles.headerImage}
          />
        </View>
      }
    >
      {/* Main Content */}
      <Animated.View style={[
        styles.mainContent,
        {
          opacity: scrollY.interpolate({
            inputRange: [0, screenHeight * 0.5],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
        },
      ]}>
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
          snapToInterval={screenWidth}
        />

        {/* Navigation Dots */}
        <View style={styles.pagination}>
          {steps.map((_, index) => (
            <TouchableOpacity key={index} onPress={() => {
              scrollX.setValue(index * screenWidth);
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
      </Animated.View>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    height: screenHeight, // Full screen height for the header image
    width: screenWidth,
    resizeMode: 'cover',
  },
  mainContent: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  descriptionContainer: {
    marginBottom: 16,
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
