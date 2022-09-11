import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";
import data from "../utils/data";




export default function Index(){
  return (
    <>
      <Layout title="Home Page">
        <div className="
        grid grid-cols-1 
        gap-4 
        md:grid-cols-3 
        lg:grid-coles-4">
            {data.products.map((product) => (
                <ProductItem product={product} key={product.slug}/>
            ))}
        </div>
      </Layout>
      </>
  )
}


