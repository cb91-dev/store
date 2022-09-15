
import Product from "../../../models/Product"
import db from "../../../utils/db"


const handler = async(req,res) => {
  console.log('here')
    await db.connect()
    const product = await Product.findById(req.query.id);
    await db.disconnect()
    res.send(product)
}

export default handler