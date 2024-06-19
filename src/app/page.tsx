"use client"
import Head from 'next/head'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Image from 'next/image';
import Link from 'next/link'
import {
  useDynamicContext
  
} from "@dynamic-labs/sdk-react-core";
import { WalletAccount ,RpcProvider, Contract, json,CallData,shortString,BigNumberish,cairo } from 'starknet'; // v6.10.0 min
import { connect } from 'get-starknet'; // v4.0.0 min
import {identityAddress,identityABI} from"@/starknet/contracts"
export default function Home() {

const {primaryWallet,rpcProviders} = useDynamicContext()

const identity = async()=>{

  const selectedWalletSWO = await connect({ modalMode: 'neverAsk', modalTheme: 'light' });

  
   const myWalletAccount = new WalletAccount({}, selectedWalletSWO);

  console.log(myWalletAccount)
  const myTestContract = new Contract(identityABI, identityAddress, myWalletAccount);
  console.log(myTestContract)

  const isAbiCairo1: boolean = cairo.isCairo1Abi(identityABI);
  console.log(isAbiCairo1)


  
  try
  {const owner:BigNumberish = await myTestContract.get_owner({ parseResponse: false });
   // const tx = await myTestContract.add_issuer("0x07bD211AA2444c06f50E2Ea013eA66D4d69B840Cad6055465CABF80A5d1A76C6")
  //const tx = await myTestContract.add_claim(1,"kyc",0)
  const valid = await myTestContract.isValidClaim("3500352511002723790169572099007733033269827260935240930551249030351569974982",1)
  const name  = await myTestContract.get_contract_name({ parseResponse: false })
  const title:string = shortString.decodeShortString(name[0])
  console.log(title)
  /*const myCallData = new CallData(identityABI);
  const encodedArray = [owner]; 
const res = myCallData.decodeParameters("core::starknet::contract_address::ContractAddress", encodedArray);
console.log(res)
*/
 

  console.log(name)
  console.log(valid)
  
  console.log(owner.valueOf());
  }catch(error)
  {console.log(error)}



}

  return (
    <>
      <Head>
      <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css?family=Fira+Sans&display=swap" rel="stylesheet"/>   
     <title>StarkNet OnChainID - Decentralized IDs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-black"
       
     >
         <Header/>

     <section
      id="home"
      className= "  opacity-90 relative  overflow-hidden bg-cover bg-top bg-no-repeat pt-[150px] pb-24"
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
      <div className="container ">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div className="mb-12 max-w-[570px] lg:mb-0">
              <h1
                className="mb-4 text-[40px] font-bold leading-tight text-white md:text-[50px] lg:text-[40px] xl:text-[46px] 2xl:text-[50px] sm:text-[46px]"
              >
               
               StarkNet OnChainID - Decentralized IDs 
                             </h1>
              <p
                className="opacity-80 border border-grey rounded-md  p-4 mb-8 text-lg  bg-bg-color font-medium leading-relaxed text-white md:pr-14 "
              >

Starknet OnChainID is a decentralized identity (DID) solution built on the Starknet Layer 2 network, leveraging ZK-Rollup technology for scalable and secure blockchain interactions. This solution provides users with a decentralized and self-sovereign identity, enabling seamless authentication and verification across various dApps and services within the Starknet ecosystem.

With Starknet OnChainID, users retain full control over their identity data without relying on central authorities, as identities are stored on-chain, ensuring security and immutability.

</p>
         <div className="flex flex-wrap items-center">
                <button
                  type='button'
                  onClick={()=>identity()}
                  className="mr-5 mb-5 inline-flex items-center justify-center rounded-md border-2 border-gold bg-gold py-3 px-7 text-base font-semibold text-white transition-all hover:bg-opacity-90"
                >
                  Identity
                </button>
                <Link
                  href="/identity"
                  className="mb-5 inline-flex items-center justify-center rounded-md border-2 border-white py-3 px-7 text-base font-semibold text-white transition-all hover:border-blue-light hover:bg-blue-light"
                >
                  About
                </Link>
                
              </div>
            </div>
          </div>

        
        </div>
      </div>

      
    </section>
    <Footer />
     </main>
     </>
  )
}
