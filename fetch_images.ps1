$ErrorActionPreference = "Stop"
$outDir = "C:\Users\taylo\OneDrive\Desktop\stardew-bundle-tracker\images"

# localKey -> wiki File name
$map = [ordered]@{
  "wild_horseradish"="Wild Horseradish.png"; "daffodil"="Daffodil.png"; "leek"="Leek.png"; "dandelion"="Dandelion.png";
  "grape"="Grape.png"; "spice_berry"="Spice Berry.png"; "sweet_pea"="Sweet Pea.png";
  "common_mushroom"="Common Mushroom.png"; "wild_plum"="Wild Plum.png"; "hazelnut"="Hazelnut.png"; "blackberry"="Blackberry.png";
  "winter_root"="Winter Root.png"; "crystal_fruit"="Crystal Fruit.png"; "snow_yam"="Snow Yam.png"; "crocus"="Crocus.png";
  "wood"="Wood.png"; "stone"="Stone.png"; "hardwood"="Hardwood.png";
  "coconut"="Coconut.png"; "cactus_fruit"="Cactus Fruit.png"; "cave_carrot"="Cave Carrot.png"; "red_mushroom"="Red Mushroom.png";
  "purple_mushroom"="Purple Mushroom.png"; "maple_syrup"="Maple Syrup.png"; "oak_resin"="Oak Resin.png"; "pine_tar"="Pine Tar.png"; "morel"="Morel.png";
  "parsnip"="Parsnip.png"; "green_bean"="Green Bean.png"; "cauliflower"="Cauliflower.png"; "potato"="Potato.png";
  "tomato"="Tomato.png"; "hot_pepper"="Hot Pepper.png"; "blueberry"="Blueberry.png"; "melon"="Melon.png";
  "corn"="Corn.png"; "eggplant"="Eggplant.png"; "pumpkin"="Pumpkin.png"; "yam"="Yam.png";
  "large_milk"="Large Milk.png"; "large_egg_brown"="Large Egg.png"; "large_egg_white"="Large Egg (White).png";
  "large_goat_milk"="Large Goat Milk.png"; "wool"="Wool.png"; "duck_egg"="Duck Egg.png";
  "truffle_oil"="Truffle Oil.png"; "cloth"="Cloth.png"; "goat_cheese"="Goat Cheese.png"; "cheese"="Cheese.png";
  "honey"="Honey.png"; "jelly"="Jelly.png"; "apple"="Apple.png"; "apricot"="Apricot.png"; "orange"="Orange.png";
  "peach"="Peach.png"; "pomegranate"="Pomegranate.png"; "cherry"="Cherry.png";
  "sunfish"="Sunfish.png"; "catfish"="Catfish.png"; "shad"="Shad.png"; "tiger_trout"="Tiger Trout.png";
  "largemouth_bass"="Largemouth Bass.png"; "carp"="Carp.png"; "bullhead"="Bullhead.png"; "sturgeon"="Sturgeon.png";
  "sardine"="Sardine.png"; "tuna"="Tuna.png"; "red_snapper"="Red Snapper.png"; "tilapia"="Tilapia.png";
  "walleye"="Walleye.png"; "bream"="Bream.png"; "eel"="Eel.png";
  "lobster"="Lobster.png"; "crayfish"="Crayfish.png"; "crab"="Crab.png"; "cockle"="Cockle.png"; "mussel"="Mussel.png";
  "shrimp"="Shrimp.png"; "snail"="Snail.png"; "periwinkle"="Periwinkle.png"; "oyster"="Oyster.png"; "clam"="Clam.png";
  "pufferfish"="Pufferfish.png"; "ghostfish"="Ghostfish.png"; "sandfish"="Sandfish.png"; "woodskip"="Woodskip.png";
  "copper_bar"="Copper Bar.png"; "iron_bar"="Iron Bar.png"; "gold_bar"="Gold Bar.png";
  "quartz"="Quartz.png"; "earth_crystal"="Earth Crystal.png"; "frozen_tear"="Frozen Tear.png"; "fire_quartz"="Fire Quartz.png";
  "slime"="Slime.png"; "bat_wing"="Bat Wing.png"; "solar_essence"="Solar Essence.png"; "void_essence"="Void Essence.png";
  "fiddlehead_fern"="Fiddlehead Fern.png"; "truffle"="Truffle.png"; "poppy"="Poppy.png"; "maki_roll"="Maki Roll.png"; "fried_egg"="Fried Egg.png";
  "sea_urchin"="Sea Urchin.png"; "sunflower"="Sunflower.png"; "duck_feather"="Duck Feather.png"; "aquamarine"="Aquamarine.png";
  "red_cabbage"="Red Cabbage.png"; "nautilus_shell"="Nautilus Shell.png"; "chub"="Chub.png"; "frozen_geode"="Frozen Geode.png";
  "wheat"="Wheat.png"; "hay"="Hay.png"; "wine"="Wine.png"; "rabbits_foot"="Rabbit's Foot.png";
  "dinosaur_mayonnaise"="Dinosaur Mayonnaise.png"; "prismatic_shard"="Prismatic Shard.png"; "ancient_fruit"="Ancient Fruit.png";
  "void_salmon"="Void Salmon.png"; "caviar"="Caviar.png"; "gold_coin"="Gold.png";
}

# Build reverse lookup: normalized wiki title -> localKey
$titleToKey = @{}
foreach ($k in $map.Keys) {
  $t = "File:" + $map[$k]
  $titleToKey[$t] = $k
}

$keys = @($map.Keys)
$titles = @($keys | ForEach-Object { "File:" + $map[$_] })

$urlByKey = @{}
$missing = @()

for ($i = 0; $i -lt $titles.Count; $i += 40) {
  $batch = $titles[$i..([Math]::Min($i+39, $titles.Count-1))]
  $joined = ($batch -join "|")
  $api = "https://stardewvalleywiki.com/mediawiki/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles=" + [uri]::EscapeDataString($joined)
  $resp = Invoke-RestMethod -Uri $api -UserAgent "Mozilla/5.0 BundleTracker"
  # normalization map (requested title -> normalized title)
  $norm = @{}
  if ($resp.query.normalized) { foreach ($n in $resp.query.normalized) { $norm[$n.to] = $n.from } }
  foreach ($p in $resp.query.pages.PSObject.Properties) {
    $page = $p.Value
    $title = $page.title
    # figure out original requested title
    $orig = if ($norm.ContainsKey($title)) { $norm[$title] } else { $title }
    if ($page.imageinfo) {
      $url = $page.imageinfo[0].url
      if ($titleToKey.ContainsKey($orig)) { $urlByKey[$titleToKey[$orig]] = $url }
      elseif ($titleToKey.ContainsKey($title)) { $urlByKey[$titleToKey[$title]] = $url }
    }
  }
  Start-Sleep -Milliseconds 300
}

# Report any keys without a resolved URL
foreach ($k in $keys) {
  if (-not $urlByKey.ContainsKey($k)) { $missing += $k }
}

Write-Host "Resolved URLs: $($urlByKey.Count) / $($keys.Count)"
if ($missing.Count -gt 0) { Write-Host "NO URL FOR: $($missing -join ', ')" }

# Download
$failed = @()
foreach ($k in $urlByKey.Keys) {
  $dest = Join-Path $outDir ($k + ".png")
  try {
    Invoke-WebRequest -Uri $urlByKey[$k] -OutFile $dest -UserAgent "Mozilla/5.0 BundleTracker"
  } catch {
    $failed += $k
  }
  Start-Sleep -Milliseconds 80
}
Write-Host "Downloaded OK. Failed downloads: $($failed -join ', ')"
