class PropertyAdapter {
  private id: string;
  private address: string;
  private lockerCount: number;
  private owner: string;
  private parkingCount: number;
  private propertyName: string;
  private unitCount: number;
  private units: Object[];

  constructor(
    id: string,
    address: string,
    lockerCount: number,
    owner: string,
    parkingCount: number,
    propertyName: string,
    unitCount: number,
    units: Object[],
  ) {
    this.id = id;
    this.address = address;
    this.lockerCount = lockerCount;
    this.owner = owner;
    this.parkingCount = parkingCount;
    this.propertyName = propertyName;
    this.unitCount = unitCount;
    this.units = units;
  }

  toJSON = () => {
    return {
      id: this.id,
      address: this.address,
      lockerCount: this.lockerCount,
      owner: this.owner,
      parkingCount: this.parkingCount,
      propertyName: this.propertyName,
      unitCount: this.unitCount,
      units: this.units,
    };
  };
}

export default PropertyAdapter;
