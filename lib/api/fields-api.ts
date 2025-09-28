import { Field } from "@/lib/types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FieldsResponse {
  fields: Field[];
}

// Get all fields for the current user
export async function getFieldsByUser(): Promise<Field[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fields`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add authentication headers here when auth is implemented
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<FieldsResponse> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch fields");
    }

    return result.data?.fields || [];
  } catch (error) {
    console.error("Error fetching fields:", error);
    throw error;
  }
}

// Create a new field
export async function createField(field: Field): Promise<ApiResponse<Field>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fields`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add authentication headers here when auth is implemented
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(field),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Field> = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating field:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create field",
    };
  }
}

// Update an existing field
export async function updateField(
  id: string,
  updates: Partial<Field>
): Promise<ApiResponse<Field>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fields/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Add authentication headers here when auth is implemented
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Field> = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating field:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update field",
    };
  }
}

// Delete a field
export async function deleteField(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fields/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Add authentication headers here when auth is implemented
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<void> = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting field:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete field",
    };
  }
}

// Get a specific field by ID
export async function getFieldById(id: string): Promise<Field | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fields/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add authentication headers here when auth is implemented
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Field> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch field");
    }

    return result.data || null;
  } catch (error) {
    console.error("Error fetching field:", error);
    throw error;
  }
}
