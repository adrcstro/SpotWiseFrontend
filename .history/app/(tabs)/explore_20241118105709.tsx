import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Button, ActivityIndicator, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const classes = [
  'Acne',
  'ChickenPox',
  'Melanoma',
  'Psoriasis',
  'Shingles',
  'Vitiligo',
  'Warts',
  'Unknown',
];

export default function TabTwoScreen() {
  const [isModelReady, setModelReady] = useState(false);
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [predictedClass, setPredictedClass] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await tf.loadGraphModel(
          bundleResourceIO(
            require('../../Model/model.json'),
            [
              require('../../Model/group1-shard1of7.bin'),
              require('../../Model/group1-shard2of7.bin'),
              require('../../Model/group1-shard3of7.bin'),
              require('../../Model/group1-shard4of7.bin'),
              require('../../Model/group1-shard5of7.bin'),
              require('../../Model/group1-shard6of7.bin'),
              require('../../Model/group1-shard7of7.bin'),
            ]
          )
        );
        setModel(loadedModel);
        setModelReady(true);
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };

    loadModel();
  }, []);

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      classifyImage(result.assets[0].uri);
    }
  };

  const classifyImage = async (uri: string) => {
    if (!model) return;

    try {
      setLoading(true);

      // Convert the image to a tensor
      const response = await fetch(uri);
      const imageData = await response.blob();
      const imageTensor = decodeJpeg(await imageData.arrayBuffer());

      // Resize the image tensor to match the model's input shape
      const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
      const normalizedImage = resizedImage.div(255.0).expandDims(0);

      // Make a prediction
      const prediction = model.predict(normalizedImage) as tf.Tensor;
      const predictionArray = prediction.dataSync();

      // Get the class with the highest probability
      const maxIndex = predictionArray.indexOf(Math.max(...predictionArray));
      setPredictedClass(classes[maxIndex]);
    } catch (error) {
      console.error('Error classifying image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#ffffff', dark: '#ffffff' }}
      headerImage={
        <Image
          source={require('@/assets/images/WelcomeScreen.png')} // Replace with your image path
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">About Us</ThemedText>
      </ThemedView>
      <ThemedText>A reliable companion in understanding and managing skin health! Our mission is to empower individuals by providing accessible, accurate skin condition assessments.</ThemedText>

      <ThemedView style={styles.titleFAQ}>
        <ThemedText type="title">Scan and Classify</ThemedText>
      </ThemedView>

      {isModelReady ? (
        <View style={styles.scanContainer}>
          <Button title="Upload Image" onPress={handleImageUpload} />
          {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
          {loading ? (
            <ActivityIndicator size="large" color="#00ff00" />
          ) : (
            predictedClass && (
              <Text style={styles.text}>
                Predicted Class: {predictedClass}
              </Text>
            )
          )}
        </View>
      ) : (
        <Text style={styles.text}>Loading Model...</Text>
      )}

      <ThemedView style={styles.titleFAQ}>
        <ThemedText type="title">FAQ</ThemedText>
      </ThemedView>

      {/* Existing FAQ sections */}
      <Collapsible title="How do I take a photo for Spotwise accuracy?">
        <ThemedText style={styles.collapsibleText}>
          Use bright, even lighting and focus closely on the affected area for the best results.
        </ThemedText>
      </Collapsible>
      <Collapsible title="What skin conditions can Spotwise detect?">
        <ThemedText style={styles.collapsibleText}>
          Spotwise can classify Acne, Vitiligo, Shingles, Melanoma, Psoriasis, Chickenpox, and Warts.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    height: 200,
    width: 360,
    alignSelf: 'center',
    marginTop: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  titleFAQ: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  collapsibleText: {
    backgroundColor: '#3C424D',
    padding: 10,
    borderRadius: 5,
  },
  scanContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: 'black',
    marginTop: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
    borderRadius: 10,
  },
});
