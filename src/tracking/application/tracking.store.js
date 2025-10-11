import { defineStore } from 'pinia'
import { TrackingRepositoryImpl } from '../infrastructure/repository/TrackingRepositoryImpl.js'
import { GetTrackingByShipmentIdHandler } from './handler/GetTrackingByShipmentIdHandler.js'
import { GetTrackingByShipmentIdQuery } from './query/GetTrackingByShipmentIdQuery.js'

const trackingRepository = new TrackingRepositoryImpl()

export const useTrackingStore = defineStore('tracking', {
  state: () => ({
    events: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchByShipmentId(shipmentId) {
      this.loading = true
      this.error = null
      try {
        const handler = new GetTrackingByShipmentIdHandler({ trackingRepository })
        this.events = await handler.execute(new GetTrackingByShipmentIdQuery({ shipmentId }))
      } catch (error) {
        this.error = error.message || 'errors.fetchTracking'
        this.events = []
      } finally {
        this.loading = false
      }
    },
  },
})
