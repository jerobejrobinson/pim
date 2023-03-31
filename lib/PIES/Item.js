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
        this.Packages.Package.push(pack)
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
        return this
    }

    addDigitalAssets(assets) {
        this.DigitalAssets.DigitalFileInformation.push(assets)
    }

    jsonString(){
        return JSON.stringify(this)
    }

    // async sendToDatabase() {
    //     const client = await clientPromise
    //     const db = client.db('PIM')
    //     const items = db.collection('items')
    //     await items.updateOne({_id: this._id}, this.jsonString())
    //     console.log(this._id)
    // }
}

export default Item;