import { BootstrapVue } from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import SentinelCherrypick from '@/pages/sentinel_cherrypick'
import labwhere from '@/modules/labwhere'
import sequencescape from '@/modules/sequencescape'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('sentinel cherrypick', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SentinelCherrypick, {
      localVue,
      data() {
        return {
          boxBarcodes: 'lw-ogilvie-4\nlw-ogilvie-5\nlw-ogilvie-6',
          items: [],
        }
      },
    })
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(SentinelCherrypick).exists()).toBeTruthy()
  })

  it('has barcodes', () => {
    expect(wrapper.vm.boxBarcodes).toEqual(
      'lw-ogilvie-4\nlw-ogilvie-5\nlw-ogilvie-6'
    )
  })

  it('has items', () => {
    expect(wrapper.vm.items).toEqual([])
  })

  describe('get plates button', () => {
    let button

    it('has a get plates button', () => {
      button = wrapper.find('#handlePlatesRetrieval')
      expect(button.text()).toEqual('Get plates')
    })

    it('on get plates button click it calls getPlates', () => {
      wrapper.vm.getPlates = jest.fn()
      button = wrapper.find('#handlePlatesRetrieval')
      button.trigger('click')
      expect(wrapper.vm.getPlates).toHaveBeenCalled()
    })
  })

  describe('cancel button', () => {
    let button

    it('has a cancel button', () => {
      button = wrapper.find('#cancelSearch')
      expect(button.text()).toEqual('Cancel')
    })

    it('on cancel button click it calls cancelSearch', () => {
      wrapper.vm.cancelSearch = jest.fn()
      button = wrapper.find('#cancelSearch')
      button.trigger('click')
      expect(wrapper.vm.cancelSearch).toHaveBeenCalled()
    })
  })

  describe('#cancelSearch', () => {
    it('clears boxBarcode', () => {
      wrapper.vm.cancelSearch()
      expect(wrapper.vm.boxBarcodes).toEqual('')
    })
  })

  describe('#parseBoxBarcodes', () => {
    it('splits on whitespace', () => {
      const output = wrapper.vm.parseBoxBarcodes(
        'lw-ogilvie-4\nlw-ogilvie-5\nlw-ogilvie-6'
      )
      expect(output).toEqual(['lw-ogilvie-4', 'lw-ogilvie-5', 'lw-ogilvie-6'])
    })

    it('removes duplicates', () => {
      const output = wrapper.vm.parseBoxBarcodes(
        'lw-ogilvie-4\nlw-ogilvie-4\nlw-ogilvie-6'
      )
      expect(output).toEqual(['lw-ogilvie-4', 'lw-ogilvie-6'])
    })

    it('trims whitespace', () => {
      const output = wrapper.vm.parseBoxBarcodes(
        ' lw-ogilvie-4 \nlw-ogilvie-5  \n lw-ogilvie-6  '
      )
      expect(output).toEqual(['lw-ogilvie-4', 'lw-ogilvie-5', 'lw-ogilvie-6'])
    })
  })

  describe('#getPlates', () => {
    it('calls getPlatesFromBoxBarcodes', async () => {
      labwhere.getPlatesFromBoxBarcodes = jest.fn()
      wrapper.vm.handleGetPlatesResponse = jest.fn()
      await wrapper.vm.getPlates()
      expect(labwhere.getPlatesFromBoxBarcodes).toHaveBeenCalled()
    })
  })

  describe('#handleGetPlatesResponse', () => {
    let response

    it('on success it populates the table', () => {
      response = { success: true, barcodes: ['aBarcode1', 'aBarcode2'] }
      wrapper.vm.handleGetPlatesResponse(response)

      const expected = [
        {
          plate_barcode: response.barcodes[0],
          selected: true,
        },
        {
          plate_barcode: response.barcodes[1],
          selected: true,
        },
      ]

      expect(wrapper.vm.items).toEqual(expected)
    })

    it('on failure it shows an error message', () => {
      response = { success: false, error: 'There was an error' }

      wrapper.vm.handleGetPlatesResponse(response)
      wrapper.vm.$nextTick(() => {
        expect(wrapper.findComponent({ ref: 'alert' }).text()).toEqual(
          'Could not retrieve plates from LabWhere'
        )
      })
      expect(wrapper.vm.items).toEqual([])
    })
  })

  describe('create batch button, no items', () => {
    let button

    it('has a create batch button at the top of the table', () => {
      button = wrapper.find('#handleSentinelBatchCreationTop')
      expect(button.text()).toEqual('Create cherrypick batch')
    })

    it('has a create batch button at the bottom of the table', () => {
      button = wrapper.find('#handleSentinelBatchCreationBottom')
      expect(button.text()).toEqual('Create cherrypick batch')
    })

    it('create batch button (top) is disabled', () => {
      wrapper.vm.createBatch = jest.fn()
      button = wrapper.find('#handleSentinelBatchCreationTop')
      button.trigger('click')
      expect(wrapper.vm.createBatch).not.toHaveBeenCalled()
    })

    it('create batch button (bottom) is disabled', () => {
      wrapper.vm.createBatch = jest.fn()
      button = wrapper.find('#handleSentinelBatchCreationBottom')
      button.trigger('click')
      expect(wrapper.vm.createBatch).not.toHaveBeenCalled()
    })
  })

  describe('batch creation, all selected', () => {
    beforeEach(() => {
      wrapper.vm.items = [
        {
          plate_barcode: 'aBarcode1',
          selected: true,
        },
        {
          plate_barcode: 'aBarcode2',
          selected: true,
        },
      ]
    })

    describe('create batch button', () => {
      let button

      it('on create batch button (top) click it calls createBatch', () => {
        wrapper.vm.createBatch = jest.fn()
        button = wrapper.find('#handleSentinelBatchCreationTop')
        button.trigger('click')
        expect(wrapper.vm.createBatch).toHaveBeenCalled()
      })

      it('on create batch button (bottom) click it calls createBatch', () => {
        wrapper.vm.createBatch = jest.fn()
        button = wrapper.find('#handleSentinelBatchCreationBottom')
        button.trigger('click')
        expect(wrapper.vm.createBatch).toHaveBeenCalled()
      })
    })

    describe('#createBatch', () => {
      it('calls createCherrypickBatch', async () => {
        sequencescape.createCherrypickBatch = jest.fn()
        wrapper.vm.handleCreateBatchResponse = jest.fn()
        await wrapper.vm.createBatch()
        expect(sequencescape.createCherrypickBatch).toHaveBeenCalled()
      })
    })

    describe('#handleCreateBatchResponse', () => {
      let response

      it('on success it shows a link', () => {
        response = {
          success: true,
          data: {
            id: '4',
            type: 'pick_lists',
            links: {
              self: 'http://localhost:3010/api/v2/pick_lists/4',
            },
            attributes: {
              created_at: '2020-07-28T11:54:45+01:00',
              updated_at: '2020-07-28T11:54:45+01:00',
              state: 'pending',
              links: [
                {
                  name: 'Pick-list 4',
                  url: 'http://localhost:3000/pick_lists/4',
                },
              ],
              pick_attributes: [
                {
                  source_receptacle_id: 101,
                  study_id: 1,
                  project_id: 1,
                },
              ],
              asynchronous: true,
            },
          },
        }

        wrapper.vm.handleCreateBatchResponse(response)
        wrapper.vm.$nextTick(() => {
          expect(wrapper.findComponent({ ref: 'alert' }).text()).toEqual(
            'Cherrypicking batch successfully created. Go to this link to view it: http://localhost:3000/pick_lists/4'
          )
        })
      })

      it('on failure it shows an error message', () => {
        response = {
          success: false,
          error: 'Test error',
        }

        wrapper.vm.handleCreateBatchResponse(response)
        wrapper.vm.$nextTick(() => {
          expect(wrapper.findComponent({ ref: 'alert' }).text()).toEqual(
            'Test error'
          )
        })
      })
    })
  })

  describe('batch creation, not all selected', () => {
    beforeEach(() => {
      wrapper.vm.items = [
        {
          plate_barcode: 'aBarcode1',
          selected: false,
        },
        {
          plate_barcode: 'aBarcode2',
          selected: true,
        },
      ]
    })

    describe('#createBatch', () => {
      it('calls createCherrypickBatch with only selected items', async () => {
        sequencescape.createCherrypickBatch = jest.fn()
        wrapper.vm.handleCreateBatchResponse = jest.fn()
        await wrapper.vm.createBatch()
        expect(sequencescape.createCherrypickBatch).toHaveBeenCalledWith([
          'aBarcode2',
        ])
      })
    })
  })

  describe('batch creation, none selected', () => {
    beforeEach(() => {
      wrapper.vm.items = [
        {
          plate_barcode: 'aBarcode1',
          selected: false,
        },
        {
          plate_barcode: 'aBarcode2',
          selected: false,
        },
      ]
    })

    describe('#createBatch', () => {
      it("doesn't call createCherrypickBatch", async () => {
        sequencescape.createCherrypickBatch = jest.fn()
        wrapper.vm.handleCreateBatchResponse = jest.fn()
        await wrapper.vm.createBatch()
        expect(sequencescape.createCherrypickBatch).not.toHaveBeenCalled()
      })
    })
  })
})
