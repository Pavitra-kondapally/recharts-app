// Write your code here
import './index.css'
import Loader from 'react-loader-spinner'

import {Component} from 'react'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getCovidVaccinationData()
  }

  getCovidVaccinationData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
      recentVaccinationData: [],
      vaccinationByAge: [],
      vaccinationByGender: [],
    })

    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(apiUrl)

    if (response.ok === true) {
      const fetchedData = await response.json()
      this.setState({
        apiStatus: apiStatusConstants.success,
        recentVaccinationData: fetchedData.last_7_days_vaccination,
        vaccinationByAge: fetchedData.vaccination_by_age,
        vaccinationByGender: fetchedData.vaccination_by_gender,
      })
    }
    if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderChartsView = () => {
    const {
      recentVaccinationData,
      vaccinationByAge,
      vaccinationByGender,
    } = this.state

    return (
      <>
        <div className="card-container">
          <h1 className="card-title-style">Vaccination Coverage</h1>
          <VaccinationCoverage recentVaccinationData={recentVaccinationData} />
        </div>
        <div className="card-container">
          <h1 className="card-title-style">Vaccination by gender</h1>
          <VaccinationByGender vaccinationByGender={vaccinationByGender} />
        </div>
        <div className="card-container">
          <h1 className="card-title-style">Vaccination by age</h1>
          <VaccinationByAge vaccinationByAge={vaccinationByAge} />
        </div>
      </>
    )
  }

  renderLoaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-text">Something Went Wrong</h1>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    let content = null

    switch (apiStatus) {
      case apiStatusConstants.success:
        content = this.renderChartsView()
        break
      case apiStatusConstants.inProgress:
        content = this.renderLoaderView()
        break
      case apiStatusConstants.failure:
        content = this.renderFailureView()
        break

      default:
        content = null
    }

    return (
      <div className="container">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            className="logo-image"
            alt="website logo"
          />
          <p className="logo-style">Co-WIN</p>
        </div>
        <h1 className="title-style">CoWIN Vaccination In India</h1>
        {content}
      </div>
    )
  }
}

export default CowinDashboard
