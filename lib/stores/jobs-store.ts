import { Job, User } from "@/lib/types";
import { create } from "zustand";

interface JobsState {
  // State
  jobs: Job[] | undefined;
  users: User[] | undefined;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  setJobs: (jobs: Job[] | undefined) => void;
  setUsers: (users: User[] | undefined) => void;
  setIsLoading: (loading: boolean) => void;
  setIsInitialized: (initialized: boolean) => void;

  // Job actions
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;

  // Initialize with mock data
  initializeData: () => Promise<void>;
}

export const useJobsStore = create<JobsState>((set, get) => ({
  // Initial state
  jobs: undefined,
  users: undefined,
  isLoading: true,
  isInitialized: false,

  // Basic setters
  setJobs: (jobs) => set({ jobs }),
  setUsers: (users) => set({ users }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsInitialized: (isInitialized) => set({ isInitialized }),

  // Job actions
  addJob: (job) => {
    const { jobs } = get();
    set({ jobs: [...(jobs || []), job] });
  },

  updateJob: (id, updates) => {
    const { jobs } = get();
    if (!jobs) return;

    const updatedJobs = jobs.map((job) =>
      job.id === id ? { ...job, ...updates } : job
    );
    set({ jobs: updatedJobs });
  },

  deleteJob: (id) => {
    const { jobs } = get();
    if (!jobs) return;

    const filteredJobs = jobs.filter((job) => job.id !== id);
    set({ jobs: filteredJobs });
  },

  // Initialize with mock data
  initializeData: async () => {
    set({ isLoading: true });

    try {
      // Mock data - replace with actual API calls
      const mockJobs: Job[] = [
        {
          id: "1",
          title: "Planting Wheat",
          description: "Plant wheat seeds in North Field",
          status: "ONGOING",
          startDate: new Date("2024-01-15"),
          endDate: new Date("2024-01-20"),
          location: "North Field",
          createdAt: new Date("2024-01-10"),
          updatedAt: new Date("2024-01-10"),
        },
        {
          id: "2",
          title: "Harvest Corn",
          description: "Harvest corn from South Field",
          status: "DUE",
          startDate: new Date("2024-02-01"),
          endDate: new Date("2024-02-05"),
          location: "South Field",
          createdAt: new Date("2024-01-10"),
          updatedAt: new Date("2024-01-10"),
        },
      ];

      const mockUsers: User[] = [
        {
          id: "1",
          name: "John Farmer",
          email: "john@example.com",
        },
      ];

      set({
        jobs: mockJobs,
        users: mockUsers,
        isInitialized: true,
      });

      console.log("JobsStore: Data loaded successfully");
    } catch (error) {
      console.error("Error fetching jobs data:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
