/**
 * Creates a Digital File Information Object
 * @constructor
 * @param {String} fileName - (Required) file name of the image file
 * @param {String} FileType - (Required) file type of the image file (jpg, png)
 * @param {String} AssetType - (Required) Asset type of the image file. Expects P04 (main image) or P01 (secondary image)
 * @param {String} URI - (Optional) URI of image if available
 */
class DigitalFileInformation {
    constructor(fileName, FileType, AssetType, URI) {
        this.FileName = fileName;
        this.FileType = FileType;
        this.AssetType = AssetType;
        this.URI = URI;
        this['@_MaintenanceType'] = 'A';
    }
}

export default DigitalFileInformation;