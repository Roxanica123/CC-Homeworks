tsc -b .
Remove-Item -Path "deploy" -Recurse -Force
mkdir "deploy"
mkdir "deploy/static"
Copy-Item -Path "build/**" -Destination "deploy" -Recurse -Force
Copy-Item -Path "package.json" -Destination "deploy" -Force
Copy-Item -Path "app.yaml" -Destination "deploy" -Force
Copy-Item -Path "index.yaml" -Destination "deploy" -Force
Copy-Item -Path "public.key" -Destination "deploy" -Force
Copy-Item -Path ".\.gcloudignore" -Destination "deploy" -Force
Set-Location "deploy"
gcloud app deploy
Set-Location ..
Remove-Item -Path "deploy" -Recurse -Force