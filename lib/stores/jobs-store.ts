import { jobsApi, usersApi } from "@/lib/supabase-api";
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
  addJob: (
    job: Omit<Job, "id" | "createdAt" | "updatedAt">,
    userId: string
  ) => Promise<{ success: boolean; error?: string }>;
  updateJob: (
    id: string,
    updates: Partial<Job>
  ) => Promise<{ success: boolean; error?: string }>;
  deleteJob: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Initialize with Supabase data
  initializeData: (userId: string) => Promise<void>;

  // Clear all data (for sign out)
  clearData: () => void;
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
  addJob: async (job, userId) => {
    try {
      const newJob = await jobsApi.createJob(job, userId);
      const { jobs } = get();
      set({ jobs: [...(jobs || []), newJob] });
      return { success: true };
    } catch (error) {
      console.error("Error adding job:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to add job",
      };
    }
  },

  updateJob: async (id, updates) => {
    try {
      const updatedJob = await jobsApi.updateJob(id, updates);
      const { jobs } = get();
      if (!jobs) return { success: false, error: "No jobs available" };

      const updatedJobs = jobs.map((job) => (job.id === id ? updatedJob : job));
      set({ jobs: updatedJobs });
      return { success: true };
    } catch (error) {
      console.error("Error updating job:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update job",
      };
    }
  },

  deleteJob: async (id) => {
    try {
      await jobsApi.deleteJob(id);
      const { jobs } = get();
      if (!jobs) return { success: false, error: "No jobs available" };

      const filteredJobs = jobs.filter((job) => job.id !== id);
      set({ jobs: filteredJobs });
      return { success: true };
    } catch (error) {
      console.error("Error deleting job:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete job",
      };
    }
  },

  // Initialize with Supabase data
  initializeData: async (userId: string) => {
    set({ isLoading: true });

    try {
      const [jobs, users] = await Promise.all([
        jobsApi.getJobs(userId),
        usersApi.getUsers(),
      ]);

      set({
        jobs,
        users,
        isInitialized: true,
      });

      console.log("JobsStore: Data loaded successfully from Supabase");
    } catch (error) {
      console.error("Error fetching jobs data:", error);
      set({
        jobs: [],
        users: [],
        isInitialized: true,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Clear all data (for sign out)
  clearData: () => {
    console.log("🧹 Clearing jobs data");
    set({
      jobs: undefined,
      users: undefined,
      isLoading: false,
      isInitialized: false,
    });
  },
}));
