import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import LighthouseSentinelCherrypick from '@/pages/lighthouse_sentinel_cherrypick'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('lighthouse sentinel cherrypick', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(LighthouseSentinelCherrypick, {
      localVue,
      data() {
        return {
          boxBarcodes: 'lw-ogilvie-4\nlw-ogilvie-5\nlw-ogilvie-6',
          items: []
        }
      }
    })
  })

  it('is a Vue instance', () => {
    expect(
      wrapper.findComponent(LighthouseSentinelCherrypick).exists()
    ).toBeTruthy()
  })

  it('has a barcode', () => {
    expect(wrapper.vm.boxBarcodes).toEqual(
      'lw-ogilvie-4\nlw-ogilvie-5\nlw-ogilvie-6'
    )
  })

  it('has items', () => {
    expect(wrapper.vm.items).toEqual([])
  })

  // TODO: Are these necessary. Would this be better done in an integration test.
  // describe('submission', () => {
  //   let button

  //   it('has a submit button', () => {
  //     button = wrapper.find('#handleSentinelSampleCreation')
  //     expect(button.text()).toEqual('Submit')
  //   })

  //   it('on submit button click it calls handleSentinelSampleCreation', () => {
  //     wrapper.vm.handleSentinelSampleCreation = jest.fn()
  //     button = wrapper.find('#handleSentinelSampleCreation')
  //     button.trigger('click')
  //     expect(wrapper.vm.handleSentinelSampleCreation).toBeCalled()
  //   })
  // })

  // describe('cancel button', () => {
  //   let button

  //   it('has a cancel button', () => {
  //     button = wrapper.find('#cancelSearch')
  //     expect(button.text()).toEqual('Cancel')
  //   })

  //   it('on cancel button click it calls cancelSearch', () => {
  //     wrapper.vm.cancelSearch = jest.fn()
  //     button = wrapper.find('#cancelSearch')
  //     button.trigger('click')
  //     expect(wrapper.vm.cancelSearch).toBeCalled()
  //   })
  // })

  // describe('#cancelSearch', () => {
  //   it('it clears boxBarcode', () => {
  //     wrapper.vm.cancelSearch()
  //     expect(wrapper.vm.boxBarcode).toEqual('')
  //   })
  // })

  // describe('#handleSentinelSampleCreation', () => {
  //   it('calls handleApiCall', async () => {
  //     apiModule.handleApiCall = jest.fn()
  //     wrapper.vm.handleSentinelSampleCreationResponse = jest.fn()
  //     await wrapper.vm.handleSentinelSampleCreation()
  //     expect(apiModule.handleApiCall).toBeCalled()
  //   })

  //   it('calls handleApiCall', async () => {
  //     const expected = [{ it: 'worked' }]
  //     apiModule.handleApiCall = jest.fn().mockReturnValue(expected)
  //     wrapper.vm.handleSentinelSampleCreationResponse = jest.fn()
  //     await wrapper.vm.handleSentinelSampleCreation()
  //     expect(wrapper.vm.handleSentinelSampleCreationResponse).toBeCalledWith(
  //       expected
  //     )
  //   })
  // })

  // describe('#handleSentinelSampleCreationResponse', () => {
  //   let response

  //   it('on success it populates the table', () => {
  //     response = [
  //       {
  //         data: {
  //           data: {
  //             plate_barcode: 'aBarcode1',
  //             centre: 'tst1',
  //             number_of_positives: 3
  //           }
  //         }
  //       },
  //       {
  //         data: {
  //           data: {
  //             plate_barcode: 'aBarcode2',
  //             centre: 'tst1',
  //             number_of_positives: 1
  //           }
  //         }
  //       }
  //     ]
  //     wrapper.vm.handleSentinelSampleCreationResponse(response)
  //     expect(wrapper.vm.items).toEqual(
  //       response.map((r) => r.data).map((r) => r.data)
  //     )
  //   })

  //   it('on failure it shows an error message', () => {
  //     response = [
  //       {
  //         errors: ['an error 1']
  //       },
  //       {
  //         errors: ['an error 2', 'an error 3']
  //       }
  //     ]

  //     wrapper.vm.handleSentinelSampleCreationResponse(response)
  //     wrapper.vm.$nextTick(() => {
  //       expect(wrapper.findComponent({ ref: 'alert' }).text()).toMatch(
  //         /an error 1, an error 2, an error 3/
  //       )
  //     })
  //     expect(wrapper.vm.items).toEqual([])
  //   })

  //   it('on partial success/failure, last request successful', () => {
  //     response = [
  //       {
  //         errors: ['an error 1']
  //       },
  //       {
  //         errors: ['an error 2']
  //       },
  //       {
  //         data: {
  //           data: {
  //             plate_barcode: 'aBarcode1',
  //             centre: 'tst1',
  //             number_of_positives: 1
  //           }
  //         }
  //       },
  //       {
  //         data: {
  //           data: {
  //             plate_barcode: 'aBarcode2',
  //             centre: 'tst1',
  //             number_of_positives: 1
  //           }
  //         }
  //       }
  //     ]

  //     wrapper.vm.handleSentinelSampleCreationResponse(response)
  //     wrapper.vm.$nextTick(() => {
  //       expect(wrapper.findComponent({ ref: 'alert' }).text()).toMatch(
  //         /an error 1, an error 2/
  //       )
  //     })
  //     expect(wrapper.vm.items).toEqual(
  //       response
  //         .slice(2)
  //         .map((r) => r.data)
  //         .map((r) => r.data)
  //     )
  //   })

  //   it('on partial success/failure, last request failed', () => {
  //     response = [
  //       {
  //         errors: ['an error 2']
  //       },
  //       {
  //         data: {
  //           data: {
  //             plate_barcode: 'aBarcode1',
  //             centre: 'tst1',
  //             number_of_positives: 1
  //           }
  //         }
  //       },
  //       {
  //         data: {
  //           data: {
  //             plate_barcode: 'aBarcode2',
  //             centre: 'tst1',
  //             number_of_positives: 1
  //           }
  //         }
  //       },
  //       {
  //         errors: ['an error 1']
  //       }
  //     ]

  //     wrapper.vm.handleSentinelSampleCreationResponse(response)
  //     wrapper.vm.$nextTick(() => {
  //       expect(wrapper.findComponent({ ref: 'alert' }).text()).toMatch(
  //         /an error 2, an error 1/
  //       )
  //     })
  //     expect(wrapper.vm.items).toEqual(
  //       response
  //         .slice(1, 3)
  //         .map((r) => r.data)
  //         .map((r) => r.data)
  //     )
  //   })
  // })
})
