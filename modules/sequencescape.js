import axios from 'axios'
import config from '@/nuxt.config'

const createPayloadForCherrypickBatch = (
  plateBarcodes,
  runtimeOptions = config.publicRuntimeConfig
) => {
  const { asynchronous, studyId, projectId } = runtimeOptions
  return {
    data: {
      type: 'pick_lists',
      attributes: {
        asynchronous,
        labware_pick_attributes: plateBarcodes.map((plateBarcode) => ({
          source_labware_barcode: plateBarcode,
          study_id: studyId,
          project_id: projectId
        }))
      }
    }
  }
}

const createCherrypickBatch = async (plateBarcodes) => {
  const payload = createPayloadForCherrypickBatch(plateBarcodes)

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

export { createCherrypickBatch, createPayloadForCherrypickBatch }

export default createCherrypickBatch
