export default class Description {
    constructor(text, descriptionCode) {
        this['#text'] = text,
        this['@_DescriptionCode'] = descriptionCode,
        this['@_MaintenanceType'] = 'A'
        this['@_LanguageCode'] = 'EN'
    }
}