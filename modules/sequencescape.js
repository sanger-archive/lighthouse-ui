import axios from 'axios'
import config from '@/nuxt.config'

const createCherrypickBatch = async (plateBarcodes) => {
  const payload = {
    data: {
      type: 'pick_lists',
      attributes: {
        labware_pick_attributes: plateBarcodes.map((plateBarcode) => ({
          source_labware_barcode: plateBarcode
        }))
      }
    }
  }

  try {
    return await axios.post(
      `${config.privateRuntimeConfig.sequencescapeBaseURL}/pick_lists`,
      payload
    )
  } catch (error) {
    return error
  }
}

export { createCherrypickBatch }

export default createCherrypickBatch
