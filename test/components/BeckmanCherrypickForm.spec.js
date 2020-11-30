import { mount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import BeckmanCherrypickForm from '@/components/BeckmanCherrypickForm'
import lighthouse from '@/modules/lighthouse_service'

jest.mock('@/modules/lighthouse_service')

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('BeckmanCherrypickForm.vue', () => {
  let wrapper, form, props

  beforeEach(() => {
    props = { action: 'create' }

    lighthouse.getRobots.mockReturnValue({
      success: true,
      robots: [
        {'name': 'robot 1', 'serial_number': 'B00000001'},
        {'name': 'robot 2', 'serial_number': 'B00000002'}
      ]
    })

    lighthouse.getFailureTypes.mockReturnValue({
      success: true,
      failure_types: [
        {'type': 'Type 1', 'description': 'Description of error 1'},
        {'type': 'Type 2', 'description': 'Description of error 2'}
      ]
    })

    wrapper = mount(BeckmanCherrypickForm, {
      propsData: props,
      localVue,
    })
    form = wrapper.vm
  })

  describe('created', () => {
    it('calls lighthouse initialiser methods', () => {
      expect(lighthouse.getRobots).toHaveBeenCalled()
      expect(lighthouse.getFailureTypes).toHaveBeenCalled()
    })
  })

  describe('props', () => {
    it('has a action property', () => {
      expect(form.action).toEqual(props.action)
    })
  })

  describe('#formInvalid', () => {
    describe('when the action is create', () => {
      it('returns true when the data is invalid #1', () => {
        wrapper.setData({ form: { username: '', barcode: '', robotSerialNumber: '' } } )
        expect(form.formInvalid).toBeTruthy
      })
      it('returns true when the data is invalid #2', () => {
        wrapper.setData({ form: { username: '    ', barcode: 'aBarcode', robotSerialNumber: 'aRobotNum' } } )
        expect(form.formInvalid).toBeTruthy
      })
      it('returns false when the data is valid', () => {
        wrapper.setData({ form: { username: 'aUsername', barcode: 'aBarcode', robotSerialNumber: 'aRobotNum' } } )
        expect(form.formInvalid).toBeFalsey
      })
    })
    describe('when the action is fail', () => {
      beforeEach(() => {
        props = { action: 'fail' }
      })

      it('returns true when the data is invalid #1', () => {
        wrapper.setData({ form: { username: '', barcode: '', robotSerialNumber: '', failureType: '' } } )
        expect(form.formInvalid).toBeTruthy
      })
      it('returns true when the data is invalid #2', () => {
        wrapper.setData({ form: { username: '    ', barcode: 'aBarcode', robotSerialNumber: 'aRobotNum', failureType: '' } } )
        expect(form.formInvalid).toBeTruthy
      })
      it('returns false when the data is valid', () => {
        wrapper.setData({ form: { username: 'aUsername', barcode: 'aBarcode', robotSerialNumber: 'aRobotNum', failureType: 'aFailureType' } } )
        expect(form.formInvalid).toBeFalsey
      })
    })
  })

  describe('#getRobots', () => {
    it('on success it sets the robots data', () => {
      form.getRobots()
      expect(form.robots.length).toEqual(2)
    })

    // TODO handler error
    it('on failure it does something', () => {
      lighthouse.getRobots.mockReturnValue({
        success: false,
      })

      wrapper = mount(BeckmanCherrypickForm, {
        propsData: props,
        localVue,
      })
      expect(wrapper.vm.robots.length).toEqual(0)
    })
  })

  describe('#getFailureTypes', () => {
    it('sets the failure types data', () => {
      form.getFailureTypes()
      expect(form.failureTypes.length).toEqual(2)
    })

    // TODO handler error
    it('on failure it does something', () => {
      lighthouse.getFailureTypes.mockReturnValue({
        success: false,
        robots: []
      })

      wrapper = mount(BeckmanCherrypickForm, {
        propsData: props,
        localVue,
      })
      expect(wrapper.vm.failureTypes.length).toEqual(0)
    })
  })
})