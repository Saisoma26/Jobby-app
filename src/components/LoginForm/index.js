import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import {Component} from 'react'

import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', errorMsg: ''}

  onLoginsuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitform = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onLoginsuccess(data.jwt_token)
    } else {
      console.log(data.error_msg)
      this.setState({errorMsg: data.error_msg})
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangepassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, errorMsg} = this.state

    const accessToken = Cookies.get('jwt_token')
    if (accessToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="back">
        <div className="login-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <form className="form-container" onSubmit={this.onSubmitform}>
            <label htmlFor="username" className="inputel-label">
              USERNAME
            </label>
            <input
              className="inputel"
              id="username"
              type="text"
              onChange={this.onChangeUsername}
              value={username}
              placeholder="Username"
            />
            <label htmlFor="password" className="inputel-label">
              PASSWORD
            </label>
            <input
              className="inputel"
              type="password"
              id="password"
              onChange={this.onChangepassword}
              value={password}
              placeholder="Password"
            />
            <button className="submit-btn" type="submit">
              Login
            </button>
          </form>
          <p className="errmsg">{errorMsg}</p>
        </div>
      </div>
    )
  }
}

export default LoginForm
