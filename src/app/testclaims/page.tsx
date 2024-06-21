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
import { identityABI, identityGatewayABI,identityGatewayAddress ,testContractAddress,testContractABI} from '@/starknet/contracts';
import { WalletAccount , Contract } from 'starknet'; // v6.10.0 min
import { connect } from 'get-starknet'; // v4.0.0 min

import { useState,useEffect,useRef } from 'react';
import Notification from '@/components/Notification/Notification';
export default function TestClaims() {
  const {primaryWallet,rpcProviders,isAuthenticated} = useDynamicContext()
  const inputRef = useRef(null);

 const [isSaving,setIsSaving] = useState()
 const [preview,setPreview] = useState()
 const [gotID,setGotID] = useState()
 const [message,setMessage] = useState()
 const [lastCaller,setLastCaller] = useState()
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
 

 const sendMessage = async()=>
  {
   setIsSaving(true) 
   const message = document.getElementById("message").value
  
   
   
     
    if(message == "" || message == undefined)
        {
            setDialogType(2) //error
            setNotificationTitle("Send Message")
            setNotificationDescription("Error message not specified.")
            setShow(true)
            setIsSaving(false)
           return
           } 
                
    

   try{
         //const   tx1 = await contract.callStatic.add_issuer(address)
         
         const selectedWalletSWO = await connect({ modalMode: 'neverAsk', modalTheme: 'light' });
         const myWalletAccount = new WalletAccount({}, selectedWalletSWO);
         
        
          const testContract = new Contract(testContractABI, testContractAddress, myWalletAccount);
          const tx = await testContract.setMessage(message,{ parseResponse: true })
       
          const txR = await myWalletAccount.waitForTransaction(tx.transaction_hash); 
          setDialogType(1) //Success
          setNotificationTitle("Send Message")
          setNotificationDescription("Message sent successfully.")
          setShow(true)
          setIsSaving(false)
   
   }catch(error)
   {
        console.log(error)
     
          setDialogType(2) //error
          setNotificationTitle("Send Message")
          setNotificationDescription("Error sending claim.")
          setShow(true)
   
    setIsSaving(false)
   }
  }

  const getMessage = async()=>
    {
     setIsSaving(true) 
    
      
  
     const selectedWalletSWO = await connect({ modalMode: 'neverAsk', modalTheme: 'light' });
     const myWalletAccount = new WalletAccount({}, selectedWalletSWO);
     
    
      const testContract = new Contract(testContractABI, testContractAddress, myWalletAccount);
   
 
     console.log(myWalletAccount)             
      
  
     try{
           const message = await testContract.getMessage({ parseResponse: true })
           console.log(message)
           setMessage(message.lastMessage)
           setLastCaller(message.lastCaller)
           setIsSaving(false)
            setDialogType(1) //Success
            setNotificationTitle("Get Message")
            setNotificationDescription("Message received.")
            setShow(true)
            setIsSaving(false)
     
     }catch(error)
     {
          console.log(error)
       
            setDialogType(2) //error
            setNotificationTitle("Get Message")
            setNotificationDescription("Error getting message.")
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
      <main className="bg-black">
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
                    <button disabled={isSaving }
                      className="hover:shadow-form w-1/2 rounded-md bg-primary py-3 px-4 text-center text-base font-semibold text-white outline-none"
                   type='button'
                   onClick={()=>sendMessage()}
                   >
                        Send Message
                    </button>

                    <button disabled={isSaving }
                      className="hover:shadow-form w-1/2 rounded-md bg-primary  py-3 px-4 text-center text-base font-semibold text-white outline-none"
                   type='button'
                   onClick={()=>getMessage()}
                   >
                        Get Message
                    </button>

                   
                  </div>                    
                 
                  </div>
                </div>
              </div>
              <div className="w-full px-5 lg:w-7/12 xl:px-8">
                <div>
                <div className="mb-8 pt-2">
                    <p className="text-[40px] font-bold text-white">
                      Test Claims
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
                          for="message"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Message to Send
                        </label>
                        <div className='flex flex-row'>
                        <input
                          required   
                          type="text"
                          name="message"
                          id="message"
                          
                          placeholder='Type message here'

                          className={` w-full text-white rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium outline-none transition-all focus:bg-[#454457] focus:shadow-input`}
                        /></div>
                      </div>     
                      
                      <div className="mb-5">
                        <label
                          for="lastmessage"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Last Message Received
                        </label>
                        <div className='flex flex-row'>
                        <input
                          disabled={true} 
                          value={message}
                          type="text"
                          name="lastmessage"
                          id="lastmessage"
                          

                          className={` w-full text-white rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium outline-none transition-all focus:bg-[#454457] focus:shadow-input`}
                        /></div>
                      </div>   
                      <div className="mb-5">
                        <label
                          for="sender"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Last Sender
                        </label>
                        <div className='flex flex-row'>
                        <input
                          disabled ={true} 
                          value={lastCaller}
                          type="text"
                          name="sender"
                          id="sender"
                          
                        

                          className={` w-full text-white rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium outline-none transition-all focus:bg-[#454457] focus:shadow-input`}
                        /></div>
                      </div>    
                      <div 
                                      className="mb-12  lg:mb-0 opacity-80 border border-grey rounded-md  p-4 mb-4 text-lg  bg-bg-color font-medium leading-relaxed text-white md:pr-14 "

                      >
              <h1
                className="mb-8 text-[40px] font-bold leading-tight text-white md:text-[30px] lg:text-[20px] xl:text-[26px] 2xl:text-[30px] sm:text-[26px]"
              >
               
               Read Me
                             </h1>
              <p
              >

The Starknet OnChain ID demo screen is designed to showcase the integration of decentralized identity verification through a custom smart contract. This screen primarily allows users to send messages, which the contract accepts only if the user possesses a self-attested claim of topic 1. This claim acts as a proof of identity and authorization, ensuring that only verified users can interact with the contract. Additionally, the screen provides functionality to view the last sent message and the sender’s details, but this information is accessible only to users who also have a self-attested claim of topic 1. This ensures that sensitive information remains secure and is only disclosed to authorized users.
</p>
<p className='mt-2'
   >For users who need to issue self-attested claims, there is a separate screen named "Issue Claims." This screen allows users to create new claims by setting the claim topic to 1 and entering their Starknet address. Users can leave the expiry date blank to create claims that do not expire, providing flexibility in managing their digital identities. The claim issuance process is designed to be user-friendly, enabling users to quickly obtain the necessary credentials to interact with the main demo screen's functionalities. Together, these screens demonstrate the practical application of decentralized identity verification using Starknet OnChain ID, enhancing security and empowering users to manage their digital identities in a decentralized manner.</p>
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
