import { supabase } from "./supabase";
import { Field, Job, User } from "./types";

// Helper function to convert database row to Field type
const mapFieldFromDB = (row: any): Field => ({
  id: row.id,
  label: row.label,
  color: row.color,
  area: row.area,
  coordinates: row.coordinates,
  authorId: row.user_id,
  categories: row.categories || [],
  isUpdating: false,
});

// Helper function to convert database row to Job type
const mapJobFromDB = (row: any): Job => ({
  id: row.id,
  title: row.title,
  description: row.description,
  status:
    row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase(), // Convert to frontend format
  startDate: new Date(row.start_date),
  endDate: new Date(row.end_date),
  location: row.location,
  userId: row.user_id,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

// Helper function to convert database row to User type
const mapUserFromDB = (row: any): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
});

// Fields API
export const fieldsApi = {
  async getFields(userId: string): Promise<Field[]> {
    console.log("🔍 Fetching fields for user:", userId);

    const { data, error } = await supabase
      .from("fields")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching fields:", error);
      throw error;
    }

    console.log("✅ Found fields:", data?.length || 0);
    return data?.map(mapFieldFromDB) || [];
  },

  async createField(field: Omit<Field, "id" | "isUpdating">): Promise<Field> {
    console.log("➕ Creating field for user:", field.authorId);

    const { data, error } = await supabase
      .from("fields")
      .insert({
        user_id: field.authorId,
        label: field.label,
        color: field.color,
        area: field.area,
        coordinates: field.coordinates,
        categories: field.categories,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating field:", error);
      throw error;
    }

    console.log("✅ Field created successfully:", data.id);
    return mapFieldFromDB(data);
  },

  async updateField(id: string, updates: Partial<Field>): Promise<Field> {
    const updateData: any = {};

    if (updates.label !== undefined) updateData.label = updates.label;
    if (updates.color !== undefined) updateData.color = updates.color;
    if (updates.area !== undefined) updateData.area = updates.area;
    if (updates.coordinates !== undefined)
      updateData.coordinates = updates.coordinates;
    if (updates.categories !== undefined)
      updateData.categories = updates.categories;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("fields")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating field:", error);
      throw error;
    }

    return mapFieldFromDB(data);
  },

  async deleteField(id: string): Promise<void> {
    const { error } = await supabase.from("fields").delete().eq("id", id);

    if (error) {
      console.error("Error deleting field:", error);
      throw error;
    }
  },
};

// Jobs API
export const jobsApi = {
  async getJobs(userId: string): Promise<Job[]> {
    console.log("🔍 Fetching jobs for user:", userId);

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }

    console.log("✅ Found jobs:", data?.length || 0);
    return data?.map(mapJobFromDB) || [];
  },

  async createJob(
    job: Omit<Job, "id" | "createdAt" | "updatedAt">,
    userId: string
  ): Promise<Job> {
    console.log("➕ Creating job for user:", userId);

    const { data, error } = await supabase
      .from("jobs")
      .insert({
        user_id: userId,
        title: job.title,
        description: job.description,
        status: job.status.toLowerCase(), // Convert to database format
        start_date: job.startDate.toISOString(),
        end_date: job.endDate.toISOString(),
        location: job.location,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating job:", error);
      throw error;
    }

    console.log("✅ Job created successfully:", data.id);
    return mapJobFromDB(data);
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    const updateData: any = {};

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.status !== undefined)
      updateData.status = updates.status.toLowerCase(); // Convert to database format
    if (updates.startDate !== undefined)
      updateData.start_date = updates.startDate.toISOString();
    if (updates.endDate !== undefined)
      updateData.end_date = updates.endDate.toISOString();
    if (updates.location !== undefined) updateData.location = updates.location;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("jobs")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating job:", error);
      throw error;
    }

    return mapJobFromDB(data);
  },

  async deleteJob(id: string): Promise<void> {
    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) {
      console.error("Error deleting job:", error);
      throw error;
    }
  },
};

// Users API
export const usersApi = {
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }

    return data?.map(mapUserFromDB) || [];
  },

  async createUser(user: Omit<User, "id">): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .insert({
        name: user.name,
        email: user.email,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      throw error;
    }

    return mapUserFromDB(data);
  },

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // User not found
      }
      console.error("Error fetching user:", error);
      throw error;
    }

    return mapUserFromDB(data);
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      throw error;
    }

    return mapUserFromDB(data);
  },
};
