import axios from 'axios'
import config from '@/nuxt.config'

const labwhereRequestURL = config.privateRuntimeConfig.labwhereBaseURL

const getPlatesFromBoxBarcodes = async (boxBarcode) => {
  try {
    const url = `${labwhereRequestURL}/labwares?location_barcodes=${boxBarcode}`
    const plates = await axios.get(url)

    return plates.data.map((plate) => plate.barcode)
  } catch (error) {
    return []
  }
}

export { getPlatesFromBoxBarcodes, labwhereRequestURL }
