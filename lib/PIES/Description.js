import { useState } from "react"
export default class Description {
    constructor(text, descriptionCode) {
        this['#text'] = text
        this['@_DescriptionCode'] = descriptionCode
        this['@_MaintenanceType'] = 'A'
        this['@_LanguageCode'] = 'EN'
    }

    getDescriptionType() {
        if(this['@_DescriptionCode'] === 'MKT') {
            return 'Marketing Description'
        }
        return 'Part Title'
    }

    getText() {
        return this['#text']
    }
    sendText(str) {
        this['#text'] = str
        return this;
    }
}