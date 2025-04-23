import React from "react"
import { View, Text, TouchableOpacity, Switch, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const Header = ({ theme, toggleMenu, isDarkMode, setIsDarkMode }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleMenu}>
        <Ionicons name="" size={24} color={theme.text} />
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Ionicons name="play-circle" size={32} color={theme.accent} />
        <Text style={[styles.headerTitle, { color: theme.text, fontFamily: "Poppins_700Bold" }]}>Streamify</Text>
      </View>
      <Switch
        value={isDarkMode}
        onValueChange={setIsDarkMode}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    marginLeft: 8,
  },
})

export default Header