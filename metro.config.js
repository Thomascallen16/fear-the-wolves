const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: "./global.css",
  // Keep the native-development workaround, but let Metro manage the CSS
  // module during Expo's static web-export smoke test.
  forceWriteFileSystem: process.env.EXPO_WEB_EXPORT !== "1",
});
