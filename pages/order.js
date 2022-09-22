import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CheckOut from '../components/CheckOut';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/store';



const order = (props) => {
    // Small fix for SSR issue. cartItems is undefined before hydration then is defined at client
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true)
    }, [])
    //
    const {state, dispatch} = useContext(Store)
    const { cart } = state
    const {cartItems, shippingAddress, paymentMethod } = cart
    // 123.4567 => 123.46 round function
    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) /100
    // items price
    const itemsPrice = round2(cartItems.reduce((a,c) => a + c.quantity * c.price, 0)) 
    // shipping
    const shippingPrice = itemsPrice > 200 ? 0 : 15
    // Tax
    const taxPrice = round2(itemsPrice * 0.15)
    // Total
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

    const router = useRouter()
    useEffect(() => {
        if(!paymentMethod){
            router.push('/payment')
        }
    },[paymentMethod,router])

    const [loading,setLoading] = useState(false)

    const placeOrderhandler = async () => {
        try{
            setLoading(true)
            const { data } = await axios.post(
                '/api/orders',
                {
                  orderItems: cartItems,
                  shippingAddress,
                  paymentMethod,
                  itemsPrice,
                  shippingPrice,
                  taxPrice,
                  totalPrice,
                })
            setLoading(false)
            // dispatch({type: 'CART_CLEAR_ITEMS'})
            Cookies.set(
                'cart',
                JSON.stringify({
                    ...cart,
                    cartItems: [],
                }))

        router.push(`/order/${data._id}`)
        }catch (err){
            setLoading(false)
            toast.error(getError(err))
        }
    }

    return mounted && (
        <Layout title='Place Order'>
            <CheckOut activeStep={3}/>
                <h1 className='mb-4 text-xl'>Place Order</h1>
                {cartItems.length === 0 ? (
                        <div>Cart is empty. 
                            <Link href='/'> Go Shopping</Link> 
                        </div>
                    ) : (
                        <div className='grid md:grid-cols-4 md:gap-5'>
                            <div className='overflow-x-auto md:col-span-3'>
                                <div className='card p-5'>
                                    <h2 className='mb-2 text-lg'>Shipping Address</h2>
                                    <div>
                                        <p className='p-1'>Name: {shippingAddress.fullName}</p>
                                        <p className='p-1'>Address: {shippingAddress.address}</p>
                                        <p className='p-1'>City: {shippingAddress.city}</p> 
                                        <p className='p-1'>Post Code: {shippingAddress.postCode}</p>
                                        <p className='p-1'>Country: {shippingAddress.country}</p>
                                    </div>
                                    <div>
                                        <Link href='/shipping'>Edit</Link>
                                    </div>
                                </div>
                                <div className='card p-5'>
                                    <h2 className="mb-2 text-lg">Payment Method</h2>
                                    <p>{paymentMethod}</p>
                                <div>
                                    <Link href='/payment'>Edit</Link>
                                </div>
                                </div>
                                <div className='card p-5 overflow-x-auto'>
                                    <h2 className="mb-2 text-lg">Order Items</h2>
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
                                            <tr key={item._id} className='border-b'>
                                                <td>
                                                    <Link href={`/product/${item.slug}`}>
                                                        <a className='flex items-center'>
                                                            <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            width={50}
                                                            height={50}
                                                            />
                                                            &nbsp;
                                                            {item.name}
                                                        </a>
                                                    </Link>
                                                </td>
                                                <td className='p-5 text-right'>{item.quantity}</td>
                                                <td className='p-5 text-right'>${item.price}</td>
                                                <td>${item.quantity * item.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div>
                                    <Link href='/payment'>Edit</Link>
                                </div>
                            </div>
                        </div>
                        <div>
                        <div className='card p-5'>
                            <h2 className='mb-2 text-lg'>Order Summary</h2>
                            <ul>
                                <li>
                                    <div className='mb-2 flex justify-between'>
                                        <div>Items</div>
                                        <div>${itemsPrice}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className='mb-2 flex justify-between'>
                                        <div>Tax</div>
                                        <div>${taxPrice}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className='mb-2 flex justify-between'>
                                        <div>Shipping</div>
                                        <div>${shippingPrice}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className='mb-2 flex justify-between'>
                                        <div>Total</div>
                                        <div>${totalPrice}</div>
                                    </div>
                                </li>
                                <li>
                                    <button 
                                    disabled={loading}
                                    onClick={placeOrderhandler}
                                    className="primary-button w-full"
                                        >
                                        {loading ? 'loading...' : 'Place Order'}
                                    </button>
                                </li>
                            </ul>
                        </div>
                        </div>
                    </div>
                )}
        </Layout>
    );
}
export default order
// Lock access to only auth users
order.auth = true