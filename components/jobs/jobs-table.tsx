import { useJobsStore } from "@/lib/stores/jobs-store";
import { Job, JobStatus } from "@/lib/types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ThemedView } from "../themed-view";
import StatusBadge from "./status-badge";

type JobsTableProps = {
  jobs?: Job[];
};

export default function JobsTable({ jobs: propJobs }: JobsTableProps = {}) {
  const { jobs: contextJobs, updateJob, deleteJob } = useJobsStore();
  const jobs = propJobs || contextJobs;
  if (!jobs) return null;

  // Calculate days remaining or overdue
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

  // Handle status change
  const handleStatusChange = async (id: string, newStatus: string) => {
    updateJob(id, { status: newStatus as JobStatus });
    // TODO: Implement API call to update job status
    // await updateJobStatus(id, newStatus as JobStatus);
  };

  // Calculate progress for timeline visualization
  const calculateProgress = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();

    if (now <= start) return 0;
    if (now >= end) return 100;

    return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
  };

  const handleDelete = async (id: string) => {
    deleteJob(id);
    // TODO: Implement API call to delete job
    // await deleteJob(id);
  };

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "Due":
        return "bg-red-500";
      case "Ongoing":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  if (jobs.length === 0) {
    return (
      <ThemedView className="bg-white/90 rounded-3xl shadow-sm border border-white/60 p-8 items-center">
        <View className="w-16 h-16 bg-neutral-100 rounded-3xl flex items-center justify-center mb-4">
          <MaterialIcons name="event" size={32} color="#9ca3af" />
        </View>
        <Text className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          No jobs found
        </Text>
        <Text className="text-neutral-500 dark:text-neutral-400 text-center">
          Create your first job to get started.
        </Text>
      </ThemedView>
    );
  }

  return (
    <ScrollView className="w-full">
      <View className="flex-col gap-4 p-2">
        {jobs.map((job) => (
          <ThemedView
            key={job.id}
            className="bg-white/90 dark:bg-neutral-800/90 rounded-3xl p-6 shadow-sm border border-soil-200/60 dark:border-neutral-700/60"
          >
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  {job.title}
                </Text>
                <Text className="text-sm text-neutral-600 dark:text-neutral-400">
                  {job.description}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <StatusBadge status={job.status} />
                <TouchableOpacity
                  onPress={() => handleDelete(job.id)}
                  className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center"
                >
                  <MaterialIcons name="delete" size={16} color="#dc2626" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="space-y-3 gap-4">
              {/* Timeline */}
              <View className="flex-row items-center gap-3 p-3 bg-neutral-100/80 dark:bg-neutral-700/50 rounded-2xl">
                <View className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <MaterialIcons name="event" size={16} color="#2563eb" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {new Date(job.startDate).toLocaleDateString()} -{" "}
                    {new Date(job.endDate).toLocaleDateString()}
                  </Text>
                  <Text className="text-xs text-neutral-600 dark:text-neutral-400">
                    {getDaysRemaining(job.endDate, job.status)}
                  </Text>
                  <View className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <View
                      className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(job.status)}`}
                      style={{
                        width: `${calculateProgress(job.startDate, job.endDate)}%`,
                      }}
                    />
                  </View>
                </View>
              </View>

              {/* Location Assigned To*/}
              <View className="flex-row items-center gap-3 p-3 bg-neutral-100/80 dark:bg-neutral-700/50 rounded-2xl">
                <View className="flex-row items-center justify-between flex-1">
                  <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <MaterialIcons name="place" size={16} color="#16a34a" />
                    </View>
                    <View>
                      <Text className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        Location
                      </Text>
                      <Text className="text-xs text-neutral-600 dark:text-neutral-400">
                        {job.location || "Not specified"}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                      <MaterialIcons name="person" size={16} color="#7c3aed" />
                    </View>
                    <View>
                      <Text className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        Assigned To
                      </Text>
                      <Text className="text-xs text-neutral-600 dark:text-neutral-400">
                        {job.assignedTo?.name || "Unassigned"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Status Change */}
              <View className="pt-2">
                <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Update Status
                </Text>
                <View className="flex-row gap-2">
                  {(["Ongoing", "Due", "Completed"] as JobStatus[]).map(
                    (status) => (
                      <TouchableOpacity
                        key={status}
                        onPress={() => handleStatusChange(job.id, status)}
                        className={`flex-1 px-4 py-3 rounded-2xl border ${
                          job.status === status
                            ? `${getStatusColor(status)} border-transparent`
                            : "bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
                        }`}
                      >
                        <Text
                          className={`text-sm text-center font-medium ${
                            job.status === status
                              ? "text-white"
                              : "text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          {status}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
            </View>
          </ThemedView>
        ))}
      </View>
    </ScrollView>
  );
}
