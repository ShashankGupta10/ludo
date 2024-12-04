import { v4 as uuid } from "uuid";
type CellType = "neutral" | "home" | "win" | "path";
type CellColor = "red" | "blue" | "green" | "yellow" | null;

export interface Cell {
    type: CellType;
    color: CellColor;
    next: string | null;
    colorPath: Cell | null;
    id: string
}

export const BOARD: Cell[][] = Array.from({ length: 15 }, (_, row) =>
    Array.from({ length: 15 }, (_, col) => ({
        type: "neutral" as CellType,
        color: null as CellColor,
        next: null,
        colorPath: null,
        id: uuid()
    }))
);

// Define home areas
function setupHomeArea(startRow: number, startCol: number, color: CellColor): void {
    for (let i = startRow; i < startRow + 6; i++) {
        for (let j = startCol; j < startCol + 6; j++) {
            BOARD[i][j] = { type: "home", color, next: null, colorPath: null, id: uuid() };
        }
    }
}

// Assign home areas
setupHomeArea(0, 0, "red"); // Top-left
setupHomeArea(0, 9, "blue"); // Top-right
setupHomeArea(9, 0, "green"); // Bottom-left
setupHomeArea(9, 9, "yellow"); // Bottom-right

// Define win area
for (let i = 6; i < 9; i++) {
    for (let j = 6; j < 9; j++) {
        BOARD[i][j] = { type: "win", color: null, next: null, colorPath: null, id: uuid() };
    }
}

// Define neutral path (static linking example for clockwise path)
const neutralPathIndices: [number, number][] = [
    [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
    [5, 5], [4, 5], [3, 5], [2, 5], [1, 5], [0, 5],
    [0, 6], [0, 7], [0, 8], [0, 9], [1, 9], [2, 9],
    [3, 9], [4, 9], [5, 9], [6, 9], [6, 10], [6, 11],
    [6, 12], [6, 13], [6, 14], [7, 14], [8, 14], [9, 14],
    [9, 13], [9, 12], [9, 11], [9, 10], [9, 9], [10, 9],
    [11, 9], [12, 9], [13, 9], [14, 9], [14, 8], [14, 7],
    [14, 6], [14, 5], [13, 5], [12, 5], [11, 5], [10, 5],
    [9, 5], [9, 4], [9, 3], [9, 2], [9, 1], [9, 0],
    [8, 0], [7, 0]
];

for (let i = 0; i < neutralPathIndices.length; i++) {
    const [row, col] = neutralPathIndices[i];
    BOARD[row][col] = { type: "neutral", color: null, next: null, colorPath: null, id: uuid() };
    if (i > 0) {
        const [prevRow, prevCol] = neutralPathIndices[i - 1];
        BOARD[prevRow][prevCol].next = BOARD[row][col].id;
    }
}

// Define color-specific paths
function setupColorPath(color: CellColor, startRow: number, startCol: number, deltaRow: number, deltaCol: number): void {
    let currentCell = BOARD[startRow][startCol];
    for (let i = 0; i < 5; i++) {
        const row = startRow + i * deltaRow;
        const col = startCol + i * deltaCol;
        BOARD[row][col].type = "path";
        BOARD[row][col].color = color;
        currentCell.colorPath = BOARD[row][col];
        currentCell = BOARD[row][col];
    }
}

// Define color paths leading to win area
setupColorPath("red", 6, 1, 0, 1); // Red path
setupColorPath("blue", 1, 8, 1, 0); // Blue path
setupColorPath("green", 8, 13, 0, -1); // Green path
setupColorPath("yellow", 13, 6, -1, 0); // Yellow path
