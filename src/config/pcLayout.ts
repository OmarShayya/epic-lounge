export interface PCPosition {
  pcNumber: string;
  x: number; // Position in percentage (0-100)
  y: number; // Position in percentage (0-100)
  rotation: number; // Rotation in degrees (0-360)
}

// Define your PC layout based on the image
// Top row (left to right)
export const PC_LAYOUT: PCPosition[] = [
  // Top row
  { pcNumber: "PC5", x: 15, y: 10, rotation: 0 },
  { pcNumber: "PC4", x: 30, y: 10, rotation: 0 },
  { pcNumber: "PC3", x: 45, y: 10, rotation: 0 },
  { pcNumber: "PC2", x: 60, y: 10, rotation: 0 },
  { pcNumber: "PC1", x: 75, y: 10, rotation: 0 },


  // Bottom row (right to left)
  { pcNumber: "PC10", x: 80, y: 85, rotation: 180 },
  { pcNumber: "PC9", x: 65, y: 85, rotation: 180 },
  { pcNumber: "PC8", x: 50, y: 85, rotation: 180 },
  { pcNumber: "PC7", x: 35, y: 85, rotation: 180 },
  { pcNumber: "PC6", x: 20, y: 85, rotation: 180 },
];

// You can easily add more PCs or adjust positions here
