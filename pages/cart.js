import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react'
import Layout from '../components/Layout';
import { Store } from '../utils/store'
import {XMarkIcon} from '@heroicons/react/24/outline'
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const CartScreen = () => {
    const router = useRouter()
    const {state , dispatch} = useContext(Store)
    const {
        cart: {cartItems},
    } = state
    const removeItemHanlder = (item) => {
        dispatch({type:'CART_REMOVE_ITEM', payload:item})
    }
    const updateCarthanlder = (item,qty) =>{
        const quantity = Number(qty)
        dispatch({type: 'CART_ADD_ITEM',payload:{...item,quantity}})
    }
    return (
        <Layout title="Cart">
            <h1 className='mb-4 text-xl'>Cart</h1>
            {cartItems.length === 0 ? (
                <div>
                    Cart is empty  <Link href='/'><span className="text-blue-500">go back to store</span></Link>
                </div>
            ) :
            <div className='grid md:grid-cols-4 md:gap-5'>
                <div className='overflow-x-auto md:col-span-3'>
                    <table className='min-w-full'>
                        <thead className='border-b'>
                            <tr>
                                <th className='px-5 text-left'>Item</th>
                                <th className='p-5 text-right'>Quantity</th>
                                <th className='p-5 text-right'>Price</th>
                                <th className='p-5'>Remove item</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.slug} className="border-b">
                                <td>
                                    <Link href={`/product/$item.slug`}>
                                        <a className='flex items-center'>
                                            <Image 
                                            src={item.image}
                                            alt={item.name}
                                            width={50}
                                            height={50}
                                            />
                                        </a>
                                    </Link>
                                    &nbsp;
                                    {item.name}
                                </td>
                                <td className='p-5 text-right'>
                                    <select value={item.quantity} onChange={(e) => updateCarthanlder(item, e.target.value)}>
                                    {[...Array(item.countInStock).keys()].map(x =>(<option key={x+ 1} value={x + 1}>{x +1}</option>))
                                    }
                                    </select>
                                </td>
                                <td className='p-5 text-right'>${item.price}</td>
                                <td className='p-5 text-center'>
                                    <button onClick={() => removeItemHanlder(item)}>
                                        <XMarkIcon className="h-5 w-5"></XMarkIcon>
                                    </button>
                                </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='pb-5 card'>
                    <ul className='p-3'>
                        <li>
                            <div className='pb-3 text-xl'>
                            Subtotal ({cartItems.reduce((a,c) => a + c.quantity,0)})
                            : $
                            {cartItems.reduce((a,c) => a + c.quantity * c.price,0)}
                            </div>
                        </li>
                        <li>
                            <button onClick={() => router.push('login?redirect=/shipping')} className='primary-button w-full'>Check Out!
                            </button>
                        </li>
                    </ul>
                </div>
            </div> 
            }
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(CartScreen) ,{ssr:false});