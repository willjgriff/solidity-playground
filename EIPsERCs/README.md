# EIP / ERC experiments

Basic usage / investigation of some EIP / ERC standards

### EIP 712 Structured data signing
This enables better UX when signing data. Prior to this EIP data that is signed would typically be byte strings which is unreadable. Using this EIP we can submit json looking objects with meaningful names and values for signing and verification.

### ERC 165 Contract interface detection
Adds a `supportsInterface(interfaceId)` function to a contract which returns whether or not the contract supports the specified interface. InterfaceId is determined by xoring the bytes4 representation of the functions in the interface. The contract can then be cast to the expected contract type or called using assembly.
