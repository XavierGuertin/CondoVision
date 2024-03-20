/**
 * CondoUnitAdapter adapts condo unit properties into a standardized format.
 */
class CondoUnitAdapter {
  private id: string;
  private condoFees: Object;
  private lockerId: string;
  private occupantInfo: Object;
  private owner: string;
  private parkingSpotId: string;
  private size: string;
  private unitId: string;

  constructor(
    id: string,
    condoFees: Object,
    lockerId: string,
    occupantInfo: Object,
    owner: string,
    parkingSpotId: string,
    size: string,
    unitId: string
  ) {
    this.id = id;
    this.condoFees = condoFees;
    this.lockerId = lockerId;
    this.occupantInfo = occupantInfo;
    this.owner = owner;
    this.parkingSpotId = parkingSpotId;
    this.size = size;
    this.unitId = unitId;
  }

  /**
   * Serializes the condo unit's properties to a JSON object.
   * @returns A JSON representation of the condo unit.
   */
  toJSON = () => {
    return {
      id: this.id,
      condoFees: {
        includes: this.condoFees.includes,
        monthlyFee: this.condoFees.monthlyFee,
      },
      lockerId: this.lockerId,
      occupantInfo: {
        contact: this.occupantInfo.contact,
        name: this.occupantInfo.name,
      },
      owner: this.owner,
      parkingSpotId: this.parkingSpotId,
      size: this.size,
      unitId: this.unitId,
    };
  };
}

export default CondoUnitAdapter;
