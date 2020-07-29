import axios from 'axios'
import config from '@/nuxt.config'

const getPlatesFromBoxBarcodes = async (boxBarcodes) => {
  try {
    const boxBarcodesParam = makeBoxBarcodesParam(boxBarcodes)
    const url = `${config.privateRuntimeConfig.labwhereBaseURL}/labwares?location_barcodes=${boxBarcodesParam}`
    const plates = await axios.get(url)

    return plates.data.map((plate) => plate.barcode)
  } catch (error) {
    return []
  }
}

const makeBoxBarcodesParam = (boxBarcodes) => {
  return boxBarcodes.join(',')
}

export { getPlatesFromBoxBarcodes, makeBoxBarcodesParam }
