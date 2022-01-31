import axios from 'axios'

const BASE_URL = 'https://iapitest.eva.guru'

// import store from '../../../store/store.js'

export default {
  // Base post api request implementation
  basePost (path, payload, useHeader = false) {
    let headers = {}

    // Headers for the request
    if (useHeader) headers = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem('accessToken')
      }
    }

    // API Request
    return new Promise((resolve, reject) => {
      axios.post(path, payload, headers).then(response => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  },
  // Login API request
  login (payload) {
    // Request path for the request
    const requestPath = `${BASE_URL}/user/auth`
    return this.basePost(requestPath, payload)
  },
  // Sales and finance API request
  getSaleFinance (payload) {
    // Request path for the request
    const requestPath = `${BASE_URL}/data/sales-finances`
    return this.basePost(requestPath, payload, true)
  },
  // Expences and refunds API request
  getExpenseAndRefunds (payload) {
    // Request path for the request
    const requestPath = `${BASE_URL}/data/sales-expense-by-request-date`
    return this.basePost(requestPath, payload, true)
  }

}
