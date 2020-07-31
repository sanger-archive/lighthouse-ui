import axios from 'axios'
import config from '@/nuxt.config'

const getPlatesFromBoxBarcodes = async (boxBarcodes) => {
  try {
    const boxBarcodesParam = makeBoxBarcodesParam(boxBarcodes)
    const url = `${config.privateRuntimeConfig.labwhereBaseURL}/labwares?location_barcodes=${boxBarcodesParam}`
    const response = await axios.get(url)

    const plateBarcodes = response.data.map((plate) => plate.barcode)

    if (plateBarcodes.length) {
      return { success: true, plateBarcodes }
    } else {
      return { success: false, error: 'The box has no plates' }
    }
  } catch (error) {
    return { success: false, error }
  }
}

const makeBoxBarcodesParam = (boxBarcodes) => {
  return boxBarcodes.join(',')
}

export { getPlatesFromBoxBarcodes, makeBoxBarcodesParam }
