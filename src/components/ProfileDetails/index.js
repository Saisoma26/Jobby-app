import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import './index.css'

const apiStatusList = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProfileDetails extends Component {
  state = {profilestatus: apiStatusList.initial}

  componentDidMount() {
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    this.setState({profilestatus: apiStatusList.loading})

    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const profileDetails = data.profile_details

      const updatedData = this.updateddatafunc(profileDetails)

      this.setState({
        profileDetails: updatedData,
        profilestatus: apiStatusList.success,
      })
    } else {
      this.setState({profilestatus: apiStatusList.failure})
    }
  }

  updateddatafunc = profile => ({
    name: profile.name,
    profileImageUrl: profile.profile_image_url,
    shortBio: profile.short_bio,
  })

  renderprofilecard = () => {
    const {profileDetails} = this.state
    const {name, shortBio} = profileDetails
    return (
      <div className="profile-bg">
        <img
          src={profileDetails.profileImageUrl}
          alt="profile"
          className="profile-image"
        />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-description">{shortBio}</p>
      </div>
    )
  }

  retryFetchProfile = () => {
    this.getProfileDetails()
  }

  renderprofileFailure = () => (
    <button className="retrybtn" type="button" onClick={this.retryFetchProfile}>
      Retry
    </button>
  )

  renderloader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  profilestatus = () => {
    const {profilestatus} = this.state
    switch (profilestatus) {
      case apiStatusList.failure:
        return this.renderprofileFailure()
      case apiStatusList.success:
        return this.renderprofilecard()
      case apiStatusList.loading:
        return this.renderloader()
      default:
        return null
    }
  }

  render() {
    return this.profilestatus()
  }
}

export default ProfileDetails
