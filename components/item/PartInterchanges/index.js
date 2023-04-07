import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { PartInterchange } from '@/lib/PIES'
import Input from '@/components/util/Input'
export default function PartInterchangeCard({item}) {
    const router = useRouter()
    const [partNumbers, setPartNumbers] = useState(null)
    const [brandId, setBrandId] = useState(null)

    useEffect(() => {
      console.log(item)
    })
    return (
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', columnGap: '1rem'}}>
            <div style={{display: 'flex', flexDirection: "column", border: '1px solid black', padding: "1rem", position: 'relative', margin: '1.5rem 0 1.5rem 0',  background: "#f9f9f9", gridColumn: '1/3'}}>Interchanges</div>
            {item.PartInterchangeInfo.PartInterchange.map((parts, i) => (
              <div key={i} style={{display: 'flex', flexDirection: "column", border: '1px solid black', padding: "1rem", position: 'relative', margin: '1.5rem 0 1.5rem 0',  background: "#f9f9f9", gridColumn: '1/5'}}>
                <p style={{position: 'absolute', top: 0, transform: 'translateY(-100%)', background: "#ffffff", padding: '.5rem', border: '1px solid black'}}>Brand ID: {parts['@_BrandAAIAID']}</p>
                <p style={{margin: '.5rem 0 .5rem 0'}}>Part Number(s): {parts.PartNumber.map((part, i) => <span key={i}> {part},</span>)}</p>
              </div>
            ))}
            <Input id="xcrossBrandID" label="Brand Id" onChange={(e) => setBrandId(e.target.value)} style={{gridColumn: '1/2'}}/>
            <Input id="xcrossPartNumber" label="Part Number (s) seperate by comma ex: US301,US302,US876"onChange={(e) => setPartNumbers(e.target.value)} style={{gridColumn: '2/4'}}/>
            <button 
              style={{gridColumn: '4/5', height: '62%', alignSelf: 'center'}}
              onClick={async () => {
              const res = await item.addPartInterchange(new PartInterchange(partNumbers.split(','), brandId.toUpperCase()))
              if(!res.acknowledged) return;
              router.replace(router.asPath)
            }}>Add Interchange</button>
          </div>
    )
}