import { createLocalVue, mount } from '@vue/test-utils'
import { BootstrapVue } from 'bootstrap-vue'
import AlertDialog from '@/components/AlertDialog'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('AlertDialog.vue', () => {
  let wrapper

  it('has a message', () => {
    wrapper = mount(AlertDialog, {
      localVue,
      data() {
        return { message: 'bar' }
      },
    })
    expect(wrapper.vm.message).toBe('bar')
  })

  it('has a type', () => {
    wrapper = mount(AlertDialog, {
      localVue,
      data() {
        return { type: 'primary' }
      },
    })
    expect(wrapper.vm.type).toBe('primary')
  })

  it('has a showDismissibleAlert', () => {
    wrapper = mount(AlertDialog, {
      localVue,
      data() {
        return { showDismissibleAlert: true }
      },
    })
    expect(wrapper.vm.showDismissibleAlert).toBe(true)
  })

  it('is hidden as default', () => {
    wrapper = mount(AlertDialog, { localVue })
    expect(wrapper.vm.showDismissibleAlert).toBe(false)
    expect(wrapper.find('#showAlert').element).toBeTruthy()
  })

  it('displays the message', () => {
    wrapper = mount(AlertDialog, {
      localVue,
      data() {
        return { message: 'bar', showDismissibleAlert: true }
      },
    })
    expect(wrapper.html()).toContain('bar')
  })

  it('displays the type', () => {
    wrapper = mount(AlertDialog, {
      localVue,
      data() {
        return { type: 'success', showDismissibleAlert: true }
      },
    })
    expect(wrapper.find('.alert-success').element).toBeTruthy()
  })

  it('#show sets the data', () => {
    const alert = mount(AlertDialog, { localVue }).vm
    alert.show('msg')
    expect(alert.message).toBe('msg')
    expect(alert.type).toBe('primary')
    expect(alert.showDismissibleAlert).toBe(true)
  })
})
