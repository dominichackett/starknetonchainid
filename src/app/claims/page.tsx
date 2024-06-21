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
import { identityABI, identityGatewayABI,identityGatewayAddress } from '@/starknet/contracts';
import { WalletAccount ,RpcProvider, Contract, json,CallData,shortString,BigNumberish,cairo } from 'starknet'; // v6.10.0 min
import { connect } from 'get-starknet'; // v4.0.0 min

import { useState,useEffect,useRef } from 'react';
import Notification from '@/components/Notification/Notification';
export default function Claims() {
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
 

 const issueClaim = async()=>
  {
   setIsSaving(true) 
   const address = document.getElementById("address").value
   const claim = document.getElementById("claim").value 
   const expirydate = document.getElementById("expirydate").value 
   const topic = document.getElementById("topic").value
   let expires 
   if(expirydate =="" || expirydate == undefined)
      expires = 0
   else
   {
      expires = new Date(expirydate).getTime()
   } 

   const selectedWalletSWO = await connect({ modalMode: 'neverAsk', modalTheme: 'light' });
   const myWalletAccount = new WalletAccount({}, selectedWalletSWO);
     const gatewayContract = new Contract(identityGatewayABI, identityGatewayAddress, myWalletAccount);
     const _id  = await gatewayContract.get_id(address,{ parseResponse: false }) 
     const userid = _id[0].toString(16)

      if(userid =="0x0")
       {
          setDialogType(2) //error
          setNotificationTitle("Add Claim")
          setNotificationDescription("Can't add claim. User doesn't have a StarkNet OnChain ID.")
          setShow(true)

          setIsSaving(false)
          return
   }
   
   
  
    const identityContract = new Contract(identityABI, userid, myWalletAccount);
 

      


   if(address.length < 65 ||  typeof BigInt(address) != 'bigint')
   {
    setDialogType(2) //error
    setNotificationTitle("Add Claim")
    setNotificationDescription("Invalid user address .")
    setShow(true)

          setIsSaving(false)
          return
   } 


   if(isNaN(parseInt(topic)))
    {
        setDialogType(2) //error
        setNotificationTitle("Add Claim")
        setNotificationDescription("Invalid claim topic.")
        setShow(true)
        setIsSaving(false)
              return
       }
       
       
    if(claim == "" || claim == undefined)
        {
            setDialogType(2) //error
            setNotificationTitle("Add Claim")
            setNotificationDescription("Error claim not specified.")
            setShow(true)
            setIsSaving(false)
                  return
           } 
                
    

   try{
         //const   tx1 = await contract.callStatic.add_issuer(address)
         

         const   tx = await identityContract.add_claim(topic,claim,expires)
          const txR = await myWalletAccount.waitForTransaction(tx.transaction_hash); 
          setDialogType(1) //Success
          setNotificationTitle("Add Claim")
          setNotificationDescription("Claim added successfully.")
          setShow(true)
          setIsSaving(false)
   
   }catch(error)
   {
        console.log(error)
     
          setDialogType(2) //error
          setNotificationTitle("Add Claim")
          setNotificationDescription("Error adding claim.")
          setShow(true)
   
    setIsSaving(false)
   }
  }

  const revokeClaim = async()=>
    {
     setIsSaving(true) 
     const address = document.getElementById("address").value
     const topic = document.getElementById("topic").value


     if(address.length < 65 ||  typeof BigInt(address) != 'bigint')
        {
         setDialogType(2) //error
         setNotificationTitle("Revoke Claim")
         setNotificationDescription("Invalid user address .")
         setShow(true)
     
               setIsSaving(false)
               return
        } 
     
      
  
     const selectedWalletSWO = await connect({ modalMode: 'neverAsk', modalTheme: 'light' });
     const myWalletAccount = new WalletAccount({}, selectedWalletSWO);
       const gatewayContract = new Contract(identityGatewayABI, identityGatewayAddress, myWalletAccount);
       const _id  = await gatewayContract.get_id(address,{ parseResponse: false }) 
       const userid = _id[0].toString(16)
  
        if(userid =="0x0")
         {
            setDialogType(2) //error
            setNotificationTitle("Revoke Claim")
            setNotificationDescription("Can't revoke claim. User doesn't have a StarkNet OnChain ID.")
            setShow(true)
  
            setIsSaving(false)
            return
     }
     
     
    
      const identityContract = new Contract(identityABI, userid, myWalletAccount);
   
  
        
  
  
    
  
     if(isNaN(parseInt(topic)))
      {
          setDialogType(2) //error
          setNotificationTitle("Revoke Claim")
          setNotificationDescription("Invalid claim topic.")
          setShow(true)
          setIsSaving(false)
                return
         }
         
         
     
                  
      
  
     try{
           //const   tx1 = await contract.callStatic.add_issuer(address)
           const claim = await identityContract.get_claimByIssuerAndTopic(address,topic,{ parseResponse: true })
           console.log(claim)
           setIsSaving(false)
           if(claim.claim_id == 0)
            {
                setDialogType(2) //error
                setNotificationTitle("Revoke Claim")
                setNotificationDescription("Claim doesn't exist.")
                setShow(true)
                setIsSaving(false)
                return
               }
          
           const   tx = await identityContract.remove_claim(claim.claim_id)
            const txR = await myWalletAccount.waitForTransaction(tx.transaction_hash); 
            setDialogType(1) //Success
            setNotificationTitle("Revoke Claim")
            setNotificationDescription("Claim revoked successfully.")
            setShow(true)
            setIsSaving(false)
     
     }catch(error)
     {
          console.log(error)
       
            setDialogType(2) //error
            setNotificationTitle("Revoke Claim")
            setNotificationDescription("Error revoking claim.")
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
                   
                  <div className="pt-2 flex gap-4">
                    <button disabled={isSaving || !gotID || (gotID && !did)}
                      className="hover:shadow-form w-1/2 rounded-md bg-primary py-3 px-4 text-center text-base font-semibold text-white outline-none"
                   type='button'
                   onClick={()=>issueClaim()}
                   >
                        Issue Claim
                    </button>

                    <button disabled={isSaving || !gotID || (gotID && !did)}
                      className="hover:shadow-form w-1/2 rounded-md bg-primary  py-3 px-4 text-center text-base font-semibold text-white outline-none"
                   type='button'
                   onClick={()=>revokeClaim()}
                   >
                        Revoke Claim
                    </button>

                   
                  </div>                    
                 
                  </div>
                </div>
              </div>
              <div className="w-full px-5 lg:w-7/12 xl:px-8">
                <div>
                <div className="mb-8 pt-2">
                    <p className="text-[40px] font-bold text-white">
                      Issue Claim
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


                      <div className="mb-5">
                        <label
                          for="address"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          User Address
                        </label>
                        <div className='flex flex-row'>
                        <input
                          required   
                          type="text"
                          name="address"
                          id="address"
                          
                          placeholder='User Address'

                          className={` w-full text-white rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium outline-none transition-all focus:bg-[#454457] focus:shadow-input`}
                        /></div>
                      </div>     
                      
                      <div className="mb-5">
                        <label
                          for="topic"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Claim Topic
                        </label>
                        <div className='flex flex-row'>
                        <input
                          required   
                          type="number"
                          defaultValue={1}
                          min={1}
                          name="topic"
                          id="topic"
                          

                          className={` w-full text-white rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium outline-none transition-all focus:bg-[#454457] focus:shadow-input`}
                        /></div>
                      </div>   
                      <div className="mb-5">
                        <label
                          for="claim"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Claim 
                        </label>
                        <div className='flex flex-row'>
                        <input
                          required   
                          type="text"
                          name="claim"
                          id="claim"
                          
                          placeholder='Claim data Eg. KYC'

                          className={` w-full text-white rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium outline-none transition-all focus:bg-[#454457] focus:shadow-input`}
                        /></div>
                      </div>    
                      <div className="mb-5">
                        <label
                          for="expirydate"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Expiry Date
                        </label>
                        <div className='flex flex-row'>
                        <input
                          required   
                          type='datetime-local'
                          name="expirydate"
                          id="expirydate"
                          

                          className={` w-full text-white rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium outline-none transition-all focus:bg-[#454457] focus:shadow-input`}
                        /></div>
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
