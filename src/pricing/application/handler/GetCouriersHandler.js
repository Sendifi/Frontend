export class GetCouriersHandler {
  constructor({ courierRepository }) {
    this.courierRepository = courierRepository
  }

  async execute() {
    return this.courierRepository.findAll()
  }
}
