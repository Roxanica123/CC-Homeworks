$path = "D:\Facultate - An3\Cloud\CC-Homeworks\Homework4"
$archivePath = $path + "\build\archive.zip"
$toArchive = $path + "\build\*"

$project = "tsconfig.json"
$build = $path + "\build"
$zip = "C:\Program Files\7-Zip\7z.exe"

$oldPath = Get-Location

Set-Location $path


Remove-Item -Path $build -Recurse -Force

npm install
tsc --project $project
Copy-Item -Path "package.json" -Destination "build\package.json"
Copy-Item -Path "package-lock.json" -Destination "build\package-lock.json"

Set-Location $build
npm install
Set-Location $path

& $zip a "$archivePath" "$toArchive" -r

Set-Location $oldPath
#az login --tenant "97c63be0-059e-4bf0-97c5-206f1360ddce"
az webapp deploy --async false --name "cloud-auth-teddy" --resource-group "roxanica" --restart "true" --type "zip" --src-path $archivePath
# az webapp deploy --async false --name "cloud-auth-teddy" --resource-group "roxanica" --restart "true" --type "zip" --src-path "D:\Facultate - An3\Cloud\CC-Homeworks\Homework4\build\archive.zip"