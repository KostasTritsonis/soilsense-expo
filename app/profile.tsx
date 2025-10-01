import { useUser } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, isLoaded } = useUser();
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const dismissModal = React.useCallback(() => {
    router.dismiss();
  }, []);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
        // Fade out as user drags down
        opacity.value = Math.max(0.3, 1 - event.translationY / 300);
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        // Smooth dismiss animation
        translateY.value = withSpring(
          1000,
          {
            damping: 20,
            stiffness: 100,
          },
          (finished) => {
            "worklet";
            if (finished) {
              dismissModal();
            }
          }
        );
        opacity.value = withSpring(0, {
          damping: 20,
          stiffness: 100,
        });
      } else {
        // Smooth return to original position
        translateY.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        });
        opacity.value = withSpring(1, {
          damping: 15,
          stiffness: 150,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
        <View className="flex-1 justify-center items-center">
          <Text className="text-neutral-600 dark:text-neutral-400">
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
        <View className="flex-1 justify-center items-center">
          <Text className="text-neutral-600 dark:text-neutral-400">
            Not signed in
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/sign-in")}
            className="mt-4 bg-soil-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedStyle]} className="flex-1">
        <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
            <TouchableOpacity
              onPress={() => {
                // Smooth dismiss animation for close button
                translateY.value = withSpring(
                  1000,
                  {
                    damping: 20,
                    stiffness: 100,
                  },
                  (finished) => {
                    "worklet";
                    if (finished) {
                      dismissModal();
                    }
                  }
                );
                opacity.value = withSpring(0, {
                  damping: 20,
                  stiffness: 100,
                });
              }}
              className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center"
            >
              <MaterialIcons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-neutral-900 dark:text-white">
              Profile
            </Text>
            <View className="w-10" />
          </View>

          <ScrollView className="flex-1 px-4 py-6">
            {/* Profile Image and Basic Info */}
            <View className="items-center mb-8">
              <View className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-lg">
                {user.imageUrl ? (
                  <Image
                    source={{ uri: user.imageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-full bg-soil-600 flex items-center justify-center">
                    <MaterialIcons name="person" size={40} color="white" />
                  </View>
                )}
              </View>

              <Text className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                {user.fullName || user.firstName || "User"}
              </Text>

              <Text className="text-neutral-600 dark:text-neutral-400 mb-4">
                {user.emailAddresses[0]?.emailAddress}
              </Text>
            </View>

            {/* Profile Information */}
            <View className="space-y-4 gap-3">
              <View className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4">
                <Text className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Account Information
                </Text>

                <View className="space-y-3">
                  <View>
                    <Text className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                      First Name
                    </Text>
                    <Text className="text-base text-neutral-900 dark:text-white">
                      {user.firstName || "Not provided"}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                      Last Name
                    </Text>
                    <Text className="text-base text-neutral-900 dark:text-white">
                      {user.lastName || "Not provided"}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                      Email Address
                    </Text>
                    <Text className="text-base text-neutral-900 dark:text-white">
                      {user.emailAddresses[0]?.emailAddress || "Not provided"}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                      User ID
                    </Text>
                    <Text className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                      {user.id}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Account Actions */}
              <View className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 gap-3">
                <Text className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Account Actions
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Edit Profile",
                      "Profile editing will be available soon. You can update your profile through your OAuth provider (Google/GitHub)."
                    );
                  }}
                  className="flex-row items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700"
                >
                  <View className="flex-row items-center">
                    <MaterialIcons name="edit" size={20} color="#6b7280" />
                    <Text className="text-base text-neutral-900 dark:text-white ml-3">
                      Edit Profile
                    </Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Change Password",
                      "Password changes are managed through your OAuth provider (Google/GitHub)."
                    );
                  }}
                  className="flex-row items-center justify-between py-3"
                >
                  <View className="flex-row items-center">
                    <MaterialIcons name="lock" size={20} color="#6b7280" />
                    <Text className="text-base text-neutral-900 dark:text-white ml-3">
                      Change Password
                    </Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </GestureDetector>
  );
}
