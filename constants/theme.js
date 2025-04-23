export const getTheme = (isDarkMode) => ({
  background: isDarkMode ? ["#2C3E50", "#000000"] : ["#74ebd5", "#ACB6E5"],
  text: isDarkMode ? "#FFFFFF" : "#333333",
  accent: "#FF6B6B",
  card: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)",
  icon: isDarkMode ? "#BBBBBB" : "#666666",
})