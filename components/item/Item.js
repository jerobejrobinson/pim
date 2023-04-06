import { useEffect, useState } from "react"
import { Description, Item, jsonToClass } from '@/lib/PIES'
import { useRouter } from 'next/router'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons"

import PartInterchangeCard from '@/components/item/PartInterchanges'
export default function ItemComp({id}) {
    const router = useRouter()
    const [itemId, setItemId] = useState(null)
    const [item, setItem] = useState(null)
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
        <div>
            <div>Brand</div>
            <div>{item.BrandAAIAID}</div>
            <div>Part Number</div>
            <div>{item.PartNumber}</div>
            {item?.Descriptions?.Description.map((data, index) => {
                data = jsonToClass(Description, JSON.stringify(data))
                return (
                    <>
                        <div key={index}>{data.getDescriptionType()}</div>
                        <div key={index + 100} style={{display: 'grid', gridTemplateColumns: '5fr 1fr', alignItems: "center"}}>
                            <input type="text" id={`${index}${data.getText()}`} placeholder={data.getText()}></input>
                            <button style={{width: "100%", cursor: 'pointer', background: 'rgba(0,0,0, .1)', }} onClick={async () => {
                                const input = document.getElementById(`${index}${data.getText()}`)
                                item.Descriptions.Description[index] = data.sendText(input.value)
                                const res = await item.sendToAPI()
                                if(!res.acknowledged) return;
                                input.value = ''
                                router.replace(router.asPath)
                            }}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </button>       
                        </div>
                    </>
                )
            })}
            {item?.Packages?.Package.map((data, index) => {
                return (
                    <>
                        <div key={index}>Weight</div>
                        <div key={index + 100}>{data?.Weights?.Weight} <FontAwesomeIcon icon={faPenToSquare} /></div>
                    </>
                )
            })}

            <PartInterchangeCard item={item} />
        </div>
    )
}