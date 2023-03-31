import clientPromise from '@/lib/mongodb'

export default async (req, res) => {
    try {
      const client = await clientPromise;
      const db = client.db("PIM");
  
      const items = await db.collection("items").find().toArray();
  
      res.json(items);
    } catch (e) {
      console.error(e);
      throw new Error(e).message;
    }
  };