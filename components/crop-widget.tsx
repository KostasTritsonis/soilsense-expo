import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFieldsStore } from "@/lib/stores/fields-store";
import { Field } from "@/lib/types";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { ThemedView } from "./themed-view";

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderWidth?: number;
  }[];
}

export default function CropWidget() {
  const { fields } = useFieldsStore();
  const colorScheme = useColorScheme();
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [categoryPercentages, setCategoryPercentages] = useState<
    { category: string; color: string; percentage: number }[]
  >([]);

  const categoryColors: Record<string, string> = {
    Wheat: "#f4a261", // crop.wheat
    Tomato: "#e63946", // crop.tomato
    Olive: "#2a9d8f", // crop.olive
    Corn: "#ffd166", // crop.corn
    Rice: "#06d6a0", // crop.rice
    Soybean: "#118ab2", // crop.soybean
  };

  const categoryColorsRef = useRef(categoryColors);

  useEffect(() => {
    if (!fields || fields.length === 0) {
      setChartData(null);
      setCategoryPercentages([]);
      return;
    }

    const categoryCounts: Record<string, number> = {};
    fields.forEach((field: Field) => {
      if (field.categories && field.categories.length > 0) {
        field.categories.forEach((category) => {
          categoryCounts[category.type] =
            (categoryCounts[category.type] || 0) + 1;
        });
      }
    });

    const totalFields = fields.length;
    const colors = categoryColorsRef.current;

    const percentages = Object.keys(categoryCounts).map((category) => ({
      category,
      color: colors[category] || "#CCCCCC",
      percentage: Math.round((categoryCounts[category] / totalFields) * 100),
    }));

    setChartData({
      labels: Object.keys(categoryCounts),
      datasets: [
        {
          label: "Categories",
          data: Object.values(categoryCounts),
          backgroundColor: Object.keys(categoryCounts).map(
            (category) => colors[category] || "#CCCCCC"
          ),
          borderWidth: 2,
        },
      ],
    });

    setCategoryPercentages(percentages);
  }, [fields]);

  if (!chartData) {
    return (
      <ThemedView className="bg-white dark:bg-neutral-800 rounded-3xl shadow-md border border-soil-200/80 dark:border-neutral-700/80 p-6">
        <View className="flex-row items-center gap-3 pb-4">
          <View className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
            <MaterialIcons name="eco" size={20} color="#16a34a" />
          </View>
          <Text className="text-lg font-semibold text-soil-900 dark:text-neutral-100">
            Crop Distribution
          </Text>
        </View>
        <View className="flex-col items-center justify-center py-12">
          <Text className="text-soil-500 dark:text-neutral-400">
            No crop data available
          </Text>
        </View>
      </ThemedView>
    );
  }

  // Prepare data for PieChart
  const pieData = chartData.labels.map((label, index) => ({
    name: label,
    population: chartData.datasets[0].data[index],
    color: chartData.datasets[0].backgroundColor[index],
    legendFontColor: colorScheme === "dark" ? "#9CA3AF" : "#6B7280",
    legendFontSize: 12,
  }));

  return (
    <ThemedView className="bg-white dark:bg-neutral-800 rounded-3xl shadow-md border border-soil-200/80 dark:border-neutral-700/80 p-6 flex-1">
      <View className="flex-row items-center justify-between pb-4">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
            <MaterialIcons name="eco" size={20} color="#16a34a" />
          </View>
          <Text className="text-lg font-semibold text-soil-900 dark:text-neutral-100">
            Crop Distribution
          </Text>
        </View>
        <Text className="text-sm text-soil-500 dark:text-neutral-400 font-medium">
          2025
        </Text>
      </View>

      <View className="flex-1 flex-col items-center justify-between">
        <View className="flex-1 justify-center items-center">
          <View className="w-full h-full">
            <PieChart
              data={pieData}
              width={300}
              height={190}
              chartConfig={{
                backgroundColor: colorScheme === "dark" ? "#1F2937" : "#FFFFFF",
                backgroundGradientFrom:
                  colorScheme === "dark" ? "#1F2937" : "#FFFFFF",
                backgroundGradientTo:
                  colorScheme === "dark" ? "#1F2937" : "#FFFFFF",
                color: (opacity = 1) =>
                  colorScheme === "dark"
                    ? `rgba(255, 255, 255, ${opacity})`
                    : `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="25"
              center={[0, 0]}
              absolute
            />
          </View>
        </View>

        <View className="w-full mt-4">
          <View className="flex-col gap-2">
            {categoryPercentages.map((item, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between p-3 bg-soil-50/80 dark:bg-neutral-700/50 rounded-xl"
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <View
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <Text className="text-sm text-soil-700 dark:text-neutral-300 font-medium flex-1">
                    {item.category}
                  </Text>
                </View>
                <Text className="text-sm text-soil-900 dark:text-neutral-100 font-semibold ml-2">
                  {item.percentage}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ThemedView>
  );
}
