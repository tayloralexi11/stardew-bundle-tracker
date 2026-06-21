$ErrorActionPreference = "Stop"
$dir = "C:\Users\taylo\OneDrive\Desktop\stardew-bundle-tracker"
$imgDir = "$dir\images"

$villagers = @("Abigail","Alex","Caroline","Clint","Demetrius","Dwarf","Elliott","Emily",
 "Evelyn","George","Gus","Haley","Harvey","Jas","Jodi","Kent","Krobus","Leah","Leo","Lewis",
 "Linus","Marnie","Maru","Pam","Penny","Pierre","Robin","Sam","Sandy","Sebastian","Shane",
 "Vincent","Willy","Wizard")

function Wikitext($page){
  $api = "https://stardewvalleywiki.com/mediawiki/api.php?action=parse&prop=wikitext&format=json&page=" + [uri]::EscapeDataString($page)
  (Invoke-RestMethod -Uri $api -UserAgent "Mozilla/5.0 BundleTracker").parse.wikitext.'*'
}
function ImgUrl($file){
  $api = "https://stardewvalleywiki.com/mediawiki/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles=" + [uri]::EscapeDataString("File:$file")
  $p = (Invoke-RestMethod -Uri $api -UserAgent "Mozilla/5.0").query.pages.PSObject.Properties.Value
  if ($p.imageinfo) { $p.imageinfo[0].url } else { $null }
}

$records = @()
$noPortrait = @()
foreach ($v in $villagers) {
  try { $wt = Wikitext $v } catch { Write-Host "FETCH FAIL: $v"; continue }
  $lines = $wt -split "`n"

  # birthday
  $season=""; $day=0
  if ($wt -match '\|\s*birthday\s*=\s*\{\{Season\|([A-Za-z]+)(?:\|(\d+))?\}\}\s*(\d+)?') {
    $season=$matches[1]
    if ($matches[2]) { $day=[int]$matches[2] } elseif ($matches[3]) { $day=[int]$matches[3] }
  }

  # loves: capture item names from the ICON filename (first cell of each row),
  # only within the Loves section, skipping the villager's own emotion portraits.
  $cat=$null; $loves=@()
  foreach ($ln in $lines) {
    if ($ln -match 'Universal Loves') { $cat='loves'; continue }
    elseif ($ln -match 'Universal Likes') { $cat='done'; continue }
    if ($cat -eq 'loves' -and $ln -match '^\|\s*\[\[File:([^|\]]+?)\.png') {
      $nm = $matches[1].Trim()
      if ($nm -ne $v -and $nm -notlike "$v *") { $loves += $nm }
    }
  }
  $loves = $loves | Select-Object -Unique

  # portrait
  $key = $v.ToLower()
  $url = ImgUrl "$v.png"
  if ($url) { try { Invoke-WebRequest -Uri $url -OutFile "$imgDir\npc_$key.png" -UserAgent "Mozilla/5.0" } catch { $noPortrait += $v } }
  else { $noPortrait += $v }

  $records += [pscustomobject]@{ key=$key; name=$v; season=$season; day=$day; loves=$loves }
  Write-Host ("{0,-12} {1} {2}  loves:{3}" -f $v, $season, $day, $loves.Count)
  Start-Sleep -Milliseconds 150
}

# write data-npcs.js
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("// Stardew villagers - birthdays + loved gifts (parsed from the wiki). Portraits: images/npc_<key>.png")
[void]$sb.AppendLine("const NPCS = [")
foreach ($r in $records) {
  $lovesJs = ($r.loves | ForEach-Object { '"' + ($_ -replace '"','\"') + '"' }) -join ","
  $line = '  { key:"' + $r.key + '", name:"' + $r.name + '", birthday:{ season:"' + $r.season + '", day:' + $r.day + ' }, loves:[' + $lovesJs + '] },'
  [void]$sb.AppendLine($line)
}
[void]$sb.AppendLine("];")
[System.IO.File]::WriteAllText("$dir\data-npcs.js", $sb.ToString())

Write-Host "`n=== done: $($records.Count) villagers ==="
if ($noPortrait.Count) { Write-Host "NO PORTRAIT: $($noPortrait -join ', ')" }
