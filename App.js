import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import VideoScreen from "./screens/VideoScreen";
import MusicScreen from "./screens/MusicScreen";
import FilesScreen from "./screens/FilesScreen";

import Header from "./components/layout/Header";
import SearchBar from "./components/layout/SearchBar";
import BottomNav from "./components/layout/BottomNav";

import VideoPlayer from "./components/ui/VideoPlayer";
import AudioPlayer from "./components/ui/AudioPlayer"; 

import { getTheme } from "./constants/theme";

const { width } = Dimensions.get("window");
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function App() {
  const [videoUri, setVideoUri] = useState(null);
  const [audioUri, setAudioUri] = useState(null); 
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("files");
  const [modalVisible, setModalVisible] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const menuAnimation = useRef(new Animated.Value(-width)).current;
  const [searchText, setSearchtext] = useState(null);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const theme = getTheme(isDarkMode);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    Animated.spring(menuAnimation, {
      toValue: menuOpen ? -width : 0,
      useNativeDriver: true,
    }).start();
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "video":
        return (
          <VideoScreen
            theme={theme}
            searchText ={searchText}
            setVideoUri={setVideoUri}
          />
        );
      case "music":
        return (
          <MusicScreen
            theme={theme}
            searchText={searchText}
            setAudioUri={setAudioUri}
          />
        ); 
      case "files":
        return <FilesScreen 
        theme={theme} 
        searchText={searchText}
        setAudioUri={setAudioUri}
        setVideoUri={setVideoUri}
        />;
      
      default:
        return <FilesScreen theme={theme} searchText={searchText}/>;
    }
  };

  const handleFabPress = () => {
    setModalVisible(true);
  };

  const handlePlayVideo = () => {
    setVideoUri(inputUrl);
    setModalVisible(false);
    setInputUrl("");

  };

  const handleExitVideoPlayer = () => {
    setVideoUri(null);
  };
  
  
  return (
    <>
      {videoUri ? (
        <VideoPlayer videoUri={videoUri} onExit={handleExitVideoPlayer}/>
      ) : audioUri ? (
        <AudioPlayer audioUri={audioUri} onExit={() => setAudioUri(null)} />
      ) : (
        <AnimatedLinearGradient colors={theme.background} style={styles.container}>
          <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
          <SafeAreaView>
            <Header
              theme={theme}
              toggleMenu={toggleMenu}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          </SafeAreaView>
          <SearchBar theme={theme} searchText={searchText} setSearchtext={setSearchtext} />
          {renderActiveScreen()}
          <BottomNav
            theme={theme}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <TouchableOpacity
            style={[styles.fab, { backgroundColor: theme.accent }]}
            onPress={handleFabPress}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter video URL"
                  placeholderTextColor="#999"
                  value={inputUrl}
                  onChangeText={setInputUrl}
                />
                <Button title="Play Video"  onPress={handlePlayVideo} />
              </View>
            </View>
          </Modal>

          
        </AnimatedLinearGradient>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    height: 40,
   
  },
});