@echo off
cd /d "%~dp0"
title StoreWell - Deploy to Cloudflare
echo Deploying StoreWell... > deploy-log.txt
call npx --yes wrangler@latest pages deploy public --project-name=storewell-3d --branch=main --commit-dirty=true >> deploy-log.txt 2>&1
echo EXITCODE %errorlevel% >> deploy-log.txt
exit
