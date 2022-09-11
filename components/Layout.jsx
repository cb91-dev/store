import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useContext, useState } from "react";
import { Store } from '../utils/store'
import { ToastContainer } from "react-toastify";
import { useSession } from "next-auth/react";
import 'react-toastify/dist/ReactToastify.css'
import { Menu } from "@headlessui/react";
import DropdownLink from "./DropdownLink";

const Layout = ({title,children}) => {

    const { status , data:session} = useSession()
    const {state} =  useContext(Store)
    const { cart } = state
    const [cartItemsCount,setCartItemsCount] = useState(0)


    useEffect(()=>{
        setCartItemsCount(
            cart.cartItems.reduce((a,c) => a + c.quantity, 0)
            )
    },[cart.cartItems])
    
    return(
    <div>
        <Head>
            <title>{title ? title + ' - Urban': 'Urban'}</title>
            <meta name="description" content="Ecommerce Website"/>
            <link rel="icon" href="/favicon.ico"></link>
        </Head>
        <ToastContainer position="bottom-center" limit={1}/>
        <div className="flex min-h-screen flex-col justify-between">
            <header>
                <nav className="flex h-12 items-center px-4 justify-between shadow-md">
                    <Link href="/">
                        <a className="text-lg font-bold">
                            <Image src="/urban_main_logo.svg"
                            height="100px"
                            width="100px"/>
                        </a>
                    </Link>
                    <div>
                        <Link href="/cart"><a className="p-2">Cart {cartItemsCount > 0 && (
                            <span className="ml-1 rounded-full     bg-red-600 px-2 py-1 text-xs font-bold text-white">
                                {cartItemsCount}
                            </span>
                        )}
                        </a>
                        </Link>
                        {status === 'loading' ? (
                            'Loading'
                        ) : session?.user ? (
                            <Menu as="div" className="relative inline-block">
                                <Menu.Button>{session.user.name}</Menu.Button>
                                <Menu.Items className="absolute right-0 w-56 bg-whiteorigin-top-right shadow-lg">
                                    <Menu.Item>
                                       <DropdownLink className="dropdown-link" href="/profile">
                                        Profile
                                       </DropdownLink>
                                    </Menu.Item>
                                </Menu.Items>
                            </Menu>
                        ) : (
                            <Link href="/login"><a className="p-2">Login</a></Link>
                        )}
                    </div>
                </nav>
            </header>
            <main className="container m-auto mt-4 px-4">{children}</main>
            <footer className="flex items-center h-10 shadow-inner">
                <p>Copyright © 2022 Urban</p>
            </footer>
        </div>
    </div>
    )
}


export default Layout