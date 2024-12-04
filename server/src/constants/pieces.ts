export type Piece = {
    position: string;
    color: PieceColor,
    home: string
}

type PieceColor = "red" | "blue" | "green" | "yellow"

export const PIECES: Array<Piece> = [
    {
        color: "red",
        home: "b2",
        position: "b2"
    },
    {
        color: "red",
        home: "b5",
        position: "b5"
    },
    {
        color: "red",
        home: "e2",
        position: "e2"
    },
    {
        color: "red",
        home: "e5",
        position: "e5"
    },
    {
        color: "blue",
        home: "b11",
        position: "b11"
    },
    {
        color: "blue",
        home: "b14",
        position: "b14"
    },
    {
        color: "blue",
        home: "e11",
        position: "e11"
    },
    {
        color: "blue",
        home: "e14",
        position: "e14"
    },
    {
        color: "green",
        home: "k2",
        position: "k2"
    },
    {
        color: "green",
        home: "k5",
        position: "k5"
    },
    {
        color: "green",
        home: "n2",
        position: "n2"
    },
    {
        color: "green",
        home: "n5",
        position: "n5"
    },
    {
        color: "yellow",
        home: "k11",
        position: "k11"
    },
    {
        color: "yellow",
        home: "k14",
        position: "k14"
    },
    {
        color: "yellow",
        home: "n11",
        position: "n11"
    },
    {
        color: "yellow",
        home: "n14",
        position: "n14"
    }
]