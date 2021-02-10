# hrs.finance-backend
Backend code for hrs.finance

To start add a .env file in the root folder. Its contents should look like this:
========================================================================
NODE_ENV=true
MNEMONIC=""

#Mainnet
MAINNET_RPC_URL=""

#Kovan
KOVAN_RPC_URL=""
========================================================================

then run "truffle compile" and you should see something like this:
========================================================================
Compiling your contracts...
===========================
> Compiling .\src\contracts\HodlerPool.sol
> Compiling .\src\contracts\Migrations.sol
> Artifacts written to C:\GitHub\drhodler\hrs.finance-backend\src\abis
> Compiled successfully using:
   - solc: 0.6.6+commit.6c089d02.Emscripten.clang
========================================================================
