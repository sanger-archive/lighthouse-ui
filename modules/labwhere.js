import axios from 'axios'
import config from '@/nuxt.config'

const labwhereRequestURL = config.privateRuntimeConfig.labwhereBaseURL

const getPlatesFromBoxBarcode = async (boxBarcode) => {
  try {
    const url = `${labwhereRequestURL}/locations/${boxBarcode}/labwares`
    const plates = await axios.get(url)

    return plates.data.map((plate) => plate.barcode)
  } catch (error) {
    return []
  }
}

export { getPlatesFromBoxBarcode, labwhereRequestURL }
