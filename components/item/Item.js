import { useEffect, useState } from "react"
import { Pack, Description, Item, DigitalFileInformation, jsonToClass } from '@/lib/PIES'
import { useRouter } from 'next/router'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons"

import PartInterchangeCard from '@/components/item/PartInterchanges'
import Input from "../util/Input"
export default function ItemComp({id}) {
    const router = useRouter()
    const [itemId, setItemId] = useState(null)
    const [item, setItem] = useState(null)
    const [createObjectURL, setCreateObjectURL] = useState(null);
    const [image, setImage] = useState(null);
    const [selection, setSelection] = useState("P04")
    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
          const i = event.target.files[0];
    
          setImage(i);
          setCreateObjectURL(URL.createObjectURL(i));
        }
    };

    const uploadToServer = async (event) => {
        const body = new FormData();
        body.append("file", image);
        const response = await fetch("/api/uploadImage", {
          method: "POST",
          body
        }).then(res => res.json()).then(data => data);

        item.addDigitalAssets(new DigitalFileInformation(response.fileName, response.fileType, selection, response.url))
        const res = await item.sendToAPI()
        if(!res.acknowledged) return;
        setItem(null)
        router.replace(router.asPath)
    };

    useEffect(() => {
        (async () => {
            if(id != itemId) {
                setItemId(id)
                const data = await fetch(`api/getItem?id=${id}`, {
                    method: 'GET'
                }).then(res => res.json()).then(data => data)
    
                console.log(data)
                if(data._id === id) {
                    setItem(jsonToClass(Item, JSON.stringify(data)))
                }
            }
        })();
    })

    if(!item) return (
        <div>
            How to use ap
        </div>
    )
    return (
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', columnGap: '1rem'}}>
            <Input id="brandid" label="Brand Id" text={item.BrandAAIAID} style={{gridColumn: '1/3'}}disableInput/>
            <Input id="partnumber" label="Part Number" text={item.PartNumber} style={{gridColumn: '3/5'}}disableInput/>
            {item?.Descriptions?.Description.map((data, index) => {
                data = jsonToClass(Description, JSON.stringify(data))
                return (
                        <Input 
                            textarea
                            key={`${index}${.5*index}`} 
                            id={`${index}Description`} 
                            label={data.getDescriptionType()} 
                            style={{gridColumn: '1/5'}} 
                            text={data.getText()} 
                            edit={async () => {
                                const input = document.getElementById(`${index}Description`)
                                item.Descriptions.Description[index] = data.sendText(input.value)
                                const res = await item.sendToAPI()
                                if(!res.acknowledged) return;
                                input.value = ''
                                router.replace(router.asPath)
                            }}
                        />
                )
            })}
            <div style={{display: 'flex', flexDirection: "column", border: '1px solid black', padding: "1rem", position: 'relative', margin: '1.5rem 0 1.5rem 0',  background: "#f9f9f9", gridColumn: '1/3'}}>Package Information</div>
            <div style={{gridColumn: '3/5'}}></div>

            <Input 
                type="number"
                id="Quantity" 
                label="Quantity Of Eaches"  
                placeholder={item?.Packages?.Package[0]?.QuantityofEaches || "Need Quantiy"}
                style={{gridColumn: '1/3'}}
            />

            <Input 
                type="number"
                id={`Weight`} 
                label={`Weight (LB)`} 
                placeholder={item?.Packages?.Package[0]?.Weights?.Weight || "Need weights"}
                style={{gridColumn: '3/5'}}
            />

            <Input 
                type="number"
                id="Length" 
                label="Length (IN)" 
                placeholder={item?.Packages?.Package[0]?.Dimensions?.ShippingLength || "Need Shipping Length"}
            />

            <Input 
                type="number"
                id="Height" 
                label="Height (IN)" 
                placeholder={item?.Packages?.Package[0]?.Dimensions?.ShippingHeight || "Need Shipping Height"}
            />

            <Input 
                type="number"
                id="Width" 
                label="Width (IN)" 
                placeholder={item?.Packages?.Package[0]?.Dimensions?.ShippingWidth || "Need Shipping Width"}
            />
            
            <button style={{alignSelf: 'center', height: "60%", gridColumnStart: '4'}} onClick={async () => {
                const swap = (input) => {
                    if(input.value) {
                        return input.value
                    } else {
                        return input.placeholder
                    }
                }

                const Quantity = document.querySelector("#Quantity");
                const Weight = document.querySelector("#Weight");
                const Length = document.querySelector("#Length");
                const Height = document.querySelector("#Height");
                const Width = document.querySelector("#Width");
                
                item.addPackage(new Pack(swap(Quantity), swap(Weight), swap(Height), swap(Width), swap(Length)))

                const res = await item.sendToAPI()
                if(!res.acknowledged) return;
                Quantity.value = ''
                Weight.value = ''
                Height.value = ''
                Width.value = ''
                Length.value = ''
                router.replace(router.asPath)
            }}>Save</button>
                

            <div style={{gridColumn: "1/5"}}>
                <PartInterchangeCard item={item} />
            </div>
            <div style={{display: 'flex', flexDirection: "column", border: '1px solid black', padding: "1rem", position: 'relative', margin: '1.5rem 0 1.5rem 0',  background: "#f9f9f9", gridColumn: '1/3'}}>Images</div>

            <input type="file" style={{gridColumn: '1/3'}} id="choseFile" onChange={uploadToClient}/>
            <select name="assetType" id="assetType" onChange={(e) => setSelection(e.target.value)}>
                <option value="P04">Main Image</option>
                <option value="P01">Secondary Image</option>
            </select>
            <button onClick={uploadToServer} style={{alignSelf: 'start'}}>send</button>
            <div  style={{gridColumn: '1/5', margin: '2rem 0 0 0', display: 'flex', flexDirection: 'row'}}>
                {item?.DigitalAssets?.DigitalFileInformation?.map(obj => (
                    <div style={{position: 'relative'}}>
                        <p style={{position: 'absolute', top: '0', transform: 'translateY(-50%)', padding: '1rem', background: "#f9f9f9"}}>{obj.AssetType}</p>
                        <img style={{width: '25%', margin: 'auto'}} src={obj.URI} />
                    </div>
                ))}
            </div>
        </div>
    )
}