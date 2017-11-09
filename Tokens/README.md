# Tokens

Token and token related contracts.

### ERC223
Basic implementation of the current ERC223 token proposal with minimal tests for experimentation. Largely copied from Aragon's implementation here: https://github.com/aragon/ERC23. Demonstrates how to call functions using byte/hex encoded function calls.

### MiniMeTesting
Playing with the Giveth MiniMeToken from https://github.com/Giveth/minime with some basic tests to understand its functionality.

### YoutubeToken
More complex use of Oraclize than in CoinFlipper from DecypherTvTutorials. Fetches YouTube subscriber count for a specified user and eth address and gives that eth address a number of tokens equal to their subscriber count (plus the specified token decimals). The address associated to the user is currently manually input when the username is provided but this should also be fetched by Oraclize. This eth address should be registered by having the user log into a site with their Youtube credentials then specifying their public address which is saved on a server. Ideally they would also save an ec signature of its private key with a message to further verify they own that address. The contract requires a google console API key with YouTube Data API v3 enabled.