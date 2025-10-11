import { defineStore } from 'pinia'
import { ShippingRepositoryImpl } from '../../shipping/infrastructure/repository/ShippingRepositoryImpl.js'
import { TrackingRepositoryImpl } from '../../tracking/infrastructure/repository/TrackingRepositoryImpl.js'
import { GetTrackingByCodeQuery } from './query/GetTrackingByCodeQuery.js'
import { GetTrackingByCodeHandler } from './handler/GetTrackingByCodeHandler.js'

const shipmentRepository = new ShippingRepositoryImpl()
const trackingRepository = new TrackingRepositoryImpl()

export const usePublicStore = defineStore('publicTracking', {
  state: () => ({
    trackingInfo: null,
    loading: false,
    error: null,
  }),
  actions: {
    async getTrackingByCode(trackingCode) {
      this.loading = true
      this.error = null
      try {
        const handler = new GetTrackingByCodeHandler({ shipmentRepository, trackingRepository })
        this.trackingInfo = await handler.execute(new GetTrackingByCodeQuery({ trackingCode }))
      } catch (error) {
        this.error = error.message || 'errors.trackingNotFound'
        this.trackingInfo = null
      } finally {
        this.loading = false
      }
    },
    reset() {
      this.trackingInfo = null
      this.error = null
    },
  },
})
