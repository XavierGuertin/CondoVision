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
    unitId: string,
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

  toJSON = () => {
    return {
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
