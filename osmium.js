// NOT MADE BY ME made on request by someone else
// Osmium Element Mod
elements.osmium = {
    color: "#99a8bb",
    behavior: behaviors.WALL,
    category: "solids",
    density: 22590,
    tempHigh: 3033,
    stateHigh: "molten_osmium",
    state: "solid",
    reactions: {
        "oxygen": { elem1: "osmium_tetroxide", chance: 0.05, tempMin: 200 },
    }};

// Define the molten state so it doesn't crash when it melts
elements.molten_osmium = {
    color: "#e2b658",
    behavior: behaviors.LIQUID,
    category: "states",
    density: 20000,
    temp: 3100,
    tempLow: 3033,
    stateLow: "osmium",
    viscosity: 10,
    state: "liquid",
};
