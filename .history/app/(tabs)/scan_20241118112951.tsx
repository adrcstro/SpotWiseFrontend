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
import { Camera } from 'expo-camera'; // Import Camera from expo-camera
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
  const [predictedClass, setPredictedClass] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false); // Camera permission state
  const [camera, setCamera] = useState<Camera | null>(null); // Camera reference
  const [imageUri, setImageUri] = useState<string | null>(null); // Image URI for preview
  const [facing, setFacing] = useState<"front" | "back">("back"); // State to toggle camera direction

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

  useEffect(() => {
    const getCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
    };
    
    getCameraPermission();
  }, []);

  const handleCapture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync({
        quality: 1,
        base64: true,
      });

      if (photo.uri) {
        setImageUri(photo.uri);
        await classifyImage(photo.uri);
      } else {
        Alert.alert('Error', 'Failed to capture the image.');
      }
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
          {cameraPermission ? (
            <Camera
              style={styles.camera}
              type={facing}
              ref={(ref) => setCamera(ref)} // Set the camera ref
            >
              <View style={styles.buttonContainer}>
                <Button title="Capture Image" onPress={handleCapture} />
                <Button
                  title="Flip Camera"
                  onPress={() => setFacing(facing === "back" ? "front" : "back")}
                />
              </View>
            </Camera>
          ) : (
            <Text style={styles.text}>Camera permission is required to use the camera.</Text>
          )}

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
  camera: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
    borderRadius: 10,
  },
});

export default ScanScreen;
