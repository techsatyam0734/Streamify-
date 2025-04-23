import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import GridItem from "../components/ui/GridItem"; 


import AudioItem from "../components/ui/AudioItem";
import AudioPlayer from "../components/ui/AudioPlayer";

const requestMediaPermissions = async () => {
  const { granted } = await MediaLibrary.requestPermissionsAsync();
  return granted;
};

export const getDeviceMediaByFolder = async () => {
  try {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) {
      throw new Error("Media library permission not granted");
    }

    const media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: 100,
    });

    let files = [];
    for (const file of media.assets) {
      files.push({
        id: file.id,
        name: file.filename || "Unknown",
        uri: file.uri,
        type: file.mediaType,
        size: file.fileSize || 0,
        duration: file.duration ? formatDuration(file.duration) : "0:00",
        created: file.creationTime || Date.now(),
        thumbnail: file.uri,
      });
    }

    return files;
  } catch (error) {
    console.error(`Error fetching audio files:`, error);
    return [];
  }
};

const formatDuration = (seconds) => {
  if (!seconds) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const MusicScreen = ({ theme,searchText, setAudioUri }) => {
  const [audioFiles, setAudioFiles] = useState(null);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  const getFilteredFiles = () => {
    const l_filteredFiles = audioFiles.filter((file) => 
      file.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredFiles(l_filteredFiles);
  };

  useEffect(() => {
    handleRequestPermission();
  }, []);

  useEffect(() => {
    const fetchAudios = async () => {
      setLoading(true);
      const audios = await getDeviceMediaByFolder();
      setAudioFiles(audios);
      setFilteredFiles(audios);
      setLoading(false);
    };

    if (permissionGranted) {
      fetchAudios();
    }
  }, [permissionGranted]);

  

  const handleRequestPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Please grant media access in settings.");
    } else {
      setPermissionGranted(true);
    }
  };

  const handleAudioPress = async (uri) => {
    setLoading(true);
    setAudioUri(uri);
    setLoading(false);
  };

  useEffect(() => {
    if (searchText && audioFiles) {
      getFilteredFiles();
    } else {
      setFilteredFiles(audioFiles); 
    }
  }, [searchText, audioFiles]);

  return (
    <ScrollView style={styles.content}>
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text, fontFamily: "Poppins_700Bold" },
          ]}
        >
          All Audios
        </Text>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={[styles.loaderText,{color:theme.text}]}>Loading...</Text>
          </View>
        ) : (
          <View style={styles.audioList}>
            {filteredFiles?.length > 0 ? (
            filteredFiles?.map((audio) => (
              <View key={audio.id} style={styles.fileItem}>
                  <GridItem
                  
                  icon={"musical-notes-outline"} 
                  title={audio.name}
                  duration={audio.duration}
                  thumbnail={audio.thumbnail}
                  theme={theme}
                  onPress={() => handleAudioPress(audio.uri)}
                />
              </View>
            ))
            ):(
              <Text style={{ color: theme.text }}>No media files found</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    marginBottom: 80,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginLeft: 12,
    fontSize: 16,
    marginBottom: 5,
  },
  fileItem: {
    width: "27%",
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  audioList: {
    marginHorizontal: -12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  loaderContainer: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 14,
    color: "#000", // 🔲 Black text
    fontFamily: "Poppins_500Medium",
  },
});

export default MusicScreen;
