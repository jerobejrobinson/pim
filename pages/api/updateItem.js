import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function updateItem(req, res) {
    const body = JSON.parse(req.body)
    const _id = body._id

    if(!_id) {
        try {
            const client = await clientPromise
            const db = await client.db('PIM')
            const items = await db.collection('items')
            const data = await items.insertOne({...body})
            return res.status(200).json(data)
        } catch(e) {
            console.log(e)
            return res.status(400);
        }
        
    }
    try {
        delete body._id
        const client = await clientPromise
        const db = await client.db('PIM')
        const items = await db.collection('items')
        const query = await items.replaceOne({_id: ObjectId(_id)}, {...body})
        res.status(200).json(query)
    } catch(e) {
        console.log(e)
        res.status(400);
    }
}