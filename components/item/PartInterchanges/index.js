import { useState } from 'react'
import { useRouter } from 'next/router'
import { PartInterchange } from '@/lib/PIES'
export default function PartInterchangeCard({item}) {
    const router = useRouter()
    const [partNumbers, setPartNumbers] = useState(null)
    const [brandId, setBrandId] = useState(null)
    return (
        <div>
          <div>Part Number: {item.PartNumber}</div>
          <div>Brand ID: {item.BrandAAIAID}</div>
          <div>
            <p>Interchanges</p>
            {item.PartInterchangeInfo.PartInterchange.map((parts, i) => (
              <div key={i}>
                <p>Brand ID: {parts['@_BrandAAIAID']}</p>
                <p>Part Number(s): {parts.PartNumber.map((part, i) => <span key={i}> {part},</span>)}</p>
              </div>
            ))}
          </div>
          <div>
            <div>
              <label htmlFor="interchangePN">Part Number</label>
              <input type="text" name="interchange" id="interchange" onChange={(e) => setPartNumbers(e.target.value)}/>
            </div>
            <div>
              <label htmlFor="interchangeBI">Brand Id</label>
              <input type="text" name="interchangeBI" id="interchangeBI" onChange={(e) => setBrandId(e.target.value)}/>
            </div>
            <div>
              <button onClick={async () => {
                const res = await item.addPartInterchange(new PartInterchange(partNumbers.split(','), brandId.toUpperCase()))
                // toast notification of error
                if(!res.acknowledged) return;
                router.replace(router.asPath)
              }}>+</button>
            </div>
          </div>
        </div>
    )
}