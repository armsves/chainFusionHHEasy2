import React, { useState } from 'react';
import { ethers } from 'ethers';

function App() {
    const [name, setName] = useState('');
    const [submittedNames, setSubmittedNames] = useState([]);

    //const sepoliaProviderUrl = "https://sepolia.drpc.org";
    //const rpcProvider = new ethers.JsonRpcProvider(sepoliaProviderUrl);
    const injectedProvider = new ethers.BrowserProvider(window.ethereum); // For MetaMask
    
    //const contractAddress = "0x942C983d96F30028Fdf958fD9bDDeA6f61371dB0";
    const contractAddress = "0x56C66e07f669A04C21Fb376Ead3eFbAE4f9440AC";
    const abi = [
        "function greet(string name) public returns (string)",
        "function getSubmittedNames() public view returns (string[])"
    ];
    
    // Create contract instances
    //const contractReadOnly = new ethers.Contract(contractAddress, abi, rpcProvider);
    const contractWithSigner = async () => {
        const signer = await injectedProvider.getSigner();
        return new ethers.Contract(contractAddress, abi, signer);
    };

    async function getSubmittedNames() {
      try {
          // Get the provider, instantiate the contract and then call getCurrentAd
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(contractAddress, abi, provider);
          const data = await contract.getSubmittedNames();
          
          console.log(data);
          setSubmittedNames(data);
      } catch (error) {
        console.error('Error fetching current ad:', error);
      }
    }
    
    // Function to call greet (requires transaction)
    async function submitGreeting() {
        try {
            const contract = await contractWithSigner();
            const tx = await contract.greet(name);
            console.log("Transaction sent:", tx.hash);
            
            // Wait for transaction confirmation
            const receipt = await tx.wait();
            console.log("Transaction confirmed:", receipt);
            return receipt;
        } catch (error) {
            console.error("Error submitting greeting:", error);
            throw error;
        }
    }

    return (
        <div>
            <h1>Greeter DApp</h1>
            <input
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                value={name}
            />
            <button onClick={submitGreeting}>Greet</button>
            <button onClick={getSubmittedNames}>Fetch Submitted Names</button>
            <ul>
                {submittedNames.map((name, index) => (
                    <li key={index}>{name}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
