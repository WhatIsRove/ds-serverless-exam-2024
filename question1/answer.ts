interface Car {
    make: string;
    color: string;
    registration: string;
    owner: string;
}

interface Bicycle {
    make: string;
    color: string;
    owner: string;
}

type Transporter = Car | Bicycle;

const database: Transporter[] = [
    {   // Car
        make: "Toyota Yaris",
        color: "Red",
        registration: "231WD1234",
        owner: "Jane Smith",
    },
    {    // Car
        make: "Suzuki Swift",
        color: "Blue",
        registration: "241WD4321",
        owner: "Paul O Regan",
    },
    {   // Car
        make: "Ford Puma",
        color: "Blue",
        registration: "241WD1212",
        owner: "Eileen Silk",
    },
    {   // Bicycle
        make: "Revel Rascal XO",
        color: "Blue",
        owner: "Cindy Tamoka",
    },
    {    // Bicycle
        make: "Yeti SB140 LR",
        color: "Red",
        owner: " ",
    },
];

function getMatches(transporter: (t: Transporter) => boolean): Transporter[] {
    let currentMatches: Transporter[] = [];
    database.forEach(element => {
        if (transporter(element)) {
            currentMatches = [...currentMatches, element];
        }
    });
    return currentMatches;
}

console.log("Blue Transporters: ", getMatches((t) => t.color === "Blue"));
console.log("\n")
console.log("Red Cars: ", getMatches((t) => t.color === "Red" && "registration" in t));