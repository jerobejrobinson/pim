export default class Pack {
    constructor(quantity, weight) {
        this.QuantityofEaches = quantity
        this.PackageUOM = 'EA'
        this.Weights = {
            Weight: weight,
            ['@_UOM']: 'PG'
        }
        this['@_ MaintenanceType'] = 'A'
    }
}