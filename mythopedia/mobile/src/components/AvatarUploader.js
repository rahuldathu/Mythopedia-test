import React, { useState } from 'react';
import { View, Image, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function AvatarUploader({ avatarUrl, onUpload, userId }) {
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      uploadImage(result.assets[0]);
    }
  };

  const uploadImage = async (asset) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        name: `avatar_${userId}.jpg`,
        type: 'image/jpeg',
      });
      const res = await fetch('http://localhost:4000/api/assets/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userId}` }, // Replace with real JWT
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onUpload(data.url);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (e) {
      Alert.alert('Upload Error', e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={avatarUrl ? { uri: avatarUrl } : require('../assets/avatar-placeholder.png')} style={styles.avatar} />
      <Button title={uploading ? 'Uploading...' : 'Change Avatar'} onPress={pickImage} disabled={uploading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 8, backgroundColor: '#eee' },
}); 