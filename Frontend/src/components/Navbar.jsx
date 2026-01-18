import React, { useState, useEffect } from 'react'
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from "@web3auth/modal/react";
import { useAccount } from "wagmi";
import { SendTransaction } from "./sendTransaction";
import { Balance } from "./getBalance";
import { SwitchChain } from "./switchNetwork";


function Navbar() {
    const { connect, isConnected, connectorName, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
    // IMP START - Logout
    const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();
    const { userInfo } = useWeb3AuthUser();
    const { address } = useAccount();

    function uiConsole(...args) {
        const el = document.querySelector("#console>p");
        if (el) {
            el.innerHTML = JSON.stringify(args || {}, null, 2);
            console.log(...args);
        }
    }

    const loggedInView = (
        <div className="grid">
            <h2>Connected to {connectorName}</h2>
            <div>{address}</div>
            <div className="flex-container">
                <div>
                    <button onClick={() => uiConsole(userInfo)} className="card">
                        Get User Info
                    </button>
                </div>
                <div>
                    <button onClick={() => disconnect()} className="card">
                        Log Out
                    </button>
                    {disconnectLoading && <div className="loading">Disconnecting...</div>}
                    {disconnectError && <div className="error">{disconnectError.message}</div>}
                </div>
            </div>
            <SendTransaction />
            <Balance />
            <SwitchChain />
        </div>
    );

    const unloggedInView = (
        <div className="grid">
            <button onClick={() => connect()} className="card">
                Login
            </button>
            {connectLoading && <div className="loading">Connecting...</div>}
            {connectError && <div className="error">{connectError.message}</div>}
        </div>

    );

    return (
        <div>
            <div className='flex'>
                <div>
                    <button onClick={() => disconnect()}>disconnect</button>
                </div>
            </div>
        </div>
    )
}

export default Navbar