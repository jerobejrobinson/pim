import clientPromise from '@/lib/mongodb'
import { useEffect, useState } from 'react'

import { XML, PIES, Item, jsonToClass } from '@/lib/PIES'

import ItemComp from '@/components/item/Item'
import AddItem from '@/components/item/AddItem'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import 'normalize.css'
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

export default function Home({isConnected, items}) {
  const [ itemArray, setItemArray ] = useState(null)
  const [ addNewItem, setAddNewItem ] = useState(false)
  const [ currentItemId, setCurrentItemId ] = useState(null)
  const [ previousItemIds, setPreviousItemId ] = useState([])

  useEffect(() => {
    if(!isConnected) return;
    if(!items) return;
    setItemArray(() => {
      return JSON.parse(items)
    })
  }, [])

  const generatePiesXML = () => {
    const xml = new XML()
    const p = new PIES()
    itemArray.map(item => {
      p.addItem(jsonToClass(Item, JSON.stringify(item)))
    })
    console.log(xml.getOutput(p))
  }
  if(!itemArray) return <div>loading...</div>
  return (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 3fr', gridTemplateRows: '50px 1fr', gridTemplateAreas: '"top top" "nav main"',height: '100vh'}}>
      <div style={{gridArea: "top", background: "grey", borderBottom: 'solid 4px rgba(0,0,0, .1)', borderTop: 'solid 4px rgba(0,0,0, .1)', display: 'flex', flexDirection: 'row'}}>
        <button 
          style={{display: 'flex', alignItems: 'center', cursor: 'pointer', border: 'none', background: 'rgba(255,255,255, 1)', height: '100%', padding: '1rem', marginRight: '3px'}}
          onClick={() => {
            setAddNewItem(true)
          }}
        >
          Add Item
        </button>

        <button style={{display: 'flex', alignItems: 'center', cursor: 'pointer', border: 'none', background: 'rgba(255,255,255, 1)', height: '100%', padding: '1rem'}} onClick={() => generatePiesXML()}>
          Generate PIES XML
        </button>
      </div>
      <div style={{gridArea: 'nav', display: 'grid', gridTemplateRows: '50px 1fr 25px', gridTemplateAreas: '"search" "item-list" "footer"'}}>

        {/* entry point for search db for a part number */}
        <div style={{gridArea: "search", backgroundColor: 'white', display: 'grid', gridTemplateColumns: '3fr 1fr'}}>

          {/* search input */}
          <input type="text" placeholder='Search...' style={{width: '100%', outline: 'none', border: 'none', padding: '1rem'}}/>

          {/* search button */}
          <button style={{width: "100%", cursor: 'pointer', border: 'none', background: 'rgba(0,0,0, .1)'}}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>

        </div>

        {/* entry point for the list of part numbers to appear */}
        <div style={{gridArea: "item-list", backgroundColor: 'lightgrey', overflowY: 'hidden', height: '100%'}}>
          {itemArray.map((item, index) => (
            <div key={index} style={{background: '#e9e9e9', padding: '1rem', margin: '.5rem', cursor: 'pointer'}} onClick={() => {setCurrentItemId(item._id); setAddNewItem(false)}}>
              {item.BrandAAIAID}: {item.PartNumber}
            </div>
          ))}
        </div>

        {/* basic footer */}
        <div style={{gridArea: "footer", backgroundColor: 'whitesmoke', textAlign: 'center'}}>
          Developed At MSP Diesel Solutions
        </div>
      </div>

      <div style={{background: '#bfbfbf', gridArea: 'main', borderLeft: 'solid 4px rgba(0,0,0, .1)', padding: '1rem', overflowY: 'hidden'}}>
        {!addNewItem && currentItemId && <ItemComp id={currentItemId}/>}
        {addNewItem && <AddItem />}
      </div>
    </div>
  )
}
