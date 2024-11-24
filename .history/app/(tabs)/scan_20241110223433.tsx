// scan.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { Camera } from 'expo-camera';

const ScanScreen = () => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [result, setResult] = useState('');
  let cameraRef = React.useRef(null);

  const loadModel = async () => {
    const modelJson = require('../assets/model/skin_disease_model.json');
    const modelWeights = require('../assets/model/skin_disease_model.weights.bin');
    return await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
  };

  const captureImage = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync({ base64: true });
      setCapturedImage(photo.uri);
      classifyImage(photo.uri);
    }
  };

  const classifyImage = async (uri) => {
    await tf.ready();
    const model = await loadModel();

    const image = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 224, height: 224 } }],
      { base64: true }
    );
    const imageData = tf.browser.fromPixels(image).reshape([1, 224, 224, 3]);

    const prediction = model.predict(imageData) as tf.Tensor;
    const predictedClass = prediction.argMax(-1).dataSync()[0];
    const diseaseNames = ['Disease 1', 'Disease 2', 'Disease 3', 'Disease 4', 'Disease 5', 'Disease 6', 'Disease 7'];
    setResult(diseaseNames[predictedClass]);
  };

  const requestPermissions = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setCameraPermission(status === 'granted');
  };

  if (cameraPermission === null) {
    requestPermissions();
    return <Text>Requesting permissions...</Text>;
  }

  if (cameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skin Disease Scanner</Text>
      {capturedImage ? (
        <Image source={{ uri: capturedImage }} style={styles.imagePreview} />
      ) : (
        <Camera style={styles.camera} ref={(ref) => (cameraRef = ref)} />
      )}
      <Button title="Capture Image" onPress={captureImage} />
      {result ? <Text style={styles.resultText}>Detected: {result}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  camera: {
    width: 300,
    height: 400,
    marginVertical: 20,
  },
  imagePreview: {
    width: 300,
    height: 400,
  },
  resultText: {
    fontSize: 20,
    color: '#333',
    marginVertical: 10,
  },
});

export default ScanScreen;
