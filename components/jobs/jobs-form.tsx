import { useLoadingStore } from "@/lib/loading-store";
import { useJobsStore } from "@/lib/stores/jobs-store";
import { JobFormData } from "@/lib/types";
import React, { useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import ButtonLoader from "../button-loader";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

type JobFormProps = {
  onCancel: () => void;
};

export default function JobForm({ onCancel }: JobFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { users, addJob } = useJobsStore();
  const { setJobsLoading } = useLoadingStore();
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    status: "Ongoing",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    location: "",
    assignedToId: "",
  });

  if (!users) return null;

  const handleInputChange = (name: string, value: string) => {
    if (name === "startDate" || name === "endDate") {
      setFormData({ ...formData, [name]: new Date(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setJobsLoading(true);

    try {
      // Create new job object
      const newJob = {
        id: Date.now().toString(), // Simple ID generation
        title: formData.title,
        description: formData.description,
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location || null,
        assignedToId: formData.assignedToId || null,
        assignedTo: users.find((u) => u.id === formData.assignedToId) || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add to jobs list
      addJob(newJob);

      // Reset form and close
      setFormData({
        title: "",
        description: "",
        status: "Ongoing",
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        location: "",
        assignedToId: "",
      });
      onCancel();
    } catch (error) {
      console.error("Error creating job:", error);
    } finally {
      setIsSubmitting(false);
      setJobsLoading(false);
    }
  };

  return (
    <ThemedView className="bg-white/90 rounded-3xl shadow-sm border border-white/60 p-6 md:p-8">
      <ThemedText
        type="defaultSemiBold"
        className="text-xl md:text-2xl font-semibold text-neutral-900 mb-6"
      >
        Create New Job
      </ThemedText>

      <ScrollView className="space-y-6">
        {/* Basic Information */}
        <View className="space-y-4">
          <View>
            <ThemedText
              type="default"
              className="text-sm font-medium text-neutral-700 mb-2"
            >
              Job Title *
            </ThemedText>
            <TextInput
              value={formData.title}
              onChangeText={(value) => handleInputChange("title", value)}
              placeholder="Enter job title"
              className="w-full px-4 py-3 border border-neutral-300 rounded-2xl bg-white/80 text-neutral-900"
              style={{ borderWidth: 1, borderColor: "#d1d5db" }}
            />
          </View>

          <View>
            <ThemedText
              type="default"
              className="text-sm font-medium text-neutral-700 mb-2"
            >
              Description
            </ThemedText>
            <TextInput
              value={formData.description}
              onChangeText={(value) => handleInputChange("description", value)}
              placeholder="Enter job description"
              multiline
              numberOfLines={3}
              className="w-full px-4 py-3 border border-neutral-300 rounded-2xl bg-white/80 text-neutral-900"
              style={{
                borderWidth: 1,
                borderColor: "#d1d5db",
                textAlignVertical: "top",
              }}
            />
          </View>
        </View>

        {/* Location and Assignment */}
        <View className="space-y-4">
          <View>
            <ThemedText
              type="default"
              className="text-sm font-medium text-neutral-700 mb-2"
            >
              Location
            </ThemedText>
            <TextInput
              value={formData.location || ""}
              onChangeText={(value) => handleInputChange("location", value)}
              placeholder="Enter location"
              className="w-full px-4 py-3 border border-neutral-300 rounded-2xl bg-white/80 text-neutral-900"
              style={{ borderWidth: 1, borderColor: "#d1d5db" }}
            />
          </View>

          <View>
            <ThemedText
              type="default"
              className="text-sm font-medium text-neutral-700 mb-2"
            >
              Assigned To
            </ThemedText>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => handleInputChange("assignedToId", "")}
                className={`flex-1 px-4 py-3 rounded-2xl border ${
                  !formData.assignedToId
                    ? "bg-primary-600 border-transparent"
                    : "bg-white border-neutral-300"
                }`}
              >
                <ThemedText
                  type="default"
                  className={`text-sm text-center font-medium ${
                    !formData.assignedToId ? "text-white" : "text-neutral-700"
                  }`}
                >
                  Not Assigned
                </ThemedText>
              </TouchableOpacity>
              {users.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  onPress={() => handleInputChange("assignedToId", user.id)}
                  className={`flex-1 px-4 py-3 rounded-2xl border ${
                    formData.assignedToId === user.id
                      ? "bg-primary-600 border-transparent"
                      : "bg-white border-neutral-300"
                  }`}
                >
                  <ThemedText
                    type="default"
                    className={`text-sm text-center font-medium ${
                      formData.assignedToId === user.id
                        ? "text-white"
                        : "text-neutral-700"
                    }`}
                  >
                    {user.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Dates and Status */}
        <View className="space-y-4">
          <View>
            <ThemedText
              type="default"
              className="text-sm font-medium text-neutral-700 mb-2"
            >
              Start Date *
            </ThemedText>
            <TextInput
              value={formData.startDate.toISOString().split("T")[0]}
              onChangeText={(value) => handleInputChange("startDate", value)}
              placeholder="YYYY-MM-DD"
              className="w-full px-4 py-3 border border-neutral-300 rounded-2xl bg-white/80 text-neutral-900"
              style={{ borderWidth: 1, borderColor: "#d1d5db" }}
            />
          </View>

          <View>
            <ThemedText
              type="default"
              className="text-sm font-medium text-neutral-700 mb-2"
            >
              End Date *
            </ThemedText>
            <TextInput
              value={formData.endDate.toISOString().split("T")[0]}
              onChangeText={(value) => handleInputChange("endDate", value)}
              placeholder="YYYY-MM-DD"
              className="w-full px-4 py-3 border border-neutral-300 rounded-2xl bg-white/80 text-neutral-900"
              style={{ borderWidth: 1, borderColor: "#d1d5db" }}
            />
          </View>

          <View>
            <ThemedText
              type="default"
              className="text-sm font-medium text-neutral-700 mb-2"
            >
              Status
            </ThemedText>
            <View className="flex-row gap-2">
              {(["Ongoing", "Due", "Completed"] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => handleInputChange("status", status)}
                  className={`flex-1 px-4 py-3 rounded-2xl border ${
                    formData.status === status
                      ? "bg-primary-600 border-transparent"
                      : "bg-white border-neutral-300"
                  }`}
                >
                  <ThemedText
                    type="default"
                    className={`text-sm text-center font-medium ${
                      formData.status === status
                        ? "text-white"
                        : "text-neutral-700"
                    }`}
                  >
                    {status}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-end gap-3 pt-4">
          <TouchableOpacity
            onPress={onCancel}
            className="px-6 py-3 border border-neutral-300 rounded-2xl"
            disabled={isSubmitting}
          >
            <ThemedText type="default" className="text-neutral-700 font-medium">
              Cancel
            </ThemedText>
          </TouchableOpacity>
          <ButtonLoader
            isLoading={isSubmitting}
            loadingText="Creating..."
            onPress={handleSubmit}
            className="px-6 py-3 bg-primary-600 text-white rounded-2xl font-semibold"
          >
            Create Job
          </ButtonLoader>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
