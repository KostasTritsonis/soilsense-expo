import { useJobsStore } from "@/lib/stores/jobs-store";
import { Job, JobStatus } from "@/lib/types";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

type JobsCalendarProps = {
  jobs?: Job[];
};

export default function JobsCalendar({
  jobs: propJobs,
}: JobsCalendarProps = {}) {
  const { jobs: contextJobs } = useJobsStore();
  const jobs = propJobs || contextJobs;
  const [selectedDate, setSelectedDate] = useState<string>("");

  if (!jobs) return null;

  // Get status color for calendar marking
  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case "Completed":
        return "#16a34a"; // green-600
      case "Due":
        return "#dc2626"; // red-600
      case "Ongoing":
        return "#2563eb"; // blue-600
      default:
        return "#6b7280"; // gray-500
    }
  };

  // Create marked dates object for calendar
  const getMarkedDates = () => {
    const marked: any = {};

    jobs.forEach((job) => {
      const startDate = new Date(job.startDate);
      const endDate = new Date(job.endDate);
      const color = getStatusColor(job.status);

      // Generate all dates between start and end (inclusive)
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split("T")[0];
        const isStart = currentDate.getTime() === startDate.getTime();
        const isEnd = currentDate.getTime() === endDate.getTime();
        const isSingleDay = startDate.getTime() === endDate.getTime();

        marked[dateString] = {
          marked: true,
          dotColor: color,
          startingDay: isStart || isSingleDay,
          endingDay: isEnd || isSingleDay,
          color: color,
          textColor: "white",
        };

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    // Mark selected date
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: "#3b82f6",
      };
    }

    return marked;
  };

  // Get jobs for selected date
  const getJobsForDate = (date: string) => {
    return jobs.filter((job) => {
      const jobStart = new Date(job.startDate).toISOString().split("T")[0];
      const jobEnd = new Date(job.endDate).toISOString().split("T")[0];
      return date >= jobStart && date <= jobEnd;
    });
  };

  // Handle date selection
  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const selectedDateJobs = selectedDate ? getJobsForDate(selectedDate) : [];

  return (
    <ThemedView className="bg-white/90 rounded-3xl shadow-sm border border-white/60 p-6">
      <View className="flex-row items-center gap-3 mb-6">
        <View className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
          <MaterialIcons name="event" size={20} color="#2563eb" />
        </View>
        <ThemedText
          type="defaultSemiBold"
          className="text-xl font-semibold text-neutral-900"
        >
          Job Calendar
        </ThemedText>
      </View>

      {/* Calendar Component */}
      <Calendar
        onDayPress={onDayPress}
        markedDates={getMarkedDates()}
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#374151",
          selectedDayBackgroundColor: "#3b82f6",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#3b82f6",
          dayTextColor: "#374151",
          textDisabledColor: "#d1d5db",
          dotColor: "#3b82f6",
          selectedDotColor: "#ffffff",
          arrowColor: "#3b82f6",
          disabledArrowColor: "#d1d5db",
          monthTextColor: "#111827",
          indicatorColor: "#3b82f6",
          textDayFontWeight: "500",
          textMonthFontWeight: "600",
          textDayHeaderFontWeight: "600",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        style={{
          borderRadius: 16,
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      />

      {/* Selected Date Jobs */}
      {selectedDate && (
        <View className="mt-6">
          <ThemedText
            type="defaultSemiBold"
            className="text-lg font-semibold text-neutral-900 mb-4"
          >
            Jobs for {formatDate(selectedDate)}
          </ThemedText>

          {selectedDateJobs.length === 0 ? (
            <ThemedView className="bg-neutral-50/80 rounded-2xl p-4 items-center">
              <MaterialIcons name="event-busy" size={32} color="#9ca3af" />
              <ThemedText
                type="default"
                className="text-neutral-600 mt-2 text-center"
              >
                No jobs scheduled for this date
              </ThemedText>
            </ThemedView>
          ) : (
            <ScrollView className="max-h-64">
              {selectedDateJobs.map((job) => (
                <ThemedView
                  key={job.id}
                  className="bg-neutral-50/80 rounded-2xl p-4 mb-3"
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1">
                      <ThemedText
                        type="defaultSemiBold"
                        className="text-base font-semibold text-neutral-900"
                      >
                        {job.title}
                      </ThemedText>
                      <ThemedText
                        type="default"
                        className="text-sm text-neutral-600 mt-1"
                      >
                        {job.description}
                      </ThemedText>
                    </View>
                    <View
                      className="px-2 py-1 rounded-full"
                      style={{ backgroundColor: getStatusColor(job.status) }}
                    >
                      <ThemedText
                        type="default"
                        className="text-xs font-medium text-white"
                      >
                        {job.status}
                      </ThemedText>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-4 mt-2">
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons
                        name="schedule"
                        size={14}
                        color="#6b7280"
                      />
                      <ThemedText
                        type="default"
                        className="text-xs text-neutral-600"
                      >
                        {new Date(job.startDate).toLocaleDateString()} -{" "}
                        {new Date(job.endDate).toLocaleDateString()}
                      </ThemedText>
                    </View>
                  </View>

                  {job.location && (
                    <View className="flex-row items-center gap-1 mt-2">
                      <MaterialIcons name="place" size={14} color="#6b7280" />
                      <ThemedText
                        type="default"
                        className="text-xs text-neutral-600"
                      >
                        {job.location}
                      </ThemedText>
                    </View>
                  )}

                  {job.assignedTo && (
                    <View className="flex-row items-center gap-1 mt-2">
                      <MaterialIcons name="person" size={14} color="#6b7280" />
                      <ThemedText
                        type="default"
                        className="text-xs text-neutral-600"
                      >
                        {job.assignedTo.name}
                      </ThemedText>
                    </View>
                  )}
                </ThemedView>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Legend */}
      <View className="mt-6 pt-4 border-t border-neutral-200">
        <ThemedText
          type="default"
          className="text-sm font-medium text-neutral-700 mb-3"
        >
          Status Legend
        </ThemedText>
        <View className="flex-row flex-wrap gap-4">
          <View className="flex-row items-center gap-2">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getStatusColor("Ongoing") }}
            />
            <ThemedText type="default" className="text-xs text-neutral-600">
              Ongoing
            </ThemedText>
          </View>
          <View className="flex-row items-center gap-2">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getStatusColor("Due") }}
            />
            <ThemedText type="default" className="text-xs text-neutral-600">
              Due
            </ThemedText>
          </View>
          <View className="flex-row items-center gap-2">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getStatusColor("Completed") }}
            />
            <ThemedText type="default" className="text-xs text-neutral-600">
              Completed
            </ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}
