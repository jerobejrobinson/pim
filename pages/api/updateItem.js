import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function updateItem(req, res) {
    const body = JSON.parse(req.body)
    const _id = body._id
    delete body._id

    try {
        const client = await clientPromise
        const db = await client.db('PIM')
        const items = await db.collection('items')
        const query = await items.replaceOne({_id: ObjectId(_id)}, {...body})
        res.status(200).json(query)
    } catch(e) {
        console.log(e)
        res.status(400);
    }
    // console.log(req.body)    
    res.status(200)
}