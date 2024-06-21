"use client"
import Head from 'next/head'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Image from 'next/image';
import Link from 'next/link'
import { ClipboardDocumentIcon } from "@heroicons/react/24/solid";

import {
  useDynamicContext
  
} from "@dynamic-labs/sdk-react-core";
import { identityGatewayABI,identityGatewayAddress } from '@/starknet/contracts';
import { WalletAccount ,RpcProvider, Contract, json,CallData,shortString,BigNumberish,cairo } from 'starknet'; // v6.10.0 min
import { connect } from 'get-starknet'; // v4.0.0 min

import { useState,useEffect,useRef } from 'react';
import Notification from '@/components/Notification/Notification';
export default function Identity() {
  const {primaryWallet,rpcProviders,isAuthenticated} = useDynamicContext()
  const inputRef = useRef(null);

 const [isSaving,setIsSaving] = useState()
 const [preview,setPreview] = useState()
 const [gotID,setGotID] = useState()
 const [did,setDid] = useState()
 const [placeholder,setPlaceholder] = useState("Getting StarkNet OnChain ID")
  // NOTIFICATIONS functions
  const [notificationTitle, setNotificationTitle] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [dialogType, setDialogType] = useState(1);
  const [show, setShow] = useState(false);
  const close = async () => {
setShow(false);
};

useEffect(()=>{
  async function getID(){

    const selectedWalletSWO = await connect({ modalMode: 'neverAsk', modalTheme: 'light' });
    const myWalletAccount = new WalletAccount({}, selectedWalletSWO);
    const contract = new Contract(identityGatewayABI, identityGatewayAddress, myWalletAccount);
   console.log(myWalletAccount)

   console.log(primaryWallet)
    try{
      const _id  = await contract.get_id(primaryWallet.address,{ parseResponse: false }) 
      const myid = _id[0].toString(16)
     
      if(myid =="0x0")
      {
        setGotID(true)  
        setPlaceholder("No ID found. Please create an ID.")    
      } 
      else
      {
        setGotID(true)
        setDid(myid)
        setPlaceholder(myid)
      } 
    }catch(error)
    {
      console.log(error)
    }
  }

  if(isAuthenticated && primaryWallet?.address)
    getID()
},[isAuthenticated,primaryWallet])
 

 const createID = async()=>
  {
    const selectedWalletSWO = await connect({ modalMode: 'neverAsk', modalTheme: 'light' });
    const myWalletAccount = new WalletAccount({}, selectedWalletSWO);
    const contract = new Contract(identityGatewayABI, identityGatewayAddress, myWalletAccount);
   setIsSaving(true) 
   try{
         const   tx = await contract.createId();
          const txR = await myWalletAccount.waitForTransaction(tx.transaction_hash); 
          console.log(txR.value.events[0])
          let myid = txR.value.events[0].data[0]
          setDid(myid)
          setGotID(true)
          setDialogType(1) //Success
          setNotificationTitle("Create OnChain ID")
          setNotificationDescription("OnChain ID created.")
          setShow(true)
          setIsSaving(false)
   
   }catch(error)
   {
     
          setDialogType(2) //Success
          setNotificationTitle("Create OnChain ID")
          setNotificationDescription("OnChain ID not created.")
          setShow(true)
   
    setIsSaving(false)
   }
  }

  const copyToClipboard = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value)
        .then(() => {
            })
        .catch((err) => {
          console.error('Could not copy text: ', err);
        });
    }
  };

  return (
    <>
      <Head>
      <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css?family=Fira+Sans&display=swap" rel="stylesheet"/>   
     <title>StarkNet OnChainID - Decentralized IDS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-black"
       
     >
         <Header/>

     <section
      id="home"
      className= "opacity-90  relative  overflow-hidden bg-cover bg-top bg-no-repeat pt-[150px] pb-24"
          >
      <div
        className="grade absolute left-0 top-0 -z-10 h-full w-full"
       
        
      ></div>      
      <div
        className="absolute left-0 top-0 -z-10 h-full w-full"
      
      ></div>
       <video className="-z-10 absolute top-0 left-0 w-full h-full object-cover bg-top bg-no-repeat " autoPlay loop muted>
    <source src="/videos/id.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
      <div className="container">
      <div
          className="relative  overflow-hidden rounded-xl bg-bg-color"
        >       
        <form className="p-8 sm:p-10"  >
            <div className="-mx-5 flex flex-wrap xl:-mx-8">
              <div className="w-full px-5 lg:w-5/12 xl:px-8">
              <div className="mb-12 lg:mb-0">
                  <div className="mb-8">
                  
                    <label
                      for="eventImage"
                      className="cursor-pointer relative flex h-[480px] min-h-[200px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
                    >
                     <img src={preview ? preview: '/images/stark.png'}/>
                    </label>
                  </div>

            

                  <div className="rounded-md bg-[#4E4C64] py-4 px-8">
                   
                  <div className="pt-2">
                    <button disabled={isSaving || !gotID || (gotID && did)}
                      className="hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                   type='button'
                   onClick={()=>createID()}
                   >
                        Create OnChain ID
                    </button>

                   
                  </div>                    
                   
                  </div>
                </div>
              </div>
              <div className="w-full px-5 lg:w-7/12 xl:px-8">
                <div>
                <div className="mb-8 pt-2">
                    <p className="text-[40px] font-bold text-white">
                      StarkNet OnChain ID
                    </p>
                  </div>
                  <div className="mb-5">
                        <label
                          for="ethaddress"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Your ID
                        </label>
                        <div className='flex flex-row'>
                        <input
                        disabled={true}
                          required   
                          type="text"
                          name="onchainid"
                          id="onchainid"
                          value={did}
                          placeholder={placeholder}
                          ref={inputRef}

                          className={` w-full text-white rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium outline-none transition-all focus:bg-[#454457] focus:shadow-input`}
                        />
                        <button  className="ml-2 p-2 border border-stroke bg-[#353444] bg-bg-color rounded-md inline-flex text-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      type='button' 
                      onClick={()=>copyToClipboard()} >                      <ClipboardDocumentIcon className="h-8 w-8" aria-hidden="true" />
</button></div>
                      </div>     
                      <div className="mb-12  lg:mb-0">
              <h1
                className="mb-8 text-[40px] font-bold leading-tight text-white md:text-[30px] lg:text-[20px] xl:text-[26px] 2xl:text-[30px] sm:text-[26px]"
              >
               
               StarkNet OnChainID - Decentralized IDs 
                             </h1>
              <p
                className="opacity-80 border border-grey rounded-md  p-4 mb-4 text-lg  bg-bg-color font-medium leading-relaxed text-white md:pr-14 "
              >

Starknet OnChainID is a decentralized identity (DID) solution built on the Starknet Layer 2 network, leveraging ZK-Rollup technology for scalable and secure blockchain interactions. This solution provides users with a decentralized and self-sovereign identity, enabling seamless authentication and verification across various dApps and services within the Starknet ecosystem.

With Starknet OnChainID, users retain full control over their identity data without relying on central authorities, as identities are stored on-chain, ensuring security and immutability.

</p>
            </div>
          
                      <div className="-mx-3 flex flex-wrap">
                    
                    
                  </div>

              
     
                 
               
                 
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      
    </section>
    <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
    <Footer />
     </main>
     </>
  )
}
