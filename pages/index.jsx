import clientPromise from '@/lib/mongodb'
import { useEffect, useState } from 'react'

import { XML, PIES, Item, jsonToClass } from '@/lib/PIES'

import ItemComp from '@/components/item/Item'
import AddItem from '@/components/item/AddItem'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons'

import styles from 'public/styles/index.module.css'
import 'normalize.css'

export async function getServerSideProps() {
  try {
    const client = await clientPromise
    const db = client.db('PIM')
    const items = db.collection('items')
    const data = await items.find().project({PartNumber: 1, BrandAAIAID: 1}).toArray()
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
  const [ activeClone, setActiveClone] = useState(false)
  const [ currentItemId, setCurrentItemId ] = useState(null)

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
    <div style={{display: 'grid', gridTemplateColumns: '1fr 3fr', gridTemplateRows: '50px 1fr', gridTemplateAreas: '"top top" "nav main"', height: '100vh', overflow: 'hidden'}}>
      <div style={{gridArea: "top", background: "grey", borderBottom: 'solid 4px rgba(0,0,0, .1)', borderTop: 'solid 4px rgba(0,0,0, .1)', display: 'flex', flexDirection: 'row'}}>
        <button 
          style={{display: 'flex', alignItems: 'center', cursor: 'pointer', border: 'none', background: 'rgba(255,255,255, 1)', height: '100%', padding: '1rem', marginRight: '3px'}}
          onClick={() => {
            setAddNewItem(true)
          }}
        >
          Add Item
        </button>

        <button style={{display: 'flex', alignItems: 'center', cursor: 'pointer', border: 'none', background: 'rgba(255,255,255, 1)', height: '100%', padding: '1rem', marginRight: '3px'}} onClick={() => generatePiesXML()}>
          Generate PIES XML
        </button>
        <button style={{display: 'flex', alignItems: 'center', cursor: 'pointer', border: 'none', background: 'rgba(255,255,255, 1)', height: '100%', padding: '1rem', marginRight: '3px'}} onClick={() => generatePiesXML()}>
          <a 
            href="https://drive.google.com/drive/folders/1DV-vhLiT3wrQchuFp-qNwIi3REqTEDF4"
            style={{textDecoration: 'None', color: "black"}}
          >View Images at Google Drive</a>
        </button>
        {!addNewItem && currentItemId && (
          <button style={{display: 'flex', alignItems: 'center', cursor: 'pointer', border: 'none', background: `${activeClone ? 'red' : 'rgba(255,255,255, 1)'}`, height: '100%', padding: '1rem'}} onClick={async () => {
            let clone = null
            const data = await fetch(`api/getItem?id=${currentItemId}`, {
              method: 'GET'
            }).then(res => res.json()).then(data => data)

            if(data._id === currentItemId) {
              clone = jsonToClass(Item, JSON.stringify(data))
              clone.stripPartInterchanges()
              clone.stripID()
              const res = await clone.sendToAPI()
              if(!res.acknowledged) return;
              setCurrentItemId(res.insertedId)
              setActiveClone(true)
              const items = await fetch(`api/getItems`, {
                method: 'GET'
              }).then(res => res.json()).then(data => JSON.stringify(data))
  
              setItemArray(() => {
                return JSON.parse(items)
              })
            }

          }}>
            Clone Item
          </button>
        )}
      </div>
      <div style={{gridArea: 'nav', display: 'grid', gridTemplateRows: '50px calc(100vh - 125px) 25px', gridTemplateAreas: '"search" "item-list" "footer"'}}>

        {/* entry point for search db for a part number */}
        <div style={{gridArea: "search", backgroundColor: 'white', display: 'grid', gridTemplateColumns: '3fr 1fr 1fr'}}>

          {/* search input */}
          <input type="text" placeholder='Search...' style={{width: '100%', outline: 'none', border: 'none', padding: '1rem'}}/>

          {/* search button */}
          <button style={{width: "100%", cursor: 'pointer', border: 'none', background: 'rgba(0,0,0, .1)'}}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>

          {/* refresh list */}
          <button style={{width: "100%", cursor: 'pointer', border: 'none', background: 'rgba(0,0,0, .1)'}} onClick={async () => {
            const items = await fetch(`api/getItems`, {
              method: 'GET'
            }).then(res => res.json()).then(data => JSON.stringify(data))

            setItemArray(() => {
              return JSON.parse(items)
            })

          }}>
            <FontAwesomeIcon icon={faArrowsRotate} />
          </button>

        </div>

        {/* entry point for the list of part numbers to appear */}
        <div style={{gridArea: "item-list", backgroundColor: 'lightgrey', overflowY: 'hidden', height: '100%', overflowY: 'scroll'}} className={styles.scrollbar} >
          {itemArray.map((item, index) => (
            <div key={index} style={{background: currentItemId === item._id ? 'red' : '#e9e9e9', padding: '1rem', margin: '.5rem', cursor: 'pointer'}} onClick={() => {
              setCurrentItemId(item._id); 
              setAddNewItem(false);
              setActiveClone(false);
            }}>
              {item.BrandAAIAID}: {item.PartNumber}
            </div>
          ))}
        </div>

        {/* basic footer */}
        <div style={{gridArea: "footer", backgroundColor: 'whitesmoke', textAlign: 'center'}}>
          Developed At MSP Diesel Solutions
        </div>
      </div>

      <div style={{background: '#bfbfbf', gridArea: 'main', borderLeft: 'solid 4px rgba(0,0,0, .1)', padding: '1rem', overflowY: 'scroll', borderRight: 'solid 2px rgba(0,0,0, 1)'}} className={styles.scrollbar}>
        {!addNewItem && currentItemId && <ItemComp id={currentItemId}/>}
        {addNewItem && <AddItem />}
      </div>
    </div>
  )
}
