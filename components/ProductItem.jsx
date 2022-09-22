import Link from "next/link";
import Image from "next/image";


const ProductItem = ({ product,addToCartHandler }) => {

    return (
        <div className="card z-0">
            <Link href={`/product/${product.slug}`}>
            <a>
                <Image
                src={product.image}
                alt={product.name}
                width={700}
                height={500}
                className="rounded shadow"
                />
            </a>
            </Link>
            <div className="flex flex-col items-center justify-center p-5">
                <Link href={`/product/${product.slug}`}>
                    <a>
                        <h2 className="text-lg">{product.name}</h2>
                    </a>
                </Link>
                <p className="mb-2">{product.brand}</p>
                <p>${product.price}</p>
                <button 
                className="primary-button" 
                type="button"
                onClick={() => addToCartHandler(product)}
                >
                    Add to cart
                </button>
            </div>
        </div>
    );
}

export default ProductItem;