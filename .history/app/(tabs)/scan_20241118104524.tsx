import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import { useNavigation } from '@react-navigation/native';

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

const ScanScreen = () => {
  const navigation = useNavigation(); // Get navigation context
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
    <View style={styles.container}>
      {isModelReady ? (
        <>
          <Button title="Upload Image" onPress={handleImageUpload} />
          {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
          {loading ? (
            <ActivityIndicator size="large" color="#00ff00" />
          ) : (
            predictedClass && <Text style={styles.text}>Predicted: {predictedClass}</Text>
          )}
          {/* Navigate back to the Home Screen */}
      
        </>
      ) : (
        <Text style={styles.text}>Loading Model...</Text>
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
  text: {
    color: 'white',
    fontSize: 18,
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
    borderRadius: 10,
  },
});

export default ScanScreen;
