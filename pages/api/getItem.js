import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb';
export default async (req, res) => {
    const { id } = req.query
    if(id === 'null') return res.status(400);
    try {
        const client = await clientPromise;
        const db = client.db("PIM");
        const item = await db.collection("items").findOne({_id: ObjectId(id)});
        console.log(item)
        res.json(item);
    } catch (e) {
        console.error(e);
        throw new Error(e).message;
    }
  };