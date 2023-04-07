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

    jsonString(){
        return JSON.stringify(this)
    }

    addID(id) {
        this._id = id
    }
    async sendToAPI() {
        return await fetch(`api/updateItem`, {
            method: 'POST',
            body: this.jsonString()
        }).then(data => data.json())
    }
}

export default Item;