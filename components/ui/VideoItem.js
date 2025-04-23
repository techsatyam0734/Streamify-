import React from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native"

const VideoItem = ({ title, duration, thumbnail, theme,onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.videoItem, { backgroundColor: theme.card }]}
      onPress={onPress}
    >
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: thumbnail || 'https://via.placeholder.com/150x84' }} 
          style={styles.thumbnail} 
        />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{duration}</Text>
        </View>
      </View>
      <Text 
        style={[styles.videoTitle, { color: theme.text, fontFamily: "Poppins_600SemiBold" }]} 
        numberOfLines={1}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  videoItem: {
    width: "43%",
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 10,
    
  },
  videoTitle: {
    fontSize: 14,
    padding: 8,
  },
})

export default VideoItem