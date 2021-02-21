import config from '@/nuxt.config'
import axios from 'axios'

const createPayloadForCherrypickBatch = (barcodes, runtimeOptions = config.publicRuntimeConfig) => {
  const { asynchronous, studyId, projectId } = runtimeOptions
  return {
    data: {
      type: 'pick_lists',
      attributes: {
        asynchronous,
        labware_pick_attributes: barcodes.map((plateBarcode) => ({
          source_labware_barcode: plateBarcode,
          study_id: parseInt(studyId),
          project_id: parseInt(projectId),
        })),
      },
    },
  }
}

const createCherrypickBatch = async (barcodes) => {
  const payload = createPayloadForCherrypickBatch(barcodes)

  try {
    const response = await axios.post(
      `${config.privateRuntimeConfig.sequencescapeBaseURL}/pick_lists`,
      payload,
      {
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
      }
    )
    return {
      success: true,
      data: response.data.data,
    }
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}

const sequencescape = { createCherrypickBatch, createPayloadForCherrypickBatch }

export default sequencescape
