import { useState } from 'react'
import { useRouter } from 'next/router'
import { Description, Item, Pack } from '@/lib/PIES'
import Input from '@/components/util/Input'
import PartInterchangeCard from './PartInterchanges'
export default function AddItem() {
    const router = useRouter()
    const [stage, setStage] = useState(1)
    const [newItem, setNewItem] = useState(null);

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

    if( stage === 3) return (
        <div>
            stage to add images
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