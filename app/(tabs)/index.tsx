import Card from "@/components/card";
import CropWidget from "@/components/crop-widget";
import Header from "@/components/header";
import JobsWidget from "@/components/jobs/jobs-widget";
import WeatherWidget from "@/components/weather/weather-widget";
import { useFieldsStore } from "@/lib/stores/fields-store";
import { useJobsStore } from "@/lib/stores/jobs-store";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  console.log("Dashboard: Component rendering");
  const { fields, isInitialized } = useFieldsStore();
  const { jobs } = useJobsStore();
  console.log("Dashboard: useFieldsStore result", {
    fields: fields.length,
    jobs: jobs?.length,
    isInitialized,
  });
  const [totalArea, setTotalArea] = useState<number>(0);

  useEffect(() => {
    setTotalArea(0);
    fields.forEach((field) => {
      setTotalArea((prev) => prev + field.area);
    });
  }, [fields]);

  const activeJobs =
    jobs?.filter((job) => job.status === "Ongoing").length || 0;
  const dueJobs = jobs?.filter((job) => job.status === "Due").length || 0;
  const completedJobs =
    jobs?.filter((job) => job.status === "Completed").length || 0;

  return (
    <SafeAreaView className="flex-1 bg-earth-50 dark:bg-neutral-900">
      <Header />
      <ScrollView
        className="flex-1 px-4 py-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between mb-6">
          <View className="w-[48%] mb-4">
            <Card
              title="Total Fields"
              value={`${fields.length}`}
              subtitle={`${totalArea.toFixed(2)} ha`}
              icon={
                <View className="w-10 h-10 bg-soil-200 dark:bg-soil-700 rounded-2xl flex items-center justify-center">
                  <MaterialIcons name="map" size={20} color="#8B5C2A" />
                </View>
              }
            />
          </View>
          <View className="w-[48%] mb-4">
            <Card
              title="Active Jobs"
              value={`${activeJobs}`}
              icon={
                <View className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                  <MaterialIcons name="work" size={20} color="#3b82f6" />
                </View>
              }
            />
          </View>
          <View className="w-[48%] mb-4">
            <Card
              title="Due Jobs"
              value={`${dueJobs}`}
              icon={
                <View className="w-10 h-10 bg-warning-100 dark:bg-warning-900/30 rounded-2xl flex items-center justify-center">
                  <MaterialIcons name="schedule" size={20} color="#f59e0b" />
                </View>
              }
            />
          </View>
          <View className="w-[48%] mb-4">
            <Card
              title="Completed"
              value={`${completedJobs}`}
              icon={
                <View className="w-10 h-10 bg-success-100 dark:bg-success-900/30 rounded-2xl flex items-center justify-center">
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color="#22c55e"
                  />
                </View>
              }
            />
          </View>
        </View>

        <View className="pb-6">
          <CropWidget />
        </View>

        <View className="pb-6">
          <JobsWidget />
        </View>

        <View className="pb-14">
          <WeatherWidget />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
