@echo off
setlocal enabledelayedexpansion
title ZKP Identity — Setup

:: ─────────────────────────────────────────────────────────────────────────────
:: zkp-identity setup.bat
:: Run this from inside your zkp-identity project folder.
:: Double-click it OR run it from Command Prompt: setup.bat
:: ─────────────────────────────────────────────────────────────────────────────

echo.
echo  ██████╗ ██╗  ██╗██████╗     ██╗██████╗
echo  ╚════██╗██║ ██╔╝██╔══██╗   ██╔╝██╔══██╗
echo   █████╔╝█████╔╝ ██████╔╝  ██╔╝ ██║  ██║
echo   ╚═══██╗██╔═██╗ ██╔═══╝  ██╔╝  ██║  ██║
echo  ██████╔╝██║  ██╗██║     ██╔╝   ██████╔╝
echo  ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝    ╚═════╝
echo.
echo  Zero-Knowledge Identity — Windows Setup
echo  ─────────────────────────────────────────
echo.

:: ── STEP 0: Check we are in the right folder ──────────────────────────────────
if not exist "package.json" (
    echo  [ERROR] No package.json found.
    echo  Please run this script from inside your zkp-identity project folder.
    echo  Example:  cd Desktop\zkp-identity   then   setup.bat
    pause
    exit /b 1
)

:: ── STEP 1: Check prerequisites ───────────────────────────────────────────────
echo  [1/8] Checking prerequisites...
echo.

call :check_tool node "node --version" "v18"
call :check_tool npm "npm --version" ""
call :check_tool git "git --version" ""
call :check_tool circom "circom --version" ""
call :check_tool snarkjs "snarkjs --version" ""

if "!PREREQ_FAIL!"=="1" (
    echo.
    echo  [ERROR] One or more prerequisites are missing.
    echo  Please follow the installation guide before running this script.
    pause
    exit /b 1
)

echo.
echo  All prerequisites found.
echo.

:: ── STEP 2: Install npm dependencies ─────────────────────────────────────────
echo  [2/8] Installing npm dependencies...
echo.
call npm install snarkjs ethers @digitalbazaar/vc did-resolver 2>&1
call npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox snarkjs chai 2>&1
if errorlevel 1 (
    echo  [ERROR] npm install failed. Check your internet connection.
    pause
    exit /b 1
)
echo  Dependencies installed.
echo.

:: ── STEP 3: Create folder structure ──────────────────────────────────────────
echo  [3/8] Creating folder structure...
if not exist "circuits"    mkdir circuits
if not exist "keys"        mkdir keys
if not exist "contracts"   mkdir contracts
if not exist "scripts"     mkdir scripts
if not exist "test"        mkdir test
if not exist "build"       mkdir build
if not exist "deployments" mkdir deployments
echo  Folders ready.
echo.

:: ── STEP 4: Write hardhat.config.js ──────────────────────────────────────────
echo  [4/8] Writing hardhat.config.js...
if not exist "hardhat.config.js" (
    (
        echo require^("@nomicfoundation/hardhat-toolbox"^);
        echo.
        echo module.exports = {
        echo   solidity: "0.8.19",
        echo   paths: {
        echo     sources: "./contracts",
        echo     tests:   "./test",
        echo     scripts: "./scripts",
        echo   },
        echo   networks: {
        echo     localhost: {
        echo       url: "http://127.0.0.1:8545"
        echo     }
        echo   }
        echo };
    ) > hardhat.config.js
    echo  hardhat.config.js created.
) else (
    echo  hardhat.config.js already exists, skipping.
)
echo.

:: ── STEP 5: Compile the Circom circuit ───────────────────────────────────────
echo  [5/8] Compiling Circom circuit...
if not exist "circuits\ageCheck.circom" (
    echo  [WARN] circuits\ageCheck.circom not found.
    echo  Copy the file from the demo into the circuits\ folder, then re-run.
    echo  Skipping circuit compilation.
) else (
    circom circuits\ageCheck.circom --r1cs --wasm --sym -o build\
    if errorlevel 1 (
        echo  [ERROR] Circom compilation failed.
        echo  Check that ageCheck.circom is saved correctly.
        pause
        exit /b 1
    )
    echo  Circuit compiled. Files in build\
)
echo.

:: ── STEP 6: Trusted setup (Powers of Tau + zkey) ─────────────────────────────
echo  [6/8] Running trusted setup...
echo  This will take a minute. When prompted for entropy, type any random
echo  characters and press Enter.
echo.

if exist "keys\ageCheck_final.zkey" (
    echo  keys\ageCheck_final.zkey already exists — skipping trusted setup.
    echo  Delete it and re-run if you want to regenerate keys.
) else (
    if not exist "circuits\ageCheck.circom" (
        echo  [WARN] Skipping trusted setup — circuit not compiled yet.
    ) else (
        snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
        snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="zkp-id-demo" -v
        snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
        snarkjs groth16 setup build\ageCheck.r1cs pot12_final.ptau keys\ageCheck_0000.zkey
        snarkjs zkey contribute keys\ageCheck_0000.zkey keys\ageCheck_final.zkey --name="zkp-id-demo" -v
        snarkjs zkey export verificationkey keys\ageCheck_final.zkey keys\verification_key.json

        :: Export the real Solidity verifier (overwrites placeholder)
        snarkjs zkey export solidityverifier keys\ageCheck_final.zkey contracts\Verifier.sol
        echo.
        echo  Trusted setup complete. Keys saved to keys\
        echo  contracts\Verifier.sol updated with real verification key constants.
    )
)
echo.

:: ── STEP 7: Test the circuit ──────────────────────────────────────────────────
echo  [7/8] Testing circuit with input.json...
if not exist "circuits\input.json" (
    echo  [WARN] circuits\input.json not found — skipping circuit test.
) else if not exist "keys\ageCheck_final.zkey" (
    echo  [WARN] Trusted setup not complete — skipping circuit test.
) else (
    snarkjs groth16 fullprove circuits\input.json build\ageCheck_js\ageCheck.wasm keys\ageCheck_final.zkey proof.json public.json
    snarkjs groth16 verify keys\verification_key.json public.json proof.json
    if errorlevel 1 (
        echo  [ERROR] Circuit verification failed. Check your circuit and keys.
        pause
        exit /b 1
    )
    echo  Circuit test passed.
)
echo.

:: ── STEP 8: React frontend ───────────────────────────────────────────────────
echo  [8/8] Setting up React frontend...
if not exist "src\package.json" (
    echo  Creating React app in src\ — this may take a few minutes...
    call npx create-react-app src 2>&1
    if errorlevel 1 (
        echo  [WARN] create-react-app had issues. You can run it manually:
        echo        npx create-react-app src
    ) else (
        echo  React app created in src\
    )
) else (
    echo  React app already exists in src\ — skipping.
)
echo.

:: ── DONE ─────────────────────────────────────────────────────────────────────
echo  ─────────────────────────────────────────
echo  Setup complete! Here is what to do next:
echo  ─────────────────────────────────────────
echo.
echo  TERMINAL 1 — Start local blockchain:
echo    npx hardhat node
echo.
echo  TERMINAL 2 — Deploy the contract:
echo    npx hardhat run scripts\deploy.js --network localhost
echo.
echo  TERMINAL 2 — Run tests:
echo    npx hardhat test
echo.
echo  TERMINAL 2 — Start React frontend:
echo    cd src ^&^& npm start
echo    Then open http://localhost:3000
echo.
echo  TIP: Copy Issuer.jsx and ProverVerifier.jsx into src\src\ before
echo  starting the frontend.
echo.
pause
exit /b 0

:: ─────────────────────────────────────────────────────────────────────────────
:: Subroutine: check a tool is installed
:: Usage: call :check_tool <name> <version-command> <min-version-prefix>
:: ─────────────────────────────────────────────────────────────────────────────
:check_tool
set TOOL_NAME=%1
set TOOL_CMD=%2
set TOOL_MIN=%3

%TOOL_CMD% >nul 2>&1
if errorlevel 1 (
    echo  [MISSING] %TOOL_NAME% — not found in PATH
    set PREREQ_FAIL=1
) else (
    for /f "tokens=*" %%v in ('%TOOL_CMD% 2^>^&1') do (
        echo  [OK]      %TOOL_NAME% — %%v
        goto :check_done
    )
)
:check_done
exit /b 0
