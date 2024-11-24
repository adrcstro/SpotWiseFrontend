import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { Asset } from 'expo-asset';
const ScanScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);

  const loadModel = async () => {
    try {
      await tf.ready();
  
      // Load the model using Asset.fromModule to get the URI
      const modelJson = Asset.fromModule(require('../../assets/Model/model.json')).uri;
      const modelWeights = [
        Asset.fromModule(require('../../assets/Model/group1-shard1of7.bin')).uri,
        Asset.fromModule(require('../../assets/Model/group1-shard2of7.bin')).uri,
        Asset.fromModule(require('../../assets/Model/group1-shard3of7.bin')).uri,
        Asset.fromModule(require('../../assets/Model/group1-shard4of7.bin')).uri,
        Asset.fromModule(require('../../assets/Model/group1-shard5of7.bin')).uri,
        Asset.fromModule(require('../../assets/Model/group1-shard6of7.bin')).uri,
        Asset.fromModule(require('../../assets/Model/group1-shard7of7.bin')).uri,
      ];
  
      // Use bundleResourceIO to load the model
      const model = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
      return model;
    } catch (error) {
      console.error('Error loading model:', error);
      Alert.alert('Error', 'Failed to load the model');
      return null;
    }
  };
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Corrected property
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri); // Updated to fetch the image URI
      setPrediction(null); // Reset prediction when a new image is uploaded
    }
  };
  
  const classifyImage = async () => {
    if (!image) {
      Alert.alert('Error', 'Please upload an image first');
      return;
    }

    const model = await loadModel();
    if (!model) return;

    try {
      const imgB64 = await fetch(image).then(res => res.blob());
      const imgBuffer = await imgB64.arrayBuffer();
      const tensor = tf.browser
        .fromPixels({ data: new Uint8Array(imgBuffer), width: 224, height: 224 })
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(255.0)
        .expandDims(0);

      const predictions = model.predict(tensor) as tf.Tensor;
      const predictionArray = predictions.dataSync();
      const classes = ['Acne', 'ChickenPox', 'Melanoma', 'Psoriasis', 'Shingles', 'Vitiligo', 'Warts'];
      const maxIndex = predictionArray.indexOf(Math.max(...predictionArray));
      setPrediction(classes[maxIndex]);
    } catch (error) {
      console.error('Error classifying image:', error);
      Alert.alert('Error', 'Failed to classify the image');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Scan Skin Disease</Text>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Upload Image" onPress={pickImage} />
      {image && <Button title="Classify Image" onPress={classifyImage} />}
      {prediction && <Text style={styles.prediction}>Prediction: {prediction}</Text>}
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
  text: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  prediction: {
    color: '#00FF00',
    fontSize: 18,
    marginTop: 20,
  },
});

export default ScanScreen;
