:::### Build BackEnd ###

:: Remove existing production folder
del /f /q .\build

:: Transpile .ts to .js
call tsc --sourceMap false



:::### Bundle FrontEnd ###

: Create the directory for React
md build\public

:: Navigate to the react directory
cd ./src/public/react

:: Build React code
call npm run build

:: rename
REN build messaging-react

:: Move the contains to the build/ dir
Move /Y messaging-react ../../../build/public/