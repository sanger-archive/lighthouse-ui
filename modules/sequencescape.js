import axios from 'axios'
import config from '@/nuxt.config'

const sequencescapeRequest = axios.create({
  baseURL: config.privateRuntimeConfig.sequencescapeBaseURL
})

const getPlates = async (request, barcodes) => {
  // try {
  //   const plates = await request.get(`/api/locations/${boxBarcode}/children`)
  //   return plates.data.map((plate) => plate.barcode)
  // } catch (error) {
  //   return []
  // }
}

export { sequencescapeRequest, getPlates }

export default getPlates
