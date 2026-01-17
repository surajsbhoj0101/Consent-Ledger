// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {ConsentLedger} from "../src/ConsentLedger.sol";

contract ConsentLedgerDeploy is Script{
    ConsentLedger public consentledger;

     function setUp() public {}
 
    function run() public {
        vm.startBroadcast();
 
        consentledger = new ConsentLedger();
 
        vm.stopBroadcast();
    }
}