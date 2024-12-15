export type Piece = {
    position: string;
    color: PieceColor,
    home: string
    openPosition: string
}


export type BoardSquare = {
    type: "neutral" | "home" | "win"
    color: CellColor;
    next: string | null
    colorPath: string | null
    id: string;
    safe?: boolean
}

type CellType = "neutral" | "home" | "win" | "path";
type CellColor = "red" | "blue" | "green" | "yellow" | null;
type PieceColor = "red" | "blue" | "green" | "yellow"

export interface Cell {
    type: CellType;
    color: CellColor;
    next: Cell | null;
    colorPath: Cell | null;
}

export const LUDO_BOARD: Array<Array<BoardSquare>> = [
    [
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "a1"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "a2"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "a3"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "a4"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "a5"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "a6"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "a8",
            "colorPath": null,
            "id": "a7"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "a9",
            "colorPath": null,
            "id": "a8"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "b9",
            "colorPath": null,
            "id": "a9"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "a10"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "a11"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "a12"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "a13"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "a14"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "a15"
        }
    ],
    [
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "b1"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "b2"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "b3"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "b4"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "b5"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "b6"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "a7",
            "colorPath": null,
            "id": "b7"
        },
        {
            "type": "neutral",
            "color": "blue",
            "next": "c8",
            "colorPath": null,
            "id": "b8"
        },
        {
            "type": "neutral",
            "color": "blue",
            "next": "c9",
            "colorPath": null,
            "id": "b9",
            "safe": true
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "b10"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "b11"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "b12"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "b13"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "b14"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "b15"
        }
    ],
    [
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "c1"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "c2"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "c3"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "c4"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "c5"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "c6"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "b7",
            "colorPath": null,
            "id": "c7",
            "safe": true
        },
        {
            "type": "neutral",
            "color": "blue",
            "next": "d8",
            "colorPath": null,
            "id": "c8"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "d9",
            "colorPath": null,
            "id": "c9"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "c10"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "c11"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "c12"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "c13"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "c14"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "c15"
        }
    ],
    [
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "d1"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "d2"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "d3"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "d4"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "d5"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "d6"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "c7",
            "colorPath": null,
            "id": "d7"
        },
        {
            "type": "neutral",
            "color": "blue",
            "next": "e8",
            "colorPath": null,
            "id": "d8"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "e9",
            "colorPath": null,
            "id": "d9"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "d10"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "d11"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "d12"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "d13"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "d14"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "d15"
        }
    ],
    [
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "e1"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "e2"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "e3"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "e4"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "e5"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "e6"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "d7",
            "colorPath": null,
            "id": "e7"
        },
        {
            "type": "neutral",
            "color": "blue",
            "next": "f8",
            "colorPath": null,
            "id": "e8"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "f9",
            "colorPath": null,
            "id": "e9"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "e10"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "e11"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "e12"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "e13"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "e14"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "e15"
        }
    ],
    [
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "f1"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "f2"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "f3"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "f4"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "f5"
        },
        {
            "type": "home",
            "color": "red",
            "next": null,
            "colorPath": null,
            "id": "f6"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "e7",
            "colorPath": null,
            "id": "f7"
        },
        {
            "type": "neutral",
            "color": "blue",
            "next": "win",
            "colorPath": null,
            "id": "f8"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "g10",
            "colorPath": null,
            "id": "f9"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "f10"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "f11"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "f12"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "f13"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "f14"
        },
        {
            "type": "home",
            "color": "blue",
            "next": null,
            "colorPath": null,
            "id": "f15"
        }
    ],
    [
        {
            "type": "neutral",
            "color": null,
            "next": "g2",
            "colorPath": null,
            "id": "g1"
        },
        {
            "type": "neutral",
            "color": "red",
            "next": "g3",
            "colorPath": null,
            "id": "g2",
            "safe": true
        },
        {
            "type": "neutral",
            "color": null,
            "next": "g4",
            "colorPath": null,
            "id": "g3"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "g5",
            "colorPath": null,
            "id": "g4"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "g6",
            "colorPath": null,
            "id": "g5"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "f7",
            "colorPath": null,
            "id": "g6"
        },
        {
            "type": "win",
            "color": null,
            "next": null,
            "colorPath": null,
            "id": "g7"
        },
        {
            "type": "win",
            "color": null,
            "next": null,
            "colorPath": null,
            "id": "g8"
        },
        {
            "type": "win",
            "color": null,
            "next": null,
            "colorPath": null,
            "id": "g9"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "g11",
            "colorPath": null,
            "id": "g10"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "g12",
            "colorPath": null,
            "id": "g11"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "g13",
            "colorPath": null,
            "id": "g12"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "g14",
            "colorPath": null,
            "id": "g13",
            "safe": true
        },
        {
            "type": "neutral",
            "color": null,
            "next": "g15",
            "colorPath": null,
            "id": "g14"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "h15",
            "colorPath": null,
            "id": "g15"
        }
    ],
    [
        {
            "type": "neutral",
            "color": null,
            "next": "g1",
            "colorPath": null,
            "id": "h1"
        },
        {
            "type": "neutral",
            "color": "red",
            "next": "h3",
            "colorPath": null,
            "id": "h2"
        },
        {
            "type": "neutral",
            "color": "red",
            "next": "h4",
            "colorPath": null,
            "id": "h3"
        },
        {
            "type": "neutral",
            "color": "red",
            "next": "h5",
            "colorPath": null,
            "id": "h4"
        },
        {
            "type": "neutral",
            "color": "red",
            "next": "h6",
            "colorPath": null,
            "id": "h5"
        },
        {
            "type": "neutral",
            "color": "red",
            "next": "win",
            "colorPath": null,
            "id": "h6"
        },
        {
            "type": "win",
            "color": null,
            "next": null,
            "colorPath": null,
            "id": "h7"
        },
        {
            "type": "win",
            "color": null,
            "next": "h9",
            "colorPath": null,
            "id": "h8"
        },
        {
            "type": "win",
            "color": null,
            "next": null,
            "colorPath": null,
            "id": "h9"
        },
        {
            "type": "neutral",
            "color": "yellow",
            "next": "win",
            "colorPath": null,
            "id": "h10"
        },
        {
            "type": "neutral",
            "color": "yellow",
            "next": "h10",
            "colorPath": null,
            "id": "h11"
        },
        {
            "type": "neutral",
            "color": "yellow",
            "next": "h11",
            "colorPath": null,
            "id": "h12"
        },
        {
            "type": "neutral",
            "color": "yellow",
            "next": "h12",
            "colorPath": null,
            "id": "h13"
        },
        {
            "type": "neutral",
            "color": "yellow",
            "next": "h13",
            "colorPath": null,
            "id": "h14"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "i15",
            "colorPath": null,
            "id": "h15"
        }
    ],
    [
        {
            "type": "neutral",
            "color": null,
            "next": "h1",
            "colorPath": null,
            "id": "i1"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "i1",
            "colorPath": null,
            "id": "i2"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "i2",
            "colorPath": null,
            "id": "i3",
            "safe": true
        },
        {
            "type": "neutral",
            "color": null,
            "next": "i3",
            "colorPath": null,
            "id": "i4"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "i4",
            "colorPath": null,
            "id": "i5"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "i5",
            "colorPath": null,
            "id": "i6"
        },
        {
            "type": "win",
            "color": null,
            "next": null,
            "colorPath": null,
            "id": "i7"
        },
        {
            "type": "win",
            "color": null,
            "next": null,
            "colorPath": null,
            "id": "i8"
        },
        {
            "type": "win",
            "color": null,
            "next": null,
            "colorPath": null,
            "id": "i9"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "j9",
            "colorPath": null,
            "id": "i10"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "i10",
            "colorPath": null,
            "id": "i11"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "i11",
            "colorPath": null,
            "id": "i12"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "i12",
            "colorPath": null,
            "id": "i13"
        },
        {
            "type": "neutral",
            "color": "yellow",
            "next": "i13",
            "colorPath": null,
            "id": "i14",
            "safe": true
        },
        {
            "type": "neutral",
            "color": null,
            "next": "i14",
            "colorPath": null,
            "id": "i15"
        }
    ],
    [
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "j1"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "j2"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "j3"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "j4"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "j5"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "j6"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "i6",
            "colorPath": null,
            "id": "j7"
        },
        {
            "type": "neutral",
            "color": "green",
            "next": "win",
            "colorPath": null,
            "id": "j8"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "k9",
            "colorPath": null,
            "id": "j9"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "j10"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "j11"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "j12"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "j13"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "j14"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "j15"
        }
    ],
    [
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "k1"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "k2"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "k3"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "k4"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "k5"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "k6"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "j7",
            "colorPath": null,
            "id": "k7"
        },
        {
            "type": "neutral",
            "color": "green",
            "next": "j8",
            "colorPath": null,
            "id": "k8"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "l9",
            "colorPath": null,
            "id": "k9"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "k10"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "k11"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "k12"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "k13"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "k14"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "k15"
        }
    ],
    [
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "l1"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "l2"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "l3"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "l4"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "l5"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "l6"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "k7",
            "colorPath": null,
            "id": "l7"
        },
        {
            "type": "neutral",
            "color": "green",
            "next": "k8",
            "colorPath": null,
            "id": "l8"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "m9",
            "colorPath": null,
            "id": "l9"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "l10"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "l11"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "l12"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "l13"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "l14"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "l15"
        }
    ],
    [
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "m1"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "m2"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "m3"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "m4"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "m5"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "m6"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "l7",
            "colorPath": null,
            "id": "m7"
        },
        {
            "type": "neutral",
            "color": "green",
            "next": "l8",
            "colorPath": null,
            "id": "m8"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "n9",
            "colorPath": null,
            "id": "m9",
            "safe": true
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "m10"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "m11"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "m12"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "m13"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "m14"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "m15"
        }
    ],
    [
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "n1"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "n2"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "n3"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "n4"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "n5"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "n6"
        },
        {
            "type": "neutral",
            "color": "green",
            "next": "m7",
            "colorPath": null,
            "id": "n7",
            "safe": true
        },
        {
            "type": "neutral",
            "color": "green",
            "next": "m8",
            "colorPath": null,
            "id": "n8"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "o9",
            "colorPath": null,
            "id": "n9"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "n10"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "n11"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "n12"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "n13"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "n14"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "n15"
        }
    ],
    [
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "o1"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "o2"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "o3"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "o4"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "o5"
        },
        {
            "type": "home",
            "color": "green",
            "next": null,
            "colorPath": null,
            "id": "o6"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "n7",
            "colorPath": null,
            "id": "o7"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "o7",
            "colorPath": null,
            "id": "o8"
        },
        {
            "type": "neutral",
            "color": null,
            "next": "o8",
            "colorPath": null,
            "id": "o9"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "o10"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "o11"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "o12"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "o13"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "o14"
        },
        {
            "type": "home",
            "color": "yellow",
            "next": null,
            "colorPath": null,
            "id": "o15"
        }
    ]
]

export const PIECES: Array<Piece> = [
    {
        color: "red",
        home: "b2",
        position: "b2",
        openPosition: "g2"
    },
    {
        color: "red",
        home: "b5",
        position: "b5",
        openPosition: "g2"
    },
    {
        color: "red",
        home: "e2",
        position: "e2",
        openPosition: "g2"
    },
    {
        color: "red",
        home: "e5",
        position: "e5",
        openPosition: "g2"
    },
    {
        color: "blue",
        home: "b11",
        position: "b11",
        openPosition: "b9"
    },
    {
        color: "blue",
        home: "b14",
        position: "b14",
        openPosition: "b9"
    },
    {
        color: "blue",
        home: "e11",
        position: "e11",
        openPosition: "b9"
    },
    {
        color: "blue",
        home: "e14",
        position: "e14",
        openPosition: "b9"
    },
    {
        color: "green",
        home: "k2",
        position: "k2",
        openPosition: "n7"
    },
    {
        color: "green",
        home: "k5",
        position: "k5",
        openPosition: "n7"
    },
    {
        color: "green",
        home: "n2",
        position: "n2",
        openPosition: "n7"
    },
    {
        color: "green",
        home: "n5",
        position: "n5",
        openPosition: "n7"
    },
    {
        color: "yellow",
        home: "k11",
        position: "k11",
        openPosition: "i14"
    },
    {
        color: "yellow",
        home: "k14",
        position: "k14",
        openPosition: "i14"
    },
    {
        color: "yellow",
        home: "n11",
        position: "n11",
        openPosition: "i14"
    },
    {
        color: "yellow",
        home: "n14",
        position: "n14",
        openPosition: "i14"
    }
]