# API Integration

This directory contains API integration functions for the mobile app.

## Fields API

The `fields-api.ts` file provides functions to interact with the fields API endpoints:

- `getFieldsByUser()` - Fetch all fields for the current user
- `createField(field)` - Create a new field
- `updateField(id, updates)` - Update an existing field
- `deleteField(id)` - Delete a field
- `getFieldById(id)` - Get a specific field by ID

## Environment Configuration

Make sure to set the `EXPO_PUBLIC_API_URL` environment variable in your `.env` file:

```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## Authentication

The API functions are currently set up to work without authentication. When authentication is implemented, uncomment the authorization headers in each function.

## Error Handling

All API functions include proper error handling and return structured responses with success/error information.
