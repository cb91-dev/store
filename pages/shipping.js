import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import CheckOut from '../components/CheckOut';
import Layout from '../components/Layout';
import { Store } from '../utils/store';

function Shipping() {
    const router = useRouter()
    const {
        handleSubmit,
        register,
        formState:{errors},
        setValue
    } = useForm()

    const {state, dispatch} = useContext(Store)
    const { cart } = state
    const { shippingAddress } = cart


    useEffect( () => {
        setValue('fullName', shippingAddress.fullName)
        setValue('address', shippingAddress.address)
        setValue('city', shippingAddress.city)
        setValue('postCode', shippingAddress.postCode)
        setValue('country', shippingAddress.country)
    },)


    const submitHandler = ({fullName,address,city,postCode,country}) => {
        dispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {fullName,address,city,postCode,country},
        })
        Cookies.set(
            'cart',
            JSON.stringify({
                ...cart,
                shippingAddress: {
                    fullName,
                    address,
                    city,
                    postCode,
                    country
                }
            })
        )
        router.push('/payment')
    }
    return (
       <Layout title="Shipping Address">
            <CheckOut activeStep={1}/>
            <form
            className='mx-auto max-w-screen-md'
            onSubmit={handleSubmit(submitHandler)}>
                <h1 className='mb-4 text-xl'>Shipping Address</h1>
                <div className='mb-4'>
                    <label htmlFor='fullName'>Full Name</label>
                    <input
                    className='w-full'
                    id='fullName'
                    autoFocus
                    {...register('fullName',{
                        required: 'Please enter full name',
                    })}
                    />
                    {errors.fullName && (
                        <div className='text-red-500'>{errors.fullName.message}</div>
                    )}
                </div>
                <div className='mb-4'>
                    <label htmlFor='address'>Address</label>
                    <input
                    className='w-full'
                    id='address'
                    autoFocus
                    {...register('address',{
                        required: 'Please enter address',
                        minLength: {value: 3,message:'Address needs to be more then 2 chars'}
                    })}
                    />
                    {errors.address && (
                        <div className='text-red-500'>{errors.address.message}</div>
                    )}
                </div>
                <div className='mb-4'>
                    <label htmlFor='city'>City</label>
                    <input
                    className='w-full'
                    id='city'
                    autoFocus
                    {...register('city',{
                        required: 'Please enter city',
                    })}
                    />
                    {errors.city && (
                        <div className='text-red-500'>{errors.city.message}</div>
                    )}
                </div>
                <div className='mb-4'>
                    <label htmlFor='postCode'>Post Code</label>
                    <input
                    className='w-full'
                    id='postCode'
                    autoFocus
                    {...register('postCode',{
                        required: 'Please enter your post code',
                    })}
                    />
                    {errors.postCode && (
                        <div className='text-red-500'>{errors.postCode.message}</div>
                    )}
                </div>
                <div className='mb-4'>
                    <label htmlFor='country'>Country</label>
                    <input
                    className='w-full'
                    id='country'
                    autoFocus
                    {...register('country',{
                        required: 'Please enter your country',
                    })}
                    />
                    {errors.country && (
                        <div className='text-red-500'>{errors.country.message}</div>
                    )}
                </div>
                <div className='mb-4 flex justify-between'>
                    <button className='primary-button'>Next</button>
                </div>
            </form>
       </Layout>
    )
}

export default Shipping;


Shipping.auth = true

