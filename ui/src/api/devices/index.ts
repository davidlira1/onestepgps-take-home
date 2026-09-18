import { httpDeviceApi } from './http'
import { mockDeviceApi } from './mock'
import type { DeviceApi } from '@/types/device'

export function createDeviceApi(
  useMock: boolean = import.meta.env.VITE_USE_MOCK_DEVICES === 'true'
): DeviceApi {
  return useMock ? mockDeviceApi : httpDeviceApi
}

export const deviceApi = createDeviceApi()

export const listDevices = () => deviceApi.listDevices()

export { httpDeviceApi } from './http'
export { mockDeviceApi, mockDevices } from './mock'
