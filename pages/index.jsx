import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import { Item, PartInterchange, jsonToClass } from '@/lib/PIES'
import { useEffect, useState } from 'react'
import PartInterchangeCard from '@/components/item/PartInterchanges'

export async function getServerSideProps() {
  try {
    const client = await clientPromise
    const db = client.db('PIM')
    const items = db.collection('items')
    const data = await items.find().toArray()
    // console.log()
    return {
      props: { isConnected: true, items: JSON.stringify(data.map(item => jsonToClass(Item, JSON.stringify(item))))},
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

export default function Home({isConnected, items}) {
  const [ itemArray, setItemArray] = useState(null)

  useEffect(() => {
    
    if(!isConnected) return;
    if(!items) return;
    setItemArray(() => {
      return JSON.parse(items)
    })
  }, [])

  if(!itemArray) return <div>loading...</div>
  return (
    <div>
      {itemArray.map((item, i) => (
        <PartInterchangeCard item={item} key={i} />
      ))}
    </div>
  )
}
