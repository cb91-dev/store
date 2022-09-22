import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CheckOut from "../components/CheckOut";
import Layout from "../components/Layout";
import { Store } from "../utils/store";


const Payment = () => {
    const [selectedPaymentMethod,setSelectedPaymentMethod] = useState('')

    const {state,dispatch} = useContext(Store)
    const { cart } = state
    const { shippingAddress, paymentMethod} = cart
    const router = useRouter()

    const submitHandler = (e) => {
        e.preventDefault();
        if(!selectedPaymentMethod){
            return toast.error('Payment method is required')
        }
        dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod})
        Cookies.set('cart',
        JSON.stringify({
            ...cart,
            paymentMethod: selectedPaymentMethod
        }))
        router.push('/order')
    }

    useEffect(() => {
        if (!shippingAddress.address){
            return router.push('/shipping')
        }
        setSelectedPaymentMethod(paymentMethod || '')
    },[paymentMethod,router,shippingAddress.address])


    return (
        <Layout title='Pay Method'>
            <CheckOut activeStep={2}/>
            <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
                <h1 className="mb-4 text-xl">Payment Method</h1>
                {
                    ['PayPal','Stripe','CashOnDelivery'].map((payment) => (
                        <div key={payment} className='mb-4'>
                            <input
                            name="paymentMethod"
                            className="p-2 outline-noe focus:ring-0"
                            id={payment}
                            type='radio'
                            checked={selectedPaymentMethod === payment}
                            onChange={() => setSelectedPaymentMethod(payment)}
                            />
                            <label className="p-2" htmlFor={payment}>{payment}</label>
                        </div>
                    ))}
                    <div className="mb-4 flex justify-between">
                        <button
                        type="button"
                        className="default-button"
                        onClick={() => router.push('/shipping')} 
                        >Back</button>
                        <button className="primary-button">Next</button>
                    </div>
            </form>
        </Layout>
    );
}

export default Payment;

// Lock access to only auth users
Payment.auth = true