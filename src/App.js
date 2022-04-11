import { useAddress, useMetamask, useNFTDrop } from '@thirdweb-dev/react';
import { useState, useEffect} from 'react';

const App = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const nftDrop = useNFTDrop("0x1F6aE72C5C1Aa0abd2Aa8740F53056B5Be8Ed127");
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() =>{
    // no wallet connected => exit
    if (!address){
      return;
    }

    const checkBalance = async () => {
      try {
        const nfts = await nftDrop.getOwned(address);
        setHasClaimedNFT(nfts?.length > 0);
      } catch (error) {
        setHasClaimedNFT(false)
        console.error("failed to get NFTs", error)
      }
    };
    checkBalance();
  }, [address, nftDrop]);

  const mintNft = async () => {
    try{
      setIsClaiming(true);
      await nftDrop.claim(1);
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to mint NFT", error);
    } finally {
      setIsClaiming(false);
    }
  }

  if(!address){
    return <button onClick={connectWithMetamask}>Connect with Metamask</button>
  }

  if (hasClaimedNFT) {
    return (
      <div>
        <p>You have a passed the GreenhouseGate</p>
      </div>
    )
  }

  return (
    <div>
      <p>Your address: {address}</p>
      <button disabled={isClaiming} onClick={mintNft}>Mint NFT</button>
    </div>
  );
}

export default App;
