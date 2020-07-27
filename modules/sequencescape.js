import axios from 'axios'
import config from '@/nuxt.config'

const createCherrypickBatch = async (plateBarcodes) => {
  const payload = {
    data: {
      type: 'pick_lists',
      attributes: {
        asynchronous: true,
        labware_pick_attributes: plateBarcodes.map((plateBarcode) => ({
          source_labware_barcode: plateBarcode,
          study_id: 1,
          project_id: 1
        }))
      }
    }
  }

  try {
    const response = await axios.post(
      `${config.privateRuntimeConfig.sequencescapeBaseURL}/pick_lists`,
      payload,
      {
        headers: {
          'Content-Type': 'application/vnd.api+json'
        }
      }
    )
    return {
      success: true,
      data: response.data.data
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

export { createCherrypickBatch }

export default createCherrypickBatch
