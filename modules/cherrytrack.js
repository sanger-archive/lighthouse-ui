import config from '@/nuxt.config'
import axios from 'axios'

const getSourcePlate = async (barcode) => {
  try {
    const url = `${config.privateRuntimeConfig.cherrytrackBaseURL}/source-plates/${barcode}`
    const response = await axios.get(url)

    return { success: true, ...response.data.data }
  } catch (error) {
    return { success: false }
  }
}

const getDestinationPlate = async (barcode) => {
  try {
    const url = `${config.privateRuntimeConfig.cherrytrackBaseURL}/destination-plates/${barcode}`
    const response = await axios.get(url)

    return { success: true, ...response.data.data }
  } catch (error) {
    return { success: false }
  }
}

const cherrytrack = { getSourcePlate, getDestinationPlate }

export default cherrytrack
