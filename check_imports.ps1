$files = Get-ChildItem -Path "js" -Recurse -Filter "*.js"
$missingCount = 0
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    $regex = [regex]'from\s+[\x27\x22]([^\x27\x22]+)[\x27\x22]'
    $matches = $regex.Matches($content)
    foreach ($m in $matches) {
        $importPath = $m.Groups[1].Value
        if ($importPath.StartsWith('.')) {
            $dir = Split-Path $f.FullName -Parent
            $resolved = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($dir, $importPath))
            if (-not (Test-Path $resolved)) {
                Write-Host "[MISSING IMPORT] In $($f.FullName): $importPath -> $resolved"
                $missingCount++
            }
        }
    }
}
Write-Host "Done checking imports. Missing imports: $missingCount"
