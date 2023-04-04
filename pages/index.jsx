import clientPromise from '@/lib/mongodb'
import { useEffect, useState } from 'react'
import 'normalize.css'

import ItemComp from '@/components/item/Item'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

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
  const [ itemArray, setItemArray] = useState(null)
  const [ currentItemId, setCurrentItemId] = useState(null)
  const [ previousItemIds, setPreviousItemId] = useState([])

  useEffect(() => {
    if(!isConnected) return;
    if(!items) return;
    setItemArray(() => {
      return JSON.parse(items)
    })
  }, [])

  if(!itemArray) return <div>loading...</div>
  return (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 3fr', gridTemplateRows: '50px 1fr', gridTemplateAreas: '"top top" "nav main"',height: '100vh'}}>
      <div style={{gridArea: "top", background: "grey", borderBottom: 'solid 4px rgba(0,0,0, .1)', borderTop: 'solid 4px rgba(0,0,0, .1)'}}>
        <button style={{cursor: 'pointer', border: 'none', background: 'rgba(255,255,255, 1)', height: '100%', padding: '1rem', marginRight: '3px'}}>Add Item</button>
        <button style={{cursor: 'pointer', border: 'none', background: 'rgba(255,255,255, 1)', height: '100%', padding: '1rem'}}>Generate PIES XML</button>
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
        <div style={{gridArea: "item-list", backgroundColor: 'lightgrey'}}>
          {itemArray.map((item, index) => (
            <div key={index} style={{background: '#e9e9e9', padding: '1rem', margin: '.5rem', cursor: 'pointer'}} onClick={() => setCurrentItemId(item._id)}>
              {item.BrandAAIAID}: {item.PartNumber}
            </div>
          ))}
        </div>

        {/* basic footer */}
        <div style={{gridArea: "footer", backgroundColor: 'whitesmoke', textAlign: 'center'}}>
          Developed At MSP Diesel Solutions
        </div>
      </div>

      <div style={{background: '#f9f9f9', gridArea: 'main', borderLeft: 'solid 4px rgba(0,0,0, .1)', padding: '1rem'}}>
        {currentItemId && <ItemComp id={currentItemId}/>}
      </div>
    </div>
  )
}
