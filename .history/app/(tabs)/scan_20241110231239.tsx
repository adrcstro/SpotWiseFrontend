// app/(tabs)/scan.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import * as tflite from '@tensorflow/tfjs-tflite';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const ScanScreen = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [model, setModel] = useState(null);
    const [prediction, setPrediction] = useState('');

    useEffect(() => {
        (async () => {
            // Request camera permissions
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');

            // Load TensorFlow.js and the TFLite model
            await tf.ready();
            const model = await tflite.loadTFLiteModelAsync(require('../../assets/models/resnet.tflite'));
            setModel(model);
        })();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.uri);
            await classifyImage(result.uri);
        }
    };

    const classifyImage = async (uri) => {
        try {
            // Convert image to tensor
            const imgB64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
            const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
            const raw = new Uint8Array(imgBuffer);
            let imageTensor = tf.tensor3d(raw, [224, 224, 3]); // Adjust dimensions if needed

            // Run the model prediction
            const predictions = model.predict(imageTensor);
            const predictedClass = predictions.argMax(-1).dataSync()[0];

            // Set prediction result (use a mapping to your skin disease classes)
            setPrediction(`Predicted class: ${predictedClass}`);
        } catch (error) {
            console.error("Error in classification:", error);
        }
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Scan Screen</Text>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Pick an Image</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            {prediction ? <Text style={styles.prediction}>{prediction}</Text> : null}
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
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    image: {
        width: 224,
        height: 224,
        marginVertical: 10,
    },
    prediction: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
});

export default ScanScreen;
