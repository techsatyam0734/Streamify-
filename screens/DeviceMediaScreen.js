import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { 
  scanDeviceMedia, 
  getDeviceMedia, 
  importDeviceMedia 
} from "../services/deviceMediaService";


import VideoItem from "../components/ui/VideoItem";
import AudioItem from "../components/ui/AudioItem";

const DeviceMediaScreen = ({ theme, navigation }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  
  const loadMedia = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDeviceMedia();
      setMedia(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load device media");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const handleScan = async () => {
    try {
      setScanning(true);
      const result = await scanDeviceMedia();
      Alert.alert(
        "Scan Complete",
        `Found ${result.added} new files, updated ${result.updated} files, and ${result.removed} files are no longer available.`
      );
      
      await loadMedia();
    } catch (err) {
      setError(err.message || "Failed to scan device media");
      Alert.alert("Error", "Failed to scan device media. Please check permissions.");
    } finally {
      setScanning(false);
    }
  };

  const handleImport = async (item) => {
    try {
      Alert.alert(
        "Import Media",
        `Do you want to import "${item.name}" to your library?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Import",
            onPress: async () => {
              setLoading(true);
              await importDeviceMedia(item._id, item.uri);
              Alert.alert("Success", "Media imported successfully");
              setLoading(false);
            }
          }
        ]
      );
    } catch (err) {
      setError(err.message || "Failed to import media");
      Alert.alert("Error", "Failed to import media");
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMedia();
    setRefreshing(false);
  }, [loadMedia]);

  const videos = media.filter(item => item.type === 'video' && item.isIndexed);
  const audios = media.filter(item => item.type === 'audio' && item.isIndexed);
  const images = media.filter(item => item.type === 'image' && item.isIndexed);
  const others = media.filter(item => !['video', 'audio', 'image'].includes(item.type) && item.isIndexed);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.headerTitle, { color: theme.text, fontFamily: "Poppins_700Bold" }]}>
          Device Media
        </Text>
        <TouchableOpacity 
          style={[styles.scanButton, { backgroundColor: theme.accent }]}
          onPress={handleScan}
          disabled={scanning}
        >
          {scanning ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="scan-outline" size={16} color="#fff" />
              <Text style={styles.scanButtonText}>Scan</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={{ color: theme.text }}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: theme.accent }]}
            onPress={loadMedia}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.accent]}
              tintColor={theme.accent}
            />
          }
        >
          
          {videos.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: "Poppins_700Bold" }]}>
                Videos ({videos.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {videos.map(video => (
                  <TouchableOpacity key={video._id} onPress={() => handleImport(video)}>
                    <VideoItem 
                      title={video.name} 
                      duration={video.duration} 
                      thumbnail={video.uri} 
                      theme={theme}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {audios.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: "Poppins_700Bold" }]}>
                Music ({audios.length})
              </Text>
              <View style={styles.audioList}>
                {audios.slice(0, 5).map(audio => (
                  <TouchableOpacity key={audio._id} onPress={() => handleImport(audio)}>
                    <AudioItem 
                      title={audio.name} 
                      artist={audio.metadata?.artist || "Unknown"} 
                      duration={audio.duration} 
                      cover={audio.uri}
                      theme={theme}
                    />
                  </TouchableOpacity>
                ))}
                {audios.length > 5 && (
                  <TouchableOpacity 
                    style={[styles.viewMoreButton, { backgroundColor: theme.cardBackground }]}
                    onPress={() => navigation.navigate("MusicScreen")}
                  >
                    <Text style={{ color: theme.text }}>View all {audios.length} audio files</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {images.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: "Poppins_700Bold" }]}>
                Images ({images.length})
              </Text>
              <TouchableOpacity 
                style={[styles.viewMoreButton, { backgroundColor: theme.cardBackground }]}
                onPress={() => navigation.navigate("FilesScreen")}
              >
                <Text style={{ color: theme.text }}>View all {images.length} images</Text>
              </TouchableOpacity>
            </View>
          )}

          {others.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: "Poppins_700Bold" }]}>
                Other Files ({others.length})
              </Text>
              <TouchableOpacity 
                style={[styles.viewMoreButton, { backgroundColor: theme.cardBackground }]}
                onPress={() => navigation.navigate("FilesScreen")}
              >
                <Text style={{ color: theme.text }}>View all {others.length} files</Text>
              </TouchableOpacity>
            </View>
          )}

          {media.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={64} color={theme.textSecondary} />
              <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                No media found on your device
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: theme.textSecondary }]}>
                Tap the Scan button to search for media files
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 18,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scanButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  horizontalScroll: {
    marginHorizontal: -8,
  },
  audioList: {
    marginHorizontal: -8,
  },
  viewMoreButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default DeviceMediaScreen;