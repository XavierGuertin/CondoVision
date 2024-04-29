// PropertyAdapter.ts
// Defines a class to adapt and manage property information.
// This class provides a structured way to handle property data and convert it into a JSON format for easy serialization or API response preparation.

class PropertyAdapter {
    private id: string;
    private address: string;
    private lockerCount: number;
    private owner: string;
    private parkingCount: number;
    private propertyName: string;
    private unitCount: number;
    private latitude: string;
    private longitude: string;
    private units: Object[];
  
    /**
     * Constructs an instance of the PropertyAdapter.
     * @param id - The unique identifier for the property.
     * @param address - The physical address of the property.
     * @param lockerCount - The number of lockers associated with the property.
     * @param owner - The owner of the property.
     * @param parkingCount - The number of parking spaces associated with the property.
     * @param propertyName - The name of the property.
     * @param unitCount - The number of units within the property.
     * @param units - An array of Unit objects associated with the property.
     */
    constructor(
      id: string,
      address: string,
      lockerCount: number,
      owner: string,
      parkingCount: number,
      propertyName: string,
      unitCount: number,
      latitude: string,
      longitude: string,
      units: Object[],
    ) {
      this.id = id;
      this.address = address;
      this.lockerCount = lockerCount;
      this.owner = owner;
      this.parkingCount = parkingCount;
      this.propertyName = propertyName;
      this.unitCount = unitCount;
      this.latitude = latitude;
      this.longitude = longitude;
      this.units = units;
    }
  
    /**
     * Converts the PropertyAdapter instance into a JSON object.
     * @returns A JSON representation of the property, suitable for serialization.
     */
    toJSON = () => {
      return {
        id: this.id,
        address: this.address,
        lockerCount: this.lockerCount,
        owner: this.owner,
        parkingCount: this.parkingCount,
        propertyName: this.propertyName,
        unitCount: this.unitCount,
        latitude: this.latitude,
        longitude: this.longitude,
        units: this.units,
      };
    };
  }
  
  export {PropertyAdapter};

  interface CondoFees {
    includes: string[];
    isPayed: boolean;
    monthlyFee: number;
  }
  
  interface OccupantInfo {
    contact: string;
    name: string;
  }
  
  class CondoUnitAdapter {
    private id: string;
    private condoFees: CondoFees;
    private lockerId: string;
    private occupantInfo: OccupantInfo;
    private owner: string;
    private parkingSpotId: string;
    private size: string;
    private unitId: string;
  
    constructor(
      id: string,
      condoFees: CondoFees,
      lockerId: string,
      occupantInfo: OccupantInfo,
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
  
    toJSON = () => {
      return {
        id: this.id,
        condoFees: {
          includes: this.condoFees.includes,
          isPayed: this.condoFees.isPayed,
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
  export {CondoUnitAdapter};