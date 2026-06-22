$ErrorActionPreference = "Stop"
$dir = "C:\Users\taylo\OneDrive\Desktop\stardew-bundle-tracker"
$imgDir = "$dir\images"

$villagerKeys = @("abigail","alex","caroline","clint","demetrius","dwarf","elliott","emily",
 "evelyn","george","gus","haley","harvey","jas","jodi","kent","krobus","leah","leo","lewis",
 "linus","marnie","maru","pam","penny","pierre","robin","sam","sandy","sebastian","shane",
 "vincent","willy","wizard")
$validKeys = New-Object System.Collections.Generic.HashSet[string]
$villagerKeys | ForEach-Object { [void]$validKeys.Add($_) }

function Slug($s){ (($s.ToLower() -replace "&amp;","and") -replace "[^a-z0-9]+","_").Trim("_") }
function JsStr($s){ '"' + (($s -replace '\\','\\\\') -replace '"','\"' -replace "`r","" -replace "`n"," ") + '"' }
function Clean($s){
  if(-not $s){ return "" }
  $s = $s -replace '\{\{Season\|([A-Za-z]+)(\|\d+)?\}\}','$1'
  $s = $s -replace '\{\{[Nn]ame\|([^|}]+)(\|[^}]*)?\}\}','$1'
  $s = $s -replace '\{\{[Bb]undle\|([^}]*)\}\}','Bundle'
  $s = $s -replace '\{\{[^}]*\}\}',''
  $s = $s -replace '\[\[[^\]|]*\|([^\]]+)\]\]','$1'
  $s = $s -replace '\[\[([^\]]+)\]\]','$1'
  $s = $s -replace "'''",'' ; $s = $s -replace "''",''
  $s = $s -replace '<br\s*/?>',' - '
  $s = $s -replace '<[^>]+>',''
  $s = $s -replace '\s+',' '
  $s.Trim()
}

# ---------- collect item names from existing data files ----------
$names = New-Object System.Collections.Generic.HashSet[string]
$npc = Get-Content "$dir\data-npcs.js" -Raw
foreach($m in [regex]::Matches($npc,'(?:loves|likes|neutral|dislikes|hates):\[([^\]]*)\]')){
  foreach($mm in [regex]::Matches($m.Groups[1].Value,'"([^"]+)"')){ [void]$names.Add($mm.Groups[1].Value) }
}
$bun = Get-Content "$dir\data.js" -Raw
foreach($m in [regex]::Matches($bun,'img:"[^"]+",\s*name:"([^"]+)"')){
  $nm = $m.Groups[1].Value -replace '\s*\(.*\)$',''   # strip "(brown)" etc.
  if($nm -notmatch 'g Bundle$'){ [void]$names.Add($nm) }
}
$crp = Get-Content "$dir\data-crops.js" -Raw
foreach($m in [regex]::Matches($crp,'img:"[^"]+",\s+name:"([^"]+)"')){
  [void]$names.Add(($m.Groups[1].Value -replace ' Tree$',''))
}
$names.Remove("Wood (second wood slot)") | Out-Null
$nameList = @($names) | Sort-Object
Write-Host "Collected $($nameList.Count) unique item names to look up."

# ---------- scrape each item ----------
$items=@()
$imgFile=@{}
$i=0
foreach($nm in $nameList){
  $i++
  try {
    $api="https://stardewvalleywiki.com/mediawiki/api.php?action=parse&prop=wikitext&format=json&page="+[uri]::EscapeDataString($nm)
    $wt=(Invoke-RestMethod -Uri $api -UserAgent "Mozilla/5.0 BundleTracker").parse.wikitext.'*'
  } catch { Write-Host "miss: $nm"; continue }

  $sell=0
  if($wt -match '(?m)^\s*\|\s*sellprice\s*=\s*(\d+)'){ $sell=[int]$matches[1] }
  elseif($wt -match '(?m)^\s*\|\s*price\s*=\s*(\d+)'){ $sell=[int]$matches[1] }

  $season=""; if($wt -match '(?m)^\s*\|\s*season\s*=\s*(.+)$'){ $season=Clean $matches[1] }
  $source=""; if($wt -match '(?m)^\s*\|\s*source\s*=\s*(.+)$'){ $source=Clean $matches[1] }
  $loc="";    if($wt -match '(?m)^\s*\|\s*location\s*=\s*(.+)$'){ $loc=Clean $matches[1] }
  $time="";   if($wt -match '(?m)^\s*\|\s*time\s*=\s*(.+)$'){ $time=Clean $matches[1] }
  $weather="";if($wt -match '(?m)^\s*\|\s*weather\s*=\s*(.+)$'){ $weather=Clean $matches[1] }
  $ingr="";   if($wt -match '(?m)^\s*\|\s*ingredients\s*=\s*(.+)$'){ $ingr=Clean $matches[1] }

  $cat="item"
  if($wt -match '\{\{Infobox\s+(\w+)'){ $cat=$matches[1].ToLower() }

  $tastes=@{love=@();like=@();neutral=@();dislike=@();hate=@()}
  foreach($tk in @('love','like','neutral','dislike','hate')){
    if($wt -match "(?m)^\s*\|\s*$tk\s*=\s*(.+)$"){
      foreach($v in ($matches[1] -split ',')){
        $k=($v.Trim().ToLower() -replace '\[\[|\]\]','')
        if($validKeys.Contains($k)){ $tastes[$tk]+=$k }
      }
    }
  }

  $imgName=$nm
  if($wt -match '(?m)^\s*\|\s*image\s*=\s*([^\r\n|]+\.png)'){ $imgName=($matches[1].Trim() -replace '\.png$','') }
  $imgFile[(Slug $nm)]=$imgName

  $items += [pscustomobject]@{ slug=(Slug $nm); name=$nm; sell=$sell; season=$season; source=$source;
    loc=$loc; time=$time; weather=$weather; ingr=$ingr; cat=$cat; tastes=$tastes }
  if($i % 40 -eq 0){ Write-Host "  …$i / $($nameList.Count)" }
  Start-Sleep -Milliseconds 110
}
Write-Host "Parsed $($items.Count) items."

# ---------- download icons (item_<slug>.png) ----------
$pairs = $imgFile.GetEnumerator() | ForEach-Object { [pscustomobject]@{ slug=$_.Key; file=$_.Value } }
$urlBySlug=@{}
for($j=0;$j -lt $pairs.Count;$j+=40){
  $batch=$pairs[$j..([Math]::Min($j+39,$pairs.Count-1))]
  $titles=($batch | ForEach-Object { "File:$($_.file).png" }) -join "|"
  $api="https://stardewvalleywiki.com/mediawiki/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles="+[uri]::EscapeDataString($titles)
  $r=Invoke-RestMethod -Uri $api -UserAgent "Mozilla/5.0"
  $norm=@{}; if($r.query.normalized){foreach($n in $r.query.normalized){$norm[$n.to]=$n.from}}
  $byTitle=@{}
  foreach($p in $r.query.pages.PSObject.Properties.Value){ if($p.imageinfo){ $t=$p.title; if($norm.ContainsKey($t)){$t=$norm[$t]}; $byTitle[$t]=$p.imageinfo[0].url } }
  foreach($b in $batch){ $t="File:$($b.file).png"; if($byTitle.ContainsKey($t)){ $urlBySlug[$b.slug]=$byTitle[$t] } }
  Start-Sleep -Milliseconds 150
}
$dl=0;$miss=@()
foreach($it in $items){
  if($urlBySlug.ContainsKey($it.slug)){
    $dest="$imgDir\item_$($it.slug).png"
    if(-not (Test-Path $dest)){ try{ Invoke-WebRequest -Uri $urlBySlug[$it.slug] -OutFile $dest -UserAgent "Mozilla/5.0"; $dl++ }catch{$miss+=$it.name}; Start-Sleep -Milliseconds 35 } else { $dl++ }
  } else { $miss+=$it.name }
}
Write-Host "Item icons present: $dl ; missing: $($miss.Count)"

# ---------- write data-items.js ----------
$sb=New-Object System.Text.StringBuilder
[void]$sb.AppendLine("// Stardew items - sell price, source, season, gift reactions (parsed from wiki infoboxes).")
[void]$sb.AppendLine("// Icons: images/item_<slug>.png   tastes are villager keys.")
[void]$sb.AppendLine("const ITEMS = [")
foreach($it in ($items | Sort-Object name)){
  $tj=@{}
  foreach($tk in @('love','like','neutral','dislike','hate')){
    $tj[$tk]='['+(($it.tastes[$tk] | ForEach-Object { '"'+$_+'"' }) -join ',')+']'
  }
  $line='  { slug:"'+$it.slug+'", name:'+(JsStr $it.name)+', cat:'+(JsStr $it.cat)+', sell:'+$it.sell+
    ', season:'+(JsStr $it.season)+', source:'+(JsStr $it.source)+', loc:'+(JsStr $it.loc)+
    ', time:'+(JsStr $it.time)+', weather:'+(JsStr $it.weather)+', ingr:'+(JsStr $it.ingr)+
    ', love:'+$tj['love']+', like:'+$tj['like']+', neutral:'+$tj['neutral']+', dislike:'+$tj['dislike']+', hate:'+$tj['hate']+' },'
  [void]$sb.AppendLine($line)
}
[void]$sb.AppendLine("];")
[System.IO.File]::WriteAllText("$dir\data-items.js",$sb.ToString())
Write-Host "Wrote data-items.js with $($items.Count) items."
