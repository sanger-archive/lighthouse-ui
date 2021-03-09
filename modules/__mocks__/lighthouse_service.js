// https://jestjs.io/docs/en/jest-object#jestcreatemockfrommodulemodulename
const lighthouse = jest.createMockFromModule('@/modules/lighthouse_service').default

export default lighthouse
