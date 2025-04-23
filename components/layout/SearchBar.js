import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = ({ theme, searchText, setSearchtext }) => {
  return (
    <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
      <Ionicons name="search" size={20} color={theme.icon} />
      <TextInput
        placeholder="Search"
        placeholderTextColor={theme.icon}
        style={[styles.searchInput, { color: theme.text, fontFamily: "Poppins_400Regular" }]}
        value={searchText}
        onChangeText={setSearchtext}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
});

export default SearchBar;
