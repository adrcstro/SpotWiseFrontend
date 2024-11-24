// app/(tabs)/scan.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScanScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Scan Screen</Text>
            {/* Add your scanning component or functionality here */}
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
});

export default ScanScreen;
