import config from '@/nuxt.config'
import axios from 'axios'

const getPlatesFromBoxBarcodes = async (...boxBarcodes) => {
  try {
    const url = `${config.privateRuntimeConfig.labwhereBaseURL}/labwares?location_barcodes=${boxBarcodes}`
    const response = await axios.get(url)

    const barcodes = response.data.map((plate) => plate.barcode)

    if (barcodes.length) {
      return { success: true, barcodes }
    } else {
      return { success: false, error: 'The box has no plates' }
    }
  } catch (error) {
    return { success: false, error }
  }
}

const labwhere = { getPlatesFromBoxBarcodes }

export default labwhere
