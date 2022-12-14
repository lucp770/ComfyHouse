//create a loading screen, get the data from the user and the total from the localstorage;
//creating a loading circle
// open metamask, to execute a transaction
//if transaction suceeded, then change the page to green, otherwise change to red.

//_________________// get DOM elements //___________________________//

const totalContainer = document.querySelector('.user-total-container');
const informText = document.querySelector('.information-banner');
const userTotal = document.querySelector('.user-total');
const confirmPayment = document.querySelector('.finish-payment');
const cancelPayment = document.querySelector('.cancel-payment');
let ETHPrice;

//----------------get data from localStorage:----------------//

//user and total
const {user, total} = JSON.parse(localStorage.getItem('userAndTotalValue'));

//------------------------loading total in usdt and checking metamask.-----------------------------

async function executeTransaction(sender, recipient, total, gasPrice){
   const tx = {
      from: sender,
      to: recipient,
      value: ether.utils.parseUnits(total, "ethers"),
      gasPrice: gasPrice,
      gasLimit: ethers.utils.hexlify(10000000), //100 000 gwei
      nounce: signer_provider.getTransactionCount(sender, 'latest')
   };

   const transaction = await signer.sendTransaction(sender,'latest');

   console.log(transaction);
   return transaction;

}

 async function getAdress(){
      //get the eth provider (metamask)
   let provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth_goerli');
   console.log('jsonprovider', provider);
   let signer_provider = new ethers.providers.Web3Provider(window.ethereum);
    try{
      //i guess i could get the data to be fin
        let accounts = await signer_provider.send("eth_requestAccounts", []);
    return accounts;

    }catch(e){
        console.log(e);
    }
 }

 async function getEthPrice(price){
   //get ethtoUSD price from the binance API.
   try{

      let ethToUSDT  = await fetch('https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1h');
      // let data ='binance'
      ethToUSDT = await ethToUSDT.json();
      ethToUSDT = ethToUSDT[ethToUSDT.length-1][4];

      let totalEth = await price/ethToUSDT; // (1000 USDT/1 ETH)*(1/ 20 USDT)
      return {totalEth, ethToUSDT};

   }catch(e){
      console.log(e);
   }
    

 }

 getEthPrice(total).then(result => console.log(result));

async function fillDom(){
   //get the eth provider (metamask)
   let provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth_goerli');
   console.log('jsonprovider', provider);
   let signer_provider = new ethers.providers.Web3Provider(window.ethereum);
   console.log('eth provider', signer_provider);

   const signer = await signer_provider.getSigner();
   //get the gas price:
   let gasPrice = await signer_provider.getGasPrice();
   //convert gasPrice to ether.
   gasPrice =  ethers.utils.formatUnits(gasPrice,'ether');

   getEthPrice(total).then( ({totalEth, ethToUSDT}) =>{
   let text = (totalEth+Number(gasPrice)).toString()
   console.log('gasPrice: ');

   let newTotal = total + gasPrice/ethToUSDT;

   //set the inner html

   userTotal.innerHTML = text +' ETH' + ' ( $'+ newTotal +' )';
   })
}

document.addEventListener('DOMContentLoaded',fillDom)


userTotal.addEventListener('mouseover',()=>{
   informText.classList.remove('hidden');
})

userTotal.addEventListener('mouseleave',()=>{
   informText.classList.add('hidden');
})

confirmPayment.addEventListener('click', async ()=>{
   console.log('botao clicado');
   //the wallet associated with the 
   const recipient = '0x7A77e531E1e7444027817356f2dCf5349fEd2e84';
   const sender = await getAdress();
   console.log(sender);


})

//--------------------//--------//------------//------------------

//O pagameto foi totalizado em $ethers, cofirmar pagamento?

// get_data().then((data)=> data.json()).then((result)=>{
//    ETHPrice = result[result.length-1][4];
//    console.log('preco atual do ethereum: ', ETHPrice);
// })


// then(dadosjson=>console.log(dadosjson[dadosjson.length-1][4]))
 // MetaMask requires requesting permission to connect users accounts



//se confirmado, sumir com os bot??es, mostrar tela de carregamento

//atualizar msgs a medida que a transa????o completa.

//completar transa????o, realizar um POST para o servidor

//posteriormente, manipular esse POST para que os dados salvos no servidor sejam salvos em um banco de dados.
