export class ReportingDomainService {
  static summarizeShipments(shipments = []) {
    const totals = shipments.reduce(
      (acc, shipment) => {
        acc.total += 1
        acc.byStatus[shipment.status] = (acc.byStatus[shipment.status] || 0) + 1
        return acc
      },
      { total: 0, byStatus: {} },
    )
    return totals
  }
}
