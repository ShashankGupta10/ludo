export type Piece = {
    id: number;
    position: string;
}

export const PIECES: Record<string, Array<Piece>> = {
    red: [
        { id: 1, position: "r8" },
        { id: 2, position: "r11" },
        { id: 3, position: "r26" },
        { id: 4, position: "r29" }
    ],
    yellow: [
        { id: 1, position: "y8" },
        { id: 2, position: "y11" },
        { id: 3, position: "y26" },
        { id: 4, position: "y29" }
    ],
    green: [
        { id: 1, position: "g8" },
        { id: 2, position: "g11" },
        { id: 3, position: "g26" },
        { id: 4, position: "g29" }
    ],
    blue: [
        { id: 1, position: "b8" },
        { id: 2, position: "b11" },
        { id: 3, position: "b26" },
        { id: 4, position: "b29" }
    ]
};