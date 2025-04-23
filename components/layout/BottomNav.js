import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const BottomNav = ({ theme, activeTab, setActiveTab }) => {
  const bottomNavItems = [
    { icon: "videocam-outline", label: "Video", id: "video" },
    { icon: "folder-outline", label: "Files", id: "files" },
    { icon: "musical-note-outline", label: "Audio", id: "music" },
    
  ]

  return (
    <View style={styles.bottomNavContainer}>
      <View style={[styles.bottomNav, { backgroundColor: theme.card }]}> 
        {bottomNavItems.map(({ icon, label, id }) => (
          <TouchableOpacity 
            key={id} 
            style={styles.navItem}
            onPress={() => setActiveTab(id)}
          >
            <Ionicons 
              name={icon} 
              size={24} 
              color={activeTab === id ? theme.accent : theme.icon} 
            />
            <Text 
              style={{ 
                fontSize: 12, 
                color: activeTab === id ? theme.accent : theme.icon, 
                fontFamily: "Poppins_400Regular" 
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  bottomNav: {
    flexDirection: "row",
    paddingVertical: 8,
    borderRadius: 0,
    marginBottom: 0,
    width: "100%",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    padding: 8,
  },
})

export default BottomNav