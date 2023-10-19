import { ConnectWallet, Web3Button, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useState } from "react";

export default function Home() {
  const address = useAddress();
  const contractAddress = '0x8f44d7e490B54AE944fe2a4a8c5D126A817A76E2';

  const { contract } = useContract(contractAddress);

  const { data: totalCoffees, isLoading: loadingTotalCoffee } = useContractRead(contract, "getTotalCoffee");
  const { data: recentCoffee, isLoading: loadingRecentCoffee } = useContractRead(contract, "getAllCoffee");

  const [name, setName] = useState("")
  const [message, setMessage] = useState("")

  const handleNameChange = (e) => {
    e.preventDefault();
    setName(e.target.value);
  }
  const handleMessageChange = (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  }

  function clearValues() {
    setMessage('');
    setName('');
  }

  return (
    <main className="container min-vh-100 mx-auto bg-light bg-gradient row pt-3">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="">Buy me a coffee</h2>
        <ConnectWallet />
      </div>

      <div className="col-12 col-lg-6">

        <div className="mt-4 mt-lg-0">
          <div className="">
            <h3 className="">Buy a coffee</h3>
          </div>

          <div className="d-flex align-items-center">
            <span>Total Coffee:</span>
            {
              !loadingTotalCoffee ? <span className="ms-2">{totalCoffees?.toString()}</span> : null
            }
          </div>

          <form className="mt-4 d-flex flex-column gap-3">
            <div className="">
              <label>Name:</label>
              <input type="text" value={name} placeholder="Meta Lekan" className="form-control" onChange={handleNameChange} />
            </div>

            <div className="">
              <label>Message:</label>
              <input type="text" value={message} placeholder="Enter your message" className="form-control" onChange={handleMessageChange} />
            </div>

            <div className="mt-3">
              {
                address ?
                  <Web3Button
                    contractAddress={contractAddress}
                    action={() => {
                      contract.call("buyCoffee", [message, name], { value: ethers.utils.parseEther("0.01") })
                    }}
                    onSuccess={() => clearValues()}
                  >
                    {"Buy coffee 0.01 BNB"}
                  </Web3Button> :
                  <span>Connect your wallet</span>
              }
            </div>
          </form>

        </div>
      </div>

      <div className="mt-3 mt-lg-0 col-12 col-lg-6">
        <div className="">
          <h3>Recent messages</h3>

          {
            !loadingRecentCoffee ?
              <div className="d-flex flex-column gap-3">
                {
                  recentCoffee && recentCoffee.map((coffee, index) => (
                    <div key={index} className="mx-3">
                      <div className="d-flex flex-column gap-1 bg-light bg-gradient shadow-lg rounded-4 p-3">
                        <span className="">{coffee[1]}</span>
                        <span className="fw-bold">From: {coffee[2]}</span>
                        <span>{coffee[0]}</span>
                      </div>
                    </div>
                  ))
                }
              </div> :
              null
          }
        </div>
      </div>

    </main>
  );
}
