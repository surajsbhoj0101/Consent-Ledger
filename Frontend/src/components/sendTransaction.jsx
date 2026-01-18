import { FormEvent } from "react";
import { useWaitForTransactionReceipt, useSendTransaction, BaseError } from "wagmi";
import { parseEther } from "viem";

export function SendTransaction() {
    const { data: hash, error, isPending, sendTransaction } = useSendTransaction()

    async function submit(e) {
        e.preventDefault()
        const formData = new FormData(e.target )
        const to = formData.get('address') 
        const value = formData.get('value')
        sendTransaction({ to, value: parseEther(value) })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    return (
        <div>
            <h2>Send Transaction</h2>
            <form onSubmit={submit}>
                <input name="address" placeholder="Address" required />
                <input
                    name="value"
                    placeholder="Amount (ETH)"
                    type="number"
                    step="0.000000001"
                    required
                />
                <button disabled={isPending} type="submit">
                    {isPending ? 'Confirming...' : 'Send'}
                </button>
            </form>
            {hash && <div>Transaction Hash: {hash}</div>}
            {isConfirming && 'Waiting for confirmation...'}
            {isConfirmed && 'Transaction confirmed.'}
            {error && (
                <div>Error: {(error ).shortMessage || error.message}</div>
            )}
        </div>
    )
}