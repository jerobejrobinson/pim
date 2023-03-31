import { XMLBuilder } from 'fast-xml-parser'

/** Builds the XML for the Passed PIES Class */
export default class XML {
    constructor() {
        this.build = new XMLBuilder({
            ignoreAttributes : false
        });
    }

    /** Accepts a PIES Class object 
    *  @param {Class} PIES - The completed PIES object.
    *  @returns {String} string representation of XML file
    */
    getOutput(PIES) {
        PIES.addItemCount();
        return this.build.build(PIES);
    }
}