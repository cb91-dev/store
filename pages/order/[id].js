import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";



const reducer = (state ,action) => {
    switch(action.type){
        case 'FETCH_REQUEST':
            return { ...state, loading: true,error:''};
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' };
        case 'FETCH_FAIL':
            return {...state,loading: false,error: action.payload}
        case 'PAY_REQUEST':
            return {...state,loadingPay: true}
        case 'PAY_SUCCESS':
            return {...state,loadingPay: false, successPay:true}
        case 'PAY_FAIL':
            return {...state,loadingPay: false,errorPay: action.payload}
        case 'PAY_FAIL':
            return {...state,loadingPay: false,successPay: false, errorPay:''}
        default:
            state
    }
}



const OrderScreen = (props) => {
    // PAYPAL 
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()
    // orders/:id
    const { query } = useRouter()
    const orderId = query.id

    
    const [
        { loading, error, order, successPay, loadingPay, successDeliver },
        dispatch,
      ] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
      });


      const {
        shippingAddress,
        paymentMethod,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid,
        paidAt,
        isDelivered,
        deliveredAt,
      } = order;


useEffect(() => {
        const fetchOrder = async () => {
            try{
                dispatch({ type:'FETCH_REQUEST' })
                const { data } = await axios.get(`/api/orders/${orderId}`)
                dispatch({type: 'FETCH_SUCCESS', payload: data})
            }catch (err){
            dispatch({type: 'FETCH_FAIL',payload: getError(err)})
            }
        }
        // If there is no order._id or successPay is false or there is a order._id and it does not much orderId
        if(!order._id || successPay || (order._id && order._id !== orderId)){
        fetchOrder()
        if(successPay){
            dispatch({ type: 'PAY_REST'})
        }
        }else {
            const loadPayPalScript = async () => {
                const {data: clientId} = await axios.get('/api/keys/paypal')
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': clientId,
                        currency: 'AUD'
                    }
                })
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending'})
            }
            loadPayPalScript()
        }
},[order,order._id,paypalDispatch,successPay])

// PAYPAL
const createOrder = (data,actions) => {
    return actions.order.create({
        purchase_units:[
            {
                amount: { value:totalPrice}
            },
        ]
    }).then((orderID) => {
        return orderID
    })
}

// PAYPAL
const onApprove = (data,actions) => {
    console.log('2')
    return actions.order.capture().then(async function(details) {
        try {
            dispatch({ type: 'PAY_REQUEST' })
            const { data } = await axios.put(`/api/orders/${order._id}/pay`,
            details
            )
            dispatch({ type: 'PAY_SUCCESS', payload: data })
            toast.success('Order is paid successfully')
        }catch (err){
            dispatch({ type: 'PAY_FAIL', payload: getError(err) })
            toast.error(getError(err))
        }
    })
}
// PAYPAL
const onError = (err) => {
    toast.err(getError(err))
}


    return (
      <Layout title={`Order: ${orderId}`}>
        <h1 className="mb-4 text-xl">{`Order ${orderId}`}</h1>
        {
            loading ? (
            <div>Loading..</div>
            ):
            error ? (
                <div className="alert-error">{error}</div>
            ):
            (<div className="grid md:grid-cols-4 md:gap-4">
                <div className="overflow-x-auto md:col-span-3">
                    <div className="card p-5">
                        <h2 className="mb-2 text-lg">Shipping Address</h2>
                        <div>
                            <p>{shippingAddress.fullName}</p>
                            <p>{shippingAddress.address}</p>
                            <p>{shippingAddress.city}</p>
                            <p>{shippingAddress.postalCode}</p>
                            <p>{shippingAddress.country}</p>
                        </div>
                        {isDelivered ? (
                            <div className="alert-success">Delivered at {deliveredAt}
                            </div>
                        ):
                        (   <div className="alert-error">Not delivered</div>)
                        }
                    </div>
                    <div className="card p-5">
                        <h2 className="mb-2 text-lg">Payment Method</h2>
                        <div>{paymentMethod}</div>
                        {isPaid ? (
                            <div className="alert-success">Paid at {paidAt}</div>
                        ):
                        ( <div className="alert-error">Not paid</div>
                        )}
                    </div>
                    <div className="card overflow-x-auto p-5">
                        <h2 className="mb-2 text-lg">Order Items</h2>
                        <table className="min_w_full">
                            <thead className="border-b">
                                <tr>
                                    <th className="px-5 text-left">Item</th>
                                    <th className="px-5 text-left">Quantity</th>
                                    <th className="px-5 text-left">Price</th>
                                    <th className="px-5 text-left">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems.map((item) => (
                                    <tr key={item._id} className="border-b">
                                        <td>
                                            <Link href={`/product/${item.slug}`}>
                                                <a className="flex items-cneter">
                                                    <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={50}
                                                    height={50}/>
                                                    &nbsp;
                                                    {item.name} 
                                                </a>
                                            </Link>
                                        </td>
                                        <td className="p-5 text-right">{item.quantity}</td>
                                        <td className="p-5 text-right">${item.price}</td>
                                        <td className="p-5 text-right">${item.quantity * item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                <div className="card p-5">
                    <h2 className="mb-2 text-lg">Order Summary</h2>
                    <ul>
                        <li>
                            <div className="mb-2 flex justify-between"> 
                                    <div>Items</div>
                                    <div>${itemsPrice}</div>
                            </div>
                        </li>
                        <li>
                            <div className="mb-2 flex justify-between"> 
                                    <div>Tax</div>
                                    <div>${taxPrice}</div>
                            </div>
                        </li>
                        <li>
                            <div className="mb-2 flex justify-between"> 
                                    <div>Shipping</div>
                                    <div>${shippingPrice}</div>
                            </div>
                        </li>
                        <li>
                            <div className="mb-2 flex justify-between"> 
                                    <div>Total</div>
                                    <div>${totalPrice}</div>
                            </div>
                        </li>
                        {!isPaid && (
                            <li>
                                {isPending ? (<div>Loading...</div>
                                ):
                                // PAYPAL
                                (<div className="w-full">
                                    <PayPalButtons
                                    createOrder={createOrder}
                                    onApprove={onApprove}
                                    onError={onError}
                                    ></PayPalButtons>
                                </div>
                                )}
                                {loadingPay && <div>Loading....</div>}
                            </li>
                        )}
                    </ul>
                </div>
                </div>
            </div>
            )}
      </Layout>
    );
}
OrderScreen.auth = true
export default OrderScreen;