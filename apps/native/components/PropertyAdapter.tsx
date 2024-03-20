/**
 * PropertyAdapter serves to adapt property data into a structured format.
 */
class PropertyAdapter {
  private id: string;
  private address: string;
  private lockerCount: number;
  private owner: string;
  private parkingCount: number;
  private propertyName: string;
  private unitCount: number;
  private units: Object[];

    /**
   * Initializes a new instance of the PropertyAdapter.
   * @param {string} id The property's unique identifier.
   * @param {string} address The address of the property.
   * @param {number} lockerCount The count of lockers available at the property.
   * @param {string} owner The owner of the property.
   * @param {number} parkingCount The count of parking spots available at the property.
   * @param {string} propertyName The name of the property.
   * @param {number} unitCount The count of units in the property.
   * @param {Unit[]} units An array of units within the property.
   */
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

  /**
   * Converts the property data to a JSON object.
   * @returns {Object} A JSON representation of the property data.
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
      units: this.units,
    };
  };
}

export default PropertyAdapter;
