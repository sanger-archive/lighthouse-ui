import axios from 'axios'
import config from '@/nuxt.config'

const labwhereRequest = axios.create({
  baseURL: config.privateRuntimeConfig.labwhereBaseURL
})

const getPlates = async (request, boxBarcode) => {
  try {
    const plates = await request.get(`/api/locations/${boxBarcode}/children`)
    return plates.data.map((plate) => plate.barcode)
  } catch (error) {
    return []
  }
}

export { labwhereRequest, getPlates }

export default getPlates
