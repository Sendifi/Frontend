import { PricingService } from '../../domain/service/PricingService.js'

export class CalculateQuoteHandler {
  constructor({ courierRepository }) {
    this.courierRepository = courierRepository
  }

  async execute(command) {
    const courier = command.courierId ? await this.courierRepository.findById(command.courierId) : null
    return PricingService.calculateQuote({ weight: command.weight, courier })
  }
}
