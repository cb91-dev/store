import Layout from "../components/Layout";
import Product from "../models/Product";
import db from "../utils/db";
import ProductItem from "../components/ProductItem"
import { useContext } from "react";
import { Store } from "../utils/store";
import axios from "axios";
import { toast } from "react-toastify";
import superjson from 'superjson';


export default function Index({ products }) {

  console.log(products)

  const {state,dispatch} = useContext(Store)
  const { cart } = state 

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    console.log(product)
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock')
 
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Product added to cart')
  };





  return (
    <>
      <Layout title="Home Page">
        <div className="
        grid grid-cols-1 
        gap-4 
        md:grid-cols-3 
        lg:grid-coles-4">
            {products.map((product) => (
                <ProductItem 
                product={product} 
                key={product.slug}
                addToCartHandler={addToCartHandler}
                />
            ))}
        </div>
      </Layout>
      </>
  );
}

export async function getServerSideProps() {
    db.connect()
    const products = await Product.find({}).lean()
    
  return {
    props:{
      products: products.map(db.convertDocToObj),
    }
  }
}


// {"_id":{"$oid":"631f1c70307c0438dc0c2c77"},"name":"Free Shirt","slug":"free-shirt","category":"Shirts","image":"/images/shirt1.jpg","price":70,"brand":"Nike","rating":4.5,"numReviews":8,"countInStock":20,"description":"A popular shirt","__v":0,"createdAt":{"$date":"2022-09-12T11:48:00.920Z"},"updatedAt":{"$date":"2022-09-12T11:48:00.920Z"}}