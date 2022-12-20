import { createLocalVue, mount } from '@vue/test-utils'
import { BootstrapVue } from 'bootstrap-vue'
import StatusAlert from '@/components/StatusAlert'
import statuses from '~/modules/statuses'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('StatusAlert.vue', () => {
  let wrapper

  it('has an alertMessage', () => {
    wrapper = mount(StatusAlert, {
      localVue,
      data() {
        return { alertMessage: 'Alert Message' }
      },
    })

    expect(wrapper.vm.alertMessage).toBe('Alert Message')
  })

  it("is hidden when status is 'Idle'", () => {
    wrapper = mount(StatusAlert, {
      localVue,
      data() {
        return { alertMessage: 'Alert Message', status: statuses.Idle }
      },
    })

    expect(wrapper.find('.statusAlert').element).toBeTruthy()
    expect(wrapper.html()).not.toContain('Alert Message')
  })

  it.each([
    ['Busy'],
    ['Error'],
    ['Success'],
  ])("displays the message when status is '%s'", (status) => {
    wrapper = mount(StatusAlert, {
      localVue,
      data() {
        return { alertMessage: 'Alert Message', status: statuses[status] }
      },
    })

    expect(wrapper.html()).toContain('Alert Message')
  })

  describe("setStatus()", () => {
    it.each([
      ["Idle", "Idle Alert", statuses.Idle, ""],
      ["Busy", "Busy Alert", statuses.Busy, "warning"],
      ["Error", "Error Alert", statuses.Error, "danger"],
      ["Success", "Success Alert", statuses.Success, "success"],
    ])(
      "sets the status '%s' and alert message '%s'",
      (stringStatus, message, numericStatus, alertVariant) => {
        wrapper = mount(StatusAlert, { localVue })
        wrapper.vm.setStatus(stringStatus, message)

        expect(wrapper.vm.alertMessage).toBe(message)
        expect(wrapper.vm.status).toBe(numericStatus)
        expect(wrapper.vm.alertVariant).toBe(alertVariant)
      }
    )
  })
})
