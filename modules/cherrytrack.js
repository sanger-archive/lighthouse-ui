import axios from 'axios'
import config from '@/nuxt.config'

const getSourcePlate = async (barcode) => {
  try {
    const url = `${config.privateRuntimeConfig.cherrytrackBaseURL}/source-plates/${barcode}`
    const response = await axios.get(url)
    const plate = { success: true, source: true, ...response.data.data }

    return plate
  } catch (error) {
    return { success: false }
  }
}

const getDestinationPlate = async (barcode) => {
  try {
    const url = `${config.privateRuntimeConfig.cherrytrackBaseURL}/destination-plates/${barcode}`
    const response = await axios.get(url)
    const plate = { success: true, destination: true, ...response.data.data }

    return plate
  } catch (error) {
    return { success: false }
  }
}

const cherrytrack = { getSourcePlate, getDestinationPlate }

export default cherrytrack
