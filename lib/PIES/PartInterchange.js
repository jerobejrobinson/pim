export default class PartInterchange {
    constructor(partNumbersArray, BrandAAIAID) {
        this.PartNumber = partNumbersArray,
        this['@_MaintenanceType'] = 'A';
        this['@_LanguageCode'] = 'EN';
        this['@_BrandAAIAID'] = BrandAAIAID;
    }
}