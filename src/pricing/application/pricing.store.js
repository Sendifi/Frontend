import { defineStore } from 'pinia'
import { CourierRepositoryImpl } from '../infrastructure/repository/CourierRepositoryImpl.js'
import { GetCouriersHandler } from './handler/GetCouriersHandler.js'
import { CalculateQuoteHandler } from './handler/CalculateQuoteHandler.js'
import { CalculateQuoteCommand } from './command/CalculateQuoteCommand.js'

const courierRepository = new CourierRepositoryImpl()

export const usePricingStore = defineStore('pricing', {
  state: () => ({
    couriers: [],
    quote: 0,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCouriers() {
      this.loading = true
      this.error = null
      try {
        const handler = new GetCouriersHandler({ courierRepository })
        this.couriers = await handler.execute()
      } catch (error) {
        this.error = error.message || 'errors.fetchCouriers'
      } finally {
        this.loading = false
      }
    },
    async calculateQuote({ weight, courierId }) {
      const handler = new CalculateQuoteHandler({ courierRepository })
      this.quote = await handler.execute(new CalculateQuoteCommand({ weight, courierId }))
      return this.quote
    },
    resetQuote() {
      this.quote = 0
    },
  },
})
