export type Piece = {
    id: number;
    position: string;
}


export type BoardSquare = {
    colour: string;
    id: string;
}

export const LUDO_BOARD: Array<Array<BoardSquare>> = [
    [
        { colour: "red", id: "r1" }, { colour: "red", id: "r2" }, { colour: "red", id: "r3" }, { colour: "red", id: "r4" }, { colour: "red", id: "r5" }, { colour: "red", id: "r6" },
        { colour: "white", id: "1" }, { colour: "white", id: "2" }, { colour: "white", id: "3" },
        { colour: "yellow", id: "y1" }, { colour: "yellow", id: "y2" }, { colour: "yellow", id: "y3" }, { colour: "yellow", id: "y4" }, { colour: "yellow", id: "y5" }, { colour: "yellow", id: "y6" }
    ],
    [
        { colour: "red", id: "r7" }, { colour: "red", id: "r8" }, { colour: "red", id: "r9" }, { colour: "red", id: "r10" }, { colour: "red", id: "r11" }, { colour: "red", id: "r12" },
        { colour: "white", id: "4" }, { colour: "yellow", id: "5" }, { colour: "yellow", id: "6" },
        { colour: "yellow", id: "y7" }, { colour: "yellow", id: "y8" }, { colour: "yellow", id: "y9" }, { colour: "yellow", id: "y10" }, { colour: "yellow", id: "y11" }, { colour: "yellow", id: "y12" }
    ],
    [
        { colour: "red", id: "r13" }, { colour: "red", id: "r14" }, { colour: "red", id: "r15" }, { colour: "red", id: "r16" }, { colour: "red", id: "r17" }, { colour: "red", id: "r18" },
        { colour: "white", id: "7" }, { colour: "yellow", id: "8" }, { colour: "white", id: "9" },
        { colour: "yellow", id: "y13" }, { colour: "yellow", id: "y14" }, { colour: "yellow", id: "y15" }, { colour: "yellow", id: "y16" }, { colour: "yellow", id: "y17" }, { colour: "yellow", id: "y18" }
    ],
    [
        { colour: "red", id: "r19" }, { colour: "red", id: "r20" }, { colour: "red", id: "r21" }, { colour: "red", id: "r22" }, { colour: "red", id: "r23" }, { colour: "red", id: "r24" },
        { colour: "white", id: "10" }, { colour: "yellow", id: "11" }, { colour: "white", id: "12" },
        { colour: "yellow", id: "y19" }, { colour: "yellow", id: "y20" }, { colour: "yellow", id: "y21" }, { colour: "yellow", id: "y22" }, { colour: "yellow", id: "y23" }, { colour: "yellow", id: "y24" }
    ],
    [
        { colour: "red", id: "r25" }, { colour: "red", id: "r26" }, { colour: "red", id: "r27" }, { colour: "red", id: "r28" }, { colour: "red", id: "r29" }, { colour: "red", id: "r30" },
        { colour: "white", id: "13" }, { colour: "yellow", id: "14" }, { colour: "white", id: "15" },
        { colour: "yellow", id: "y25" }, { colour: "yellow", id: "y26" }, { colour: "yellow", id: "y27" }, { colour: "yellow", id: "y28" }, { colour: "yellow", id: "y29" }, { colour: "yellow", id: "y30" }
    ],
    [
        { colour: "red", id: "r31" }, { colour: "red", id: "r32" }, { colour: "red", id: "r33" }, { colour: "red", id: "r34" }, { colour: "red", id: "r35" }, { colour: "red", id: "r36" },
        { colour: "white", id: "16" }, { colour: "yellow", id: "17" }, { colour: "white", id: "18" },
        { colour: "yellow", id: "y31" }, { colour: "yellow", id: "y32" }, { colour: "yellow", id: "y33" }, { colour: "yellow", id: "y34" }, { colour: "yellow", id: "y35" }, { colour: "yellow", id: "y36" }
    ],
    [
        { colour: "white", id: "19" }, { colour: "red", id: "20" }, { colour: "white", id: "21" },
        { colour: "white", id: "22" }, { colour: "white", id: "23" }, { colour: "white", id: "24" }, { colour: "win", id: "win1" }, { colour: "win", id: "win2" },
        { colour: "win", id: "win3" },
        { colour: "white", id: "25" }, { colour: "white", id: "26" }, { colour: "white", id: "27" },
        { colour: "white", id: "28" }, { colour: "white", id: "29" }, { colour: "white", id: "30" },
    ],
    [
        { colour: "white", id: "31" }, { colour: "red", id: "32" }, { colour: "red", id: "33" },
        { colour: "red", id: "34" }, { colour: "red", id: "35" }, { colour: "red", id: "36" }, { colour: "win", id: "win4" }, { colour: "win", id: "win5" },
        { colour: "win", id: "win6" },
        { colour: "green", id: "37" }, { colour: "green", id: "38" }, { colour: "green", id: "39" },
        { colour: "green", id: "40" }, { colour: "green", id: "41" }, { colour: "white", id: "42" },
    ],
    [
        { colour: "white", id: "43" }, { colour: "white", id: "44" }, { colour: "white", id: "45" },
        { colour: "white", id: "46" }, { colour: "white", id: "47" }, { colour: "white", id: "48" }, { colour: "win", id: "win5" }, { colour: "win", id: "win6" },
        { colour: "win", id: "win7" },
        { colour: "white", id: "49" }, { colour: "white", id: "50" }, { colour: "white", id: "51" },
        { colour: "white", id: "52" }, { colour: "green", id: "53" }, { colour: "white", id: "54" },
    ],
    [
        { colour: "blue", id: "b1" }, { colour: "blue", id: "b2" }, { colour: "blue", id: "b3" },
        { colour: "blue", id: "b4" }, { colour: "blue", id: "b5" }, { colour: "blue", id: "b6" },
        { colour: "white", id: "55" }, { colour: "blue", id: "56" }, { colour: "white", id: "57" },
        { colour: "green", id: "g1" }, { colour: "green", id: "g2" }, { colour: "green", id: "g3" },
        { colour: "green", id: "g4" }, { colour: "green", id: "g5" }, { colour: "green", id: "g6" }
    ],
    [
        { colour: "blue", id: "b7" }, { colour: "blue", id: "b8" }, { colour: "blue", id: "b9" },
        { colour: "blue", id: "b10" }, { colour: "blue", id: "b11" }, { colour: "blue", id: "b12" },
        { colour: "white", id: "58" }, { colour: "blue", id: "59" }, { colour: "white", id: "60" },
        { colour: "green", id: "g7" }, { colour: "green", id: "g8" }, { colour: "green", id: "g9" },
        { colour: "green", id: "g10" }, { colour: "green", id: "g11" }, { colour: "green", id: "g12" }
    ],
    [
        { colour: "blue", id: "b13" }, { colour: "blue", id: "b14" }, { colour: "blue", id: "b15" },
        { colour: "blue", id: "b16" }, { colour: "blue", id: "b17" }, { colour: "blue", id: "b18" },
        { colour: "white", id: "61" }, { colour: "blue", id: "62" }, { colour: "white", id: "63" },
        { colour: "green", id: "g13" }, { colour: "green", id: "g14" }, { colour: "green", id: "g15" },
        { colour: "green", id: "g16" }, { colour: "green", id: "g17" }, { colour: "green", id: "g18" }
    ],
    [
        { colour: "blue", id: "b19" }, { colour: "blue", id: "b20" }, { colour: "blue", id: "b21" },
        { colour: "blue", id: "b22" }, { colour: "blue", id: "b23" }, { colour: "blue", id: "b24" },
        { colour: "white", id: "64" }, { colour: "blue", id: "65" }, { colour: "white", id: "66" },
        { colour: "green", id: "g19" }, { colour: "green", id: "g20" }, { colour: "green", id: "g21" },
        { colour: "green", id: "g22" }, { colour: "green", id: "g23" }, { colour: "green", id: "g24" }
    ],
    [
        { colour: "blue", id: "b25" }, { colour: "blue", id: "b26" }, { colour: "blue", id: "b27" },
        { colour: "blue", id: "b28" }, { colour: "blue", id: "b29" }, { colour: "blue", id: "b30" },
        { colour: "blue", id: "67" }, { colour: "blue", id: "68" }, { colour: "white", id: "69" },
        { colour: "green", id: "g25" }, { colour: "green", id: "g26" }, { colour: "green", id: "g27" },
        { colour: "green", id: "g28" }, { colour: "green", id: "g29" }, { colour: "green", id: "g30" }
    ],
    [
        { colour: "blue", id: "b31" }, { colour: "blue", id: "b32" }, { colour: "blue", id: "b33" },
        { colour: "blue", id: "b34" }, { colour: "blue", id: "b35" }, { colour: "blue", id: "b36" },
        { colour: "white", id: "70" }, { colour: "white", id: "71" }, { colour: "white", id: "72" },
        { colour: "green", id: "g31" }, { colour: "green", id: "g32" }, { colour: "green", id: "g33" },
        { colour: "green", id: "g34" }, { colour: "green", id: "g35" }, { colour: "green", id: "g36" }
    ]
];

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
