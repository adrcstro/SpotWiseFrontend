import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontAwesome, MaterialIcons, AntDesign } from '@expo/vector-icons';

const BACKEND_URL = process.env.BACKEND_URL || 'http://192.168.1.7:5000/predict';
const screenWidth = Dimensions.get('window').width;

const ScanScreen = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [probabilities, setProbabilities] = useState<{ [key: string]: number } | null>(null);
  const [loading, setLoading] = useState(false);


useEffect(() => {
  if (imageUri) {
    console.log('Image URI updated:', imageUri);
    classifyImage(); // Automatically classify when a valid image is selected
  }
}, [imageUri]);



  // Correctly type the cameraRef
  const cameraRef = useRef<InstanceType<typeof CameraView> | null>(null);

  if (!permission || !mediaLibraryPermission) {
    // Permissions are still loading.
    return <View />;
  }

  if (!permission.granted || !mediaLibraryPermission.granted) {
    // Permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Button onPress={requestPermission} title="Grant Camera Permission" />
        <Button onPress={requestMediaLibraryPermission} title="Grant Media Library Permission" />
      </View>
    );
  }

  // Toggle camera facing direction
  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

// Capture photo and automatically classify it
async function capturePhoto() {
  if (cameraRef.current) {
    try {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo && photo.uri) {
        // Save the captured image to the state
        setImageUri(photo.uri);

        // Debugging Log: Check if the URI is correctly set
        console.log('Captured image URI:', photo.uri);

        // Reset results but keep the captured image
        resetResults(false);
      } else {
        console.log('Photo capture failed or URI is missing.');
      }
    } catch (error) {
      console.log('Error capturing photo:', error);
    }
  }
}






// Function to pick an image and classify it
const pickImage = async () => {
  const pickerResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!pickerResult.canceled) {
    const selectedUri = pickerResult.assets[0].uri;

    if (selectedUri) {
      setImageUri(selectedUri); // Set the image URI
      resetResults(false); // Reset results but keep the new image URI
    } else {
      Alert.alert('Error', 'Failed to get the image URI from gallery.');
    }
  } else {
    console.log('User canceled the image picker.');
  }
};



  const clearData = () => {
    setImageUri(null);
    resetResults();
  };

  // Classify image
  const classifyImage = async () => {
    console.log('Attempting to classify image with URI:', imageUri);
  
    // Validate that imageUri is non-null and valid
    if (!imageUri || imageUri.trim() === '') {
      console.warn('imageUri is null or empty');
      Alert.alert('No Image', 'Please upload an image first!');
      return;
    }
  
    setLoading(true);
  
    try {
      const file = {
        uri: imageUri,
        name: 'skin_image.jpg',
        type: 'image/jpeg',
      };
  
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await axios.post(BACKEND_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      const { class: diseaseClass, confidence, probabilities: prob } = response.data;
  
      if (diseaseClass && confidence && prob) {
        setResult(`${diseaseClass} (${confidence})`);
        setProbabilities(prob);
      } else {
        Alert.alert('Classification Failed', 'Could not classify the image.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Could not connect to the server. Please check the backend.');
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const resetResults = (clearImage = true) => {
    if (clearImage) {
      setImageUri(null);
    }
    setResult(null);
    setProbabilities(null);
  };
  

  const renderLineChart = () => {
    if (!probabilities) return null;

    const labels = Object.keys(probabilities);
    const data = Object.values(probabilities);

    return (
      <View style={styles.chartWrapper}>
        <LineChart
          data={{
            labels: labels.map((label) =>
              label.length > 5 ? `${label.slice(0, 5)}...` : label
            ),
            datasets: [{ data, strokeWidth: 2 }],
          }}
          width={screenWidth - 32} // Adjusted for padding
          height={250}
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: '#1a1a1a',
            backgroundGradientFrom: '#1a1a1a',
            backgroundGradientTo: '#333333',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 15 },
          }}
          style={styles.chart}
        />
        <Text style={styles.graphLabel}>Confidence Graph</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        {/* Scanning Frame */}
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        {/* Flip Camera Button */}
        <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
          <Ionicons name="camera-reverse-outline" size={32} color="white" />
        </TouchableOpacity>

        {/* Capture Photo Button */}
        <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
          <Ionicons name="camera" size={30} color="white" />
        </TouchableOpacity>

        {/* Upload Button */}
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
  <FontAwesome name="upload" size={30} color="white" />
</TouchableOpacity>
      </CameraView>

      {/* Display Results */}
      {imageUri && (
        <View style={styles.resultContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <TouchableOpacity style={styles.clearButton} onPress={clearData}>
              <AntDesign name="closecircle" size={24} color="white" />
            </TouchableOpacity>
          {result && (
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultText}>{result}</Text>
            </View>
          )}
          {renderLineChart()}
          <View style={styles.buttonRow}>
  {/* Capture Button */}
  <TouchableOpacity style={styles.actionButton} onPress={clearData}>
    <Ionicons name="camera" size={20} color="black" />
    <Text style={styles.actionButtonText}>Capture</Text>
  </TouchableOpacity>

  {/* Upload Button */}
  <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
    <FontAwesome name="upload" size={20} color="black" />
    <Text style={styles.actionButtonText}>Upload</Text>
  </TouchableOpacity>

  {/* Classify Button */}
  <TouchableOpacity style={styles.actionButton} onPress={classifyImage}>
    <MaterialIcons name="search" size={20} color="black" />
    <Text style={styles.actionButtonText}>Classify</Text>
  </TouchableOpacity>
</View>

        </View>
      )}
      {loading && <ActivityIndicator size="large" color="#ffffff" />}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  camera: {
    flex: 1,
  },
  flipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  captureButton: {
    position: 'absolute',
    bottom: 20,
    left: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
    width: 70,
    height: 70,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 20,
    right: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
    width: 70,
    height: 70,
  },
  scanFrame: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    bottom: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    borderColor: 'white',
  },
  topLeft: {
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderTopLeftRadius: 10,
  },
  topRight: {
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderTopRightRadius: 10,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderBottomLeftRadius: 10,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderBottomRightRadius: 10,
  },
  resultContainer: {
    marginTop: 25,
    alignItems: 'center',
    padding: 16,
   
    borderRadius: 10,
    marginHorizontal: 16,
  },
  imagePreview: {
    width: 250,
    height: 250,
    marginBottom: 15,
    borderRadius: 10,
  },
  resultTextContainer: {
    marginTop: -5,
  },
  resultText: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  classifyButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  classifyText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartWrapper: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  chart: {
    borderRadius: 10,
  },
  graphLabel: {
    position: 'absolute',
    bottom: 1,
    left: '68%',
    transform: [{ translateX: -50 }],
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 50,
  },
  clearButton: {
    position: 'absolute',
    top: 25,
    right: 45,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 16,
  },
  
  actionButton: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center', // Center vertically within the row
    justifyContent: 'center', // Center horizontally within the row
    backgroundColor: '#72bf78',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  
  actionButtonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5, // Add space between the icon and text
  },
  
  
});


export default ScanScreen;
