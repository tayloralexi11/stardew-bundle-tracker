// Stardew Valley Community Center — standard bundle data
// seasons: array of "Spring"|"Summer"|"Fall"|"Winter"|"Any"
// cart: true | false  (false = Traveling Cart never sells it)
// req: optional weather/time note
// quality: optional ("Gold", "Silver+")
const DATA = {
  rooms: [
    {
      id: "crafts", name: "Crafts Room", emoji: "🛠️",
      reward: "Repairs the bridge by the Mines → unlocks the Quarry",
      bundles: [
        { id: "spring-forage", name: "Spring Foraging", reward: "30 Spring Seeds", need: 4, items: [
          { img:"wild_horseradish", name:"Wild Horseradish", how:"Foraging", seasons:["Spring"], cart:true },
          { img:"daffodil", name:"Daffodil", how:"Foraging; Pierre at Flower Dance", seasons:["Spring"], cart:true },
          { img:"leek", name:"Leek", how:"Foraging", seasons:["Spring"], cart:true },
          { img:"dandelion", name:"Dandelion", how:"Foraging; Pierre at Flower Dance", seasons:["Spring"], cart:true },
        ]},
        { id: "summer-forage", name: "Summer Foraging", reward: "30 Summer Seeds", need: 3, items: [
          { img:"grape", name:"Grape", how:"Foraging; also a Fall crop", seasons:["Summer"], cart:true },
          { img:"spice_berry", name:"Spice Berry", how:"Foraging; Farm Cave (fruit bat)", seasons:["Summer"], cart:true },
          { img:"sweet_pea", name:"Sweet Pea", how:"Foraging", seasons:["Summer"], cart:true },
        ]},
        { id: "fall-forage", name: "Fall Foraging", reward: "30 Fall Seeds", need: 4, items: [
          { img:"common_mushroom", name:"Common Mushroom", how:"Foraging; Secret Woods; Farm Cave; Mushroom Tree", seasons:["Fall"], cart:true },
          { img:"wild_plum", name:"Wild Plum", how:"Foraging; Farm Cave (fruit bat)", seasons:["Fall"], cart:true },
          { img:"hazelnut", name:"Hazelnut", how:"Foraging", seasons:["Fall"], cart:true },
          { img:"blackberry", name:"Blackberry", how:"Foraging (esp. Blackberry Season); Farm Cave", seasons:["Fall"], cart:true },
        ]},
        { id: "winter-forage", name: "Winter Foraging", reward: "30 Winter Seeds", need: 4, items: [
          { img:"winter_root", name:"Winter Root", how:"Till soil / Artifact Spots; Blue Slimes", seasons:["Winter"], cart:true },
          { img:"crystal_fruit", name:"Crystal Fruit", how:"Foraging; Dust Sprites", seasons:["Winter"], cart:true },
          { img:"snow_yam", name:"Snow Yam", how:"Till soil / Artifact Spots", seasons:["Winter"], cart:true },
          { img:"crocus", name:"Crocus", how:"Foraging", seasons:["Winter"], cart:true },
        ]},
        { id: "construction", name: "Construction", reward: "1 Charcoal Kiln", need: 4, items: [
          { img:"wood", name:"Wood", qty:99, how:"Chop trees; buy at Carpenter's", seasons:["Any"], cart:true },
          { img:"wood", name:"Wood", qty:99, how:"Chop trees; buy at Carpenter's", seasons:["Any"], cart:true },
          { img:"stone", name:"Stone", qty:99, how:"Smash rocks; buy at Carpenter's", seasons:["Any"], cart:true },
          { img:"hardwood", name:"Hardwood", qty:10, how:"Large Stumps/Logs; Mine crates; Mahogany Trees", seasons:["Any"], cart:true },
        ]},
        { id: "exotic-forage", name: "Exotic Foraging", reward: "5 Autumn's Bounty", need: 5, items: [
          { img:"coconut", name:"Coconut", how:"Desert/Oasis; shake Palm Tree", seasons:["Any"], cart:true },
          { img:"cactus_fruit", name:"Cactus Fruit", how:"Desert foraging; Oasis", seasons:["Any"], cart:true },
          { img:"cave_carrot", name:"Cave Carrot", how:"Mines — boxes or till soil", seasons:["Any"], cart:true },
          { img:"red_mushroom", name:"Red Mushroom", how:"Mines; Secret Woods; Farm Cave; Mushroom Tree", seasons:["Summer","Fall"], cart:true },
          { img:"purple_mushroom", name:"Purple Mushroom", how:"Deep Mines; Farm Cave; Forest Farm", seasons:["Fall"], cart:true, hard:true },
          { img:"maple_syrup", name:"Maple Syrup", how:"Tap a Maple Tree", seasons:["Any"], cart:true },
          { img:"oak_resin", name:"Oak Resin", how:"Tap an Oak Tree; Haunted Skull drop", seasons:["Any"], cart:true },
          { img:"pine_tar", name:"Pine Tar", how:"Tap a Pine Tree", seasons:["Any"], cart:true },
          { img:"morel", name:"Morel", how:"Secret Woods / Forest Farm; Farm Cave", seasons:["Spring"], cart:true },
        ]},
      ]
    },
    {
      id: "pantry", name: "Pantry", emoji: "🥫",
      reward: "Restores the Greenhouse on your farm",
      bundles: [
        { id: "spring-crops", name: "Spring Crops", reward: "20 Speed-Gro", need: 4, items: [
          { img:"parsnip", name:"Parsnip", how:"Grow it", seasons:["Spring"], cart:true },
          { img:"green_bean", name:"Green Bean", how:"Grow it", seasons:["Spring"], cart:true },
          { img:"cauliflower", name:"Cauliflower", how:"Grow it", seasons:["Spring"], cart:true },
          { img:"potato", name:"Potato", how:"Grow it", seasons:["Spring"], cart:true },
        ]},
        { id: "summer-crops", name: "Summer Crops", reward: "1 Quality Sprinkler", need: 4, items: [
          { img:"tomato", name:"Tomato", how:"Grow it", seasons:["Summer"], cart:true },
          { img:"hot_pepper", name:"Hot Pepper", how:"Grow it", seasons:["Summer"], cart:true },
          { img:"blueberry", name:"Blueberry", how:"Grow it", seasons:["Summer"], cart:true },
          { img:"melon", name:"Melon", how:"Grow it", seasons:["Summer"], cart:true },
        ]},
        { id: "fall-crops", name: "Fall Crops", reward: "1 Bee House", need: 4, items: [
          { img:"corn", name:"Corn", how:"Grow it", seasons:["Summer","Fall"], cart:true },
          { img:"eggplant", name:"Eggplant", how:"Grow it", seasons:["Fall"], cart:true },
          { img:"pumpkin", name:"Pumpkin", how:"Grow it", seasons:["Fall"], cart:true },
          { img:"yam", name:"Yam", how:"Grow it; Duggies (Mines 6–29)", seasons:["Fall"], cart:true },
        ]},
        { id: "quality-crops", name: "Quality Crops", reward: "1 Preserves Jar", need: 3, note:"All must be GOLD quality — never at the Cart.", items: [
          { img:"parsnip", name:"Parsnip", qty:5, quality:"Gold", how:"Grow with fertilizer / high Farming", seasons:["Spring"], cart:false },
          { img:"melon", name:"Melon", qty:5, quality:"Gold", how:"Grow with fertilizer / high Farming", seasons:["Summer"], cart:false },
          { img:"pumpkin", name:"Pumpkin", qty:5, quality:"Gold", how:"Grow with fertilizer / high Farming", seasons:["Fall"], cart:false },
          { img:"corn", name:"Corn", qty:5, quality:"Gold", how:"Grow with fertilizer / high Farming", seasons:["Summer","Fall"], cart:false },
        ]},
        { id: "animal", name: "Animal", reward: "1 Cheese Press", need: 5, items: [
          { img:"large_milk", name:"Large Milk", how:"Cows (high friendship)", seasons:["Any"], cart:true },
          { img:"large_egg_brown", name:"Large Egg (brown)", how:"Brown chickens", seasons:["Any"], cart:true },
          { img:"large_egg_white", name:"Large Egg (white)", how:"White chickens", seasons:["Any"], cart:true },
          { img:"large_goat_milk", name:"Large Goat Milk", how:"Goats", seasons:["Any"], cart:true },
          { img:"wool", name:"Wool", how:"Sheep; Rabbits", seasons:["Any"], cart:true },
          { img:"duck_egg", name:"Duck Egg", how:"Ducks", seasons:["Any"], cart:true },
        ]},
        { id: "artisan", name: "Artisan", reward: "1 Keg", need: 6, items: [
          { img:"truffle_oil", name:"Truffle Oil", how:"Oil Maker, from Truffles", seasons:["Any"], cart:true },
          { img:"cloth", name:"Cloth", how:"Loom (wool); recycle; Desert Trader; Mummy", seasons:["Any"], cart:true },
          { img:"goat_cheese", name:"Goat Cheese", how:"Cheese Press (goat milk)", seasons:["Any"], cart:true },
          { img:"cheese", name:"Cheese", how:"Cheese Press (cow milk); Desert Trader", seasons:["Any"], cart:true },
          { img:"honey", name:"Honey", how:"Bee House; Oasis shop", seasons:["Any"], cart:true },
          { img:"jelly", name:"Jelly", how:"Preserves Jar (any fruit)", seasons:["Any"], cart:true },
          { img:"apple", name:"Apple", how:"Apple Tree; Farm Cave", seasons:["Fall"], cart:true },
          { img:"apricot", name:"Apricot", how:"Apricot Tree; Farm Cave", seasons:["Spring"], cart:true },
          { img:"orange", name:"Orange", how:"Orange Tree; Farm Cave", seasons:["Summer"], cart:true },
          { img:"peach", name:"Peach", how:"Peach Tree; Farm Cave", seasons:["Summer"], cart:true },
          { img:"pomegranate", name:"Pomegranate", how:"Pomegranate Tree; Farm Cave", seasons:["Fall"], cart:true },
          { img:"cherry", name:"Cherry", how:"Cherry Tree; Farm Cave", seasons:["Spring"], cart:true },
        ]},
      ]
    },
    {
      id: "fishtank", name: "Fish Tank", emoji: "🐟",
      reward: "Removes the Glittering Boulder (enables panning); Willy gives a Copper Pan",
      bundles: [
        { id: "river-fish", name: "River Fish", reward: "30 Deluxe Bait", need: 4, items: [
          { img:"sunfish", name:"Sunfish", how:"Rivers", req:"Sunny · 6am–7pm", seasons:["Spring","Summer"], cart:true },
          { img:"catfish", name:"Catfish", how:"Rivers & Secret Woods", req:"Rain · 6am–12am", seasons:["Spring","Fall"], cart:true },
          { img:"shad", name:"Shad", how:"Rivers", req:"Rain · 9am–2am", seasons:["Spring","Summer","Fall"], cart:true },
          { img:"tiger_trout", name:"Tiger Trout", how:"Rivers", req:"6am–7pm", seasons:["Fall","Winter"], cart:true },
        ]},
        { id: "lake-fish", name: "Lake Fish", reward: "1 Dressed Spinner", need: 4, items: [
          { img:"largemouth_bass", name:"Largemouth Bass", how:"Mountain Lake", req:"6am–7pm", seasons:["Any"], cart:true },
          { img:"carp", name:"Carp", how:"Mountain Lake; Secret Woods; Sewer", seasons:["Spring","Summer","Fall"], cart:true },
          { img:"bullhead", name:"Bullhead", how:"Mountain Lake, anytime", seasons:["Any"], cart:true },
          { img:"sturgeon", name:"Sturgeon", how:"Mountain Lake", req:"6am–7pm", seasons:["Summer","Winter"], cart:true },
        ]},
        { id: "ocean-fish", name: "Ocean Fish", reward: "5 Warp Totem: Beach", need: 4, items: [
          { img:"sardine", name:"Sardine", how:"Ocean", req:"6am–7pm", seasons:["Spring","Fall","Winter"], cart:true },
          { img:"tuna", name:"Tuna", how:"Ocean", req:"6am–7pm", seasons:["Summer","Winter"], cart:true },
          { img:"red_snapper", name:"Red Snapper", how:"Ocean", req:"Rain · 6am–7pm", seasons:["Summer","Fall"], cart:true },
          { img:"tilapia", name:"Tilapia", how:"Ocean", req:"6am–2pm", seasons:["Summer","Fall"], cart:true },
        ]},
        { id: "night-fish", name: "Night Fishing", reward: "1 Glow Ring", need: 3, items: [
          { img:"walleye", name:"Walleye", how:"Rivers/Lake/Forest Pond", req:"Rain · 12pm–2am", seasons:["Fall"], cart:true },
          { img:"bream", name:"Bream", how:"Rivers", req:"6pm–2am", seasons:["Any"], cart:true },
          { img:"eel", name:"Eel", how:"Ocean", req:"Rain · 4pm–2am", seasons:["Spring","Fall"], cart:true },
        ]},
        { id: "crab-pot", name: "Crab Pot", reward: "3 Crab Pot", need: 5, items: [
          { img:"lobster", name:"Lobster", how:"Crab Pot (ocean)", seasons:["Any"], cart:true },
          { img:"crayfish", name:"Crayfish", how:"Crab Pot (freshwater)", seasons:["Any"], cart:true },
          { img:"crab", name:"Crab", how:"Crab Pot (ocean); Mine crabs", seasons:["Any"], cart:true },
          { img:"cockle", name:"Cockle", how:"Crab Pot (ocean); Beach foraging", seasons:["Any"], cart:true },
          { img:"mussel", name:"Mussel", how:"Crab Pot (ocean); Beach foraging", seasons:["Any"], cart:true },
          { img:"shrimp", name:"Shrimp", how:"Crab Pot (ocean)", seasons:["Any"], cart:true },
          { img:"snail", name:"Snail", how:"Crab Pot (freshwater)", seasons:["Any"], cart:true },
          { img:"periwinkle", name:"Periwinkle", how:"Crab Pot (freshwater)", seasons:["Any"], cart:true },
          { img:"oyster", name:"Oyster", how:"Crab Pot (ocean); Beach foraging", seasons:["Any"], cart:true },
          { img:"clam", name:"Clam", how:"Crab Pot (ocean); Beach foraging", seasons:["Any"], cart:true },
        ]},
        { id: "specialty-fish", name: "Specialty Fish", reward: "5 Dish O' The Sea", need: 4, items: [
          { img:"pufferfish", name:"Pufferfish", how:"Ocean", req:"Sunny · 12pm–4pm", seasons:["Summer"], cart:true },
          { img:"ghostfish", name:"Ghostfish", how:"Mines ponds (20 & 60); Ghost drop", seasons:["Any"], cart:true },
          { img:"sandfish", name:"Sandfish", how:"Desert pond", req:"6am–8pm · Desert", seasons:["Any"], cart:true, hard:true },
          { img:"woodskip", name:"Woodskip", how:"Secret Woods & Forest Farm pond", seasons:["Any"], cart:true },
        ]},
      ]
    },
    {
      id: "boiler", name: "Boiler Room", emoji: "🔥",
      reward: "Repairs the Minecarts (fast travel)",
      bundles: [
        { id: "blacksmith", name: "Blacksmith's", reward: "1 Furnace", need: 3, items: [
          { img:"copper_bar", name:"Copper Bar", how:"Smelt Copper Ore", seasons:["Any"], cart:true },
          { img:"iron_bar", name:"Iron Bar", how:"Smelt Iron Ore; Transmute (Fe)", seasons:["Any"], cart:true },
          { img:"gold_bar", name:"Gold Bar", how:"Smelt Gold Ore; Transmute (Au)", seasons:["Any"], cart:true },
        ]},
        { id: "geologist", name: "Geologist's", reward: "5 Omni Geode", need: 4, items: [
          { img:"quartz", name:"Quartz", how:"Foraged on all Mine floors", seasons:["Any"], cart:false },
          { img:"earth_crystal", name:"Earth Crystal", how:"Mines 1–39; Geodes; Duggy drop", seasons:["Any"], cart:false },
          { img:"frozen_tear", name:"Frozen Tear", how:"Mines 41–79; Geodes; Dust Sprite", seasons:["Any"], cart:false },
          { img:"fire_quartz", name:"Fire Quartz", how:"Mines 81–119; Magma/Omni Geodes", seasons:["Any"], cart:false },
        ]},
        { id: "adventurer", name: "Adventurer's", reward: "1 Small Magnet Ring", need: 2, items: [
          { img:"slime", name:"Slime", qty:99, how:"Dropped by Slimes", seasons:["Any"], cart:true },
          { img:"bat_wing", name:"Bat Wing", qty:10, how:"Dropped by Bats", seasons:["Any"], cart:true },
          { img:"solar_essence", name:"Solar Essence", how:"Ghost/Squid Kid/Metal Head/Mummy; Krobus", seasons:["Any"], cart:true },
          { img:"void_essence", name:"Void Essence", how:"Shadow/Serpent drops; Krobus", seasons:["Any"], cart:true },
        ]},
      ]
    },
    {
      id: "bulletin", name: "Bulletin Board", emoji: "📋",
      reward: "+2 hearts with every non-datable villager you've met",
      bundles: [
        { id: "chef", name: "Chef's", reward: "3 Pink Cake", need: 6, items: [
          { img:"maple_syrup", name:"Maple Syrup", how:"Tap a Maple Tree", seasons:["Any"], cart:true },
          { img:"fiddlehead_fern", name:"Fiddlehead Fern", how:"Secret Woods; Skull Cavern; Green Rain", seasons:["Summer"], cart:true, hard:true },
          { img:"truffle", name:"Truffle", how:"Pigs (outdoors)", seasons:["Any"], cart:true, hard:true },
          { img:"poppy", name:"Poppy", how:"Grow it", seasons:["Summer"], cart:true },
          { img:"maki_roll", name:"Maki Roll", how:"Cooking (Queen of Sauce / Saloon)", seasons:["Any"], cart:true },
          { img:"fried_egg", name:"Fried Egg", how:"Cooking (any egg)", seasons:["Any"], cart:true },
        ]},
        { id: "dye", name: "Dye", reward: "1 Seed Maker", need: 6, items: [
          { img:"red_mushroom", name:"Red Mushroom", how:"Mines; Secret Woods; Farm Cave", seasons:["Summer","Fall"], cart:true },
          { img:"sea_urchin", name:"Sea Urchin", how:"Beach foraging; Beach Farm", seasons:["Any"], cart:true },
          { img:"sunflower", name:"Sunflower", how:"Grow it", seasons:["Summer","Fall"], cart:true },
          { img:"duck_feather", name:"Duck Feather", how:"Ducks", seasons:["Any"], cart:true },
          { img:"aquamarine", name:"Aquamarine", how:"Aquamarine nodes; Mine boxes; fishing chests", seasons:["Any"], cart:false },
          { img:"red_cabbage", name:"Red Cabbage", how:"Grow (seeds Yr2+/Cart); Serpent/Mummy/Slime", seasons:["Summer"], cart:true, hard:true },
        ]},
        { id: "field-research", name: "Field Research", reward: "1 Recycling Machine", need: 4, items: [
          { img:"purple_mushroom", name:"Purple Mushroom", how:"Deep Mines; Farm Cave; Forest Farm", seasons:["Fall"], cart:true, hard:true },
          { img:"nautilus_shell", name:"Nautilus Shell", how:"Winter beach; Beach Farm; Demetrius gift", seasons:["Winter"], cart:true, hard:true },
          { img:"chub", name:"Chub", how:"Mountain Lake & rivers, anytime", seasons:["Any"], cart:true },
          { img:"frozen_geode", name:"Frozen Geode", how:"Mines floors 41–79", seasons:["Any"], cart:false },
        ]},
        { id: "fodder", name: "Fodder", reward: "1 Heater", need: 3, items: [
          { img:"wheat", name:"Wheat", qty:10, how:"Grow it", seasons:["Summer","Fall"], cart:true },
          { img:"hay", name:"Hay", qty:10, how:"Marnie's/Desert Trader; cut grass or wheat", seasons:["Any"], cart:false },
          { img:"apple", name:"Apple", qty:3, how:"Apple Tree; Farm Cave", seasons:["Fall"], cart:true },
        ]},
        { id: "enchanter", name: "Enchanter's", reward: "5 Gold Bars", need: 4, items: [
          { img:"oak_resin", name:"Oak Resin", how:"Tap an Oak Tree", seasons:["Any"], cart:true },
          { img:"wine", name:"Wine", how:"Keg (any fruit)", seasons:["Any"], cart:true },
          { img:"rabbits_foot", name:"Rabbit's Foot", how:"Rabbits; Serpent drop; Cat", seasons:["Any"], cart:true },
          { img:"pomegranate", name:"Pomegranate", how:"Pomegranate Tree; Farm Cave", seasons:["Fall"], cart:true },
        ]},
      ]
    },
    {
      id: "vault", name: "Vault", emoji: "💰",
      reward: "Repairs the Bus → unlocks The Calico Desert (total 42,500g)",
      bundles: [
        { id: "vault-money", name: "Gold Goals", reward: "See each tier", need: 4, items: [
          { img:"gold_coin", name:"2,500g Bundle", how:"Deposit 2,500g — reward: 3 Chocolate Cake", seasons:["Any"], cart:null },
          { img:"gold_coin", name:"5,000g Bundle", how:"Deposit 5,000g — reward: 30 Quality Fertilizer", seasons:["Any"], cart:null },
          { img:"gold_coin", name:"10,000g Bundle", how:"Deposit 10,000g — reward: 1 Lightning Rod", seasons:["Any"], cart:null },
          { img:"gold_coin", name:"25,000g Bundle", how:"Deposit 25,000g — reward: 1 Crystalarium", seasons:["Any"], cart:null },
        ]},
      ]
    },
    {
      id: "missing", name: "The Missing Bundle", emoji: "⚡",
      reward: "Movie Theater (appears only after the whole CC is complete)",
      bundles: [
        { id: "missing-bundle", name: "The Missing Bundle", reward: "Movie Theater", need: 5, note:"Several need quality levels — Cart can't supply those.", items: [
          { img:"wine", name:"Wine", quality:"Silver+", how:"Age in a Cask; Ginger Island resort", seasons:["Any"], cart:false },
          { img:"dinosaur_mayonnaise", name:"Dinosaur Mayonnaise", how:"Mayo Machine (dinosaur egg)", seasons:["Any"], cart:false },
          { img:"prismatic_shard", name:"Prismatic Shard", how:"Mining (rare)", seasons:["Any"], cart:false },
          { img:"ancient_fruit", name:"Ancient Fruit", qty:5, quality:"Gold", how:"Grow Ancient Fruit", seasons:["Any"], cart:false },
          { img:"void_salmon", name:"Void Salmon", quality:"Gold/Irid.", how:"Fish the Witch's Swamp", seasons:["Any"], cart:false },
          { img:"caviar", name:"Caviar", how:"Preserves Jar, from Sturgeon roe", seasons:["Any"], cart:true, hard:true },
        ]},
      ]
    },
  ]
};
