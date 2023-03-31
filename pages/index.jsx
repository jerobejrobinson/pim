import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import { Item, PartInterchange, jsonToClass } from '@/lib/PIES'
import { useEffect, useState } from 'react'
export async function getServerSideProps() {
  try {
    const client = await clientPromise
    const db = client.db('PIM')
    const items = db.collection('items')
    const data = await items.find().toArray()

    return {
      props: { isConnected: true, items: JSON.stringify(data)},
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

export default function Home({isConnected,items}) {
  const [ itemArray, setItemArray] = useState([])
  const [partNumbers, setPartNumbers] = useState(null)
  const [brandId, setBrandId] = useState(null)
  useEffect(() => {
    if(!isConnected) return;
    if(!items) return;
    setItemArray(() => {
      return JSON.parse(items).map((item) => {
        return jsonToClass(Item, JSON.stringify(item))
      })
    })
    console.log(itemArray)
  }, [])

  if(!itemArray) return <div>loading...</div>
  return (
    <div>
      {itemArray.map((item, i) => (
        <div key={i}>
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
              <button onClick={() => {
                item = item.addPartInterchange(new PartInterchange(partNumbers.split(','), brandId.toUpperCase()))
                
              }}>+</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
