export default class PIES {
    constructor() {
        this['?xml'] = {
            ['@_version']: '1.0',
            ['@_encoding']: 'utf-8'
        };
        this.PIES = {
            Header: {
                PIESVersion: 7.2,
                SubmissionType: 'FULL',
                TechnicalContact: 'MSP Diesel - Tim Rickman',
                ContactEmail: 'trickman@mspdieselsolutions.com',
                PCdbVersionDate: '2023-03-16'
            },
            Items: {
                Item: []
            },
            Trailer: { 
                ItemCount: null, 
                TransactionDate: `${new Date().toISOString().split('T')[0]}` 
            }
        };
        this['@_xmlns:xsi'] = 'http://www.w3.org/2001/XMLSchema-instance';
        this['@_xmlns:xsd'] = 'http://www.w3.org/2001/XMLSchema';
        this['@_xmlns'] = 'http://www.autocare.org';
    }

    addItem(item) {
        if(item._id) {
            delete item._id
        }
        this.PIES.Items.Item.push(item)
    }

    getItemCount() {
        return this.PIES.Items.Item.length;
    }

    addItemCount() {
        this.PIES.Trailer.ItemCount = this.getItemCount()
    }

    jsonString(){
        return JSON.stringify(this)
    } 
}