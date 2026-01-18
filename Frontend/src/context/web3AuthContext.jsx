import { WEB3AUTH_NETWORK } from "@web3auth/modal";

const clientId = "BHgHgju8s-IwXBx-1PmMJtqUtj4m59l9Q29VZIzOJx018TN7RRBRuQDAf6YVmeLRu8cxHuo4fs-UKgnSaJxojhc"

const web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  }
};

export default web3AuthContextConfig;