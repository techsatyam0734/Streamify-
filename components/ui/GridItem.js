import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const GridItem = ({ icon, title, duration, theme, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.gridItem, { backgroundColor: theme.card }]} 
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color={theme.accent} />
        {duration && (
        <Text style={[styles.itemSubtitle, { color: theme.icon, fontFamily: "Poppins_400Regular",fontWeight: 'bold', fontSize: 18 }]}>
          {duration}
        </Text>
      )}
      </View>
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={[styles.itemTitle, { color: theme.text, fontFamily: "Poppins_600SemiBold" }]}
      >
        {title}
      </Text>

      
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  gridItem: {
    height: 125,
    width: "100%",
    padding: 6,
    borderRadius: 0,
    marginRight: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "start",
  },
  iconContainer: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 4
  },
  itemTitle: {
    fontSize: 11,
    textAlign: "center",
    marginTop: -3,
  },
  itemSubtitle: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 1,
  },
})

export default GridItem