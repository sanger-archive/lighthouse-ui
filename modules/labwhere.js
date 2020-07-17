// import PlatesJson from '../test/data/plates'
import axios from 'axios'
import config from '@/nuxt.config'

const labwhereRequestURL = config.privateRuntimeConfig.labwhereBaseURL

const getPlatesFromBoxBarcode = async (boxBarcode) => {
  try {
    const url = `${labwhereRequestURL}/api/locations/${boxBarcode}/labwares`
    const plates = await axios.get(url)

    // Below stubs the request
    // const plates = { data: PlatesJson }
    return plates.data.map((plate) => plate.barcode)
  } catch (error) {
    return []
  }
}

export { getPlatesFromBoxBarcode, labwhereRequestURL }

export default getPlatesFromBoxBarcode
