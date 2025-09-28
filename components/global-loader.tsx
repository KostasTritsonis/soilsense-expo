import { useLoadingStore } from "@/lib/loading-store";
import React, { useEffect } from "react";
import { Modal, View } from "react-native";
import { FullScreenLoader } from "./loader";

export default function GlobalLoader() {
  const {
    isAppLoading,
    isUserLoading,
    isFieldsLoading,
    isJobsLoading,
    isWeatherLoading,
    isMapLoading,
    loadingMessage,
    resetAllLoading,
  } = useLoadingStore();

  // Reset loading states on component unmount
  useEffect(() => {
    return () => {
      resetAllLoading();
    };
  }, [resetAllLoading]);

  // Show full screen loader for app initialization
  if (isAppLoading) {
    return (
      <Modal visible={true} transparent={true} animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/20">
          <View className="bg-white/95 rounded-3xl shadow-lg border border-white/60 p-8 flex-col items-center">
            <FullScreenLoader text={loadingMessage} />
          </View>
        </View>
      </Modal>
    );
  }

  // Show overlay loader for other loading states
  const isAnyLoading =
    isUserLoading ||
    isFieldsLoading ||
    isJobsLoading ||
    isWeatherLoading ||
    isMapLoading;

  if (isAnyLoading) {
    return (
      <Modal visible={true} transparent={true} animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/20">
          <View className="bg-white/95 rounded-3xl shadow-lg border border-white/60 p-8 flex-col items-center">
            <FullScreenLoader text={loadingMessage} />
          </View>
        </View>
      </Modal>
    );
  }

  return null;
}
