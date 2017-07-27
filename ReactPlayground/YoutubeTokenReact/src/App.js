import React, { Component } from 'react'
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
      web3: null,
      youtubeToken: null,
      oraclizeFee: "",
      accBalance: "",
      youtubeUser: ""
    }
    this.registerUser = this.registerUser.bind(this)
    this.setYoutubeUser = this.setYoutubeUser.bind(this)
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({ web3: results.web3, youtubeToken: new youtubeToken(results.web3) })
      this.loadContractStateIntoView()
    }).catch(error => {
      console.log(error)
    })
  }

  loadContractStateIntoView() {
    this.getBalance()
    this.state.youtubeToken.getOraclizeCost()
      .subscribe(oraclizeFee => this.setState({ oraclizeFee: oraclizeFee }))
  }

  getBalance() {
    this.state.youtubeToken.getAccounts()
      .take(1)
      .flatMap(account => this.state.youtubeToken.getBalanceOf(account))
      .subscribe(balance => this.setState({ accBalance: balance }))
  }

  setYoutubeUser(event) {
    this.setState({ youtubeUser: event.target.value })
  }

  registerUser() {
    this.state.youtubeToken.getAccounts()
      .take(1)
      .flatMap(account => this.state.youtubeToken.addUserSubscriptionCount(this.state.youtubeUser, account))
      .subscribe(tx => console.log(tx))

      // .flatMap(txHash => this.getBalance())
      // .subscribe(balance => this.setState({ accBalance: balance }))
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Basic Contract Interface</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Youtube Subscription Count Token</h1>

              <label>
                <p>Register user:</p>
                <input type="text" onChange={this.setYoutubeUser}/>
                <button onClick={this.registerUser}>Register subcription count</button>
              </label>

              <p>Oraclize Cost for registering youtube user is: {this.state.oraclizeFee}</p>
              <p>Account 0 balance: {this.state.accBalance}</p>

            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
