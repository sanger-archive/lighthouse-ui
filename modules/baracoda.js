import axios from 'axios'
import config from '@/nuxt.config'

// return a bunch of barcodes from baracoda
const createBarcodes = async ({ count }) => {
  try {
    const response = await axios.post(
      `${config.privateRuntimeConfig.baracodaBaseURL}/barcodes_group/HT/new`,
      { count }
    )
    return {
      success: true,
      barcodes: response.data.barcodes_group.barcodes
    }
  } catch (error) {

    return {
      success: false,
      error
    }
  }
}

const Baracoda = {
  createBarcodes
}

export default Baracoda
