import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import youtubeToken from './utils/youtubeTokenCommands'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      inputStorageValue: "",
      storageContract: null,
      youtubeToken: null,
      oraclizeCost: "",
      web3: null
    }

    this.setInputStorageValue = this.setInputStorageValue.bind(this)
    this.setStorageValue = this.setStorageValue.bind(this)
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
    .then(results => {
      this.setState({ web3: results.web3, youtubeToken: new youtubeToken(results.web3) })
      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        this.setState({ storageContract: simpleStorageInstance })

        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get()
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })
    })

    // this.state.youTubeToken.getOraclizeCost()
      // .then(cost => this.setState({ oraclizeCost: cost }))

    this.setState({ oraclizeCost: this.state.youtubeToken.getOraclizeCost() })
  }

  setInputStorageValue(event) {
    this.setState({ inputStorageValue: event.target.value })
  }

  setStorageValue() {
    var storageContract = this.state.storageContract
    this.state.web3.eth.getAccounts((error, accounts) => {
      storageContract.set(this.state.inputStorageValue, { from: accounts[0] })
        .then(() => storageContract.get())
        .then(storedValue => this.setState({ storageValue: storedValue.toNumber() }))
    })
  }



  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Youtube Subscriber Count Token</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</p>
              <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
              <p>The stored value is: {this.state.storageValue}</p>

              <p>Oraclize Cost for registering youtube user is: {this.state.oraclizeCost}</p>

              <label>
                <p>New value:</p>
                <input type="text" onChange={this.setInputStorageValue}/>
              </label>
              <div className="button-container">
                <button onClick={this.setStorageValue}>Set Value</button>
              </div>

            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
