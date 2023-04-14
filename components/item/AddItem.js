import { useState } from 'react'
import { useRouter } from 'next/router'
import { DigitalFileInformation, Description, Item, Pack } from '@/lib/PIES'
import Input from '@/components/util/Input'
import PartInterchangeCard from './PartInterchanges'
export default function AddItem() {
    const router = useRouter()
    const [stage, setStage] = useState(1)
    const [newItem, setNewItem] = useState(null);
    const [image, setImage] = useState(null);
    const [selection, setSelection] = useState("P04")

    const handleCreateItem = async () => {
        const PartNumber = document.querySelector("#PartNumber");
        const BrandAAIAID = document.querySelector("#BrandAAIAID");
        const PartTerminology = document.querySelector("#PartTerminology");
        const DES = document.querySelector("#DES");
        const MKT = document.querySelector("#MKT");
        const Quantity = document.querySelector("#Quantity");
        const Weight = document.querySelector("#Weight");
        const Length = document.querySelector("#Length");
        const Height = document.querySelector("#Height");
        const Width = document.querySelector("#Width");

        const item = new Item(PartNumber.value, BrandAAIAID.value, PartTerminology.value)
        item.addDescription(new Description(DES.value, 'DES'))
        item.addDescription(new Description(MKT.value, 'MKT'))
        item.addPackage(new Pack(Quantity.value, Weight.value, Height.value, Width.value, Length.value))

        

        const res = await item.sendToAPI()
        if(!res.acknowledged) return;
        item.addID(res.insertedId)
        setNewItem(item)
        setStage(prev => prev + 1)
        // router.reload()
    }

    
    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
          const i = event.target.files[0];
    
          setImage(i);
        //   setCreateObjectURL(URL.createObjectURL(i));
        }
    };

    const uploadToServer = async (event) => {
        const body = new FormData();
        body.append("file", image);
        await fetch("/api/uploadImage", {
          method: "POST",
          body
        }).then(res => res.json()).then(async (response) => {
            newItem.addDigitalAssets(new DigitalFileInformation(response.fileName, response.fileType, selection, response.url))
            const res = await newItem.sendToAPI()
            console.log(res)
            if(!res.acknowledged) return;
            router.replace(router.asPath)
        });

        
    };
    if( stage === 3) return (
        <div>
            <div style={{display: 'flex', flexDirection: "column", border: '1px solid black', padding: "1rem", position: 'relative', margin: '1.5rem 0 1.5rem 0',  background: "#f9f9f9", gridColumn: '1/3'}}>Images</div>

            <input type="file" style={{gridColumn: '1/3'}} id="choseFile" onChange={uploadToClient}/>
            <select name="assetType" id="assetType" onChange={(e) => setSelection(e.target.value)}>
                <option value="P04">Main Image</option>
                <option value="P01">Secondary Image</option>
            </select>
            <button onClick={uploadToServer} style={{alignSelf: 'start'}}>send</button>
            <div  style={{gridColumn: '1/5', margin: '2rem 0 0 0', display: 'flex', flexDirection: 'row'}}>
                {newItem?.DigitalAssets?.DigitalFileInformation?.map(obj => (
                    <div style={{position: 'relative'}}>
                        <p style={{position: 'absolute', top: '0', transform: 'translateY(-50%)', padding: '1rem', background: "#f9f9f9"}}>{obj.AssetType}</p>
                        <img style={{width: '25%', margin: 'auto'}} src={obj.URI} />
                    </div>
                ))}
            </div>
        </div>
    )
    if(stage === 2) return (
        <div>
            <PartInterchangeCard item={newItem} />
            <button style={{padding: '1rem', float: 'right'}} onClick={() => setStage(prev => prev + 1)}>Add Images</button>
        </div>
    )
    return (
        <div>
            <div style={{display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', columnGap: '1rem'}}>
                <Input id="PartNumber" label="Part Number *"/>
                <Input id="BrandAAIAID" label="Brand ID *"/>
                <Input id="PartTerminology" label="Part Terminology *"/>
            </div>
            <div>
                <Input id="DES" label="Part Title *"/>
                <Input id="MKT" label="Marketing Description *" textarea/>
            </div>
            <div  style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', columnGap: '1rem'}}>
                <Input id="Quantity" label="Quantity" type="number" />
                <Input id="Weight" label="Weight (LB)" type="number" />
                <Input id="Length" label="Length (IN)" type="number" />
                <Input id="Height" label="Height (IN)" type="number" />
                <Input id="Width" label="Width (IN)" type="number" />
            </div>
            <div>
                
            </div>
            <div>
                <button style={{padding: '1rem', float: 'right'}} onClick={() => handleCreateItem()}>Create Item</button>
            </div>
        </div>
    )
}