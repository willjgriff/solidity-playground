var bl = require('bl')
var fs = require('fs');
var IpfsTest = artifacts.require('./IpfsTest.sol')
var ipfsTest = IpfsTest.at(IpfsTest.address)
// Note, this requires an Ipfs Daemon to be running with this config.
var ipfsApi = require('ipfs-api')
var ipfs = ipfsApi('localhost', '5001', { protocol: 'http' })

var printStream = stream => stream.pipe(bl((err, data) => { console.log(data.toString()) }))

var filo = fs.createReadStream('file.txt')
var files = [{ path: 'testFolder/actualFile.txt', content: filo }]

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