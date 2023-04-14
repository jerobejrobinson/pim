/**
 * @classdesc Creates an Item respresentation of the Item tag
 * @class Item
 */
class Item {
    constructor(PartNumber, BrandAAIAID, PartTerminologyID) {
        this.PartNumber = PartNumber;
        this.BrandAAIAID = BrandAAIAID;
        this.PartTerminologyID = PartTerminologyID
        this.Descriptions = {
            Description: []
        };
        this.PartInterchangeInfo = {
            PartInterchange: []
        };
        this.DigitalAssets = {
            DigitalFileInformation: []
        };
        this.Packages = {
            Package: []
        }
        this['@_MaintenanceType'] = 'A';
    }

    addPartTerminology(value) {
        this.PartTerminologyID = value
    }

    addPackage(pack) {
        console.log(this.Packages.Package[0])
        if(this.Packages.Package[0] !== undefined) {
            this.Packages.Package[0] = pack
        } else {
            this.Packages.Package.push(pack)
        }
    }

    addDescription(description) {
        this.Descriptions.Description.push(description)
    }

    addPartInterchange(PartInterchange) {
        let flag = false
        this.PartInterchangeInfo.PartInterchange.forEach((tag) => {
            if(tag['@_BrandAAIAID'].toUpperCase() === PartInterchange['@_BrandAAIAID']) {
                flag = true
                tag.PartNumber = tag.PartNumber.concat(PartInterchange.PartNumber)
            }
        })
        if(!flag) {
            this.PartInterchangeInfo.PartInterchange.push(PartInterchange)
        }

        return this.sendToAPI()
    }

    addDigitalAssets(assets) {
        this.DigitalAssets.DigitalFileInformation.push(assets)
    }
    removeInterchange(brandIndex, partIndex) {
        this.PartInterchangeInfo.PartInterchange[brandIndex].PartNumber = this.PartInterchangeInfo.PartInterchange[brandIndex].PartNumber.filter((obj, index) => index != partIndex ? 1 : 0)
        if(this.PartInterchangeInfo.PartInterchange[brandIndex].PartNumber.length === 0) {
            this.PartInterchangeInfo.PartInterchange = this.PartInterchangeInfo.PartInterchange.filter((obj, index) => index != brandIndex ? 1 : 0)
        }
    }
    removeImage(index) {
        this.DigitalAssets.DigitalFileInformation = this.DigitalAssets.DigitalFileInformation.filter((obj, objIndex) => objIndex != index ? 1 : 0)
    }
    
    jsonString(){
        return JSON.stringify(this)
    }

    addID(id) {
        this._id = id
    }

    stripID() {
        delete this._id
    }
    stripPartInterchanges() {
        this.PartInterchangeInfo.PartInterchange = []
    }
    async sendToAPI() {
        return await fetch(`api/updateItem`, {
            method: 'POST',
            body: this.jsonString()
        }).then(data => data.json())
    }
}

export default Item;