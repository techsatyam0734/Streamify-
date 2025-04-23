import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert } from "react-native";


import VideoItem from "../components/ui/VideoItem";
import * as MediaLibrary from "expo-media-library";
import * as Application from "expo-application";
import { Platform } from "react-native";


const getDeviceId = async () => {
  return Platform.OS === "ios"
    ? await Application.getIosIdForVendorAsync()
    : Application.androidId;
};


const requestMediaPermissions = async () => {
  const { granted } = await MediaLibrary.requestPermissionsAsync();
  return granted;
};

export const getDeviceMediaByFolder = async (folderName) => {
  try {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) {
      throw new Error("Media library permission not granted");
    }

    const media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.video,
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
    console.error(`Error fetching ${folderName} files:`, error);
    return [];
  }
};


const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const VideoScreen = ({ theme,searchText, setVideoUri }) => {
  const [videoFiles, setVideoFiles] = useState(null);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const getFilteredFiles = () => {
    const l_filteredFiles = videoFiles.filter((file) => 
      file.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredFiles(l_filteredFiles);
  };

  useEffect(() => {
    handleRequestPermission();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      if (permissionGranted) {
        setLoading(true); 
        const videos = await getDeviceMediaByFolder();
        setVideoFiles(videos);
        setFilteredFiles(videos); 
        setLoading(false); 
      }
    };

    if (permissionGranted) {
      fetchVideos();
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

  useEffect(() => {
      if (searchText && videoFiles) {
        getFilteredFiles();
      } else {
        setFilteredFiles(videoFiles); 
      }
    }, [searchText, videoFiles]);

  return (
    <ScrollView style={styles.content}>
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text, fontFamily: "Poppins_700Bold" },
          ]}
        >
          All Videos
        </Text>

        
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={[styles.loaderText, { color: theme.text }]}>
      Loading...
    </Text>
          </View>
        ) : (
          <View style={styles.videoList}>
            {filteredFiles.length > 0 ? (
            filteredFiles?.map((video) => (
              <VideoItem
                key={video.id}
                title={video.name}
                duration={video.duration}
                thumbnail={video.thumbnail}
                theme={theme}
                onPress={() => setVideoUri(video.uri)}
              />
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
  videoList: {
    marginHorizontal: -8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  loaderContainer: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 14,
    color: "#000", 
    fontFamily: "Poppins_500Medium",
  },
});

export default VideoScreen;
