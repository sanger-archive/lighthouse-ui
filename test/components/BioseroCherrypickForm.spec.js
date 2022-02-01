import { createLocalVue, mount } from '@vue/test-utils'
import { BootstrapVue } from 'bootstrap-vue'
import BioseroCherrypickForm from '@/components/BioseroCherrypickForm'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('BioseroCherrypickForm.vue', () => {
  let wrapper, form, props

  beforeEach(() => {
    props = { action: 'create', failureTypes: [] }

    wrapper = mount(BioseroCherrypickForm, {
      propsData: props,
      localVue,
    })
    form = wrapper.vm
  })

  describe('props', () => {
    it('has a action property', () => {
      expect(form.action).toEqual(props.action)
    })
    it('has a failureTypes property', () => {
      expect(form.failureTypes).toEqual(props.failureTypes)
    })

    describe('defaults', () => {
      let wrapperNoProps
      beforeEach(() => {
        wrapperNoProps = mount(BioseroCherrypickForm, {
          localVue,
        })
      })
      it('has a action property', () => {
        expect(wrapperNoProps.vm.action).toBe('')
      })
      it('has a failureTypes property', () => {
        expect(wrapperNoProps.vm.failureTypes).toEqual([])
      })
    })
  })

  describe('#formInvalid', () => {
    describe('when the action is create', () => {
      it('returns true when the data is invalid #1', () => {
        wrapper.setData({
          form: { username: '', barcode: '' },
        })
        expect(form.formInvalid).toBe(true)
      })
      it('returns true when the data is invalid #2', () => {
        wrapper.setData({
          form: {
            username: '    ',
            barcode: 'aBarcode',
          },
        })
        expect(form.formInvalid).toBe(true)
      })
      it('returns false when the data is valid', () => {
        wrapper.setData({
          form: {
            username: 'aUsername',
            barcode: 'aBarcode',
          },
        })
        expect(form.formInvalid).toBe(false)
      })
    })
    describe('when the action is fail', () => {
      let wrapperWithFailAction

      beforeEach(() => {
        props = { action: 'fail' }
        wrapperWithFailAction = mount(BioseroCherrypickForm, {
          propsData: props,
          localVue,
        })
      })

      it('returns true when the data is invalid #1', () => {
        wrapperWithFailAction.setData({
          form: {
            username: '',
            barcode: '',
            failureType: '',
          },
        })
        expect(wrapperWithFailAction.vm.formInvalid).toBe(true)
      })
      it('returns true when the data is invalid #2', () => {
        wrapperWithFailAction.setData({
          form: {
            username: 'aUsername',
            barcode: 'aBarcode',
            failureType: '',
          },
        })
        expect(wrapperWithFailAction.vm.formInvalid).toBe(true)
      })
      it('returns false when the data is valid', () => {
        wrapperWithFailAction.setData({
          form: {
            username: 'aUsername',
            barcode: 'aBarcode',
            failureType: 'aFailureType',
          },
        })
        expect(wrapperWithFailAction.vm.formInvalid).toBe(false)
      })
    })
  })
})
