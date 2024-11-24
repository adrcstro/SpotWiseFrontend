import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';

const ScanScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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

  // Load the model
  const loadModel = async () => {
    try {
      // Load the TensorFlow model
      const modelJson = require('../Model/model.json');
      const modelWeights = [
        require('../Model/group1-shard1of7.bin'),
        require('../Model/group1-shard2of7.bin'),
        require('../Model/group1-shard3of7.bin'),
        require('../Model/group1-shard4of7.bin'),
        require('../Model/group1-shard5of7.bin'),
        require('../Model/group1-shard6of7.bin'),
        require('../Model/group1-shard7of7.bin'),
      ];
      
      const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
      return model;
    } catch (error) {
      console.error("Error loading the model: ", error);
    }
  };

  // Function to handle image upload
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
      await classifyImage(result.assets[0].uri);
    }
  };

  // Function to classify the image
  const classifyImage = async (uri: string) => {
    setLoading(true);
    const model = await loadModel();

    if (model && uri) {
      try {
        const response = await fetch(uri);
        const imageBlob = await response.blob();
        const imageArrayBuffer = await imageBlob.arrayBuffer();
        const imageData = new Uint8Array(imageArrayBuffer);

        // Decode the image and prepare it for prediction
        const imageTensor = decodeJpeg(imageData).expandDims(0).div(tf.scalar(255));

        // Predict the class
        const predictions = model.predict(imageTensor) as tf.Tensor;
        const predictionArray = predictions.dataSync() as Float32Array;

        // Find the class with the highest probability
        const maxIndex = predictionArray.indexOf(Math.max(...predictionArray));
        const predictedClass = classes[maxIndex];

        setPrediction(predictedClass);
      } catch (error) {
        console.error("Error in classification: ", error);
      }
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Scan Screen</Text>
      <Button title="Upload Image" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {loading && <ActivityIndicator size="large" color="#00ff00" />}
      {prediction && (
        <Text style={styles.predictionText}>
          Predicted Class: {prediction}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Dark background color to contrast with white text
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    marginBottom: 20,
  },
  predictionText: {
    color: 'white',
    fontSize: 18,
    marginTop: 20,
  },
});

export default ScanScreen;
