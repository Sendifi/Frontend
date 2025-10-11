import { ReportingRepository } from '../../domain/repository/ReportingRepository.js'
import { ReportingDomainService } from '../../domain/service/ReportingDomainService.js'
import { Report } from '../../domain/model/Report.js'

export class ReportingMemoryRepository extends ReportingRepository {
  async generate({ shipments }) {
    const summary = ReportingDomainService.summarizeShipments(shipments)
    return new Report({ name: 'Shipment Summary', data: summary })
  }
}
