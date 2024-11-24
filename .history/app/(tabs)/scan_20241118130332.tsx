import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

// Import the JSON and .bin files at the top of your file
import modelJson from '../../assets/Model/model.json';
import group1Shard1 from '../../assets/Model/group1-shard1of7.bin';
import group1Shard2 from '../../assets/Model/group1-shard2of7.bin';
import group1Shard3 from '../../assets/Model/group1-shard3of7.bin';
import group1Shard4 from '../../assets/Model/group1-shard4of7.bin';
import group1Shard5 from '../../assets/Model/group1-shard5of7.bin';
import group1Shard6 from '../../assets/Model/group1-shard6of7.bin';
import group1Shard7 from '../../assets/Model/group1-shard7of7.bin';

const ScanScreen = () => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Skin disease classes
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

  // Load the TensorFlow.js model
  const loadModel = async () => {
    try {
      setLoading(true);
      // Use imported paths for modelJson and weights
      const loadedModel = await tf.loadLayersModel(
        bundleResourceIO(modelJson, [
          group1Shard1,
          group1Shard2,
          group1Shard3,
          group1Shard4,
          group1Shard5,
          group1Shard6,
          group1Shard7,
        ])
      );
      setModel(loadedModel);
      setLoading(false);
    } catch (error) {
      console.error("Error loading the model: ", error);
      setLoading(false);
    }
  };

  // Load the model when the component mounts
  useEffect(() => {
    (async () => {
      await tf.ready(); // Wait for TensorFlow.js to be ready
      await loadModel();
    })();
  }, []);

  // Pick an image from the gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Corrected
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
      await classifyImage(result.assets[0].uri);
    }
  };

  // Classify the selected image
  const classifyImage = async (uri: string) => {
    try {
      if (!model) return;

      setLoading(true);

      // Load the image as a tensor
      const response = await fetch(uri);
      const imageBlob = await response.blob();
      const img = await tf.browser.fromPixelsAsync(imageBlob);

      // Preprocess the image to fit model input
      const resizedImage = tf.image.resizeBilinear(img, [224, 224]);
      const normalizedImage = resizedImage.div(255).expandDims(0);

      // Predict the class
      const predictions = (model.predict(normalizedImage) as tf.Tensor).dataSync();
      const predictedIndex = predictions.indexOf(Math.max(...predictions));

      setPrediction(classes[predictedIndex]);
      setLoading(false);
    } catch (error) {
      console.error('Error classifying image: ', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skin Disease Classifier</Text>
      <Button title="Pick an Image" onPress={pickImage} />
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}
      {loading && (
        <ActivityIndicator size="large" color="#00ff00" />
      )}
      {prediction && !loading && (
        <Text style={styles.prediction}>Prediction: {prediction}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 20,
  },
  prediction: {
    color: '#00ff00',
    fontSize: 20,
    marginTop: 20,
  },
});

export default ScanScreen;
