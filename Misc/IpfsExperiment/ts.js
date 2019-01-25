const bl = require('bl');
const fs = require('fs');
const IpfsTest = artifacts.require('./IpfsTest.sol');
const ipfsTest = IpfsTest.at(IpfsTest.address);
// Note, this requires an Ipfs Daemon to be running with this config.
const ipfsApi = require('ipfs-api');
const ipfs = ipfsApi('localhost', '5001', {protocol: 'http'});

const printStream = stream => stream.pipe(bl((err, data) => {
    console.log(data.toString())
}));

const filo = fs.createReadStream('file.txt');
const files = [{path: 'testFolder/actualFile.txt', content: filo}];

// The below adds file.txt to ipfs 
// > sets the hash in the contract 
// > gets the hash from the contract
// > gets and prints the file from ipfs 
ipfs.add(files)
	.then((files) => {
		console.log(files)
		return files[0].hash
	})
	.then(fileHash => ipfsTest.setIpfsHash(fileHash))
	.then(() => ipfsTest.ipfsHash())
	.then(fileHash => ipfs.cat(fileHash))
	.then(stream => printStream(stream))

module.exports = (callback) => {}