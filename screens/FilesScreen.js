import React, { useEffect, useState, useContext } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from "react-native";
import * as MediaLibrary from "expo-media-library";

import GridItem from "../components/ui/GridItem"; 


const requestMediaPermissions = async () => {
  const { granted } = await MediaLibrary.requestPermissionsAsync();
  return granted;
};

const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const FilesScreen = ({ theme, searchText, setAudioUri, setVideoUri }) => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true); 
  
  const getFilteredFiles = () => {
    const l_filteredFiles = mediaFiles.filter((file) => 
      file.filename.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredFiles(l_filteredFiles);
  };

  
  const fetchMediaFiles = async () => {
    const permissionGranted = await requestMediaPermissions();
    if (!permissionGranted) {
      Alert.alert("Permission Denied", "Please grant media access in settings.");
      setLoading(false);
      return;
    }

    try {
     
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: [MediaLibrary.MediaType.audio, MediaLibrary.MediaType.video],
        first: 100, 
      });

      setMediaFiles(media.assets); 
      setFilteredFiles(media.assets); 
    } catch (error) {
      console.error("Error fetching media files:", error);
      Alert.alert("Error", "Could not fetch media files.");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchMediaFiles(); 
  }, []);

  useEffect(() => {
    if (searchText && mediaFiles) {
      getFilteredFiles();
    } else {
      setFilteredFiles(mediaFiles); 
    }
  }, [searchText, mediaFiles]);

  return (
    <ScrollView style={styles.content}>
      
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text, fontFamily: "Poppins_700Bold" },
          ]}
        >
          Downloads
        </Text>

        
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={{ color: theme.text, marginTop: 10 }}>Loading...</Text>
          </View>
        ) : (
          
          <View style={styles.fileList}>
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file, index) => (
                <View key={index} style={styles.fileItem}>
                  <GridItem
                    icon={file.mediaType === "audio" ? "musical-notes-outline" : "film-outline"} 
                    title={file.filename}
                    duration={formatDuration(file.duration)} 
                    theme={theme}
                    onPress={() => file.mediaType === "audio" ? setAudioUri(file.uri) : setVideoUri(file.uri)}
                  />
                </View>
              ))
            ) : (
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
  fileList: {
    marginHorizontal: -12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  fileItem: {
    width: "27%",
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  loaderContainer: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FilesScreen;
