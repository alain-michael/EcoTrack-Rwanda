# EcoTrack-Rwanda

## Folder Structure

The following outlines the structure of the `EcoTrack-Rwanda` repository, highlighting the key directories and their contents:

### 1. `src/app`
Contains the Redux store and persist configurations.

### 2. `src/components`
Contains all other components. This directory is further organized into subdirectories based on functionality:
- **auth**: Contains login and register setups. Note that `AuthorLayout` is used to manage the design for both.
- **dashboard**: Contains all dashboard components and designs.
- **sharedComponents**: Contains components that will be used across different pages, such as navigation bars, footers, etc.

### 3. `src/features`
Contains all store slices.

---

## Running the App

To run the app, follow these steps:

1. Navigate to the root folder.
2. Run the following commands:
    ```bash
    npm install -g pnpm
    pnpm install
    pnpm run dev
    ```
