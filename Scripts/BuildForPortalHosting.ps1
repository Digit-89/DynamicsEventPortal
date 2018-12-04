$websitePath  = "../"
$appOutputPath = Join-Path $websitePath "dist/ClientApp"

function Build-App()
{
    Push-Location $websitePath
    
    Invoke-Expression -Command "npm install"
    Invoke-Expression -Command "ng build --prod --output-hashing none"
    
    Pop-Location
}

function Rename-OutputFiles()
{
    Push-Location $appOutputPath

    Get-ChildItem *.js | Rename-Item -NewName { $_.name -Replace '\.js$','.es' }

    Pop-Location
}


Write-Host "Building the angular app..."
Build-App

Write-Host "Renaming output js files..."
Rename-OutputFiles