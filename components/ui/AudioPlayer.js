import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import MusicInfo from "expo-music-info-2";

export default function AudioPlayer({ audioUri, onExit }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [metadata, setMetadata] = useState({
    title: "Unknown Title",
    artist: "Unknown Artist",
    album: "Unknown Album",
  });

  const isSeeking = useRef(false);

  useEffect(() => {
    loadAudio();
    fetchMusicInfo();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioUri]);

  useEffect(() => {
    const backAction = () => {
      stopAndUnloadAudio();
      if (onExit) {
        onExit(); 
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [sound]);

  const loadAudio = async () => {
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      {
        shouldPlay: true,
        isLooping: false,
        progressUpdateIntervalMillis: 500,
      },
      onPlaybackStatusUpdate
    );

    setSound(newSound);
  };

  const fetchMusicInfo = async () => {
    try {
      const info = await MusicInfo.getMusicInfoAsync(audioUri, {
        title: true,
        artist: true,
        album: true,
        genre: true,
      });
      if(info) {
        setMetadata({
          title: info?.title || "Unknown Title",
          artist: info?.artist || "Unknown Artist",
          album: info?.album || "Unknown Album",
        });
      }
    } catch (error) {
      console.error("Error fetching music info:", error);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      if (!isSeeking.current) {
        setPosition(status.positionMillis);
      }
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      setIsBuffering(status.isBuffering);
    } else if (status.error) {
      console.log(`FATAL PLAYER ERROR: ${status.error}`);
    }
  };

  const handlePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const handleStop = async () => {
    if (sound) {
      await sound.stopAsync();
      setPosition(0);
    }
  };

  const handleForward = async () => {
    if (sound) {
      let newPosition = position + 10000;
      if (newPosition > duration) newPosition = duration;
      await sound.setPositionAsync(newPosition);
    }
  };

  const handleRewind = async () => {
    if (sound) {
      let newPosition = position - 10000; 
      if (newPosition < 0) newPosition = 0;
      await sound.setPositionAsync(newPosition);
    }
  };

  const handleSliderChangeStart = () => {
    isSeeking.current = true;
  };

  const handleSliderChangeComplete = async (value) => {
    isSeeking.current = false;
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const stopAndUnloadAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  return (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>{metadata.title}</Text>
      <Text style={styles.artist}>{metadata.artist}</Text>

      <Slider
        style={styles.slider}
        value={position}
        minimumValue={0}
        maximumValue={duration}
        onSlidingStart={handleSliderChangeStart}
        onSlidingComplete={handleSliderChangeComplete}
        minimumTrackTintColor="#1EB1FC"
        maximumTrackTintColor="#8E8E93"
        thumbTintColor="#1EB1FC"
        
      />
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={handleRewind}>
          <Ionicons name="play-back" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleStop}>
          <Ionicons name="stop" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePlayPause}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForward}>
          <Ionicons name="play-forward" size={32} color="white" />
        </TouchableOpacity>
      </View>
      {isBuffering && (
        <View style={styles.bufferingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.bufferingText}>Buffering...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  title: {
    color: "white",
    fontSize: 24,
    marginBottom: 5,
  },
  artist: {
    color: "gray",
    fontSize: 18,
    marginBottom: 20,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  timeText: {
    color: "white",
    fontSize: 16,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 20,
  },
  bufferingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  bufferingText: {
    color: "white",
    marginLeft: 10,
  },
});
