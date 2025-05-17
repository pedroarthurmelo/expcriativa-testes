@echo off
echo Removendo repositórios Git internos da pasta vendor...

REM Caminho relativo à pasta onde você está rodando esse script
setlocal enabledelayedexpansion
for /r "php\vendor" %%d in (.git) do (
    if exist "%%d" (
        echo Apagando: %%d
        rmdir /s /q "%%d"
    )
)

echo Limpando index do Git...
git rm --cached -r php\vendor\graham-campbell\result-type
git rm --cached -r php\vendor\phpoption\phpoption
git rm --cached -r php\vendor\symfony\polyfill-ctype
git rm --cached -r php\vendor\symfony\polyfill-mbstring
git rm --cached -r php\vendor\symfony\polyfill-php80
git rm --cached -r php\vendor\vlucas\phpdotenv

echo Pronto. Agora execute:
echo git add php\vendor
echo git commit -m "Removidos repositórios .git internos da vendor"
echo git push

pause
