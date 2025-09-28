import JobsCalendar from "@/components/jobs/jobs-calendar";
import JobForm from "@/components/jobs/jobs-form";
import JobsTable from "@/components/jobs/jobs-table";
import { useJobsStore } from "@/lib/stores/jobs-store";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JobsScreen() {
  const { jobs } = useJobsStore();
  const [showJobForm, setShowJobForm] = useState(false);
  const [filter, setFilter] = useState<"All" | "Ongoing" | "Due" | "Completed">(
    "All"
  );

  // Filter jobs based on selected filter
  const filteredJobs =
    jobs?.filter((job) => filter === "All" || job.status === filter) || [];

  const StatusFilter = ({
    status,
    count,
    isActive,
    onPress,
  }: {
    status: string;
    count: number;
    isActive: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      className={`px-4 py-2 rounded-lg mr-2 ${
        isActive ? "bg-primary-500" : "bg-soil-200"
      }`}
      onPress={onPress}
    >
      <Text
        className={`text-sm font-medium ${
          isActive ? "text-white" : "text-soil-700"
        }`}
      >
        {status} ({count})
      </Text>
    </TouchableOpacity>
  );

  const OngoingCount =
    jobs?.filter((job) => job.status === "Ongoing").length || 0;
  const dueCount = jobs?.filter((job) => job.status === "Due").length || 0;
  const completedCount =
    jobs?.filter((job) => job.status === "Completed").length || 0;

  return (
    <SafeAreaView className="flex-1 bg-earth-50 dark:bg-neutral-900">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="py-6 items-center">
          <Text className="text-3xl font-bold text-soil-900 dark:text-neutral-100 mb-2">
            Job Management
          </Text>
          <Text className="text-base text-soil-600 dark:text-neutral-400 text-center">
            Manage your agricultural tasks and schedules
          </Text>
        </View>

        {/* Add Job Button */}
        <TouchableOpacity
          className="bg-primary-500 py-3 px-6 rounded-xl mb-6 items-center"
          onPress={() => setShowJobForm(!showJobForm)}
        >
          <Text className="text-white text-base font-semibold">
            + Add New Job
          </Text>
        </TouchableOpacity>

        {/* Job Form */}
        {showJobForm && (
          <View className="mb-6">
            <JobForm onCancel={() => setShowJobForm(false)} />
          </View>
        )}

        {/* Status Filters */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-soil-900 mb-3">
            Filter by Status
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <StatusFilter
              status="All"
              count={jobs?.length || 0}
              isActive={filter === "All"}
              onPress={() => setFilter("All")}
            />
            <StatusFilter
              status="Ongoing"
              count={OngoingCount}
              isActive={filter === "Ongoing"}
              onPress={() => setFilter("Ongoing")}
            />
            <StatusFilter
              status="Due"
              count={dueCount}
              isActive={filter === "Due"}
              onPress={() => setFilter("Due")}
            />
            <StatusFilter
              status="Completed"
              count={completedCount}
              isActive={filter === "Completed"}
              onPress={() => setFilter("Completed")}
            />
          </ScrollView>
        </View>

        {/* Jobs List */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-soil-900 mb-4">
            {filter === "All" ? "All Jobs" : `${filter} Jobs`} (
            {filteredJobs.length})
          </Text>
          <JobsTable jobs={filteredJobs} />
        </View>

        {/* Calendar */}
        <View className="mb-6">
          <JobsCalendar jobs={filteredJobs} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
