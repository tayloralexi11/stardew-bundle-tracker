// Stardew crops & fruit trees (standard valley, patch 1.6). Prices = base/no-star quality.
// seed = cheapest typical seed/sapling cost; sell = base sell price; grow = days to first harvest;
// regrow = days between harvests after that (null = single harvest); yield = items per harvest.
// type: "crop" | "tree" | "special"
const CROPS = [
  // ---------- SPRING ----------
  { img:"parsnip",      name:"Parsnip",        type:"crop", seasons:["Spring"], seed:20,  seedSrc:"Pierre",        sell:35,  grow:4,  regrow:null, yield:1, note:"" },
  { img:"green_bean",   name:"Green Bean",     type:"crop", seasons:["Spring"], seed:60,  seedSrc:"Pierre",        sell:40,  grow:10, regrow:3,    yield:1, note:"Needs a trellis (blocks walking)" },
  { img:"cauliflower",  name:"Cauliflower",    type:"crop", seasons:["Spring"], seed:80,  seedSrc:"Pierre",        sell:175, grow:12, regrow:null, yield:1, note:"Can grow giant" },
  { img:"potato",       name:"Potato",         type:"crop", seasons:["Spring"], seed:50,  seedSrc:"Pierre",        sell:80,  grow:6,  regrow:null, yield:1, note:"Chance of extra potato" },
  { img:"tulip",        name:"Tulip",          type:"crop", seasons:["Spring"], seed:20,  seedSrc:"Pierre",        sell:30,  grow:6,  regrow:null, yield:1, note:"Flower" },
  { img:"kale",         name:"Kale",           type:"crop", seasons:["Spring"], seed:70,  seedSrc:"Pierre",        sell:110, grow:6,  regrow:null, yield:1, note:"" },
  { img:"garlic",       name:"Garlic",         type:"crop", seasons:["Spring"], seed:40,  seedSrc:"Pierre (Yr 2)", sell:60,  grow:4,  regrow:null, yield:1, note:"" },
  { img:"rhubarb",      name:"Rhubarb",        type:"crop", seasons:["Spring"], seed:100, seedSrc:"Oasis",         sell:220, grow:13, regrow:null, yield:1, note:"" },
  { img:"strawberry",   name:"Strawberry",     type:"crop", seasons:["Spring"], seed:100, seedSrc:"Egg Festival",  sell:120, grow:8,  regrow:4,    yield:1, note:"Best bought at the Egg Festival" },
  { img:"blue_jazz",    name:"Blue Jazz",      type:"crop", seasons:["Spring"], seed:30,  seedSrc:"Pierre",        sell:50,  grow:7,  regrow:null, yield:1, note:"Flower" },
  { img:"unmilled_rice",name:"Unmilled Rice",  type:"crop", seasons:["Spring"], seed:40,  seedSrc:"Pierre (Yr 2)", sell:30,  grow:8,  regrow:null, yield:1, note:"Grows faster next to water" },
  { img:"carrot",       name:"Carrot",         type:"crop", seasons:["Spring"], seed:0,   seedSrc:"Foraged seeds", sell:35,  grow:3,  regrow:null, yield:1, note:"1.6 crop; seeds from foraging" },

  // ---------- SUMMER ----------
  { img:"melon",        name:"Melon",          type:"crop", seasons:["Summer"], seed:80,  seedSrc:"Pierre",        sell:250, grow:12, regrow:null, yield:1, note:"Can grow giant" },
  { img:"tomato",       name:"Tomato",         type:"crop", seasons:["Summer"], seed:50,  seedSrc:"Pierre",        sell:60,  grow:11, regrow:4,    yield:1, note:"" },
  { img:"blueberry",    name:"Blueberry",      type:"crop", seasons:["Summer"], seed:80,  seedSrc:"Pierre",        sell:50,  grow:13, regrow:4,    yield:3, note:"Yields 3 per harvest" },
  { img:"hot_pepper",   name:"Hot Pepper",     type:"crop", seasons:["Summer"], seed:40,  seedSrc:"Pierre",        sell:40,  grow:5,  regrow:3,    yield:1, note:"" },
  { img:"radish",       name:"Radish",         type:"crop", seasons:["Summer"], seed:40,  seedSrc:"Pierre",        sell:90,  grow:6,  regrow:null, yield:1, note:"" },
  { img:"wheat",        name:"Wheat",          type:"crop", seasons:["Summer","Fall"], seed:10, seedSrc:"Pierre",  sell:25,  grow:4,  regrow:null, yield:1, note:"Also makes Hay / Beer" },
  { img:"hops",         name:"Hops",           type:"crop", seasons:["Summer"], seed:60,  seedSrc:"Pierre",        sell:25,  grow:11, regrow:1,    yield:1, note:"Trellis; great as Pale Ale" },
  { img:"corn",         name:"Corn",           type:"crop", seasons:["Summer","Fall"], seed:150, seedSrc:"Pierre", sell:50,  grow:14, regrow:4,    yield:1, note:"Spans Summer→Fall" },
  { img:"summer_spangle",name:"Summer Spangle",type:"crop", seasons:["Summer"], seed:50,  seedSrc:"Pierre",        sell:90,  grow:8,  regrow:null, yield:1, note:"Flower" },
  { img:"poppy",        name:"Poppy",          type:"crop", seasons:["Summer"], seed:100, seedSrc:"Pierre",        sell:140, grow:7,  regrow:null, yield:1, note:"Flower" },
  { img:"sunflower",    name:"Sunflower",      type:"crop", seasons:["Summer","Fall"], seed:200, seedSrc:"Pierre", sell:80,  grow:8,  regrow:null, yield:1, note:"Drops Sunflower Seeds for oil" },
  { img:"starfruit",    name:"Starfruit",      type:"crop", seasons:["Summer"], seed:400, seedSrc:"Oasis",         sell:750, grow:13, regrow:null, yield:1, note:"Very profitable as Wine" },
  { img:"red_cabbage",  name:"Red Cabbage",    type:"crop", seasons:["Summer"], seed:100, seedSrc:"Pierre (Yr 2)", sell:260, grow:9,  regrow:null, yield:1, note:"" },
  { img:"summer_squash",name:"Summer Squash",  type:"crop", seasons:["Summer"], seed:0,   seedSrc:"Foraged seeds", sell:45,  grow:6,  regrow:null, yield:1, note:"1.6 crop; seeds from foraging" },

  // ---------- FALL ----------
  { img:"eggplant",     name:"Eggplant",       type:"crop", seasons:["Fall"],   seed:20,  seedSrc:"Pierre",        sell:60,  grow:5,  regrow:5,    yield:1, note:"" },
  { img:"pumpkin",      name:"Pumpkin",        type:"crop", seasons:["Fall"],   seed:100, seedSrc:"Pierre",        sell:320, grow:13, regrow:null, yield:1, note:"Can grow giant" },
  { img:"yam",          name:"Yam",            type:"crop", seasons:["Fall"],   seed:60,  seedSrc:"Pierre",        sell:160, grow:10, regrow:null, yield:1, note:"" },
  { img:"beet",         name:"Beet",           type:"crop", seasons:["Fall"],   seed:20,  seedSrc:"Oasis",         sell:100, grow:6,  regrow:null, yield:1, note:"" },
  { img:"bok_choy",     name:"Bok Choy",       type:"crop", seasons:["Fall"],   seed:50,  seedSrc:"Pierre",        sell:80,  grow:4,  regrow:null, yield:1, note:"" },
  { img:"cranberries",  name:"Cranberries",    type:"crop", seasons:["Fall"],   seed:240, seedSrc:"Pierre",        sell:75,  grow:7,  regrow:5,    yield:2, note:"Yields 2 per harvest" },
  { img:"amaranth",     name:"Amaranth",       type:"crop", seasons:["Fall"],   seed:70,  seedSrc:"Pierre",        sell:150, grow:7,  regrow:null, yield:1, note:"" },
  { img:"grape",        name:"Grape",          type:"crop", seasons:["Fall"],   seed:60,  seedSrc:"Pierre",        sell:80,  grow:10, regrow:3,    yield:1, note:"Trellis" },
  { img:"artichoke",    name:"Artichoke",      type:"crop", seasons:["Fall"],   seed:30,  seedSrc:"Pierre (Yr 2)", sell:160, grow:8,  regrow:null, yield:1, note:"" },
  { img:"fairy_rose",   name:"Fairy Rose",     type:"crop", seasons:["Fall"],   seed:200, seedSrc:"Pierre",        sell:290, grow:12, regrow:null, yield:1, note:"Flower; great for bees" },
  { img:"broccoli",     name:"Broccoli",       type:"crop", seasons:["Fall"],   seed:0,   seedSrc:"Foraged seeds", sell:70,  grow:8,  regrow:4,    yield:1, note:"1.6 crop; seeds from foraging" },
  { img:"sweet_gem_berry",name:"Sweet Gem Berry",type:"crop",seasons:["Fall"],  seed:1000,seedSrc:"Rare Seed (Cart)",sell:3000,grow:24,regrow:null, yield:1, note:"Highest base sell price in the game" },

  // ---------- WINTER ----------
  { img:"powdermelon",  name:"Powdermelon",    type:"crop", seasons:["Winter"], seed:0,   seedSrc:"Foraged seeds", sell:60,  grow:7,  regrow:null, yield:1, note:"1.6 crop; the only outdoor winter crop" },

  // ---------- SPECIAL / GREENHOUSE ----------
  { img:"ancient_fruit", name:"Ancient Fruit", type:"special", seasons:["Spring","Summer","Fall"], seed:0, seedSrc:"Seed Maker / artifact", sell:550, grow:28, regrow:7, yield:1, note:"Amazing as Wine; grows all year in greenhouse" },
  { img:"coffee_bean",  name:"Coffee Bean",    type:"special", seasons:["Spring","Summer"], seed:2500, seedSrc:"Traveling Cart", sell:15, grow:10, regrow:2, yield:4, note:"5 beans → Coffee in a Keg" },
  { img:"cactus_fruit", name:"Cactus Fruit",   type:"special", seasons:["Any (indoors)"], seed:150, seedSrc:"Oasis", sell:75, grow:12, regrow:3, yield:1, note:"Only grows indoors / greenhouse" },

  // ---------- FRUIT TREES ----------
  { img:"cherry",       name:"Cherry Tree",    type:"tree", seasons:["Spring"], seed:3400, seedSrc:"Pierre (sapling)", sell:80,  grow:28, regrow:1, yield:1, note:"Bears 1 fruit/day in Spring once grown" },
  { img:"apricot",      name:"Apricot Tree",   type:"tree", seasons:["Spring"], seed:2000, seedSrc:"Pierre (sapling)", sell:50,  grow:28, regrow:1, yield:1, note:"Bears 1 fruit/day in Spring once grown" },
  { img:"orange",       name:"Orange Tree",    type:"tree", seasons:["Summer"], seed:4000, seedSrc:"Pierre (sapling)", sell:100, grow:28, regrow:1, yield:1, note:"Bears 1 fruit/day in Summer once grown" },
  { img:"peach",        name:"Peach Tree",     type:"tree", seasons:["Summer"], seed:6000, seedSrc:"Pierre (sapling)", sell:140, grow:28, regrow:1, yield:1, note:"Bears 1 fruit/day in Summer once grown" },
  { img:"apple",        name:"Apple Tree",     type:"tree", seasons:["Fall"],   seed:4000, seedSrc:"Pierre (sapling)", sell:100, grow:28, regrow:1, yield:1, note:"Bears 1 fruit/day in Fall once grown" },
  { img:"pomegranate",  name:"Pomegranate Tree",type:"tree",seasons:["Fall"],   seed:6000, seedSrc:"Pierre (sapling)", sell:140, grow:28, regrow:1, yield:1, note:"Bears 1 fruit/day in Fall once grown" },
];

// Festivals (no item collection — informational). day = day of that season.
const FESTIVALS = [
  { season:"Spring", day:13, name:"Egg Festival",        emoji:"🥚", note:"Egg hunt; buy Strawberry Seeds. 9am–2pm, Pelican Town." },
  { season:"Spring", day:24, name:"Flower Dance",        emoji:"💃", note:"Ask someone to dance; buy rare seeds/Pierre stall. 9am–2pm, Cindersap Forest." },
  { season:"Summer", day:11, name:"Luau",                emoji:"🍲", note:"Add your best item to the soup. 9am–2pm, The Beach." },
  { season:"Summer", day:28, name:"Dance of the Moonlight Jellies", emoji:"🪼", note:"Watch the jellies. 10pm, The Beach." },
  { season:"Fall",   day:16, name:"Stardew Valley Fair", emoji:"🎡", note:"Mini-games & grange display (show 9 items!). 9am–3pm, Pelican Town." },
  { season:"Fall",   day:27, name:"Spirit's Eve",        emoji:"🎃", note:"Spooky maze (golden pumpkin!). 10pm, Pelican Town." },
  { season:"Winter", day:8,  name:"Festival of Ice",     emoji:"⛸️", note:"Ice fishing contest. 9am–2pm, Cindersap Forest." },
  { season:"Winter", day:15, name:"Night Market",        emoji:"🚢", note:"3-day market (15–17): shops, art, special fish. 5pm–2am, The Beach." },
  { season:"Winter", day:25, name:"Feast of the Winter Star", emoji:"🎁", note:"Secret gift exchange. 9am–2pm, Pelican Town." },
];
