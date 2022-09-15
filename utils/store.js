import { createContext,useReducer } from "react";
import Cookies from 'js-cookie'





export const Store = createContext()

const initialState = {
    cart: Cookies.get('cart')
    ? JSON.parse(Cookies.get('cart'))
    : {
        cartItems: [], 
        shippingAddress:{}
    }
}

const reducer = (state,action) => {
    switch(action.type){
        case 'CART_ADD_ITEM': {
            const newItem = action.payload
            const existItem = state.cart.cartItems.find(
                (item) => item.slug === newItem.slug
            )
            const cartItems = existItem? state.cart.cartItems.map((item) => item.name === existItem.name ? newItem : item 
            ) : 
            [...state.cart.cartItems, newItem]
            // Convert object to string to save in cookies
            Cookies.set('cart',JSON.stringify({...state.cart,cartItems}))
            return {...state, cart: {...state.cart, cartItems } }
        }
        case "CART_REMOVE_ITEM": {
            const cartItems = state.cart.cartItems.filter((item) => item.slug !== action.payload.slug)
            Cookies.set('cart',JSON.stringify({...state.cart,cartItems}))
            return {...state, cart: {...state.cart, cartItems}}
        }
        case "CART_RESET":
            return {
                ...state,
                cart:{
                    cartItems:[],
                    shippingAddress:{location:{}},
                    paymentMethod:'',
                },
        }
        case "SAVE_SHIPPING_ADDRESS":
            return {
                // return current state as is
                ...state,
                // return current cart state as is
                    cart:{
                    ...state.cart,
                    // return current shippingAddress state as is
                        shippingAddress: {
                        ...state.cart.shippingAddress,
                        // update shippingAddress with payload
                        ...action.payload,
                        },
                    }
        }
        case "SAVE_PAYMENT_METHOD":
            return {
                // return current state as is
                ...state,
                // return current cart state as is
                    cart:{
                    ...state.cart,
                    // update payment method string
                    paymentMethod: action.payload
                    }
        }

        default:
            return state;
    }
}

export function StoreProvider({ children }) {
    const [state, dispatch] = useReducer(reducer,initialState)
    const value = { state,dispatch }
    return <Store.Provider value={value}>{children}</Store.Provider>
}