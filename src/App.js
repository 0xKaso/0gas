"use client";
import React, { useState } from "react";
import Web3 from "web3";

global.ethereum = window.ethereum;

const WalletConnect = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");

  // 连接钱包
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // 请求用户授权
        const accounts = await web3.eth.getAccounts(); // 获取账户
        setWeb3(web3);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("连接钱包出错：", error);
      }
    } else {
      alert("请安装MetaMask!");
    }
  };

  // 签名结构化数据
  const signStructuredData = async () => {
    if (!web3) {
      alert("请先连接钱包!");
      return;
    }

    const domainType = [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ];

    const permitType = [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ];

    const domainData = {
      name: "Uniswap V3",
      version: "1",
      chainId: 1,
      verifyingContract: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    };

    const permitPayload = {
      owner: account, // 授权者
      spender: "0x000000000022D473030F116dDEE9F6B43aC78BA3", // 被授权的合约地址
      value: 10, // 授权的数量
      nonce: 59, // 授权者的nonce
      deadline: Math.floor(new Date().getTime() / 10000 + 10), // 授权过期时间
    };

    const data = {
      types: { Permit: permitType, EIP712Domain: domainType },
      primaryType: "Permit",
      domain: domainData,
      message: permitPayload,
    };

    console.log(JSON.stringify(data));
    try {
      const signature = await window.ethereum.request({
        method: "eth_signTypedData_v4",
        params: [account, JSON.stringify(data)],
      });
      console.log("签名结果：", signature);
    } catch (error) {
      console.error("签名出错：", error);
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>连接钱包</button>
      {account && <div>账户: {account}</div>}
      <button onClick={signStructuredData}>签名结构化数据</button>
    </div>
  );
};

export default WalletConnect;
