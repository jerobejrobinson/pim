export default class Pack {
    constructor(quantity, weight, height, width, length) {
        this.QuantityofEaches = quantity
        this.PackageUOM = 'EA'
        this.Dimensions = {
            MerchandisingHeight: height,
            MerchandisingWidth: width,
            MerchandisingLength: length,
            ShippingHeight: height,
            ShippingWidth: width,
            ShippingLength: length,
            ['@_UOM']: 'IN'
        }
        this.Weights = {
            Weight: weight,
            DimensionalWeight: ((height * width * length) / 139).toFixed(4),
            ['@_UOM']: 'PG'
        }
        this['@_ MaintenanceType'] = 'A'
    }
}