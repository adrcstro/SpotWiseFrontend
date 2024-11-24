import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
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
  const navigation = useNavigation();
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
        Alert.alert('Model Error', 'Failed to load the TensorFlow model.');
      }
    };

    loadModel();
  }, []);

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Denied',
        'Permission to access the media library is required. Please enable it in your settings.'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images', // Use string directly
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled) {
        const selectedImage = result.assets?.[0]?.uri;
        if (selectedImage) {
          setImageUri(selectedImage);
          await classifyImage(selectedImage);
        } else {
          Alert.alert('Error', 'Failed to retrieve the selected image.');
        }
      }
    } catch (error) {
      console.error('Image Picker Error:', error);
    }
  };

  const classifyImage = async (uri: string) => {
    if (!model) {
      Alert.alert('Model Error', 'The TensorFlow model is not ready.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(uri);
      const imageData = await response.blob();
      const imageTensor = decodeJpeg(await imageData.arrayBuffer());

      const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
      const normalizedImage = resizedImage.div(255.0).expandDims(0);

      const prediction = model.predict(normalizedImage) as tf.Tensor;
      const predictionArray = prediction.dataSync();

      const maxIndex = predictionArray.indexOf(Math.max(...predictionArray));
      setPredictedClass(classes[maxIndex]);
    } catch (error) {
      console.error('Classification Error:', error);
      Alert.alert('Error', 'Failed to classify the image.');
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
          <Button title="Go to Home" onPress={() => navigation.navigate('index')} />
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
