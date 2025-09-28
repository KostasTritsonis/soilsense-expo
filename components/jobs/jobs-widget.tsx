import { useJobsStore } from "@/lib/stores/jobs-store";
import { JobStatus } from "@/lib/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

export default function JobsWidget() {
  const { jobs } = useJobsStore();
  const router = useRouter();
  const sortedJobs = jobs?.filter((job) => job.status === "Due");

  const getDaysRemaining = (endDate: Date, status: JobStatus) => {
    const today = new Date();
    const diffTime = new Date(endDate).getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      if (status === "Completed") return "Completed";
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return "Due today";
    } else {
      return `${diffDays} days remaining`;
    }
  };

  return (
    <ThemedView className="bg-white dark:bg-neutral-800 rounded-3xl shadow-md border border-soil-200/80 dark:border-neutral-700/80 p-4 md:p-6">
      <View className="flex-row items-center justify-between pb-4">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
            <MaterialIcons name="schedule" size={20} color="#ea580c" />
          </View>
          <ThemedText
            type="defaultSemiBold"
            className="text-lg font-semibold text-neutral-900"
          >
            Due Jobs
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={() => {
            try {
              router.push("/jobs");
            } catch {
              console.log("Navigation not available yet");
            }
          }}
          className="flex-row items-center gap-1"
        >
          <ThemedText
            type="default"
            className="text-sm text-primary-600 font-medium"
          >
            View all
          </ThemedText>
          <MaterialIcons name="arrow-forward" size={16} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <View className="space-y-3">
        {sortedJobs?.map((job) => (
          <View
            key={job.id}
            className="p-4 bg-neutral-50/80 rounded-2xl border border-neutral-100"
          >
            <View className="space-y-3">
              {/* Job Title and Status */}
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 min-w-0">
                  <ThemedText
                    type="defaultSemiBold"
                    className="text-sm font-semibold text-neutral-900 truncate"
                  >
                    {job.title}
                  </ThemedText>
                </View>
                <View className="text-right flex-shrink-0">
                  <ThemedText
                    type="default"
                    className="text-xs font-medium text-orange-600"
                  >
                    {getDaysRemaining(job.endDate, job.status)}
                  </ThemedText>
                </View>
              </View>

              {/* Job Details */}
              <View className="space-y-2">
                {/* Location */}
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="place" size={12} color="#6b7280" />
                  <ThemedText
                    type="default"
                    className="text-xs text-neutral-600 truncate"
                  >
                    {job.location || "No location specified"}
                  </ThemedText>
                </View>

                {/* Assigned To */}
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="person" size={12} color="#6b7280" />
                  <ThemedText
                    type="default"
                    className="text-xs text-neutral-600 truncate"
                  >
                    {job.assignedTo?.name || "Unassigned"}
                  </ThemedText>
                </View>

                {/* Description */}
                {job.description && (
                  <ThemedText
                    type="default"
                    className="text-xs text-neutral-500"
                    numberOfLines={2}
                  >
                    {job.description}
                  </ThemedText>
                )}
              </View>

              {/* Timeline */}
              <View className="pt-2 border-t border-neutral-200">
                <View className="flex-row items-center justify-between">
                  <ThemedText
                    type="default"
                    className="text-xs text-neutral-500"
                  >
                    {new Date(job.startDate).toLocaleDateString()} -{" "}
                    {new Date(job.endDate).toLocaleDateString()}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        ))}

        {sortedJobs?.length === 0 && (
          <View className="py-8 items-center">
            <View className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-3">
              <MaterialIcons name="schedule" size={24} color="#16a34a" />
            </View>
            <ThemedText
              type="defaultSemiBold"
              className="text-sm text-neutral-500 font-medium"
            >
              No jobs due
            </ThemedText>
            <ThemedText type="default" className="text-xs text-neutral-400">
              All caught up!
            </ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  );
}
