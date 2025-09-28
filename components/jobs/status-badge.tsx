import { JobStatus } from "@/lib/types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text } from "react-native";
import { ThemedView } from "../themed-view";

type StatusBadgeProps = {
  status: JobStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Function to get status badge color
  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 border-green-200";
      case "Due":
        return "bg-red-100 border-red-200";
      case "Ongoing":
        return "bg-blue-100 border-blue-200";
      default:
        return "bg-neutral-100 border-neutral-200";
    }
  };

  // Function to get status text color
  const getStatusTextColor = (status: JobStatus) => {
    switch (status) {
      case "Completed":
        return "text-green-800";
      case "Due":
        return "text-red-800";
      case "Ongoing":
        return "text-blue-800";
      default:
        return "text-neutral-800";
    }
  };

  // Function to get status icon
  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case "Completed":
        return "check-circle";
      case "Due":
        return "warning";
      case "Ongoing":
        return "schedule";
      default:
        return "help";
    }
  };

  // Function to get status icon color
  const getStatusIconColor = (status: JobStatus) => {
    switch (status) {
      case "Completed":
        return "#16a34a";
      case "Due":
        return "#dc2626";
      case "Ongoing":
        return "#2563eb";
      default:
        return "#6b7280";
    }
  };

  // Format status display text
  const formatStatus = (status: JobStatus) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <ThemedView
      className={`inline-flex flex-row items-center gap-1 px-2.5 py-1 rounded-full border ${getStatusColor(
        status
      )}`}
    >
      <MaterialIcons
        name={getStatusIcon(status)}
        size={12}
        color={getStatusIconColor(status)}
      />
      <Text className={`text-xs font-medium ${getStatusTextColor(status)}`}>
        {formatStatus(status)}
      </Text>
    </ThemedView>
  );
}
