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
function Slug($s){ (($s.ToLower() -replace "&amp;","and") -replace "[^a-z0-9]+","_").Trim("_") }
function JsStr($s){ '"' + (($s -replace '\\','\\\\') -replace '"','\"' -replace "`r","" -replace "`n"," ") + '"' }
function Clean($s){
  if(-not $s){ return "" }
  $s = $s -replace '(?m)^\s*\*\s*\{\{choice\|[^}]*\}\}\s*$',''   # remove choice bullet lines
  $s = $s -replace '\{\{choice\|[^}]*\}\}',''                    # any inline choices
  $s = $s -replace '\{\{[Nn]ame\|([^|}]+)(\|[^}]*)?\}\}','$1'
  $s = $s -replace '\{\{[Dd]escription\|[^}]*\}\}',''
  $s = $s -replace '\{\{[^}]*\}\}',''
  $s = $s -replace '\[\[[^\]|]*\|([^\]]+)\]\]','$1'
  $s = $s -replace '\[\[([^\]]+)\]\]','$1'
  $s = $s -replace "'''",'' ; $s = $s -replace "''",''
  $s = $s -replace '(?m)^\s*\*\s*',' - '                         # remaining bullets -> ascii dash
  $s = $s -replace '<br\s*/?>',' '
  $s = $s -replace '<[^>]+>',''
  $s = $s -replace '\s+',' '
  $s.Trim()
}

$allGifts = New-Object System.Collections.Generic.HashSet[string]
$records = @()

foreach ($v in $villagers) {
  try { $wt = Wikitext $v } catch { Write-Host "FAIL $v"; continue }
  $lines = $wt -split "`n"

  # birthday
  $season=""; $day=0
  if ($wt -match '\|\s*birthday\s*=\s*\{\{Season\|([A-Za-z]+)(?:\|(\d+))?\}\}\s*(\d+)?') {
    $season=$matches[1]; if($matches[2]){$day=[int]$matches[2]}elseif($matches[3]){$day=[int]$matches[3]}
  }

  # gift tiers
  $tiers=@{loves=@();likes=@();neutral=@();dislikes=@();hates=@()}
  $uni=@{loves=$false;likes=$false;neutral=$false;dislikes=$false;hates=$false}
  $tier=$null
  foreach ($ln in $lines) {
    if ($ln -match 'Universal Loves'){ $tier='loves'; if($ln -match 'All '){$uni.loves=$true}; continue }
    elseif ($ln -match 'Universal Likes'){ $tier='likes'; if($ln -match 'All '){$uni.likes=$true}; continue }
    elseif ($ln -match 'Universal Neutral'){ $tier='neutral'; if($ln -match 'All '){$uni.neutral=$true}; continue }
    elseif ($ln -match 'Universal Dislikes'){ $tier='dislikes'; if($ln -match 'All '){$uni.dislikes=$true}; continue }
    elseif ($ln -match 'Universal Hates'){ $tier='hates'; if($ln -match 'All '){$uni.hates=$true}; continue }
    if ($ln -match '^\s*\|\}'){ $tier=$null; continue }   # table end
    if ($tier -and $ln -match '^\|\s*\[\[File:([^|\]]+?)\.png') {
      $nm=$matches[1].Trim()
      if ($nm -ne $v -and $nm -notlike "$v *") { if($tiers[$tier] -notcontains $nm){ $tiers[$tier]+=$nm; [void]$allGifts.Add($nm) } }
    }
  }

  # heart events
  $events=@()
  $heStart = ($lines | Select-String -Pattern '^==\s*Heart Events' | Select-Object -First 1).LineNumber
  if ($heStart) {
    $heEnd=$lines.Count
    for($k=$heStart;$k -lt $lines.Count;$k++){ if($lines[$k] -match '^==[^=]'){ $heEnd=$k; break } }
    $he = $lines[$heStart..($heEnd-1)]
    $j=0
    while($j -lt $he.Count){
      if($he[$j] -match '\{\{heart event'){
        $blk=@(); $j++
        while($j -lt $he.Count -and $he[$j].Trim() -ne '}}'){ $blk+=$he[$j]; $j++ }
        $hearts=''; $trigger=''; $dl=@(); $mode=''
        foreach($l in $blk){
          if($l -match '^\s*\|\s*hearts\s*=\s*(.+)$'){ $hearts=$matches[1].Trim(); $mode=''; continue }
          if($l -match '^\s*\|\s*trigger\s*=\s*(.*)$'){ $trigger=$matches[1]; $mode='trigger'; continue }
          if($l -match '^\s*\|\s*details\s*=\s*(.*)$'){ $dl+=$matches[1]; $mode='details'; continue }
          if($l -match '^\s*\|\s*[A-Za-z]+\s*='){ $mode=''; continue }
          if($mode -eq 'details'){ $dl+=$l } elseif($mode -eq 'trigger'){ $trigger+=' '+$l }
        }
        $detRaw = ($dl -join "`n")
        $choices=@()
        foreach($m in [regex]::Matches($detRaw,'\{\{choice\|"?([^"|}]+?)"?\|(-?\d+)\}\}')){
          $choices += @{ t=$m.Groups[1].Value.Trim(); p=[int]$m.Groups[2].Value }
        }
        $events += @{ hearts=$hearts; trigger=(Clean $trigger); details=(Clean $detRaw); choices=$choices }
      }
      $j++
    }
  }

  # portrait
  $key=$v.ToLower()
  try {
    $u="https://stardewvalleywiki.com/mediawiki/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles="+[uri]::EscapeDataString("File:$v.png")
    $pp=(Invoke-RestMethod -Uri $u -UserAgent "Mozilla/5.0").query.pages.PSObject.Properties.Value
    if($pp.imageinfo){ Invoke-WebRequest -Uri $pp.imageinfo[0].url -OutFile "$imgDir\npc_$key.png" -UserAgent "Mozilla/5.0" }
  } catch {}

  $records += [pscustomobject]@{ key=$key; name=$v; season=$season; day=$day; tiers=$tiers; uni=$uni; events=$events }
  Write-Host ("{0,-11} {1} {2}  L{3} Li{4} N{5} D{6} H{7}  events:{8}" -f $v,$season,$day,$tiers.loves.Count,$tiers.likes.Count,$tiers.neutral.Count,$tiers.dislikes.Count,$tiers.hates.Count,$events.Count)
  Start-Sleep -Milliseconds 150
}

# ---- download gift icons (g_<slug>.png) ----
$names = @($allGifts)
Write-Host "`nUnique gift items: $($names.Count) - resolving icons..."
$urlByName=@{}
for($i=0;$i -lt $names.Count;$i+=40){
  $batch=$names[$i..([Math]::Min($i+39,$names.Count-1))]
  $titles=($batch | ForEach-Object { "File:$_.png" }) -join "|"
  $api="https://stardewvalleywiki.com/mediawiki/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles="+[uri]::EscapeDataString($titles)
  $r=Invoke-RestMethod -Uri $api -UserAgent "Mozilla/5.0"
  $norm=@{}; if($r.query.normalized){foreach($n in $r.query.normalized){$norm[$n.to]=$n.from}}
  foreach($p in $r.query.pages.PSObject.Properties.Value){
    if($p.imageinfo){ $t=$p.title; if($norm.ContainsKey($t)){$t=$norm[$t]}; $nm=$t -replace '^File:','' -replace '\.png$',''; $urlByName[$nm]=$p.imageinfo[0].url }
  }
  Start-Sleep -Milliseconds 200
}
$dl=0;$miss=@()
foreach($nm in $names){
  if($urlByName.ContainsKey($nm)){
    $dest="$imgDir\g_$(Slug $nm).png"
    if(-not (Test-Path $dest)){ try{ Invoke-WebRequest -Uri $urlByName[$nm] -OutFile $dest -UserAgent "Mozilla/5.0"; $dl++ }catch{ $miss+=$nm } ; Start-Sleep -Milliseconds 40 } else { $dl++ }
  } else { $miss+=$nm }
}
Write-Host "Gift icons downloaded/present: $dl ; missing: $($miss.Count)"
if($miss.Count){ Write-Host ("MISSING ICONS: " + ($miss -join ', ')) }

# ---- write data-npcs.js ----
$sb=New-Object System.Text.StringBuilder
[void]$sb.AppendLine("// Stardew villagers - birthdays, gift tiers, heart events (parsed from the wiki).")
[void]$sb.AppendLine("// Portraits: images/npc_<key>.png  Gift icons: images/g_<slug(name)>.png")
[void]$sb.AppendLine("const NPCS = [")
foreach($r in $records){
  $arr=@{}
  foreach($t in @('loves','likes','neutral','dislikes','hates')){
    $arr[$t] = '[' + (($r.tiers[$t] | ForEach-Object { JsStr $_ }) -join ',') + ']'
  }
  $uniJs = '{ loves:'+($r.uni.loves.ToString().ToLower())+', likes:'+($r.uni.likes.ToString().ToLower())+', neutral:'+($r.uni.neutral.ToString().ToLower())+', dislikes:'+($r.uni.dislikes.ToString().ToLower())+', hates:'+($r.uni.hates.ToString().ToLower())+' }'
  $evJs=@()
  foreach($e in $r.events){
    $ch = ($e.choices | ForEach-Object { '{ t:'+(JsStr $_.t)+', p:'+$_.p+' }' }) -join ','
    $evJs += '    { hearts:'+(JsStr $e.hearts)+', trigger:'+(JsStr $e.trigger)+', details:'+(JsStr $e.details)+', choices:['+$ch+'] }'
  }
  $evBlock = if($evJs.Count){ "[`n" + ($evJs -join ",`n") + "`n  ]" } else { "[]" }
  [void]$sb.AppendLine('  { key:"'+$r.key+'", name:"'+$r.name+'", birthday:{ season:"'+$r.season+'", day:'+$r.day+' },')
  [void]$sb.AppendLine('    loves:'+$arr['loves']+', likes:'+$arr['likes']+', neutral:'+$arr['neutral']+', dislikes:'+$arr['dislikes']+', hates:'+$arr['hates']+',')
  [void]$sb.AppendLine('    uni:'+$uniJs+', hearts:'+$evBlock+' },')
}
[void]$sb.AppendLine("];")
[System.IO.File]::WriteAllText("$dir\data-npcs.js",$sb.ToString())
Write-Host "`nWrote data-npcs.js with $($records.Count) villagers."
