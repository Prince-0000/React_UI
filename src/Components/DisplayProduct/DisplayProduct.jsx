import React from "react";
import "./DisplayProduct.css";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../../build/Counterfeit.json";
import "bootstrap/dist/css/bootstrap.min.css";
const DisplayProduct = () => {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("none");
  useEffect(() => {
    // --------
    const connectWallet = async () => {
      const contractAddress = "0x6830dA99A15dA10ADEa9E4E116084b56c47d3ae4"; //contract address
      const contractAbi = abi.abi; //fetching abi
      try {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        if (ethereum) {
          const account = await provider.send("eth_requestAccounts", []);
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
          );
          setState({ provider, signer, contract });
          setAccount(account);
        } else {
          alert("Please install metamask");
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();

    // ------
  }, []);

  const [print, setPrint] = useState({
    naam: null,
    description: null,
  });
  var name=null;
  const Display = async (event) => {
    event.preventDefault();
    const regId = document.querySelector("#reg").value;
    const { contract } = state;
    const getProduct = await contract.getProductById(regId);
    name= getProduct[0];
    const des = getProduct[1];
    setPrint({
      naam: name,
      description: des,
    });
  };


  const handleDown=(event)=>{
    if(event.keyCode === 8)
    {
      setPrint({
        naam: null,
        description: null,
      })

    }
  }
  // const handleSubmit=(event)=>{

  //   console.log(event);
  // }
  return (
    <>
      <div className="big">
        <h1>Verify Your Product</h1>
        <div >
          <form className="chota" onClick={Display}>
            <div className="div">
              <label className="label-product">Product id</label>
              <input
                type="text"
                id="reg"
                placeholder="Product id"
                name="regNo"
                // value={product.regNo}
                className="input-box"
                // onChange={handleChange}
                onKeyDown={handleDown}
              />
            </div>
            <div className="button-dis">
              <button type="submit" className="submit-product">
                Verify!
              </button>
            </div>
          </form>
        </div>
        {print.naam ===null?null:print.naam===name ?(
          <>
          <div className="un-verified">
            <h2>Your Product is Fake !</h2>
            <div className="connect">Complain </div>
          </div>
           
          </>
        ) : (
          <div className="verified" data-aos="zoom-in-up">
          <h2>Your Product Has Been verified</h2>
          <div className="product-name" >{`Name : ${print.naam}`}</div>
          <div className="product-disc" >{`Description : ${print.description}`}</div>
        </div>
          
        )}
      </div>
    </>
  );
};

export default DisplayProduct;