import React from "react";
import { TouchableOpacity, View } from "react-native";
import Loader from "./loader";
import { ThemedText } from "./themed-text";

interface ButtonLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  onPress?: () => void;
}

export default function ButtonLoader({
  isLoading,
  children,
  loadingText = "Loading...",
  className = "",
  disabled = false,
  onPress,
}: ButtonLoaderProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading || disabled}
      className={`flex-row items-center justify-center gap-2 transition-all duration-200 ${
        isLoading || disabled ? "opacity-60" : ""
      } ${className}`}
    >
      {isLoading && (
        <View className="w-4 h-4">
          <Loader size="sm" text="" />
        </View>
      )}
      <ThemedText type="default" className={isLoading ? "opacity-80" : ""}>
        {isLoading ? loadingText : children}
      </ThemedText>
    </TouchableOpacity>
  );
}
