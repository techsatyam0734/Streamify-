import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, BackHandler, TouchableOpacity, Text, PanResponder } from "react-native";
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';

export default function VideoPlayer({ videoUri, onExit }) {
  const player = useVideoPlayer(videoUri, player => {
    player.loop = true;
    player.play();
  });

  const videoRef = useRef(null);
  const [isLocked, setIsLocked] = useState(false);
  const [swipeDistance, setSwipeDistance] = useState(0);  

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.enterFullscreen();
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (videoRef.current) {
        videoRef.current.exitFullscreen();
        onExit(); 
        return true; 
      }
      return false;
    });

    return () => backHandler.remove();
  }, []);

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  const toggleLock = () => {
    setIsLocked((prev) => !prev);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (e, gestureState) => gestureState.dy > 5 || gestureState.dx > 5,
      onPanResponderMove: (e, gestureState) => {
        setSwipeDistance(gestureState.dy);
      },
      onPanResponderRelease: (e, gestureState) => {
        if (swipeDistance > 100) {  
          setIsLocked(false);
          setSwipeDistance(0); 
        }
      },
    })
  ).current;

  return (
    <View style={styles.contentContainer}>
      <VideoView
        ref={videoRef}
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture={!isLocked}
        useNativeControls={!isLocked}
        shouldPlay
        isLooping
        resizeMode="contain"
      />

      {isLocked && (
        <View style={styles.lockOverlay}>
          <TouchableOpacity onPress={toggleLock} style={styles.lockButton}>
            <Ionicons name="lock-closed" size={40} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {!isLocked && (
        <TouchableOpacity onPress={toggleLock} style={styles.unlockIcon}>
          <Ionicons name="lock-open" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      <View
        style={styles.swipeContainer}
        {...panResponder.panHandlers}
      >
        {swipeDistance > 0 && !isLocked && (
          <Text style={styles.swipeText}>Swipe up to unlock</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  lockButton: {
    position: 'absolute', 
    top: 10,  
    left: 10, 
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 50,
  },
  unlockIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
  swipeContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Times New Roman',
  },
});
