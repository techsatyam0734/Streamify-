import React from 'react';
import {
    View,
    Text,
    StyleSheet,                  
    Switch,
    TouchableOpacity,
  } from "react-native";
  import { Feather } from "@expo/vector-icons";
  
  function Footer() {

    return (
    
      <View style={[styles.bottomNav, { backgroundColor: theme.card }]}>
        {["video", "music", "folder", "list", "more-horizontal"].map((icon, index) => (
          <TouchableOpacity key={icon} style={styles.navItem}>
            <Feather name={icon} size={24} color={index === 2 ? theme.accent : theme.icon} />
          </TouchableOpacity>
        ))}
      </View>
      
    )
  }
  
  const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: "row",
        paddingVertical: 8,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },

  })
  export default Footer