import React, { useEffect, useState } from 'react';
import { View, Button, Text } from 'react-native';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

const ScanScreen = () => {
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      await tf.ready();

      // Load the TFLite model with the updated path
      const modelJson = require('../assets/resnet.tflite');
      const loadedModel = await tf.loadGraphModel(bundleResourceIO(modelJson));
      setModel(loadedModel);
    })();
  }, []);

  const handleImageCapture = async () => {
    if (model && hasPermission) {
      // Capture the image and process it here
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} />
      <Button title="Capture & Analyze" onPress={handleImageCapture} />
      {model && <Text>Model loaded successfully!</Text>}
    </View>
  );
};

export default ScanScreen;
