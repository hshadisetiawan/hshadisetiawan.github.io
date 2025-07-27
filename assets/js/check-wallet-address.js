var Mnemonic
var Password
var WalletPrivateKey
var WalletAddress
var ChainID
var NodeURL



function CheckWalletAddress() {
	document.getElementById('WalletAddressResult').style.display = 'block'
	document.getElementById('PrintWalletAddressResult').style.display = 'block'
	document.getElementById('EnterToCheckWalletAddress').style.display = 'none'
	
	// Mnemonic
	SetMnemonic = document.getElementById('SetMnemonic')
	SetMnemonic = SetMnemonic.value
	GetMnemonic = SetMnemonic
	document.getElementById('GetMnemonic').value = GetMnemonic
	
	// Password
	SetPassword = document.getElementById('SetPassword')
	SetPassword = SetPassword.value
	GetPassword = SetPassword
	document.getElementById('GetPassword').value = GetPassword
	
	const EthersUtilsHDNodeFromMnemonicUsingPassword = ethers.utils.HDNode.fromMnemonic(SetMnemonic,SetPassword)
	
	const DerivedNode = EthersUtilsHDNodeFromMnemonicUsingPassword.derivePath("m/44'/60'/0'/0/0")
	document.getElementById('DerivedNodePath').value = DerivedNode.path
	
	// Generate multiple wallets from the HDNode instance
	var SetNumberOfWalletAddresses = document.getElementById('SetNumberOfWalletAddresses')
	SetNumberOfWalletAddresses = SetNumberOfWalletAddresses.value
	var NumberOfWalletAddresses
	if (SetNumberOfWalletAddresses >= 1 && SetNumberOfWalletAddresses <= 10) {
		NumberOfWalletAddresses = SetNumberOfWalletAddresses
	} else {
		NumberOfWalletAddresses = 1
	}
	const MultipleWallets = []
	for (let i = 0; i < NumberOfWalletAddresses; i++) {
		const path = "m/44'/60'/0'/0/" + i
		const GetWallet = EthersUtilsHDNodeFromMnemonicUsingPassword.derivePath(path)
		MultipleWallets.push(GetWallet)
		document.getElementById('MultipleWallets').innerHTML += '<tr><th scope="row">'+i+'</th><td>'+GetWallet.privateKey+'</td><td>'+GetWallet.publicKey+'</td><td>'+GetWallet.address+'</td></tr>'
	}
}