import { useSSO, useSignUp } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startSSOFlow: startGoogleSSOFlow } = useSSO();
  const { startSSOFlow: startGithubSSOFlow } = useSSO();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.errors?.[0]?.message || "Failed to create account"
      );
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.errors?.[0]?.message || "Failed to verify email"
      );
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleSSOFlow({
        strategy: "oauth_google",
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.errors?.[0]?.message || "Failed to sign up with Google"
      );
    }
  };

  const handleGithubSignUp = async () => {
    try {
      const { createdSessionId, setActive } = await startGithubSSOFlow({
        strategy: "oauth_github",
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.errors?.[0]?.message || "Failed to sign up with GitHub"
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
      <View className="flex-1 justify-center px-6">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-2">
            Create Account
          </Text>
          <Text className="text-neutral-600 dark:text-neutral-400 text-center">
            Join SoilSense to manage your fields
          </Text>
        </View>

        {!pendingVerification ? (
          <View className="space-y-4">
            {/* OAuth Buttons */}
            <View className="space-y-3">
              <TouchableOpacity
                onPress={handleGoogleSignUp}
                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 py-3 rounded-lg flex-row items-center justify-center"
              >
                <MaterialIcons name="login" size={20} color="#4285F4" />
                <Text className="text-neutral-900 dark:text-white font-semibold ml-2">
                  Continue with Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleGithubSignUp}
                className="bg-neutral-900 dark:bg-white border border-neutral-200 dark:border-neutral-600 py-3 rounded-lg flex-row items-center justify-center"
              >
                <MaterialIcons name="code" size={20} color="white" />
                <Text className="text-white dark:text-neutral-900 font-semibold ml-2">
                  Continue with GitHub
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-neutral-200 dark:bg-neutral-600" />
              <Text className="mx-4 text-neutral-500 dark:text-neutral-400 text-sm">
                or
              </Text>
              <View className="flex-1 h-px bg-neutral-200 dark:bg-neutral-600" />
            </View>

            {/* Email/Password Form */}
            <View>
              <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                First Name
              </Text>
              <TextInput
                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-lg px-4 py-3 text-neutral-900 dark:text-white"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Last Name
              </Text>
              <TextInput
                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-lg px-4 py-3 text-neutral-900 dark:text-white"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email
              </Text>
              <TextInput
                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-lg px-4 py-3 text-neutral-900 dark:text-white"
                value={emailAddress}
                onChangeText={setEmailAddress}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Password
              </Text>
              <TextInput
                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-lg px-4 py-3 text-neutral-900 dark:text-white"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              onPress={onSignUpPress}
              className="bg-soil-600 py-3 rounded-lg mt-6"
            >
              <Text className="text-white text-center font-semibold">
                Create Account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace("/sign-in")}
              className="py-3"
            >
              <Text className="text-soil-600 text-center">
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-4">
            <Text className="text-lg font-semibold text-neutral-900 dark:text-white text-center mb-4">
              Verify your email
            </Text>
            <Text className="text-neutral-600 dark:text-neutral-400 text-center mb-6">
              We sent a verification code to {emailAddress}
            </Text>

            <View>
              <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Verification Code
              </Text>
              <TextInput
                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-lg px-4 py-3 text-neutral-900 dark:text-white text-center text-lg"
                value={code}
                onChangeText={setCode}
                placeholder="Enter verification code"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
              />
            </View>

            <TouchableOpacity
              onPress={onPressVerify}
              className="bg-soil-600 py-3 rounded-lg mt-6"
            >
              <Text className="text-white text-center font-semibold">
                Verify Email
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
