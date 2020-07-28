import axios from 'axios'
import config from '@/nuxt.config'

const getPlatesFromBoxBarcodes = async (boxBarcode) => {
  try {
    const url = `${config.privateRuntimeConfig.labwhereBaseURL}/labwares?location_barcodes=${boxBarcode}`
    const plates = await axios.get(url)

    return plates.data.map((plate) => plate.barcode)
  } catch (error) {
    return []
  }
}

export { getPlatesFromBoxBarcodes }
