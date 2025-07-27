var Mnemonic
var Password
var WalletPrivateKey
var WalletAddress
var ChainID
var NodeURL



function RandomCharacter(length) {
	let result = ''
	// const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
	const characters = 'ABCDEFabcdef0123456789'
	const charactersLength = characters.length
	let counter = 0
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
		counter += 1
	}
	return result
}



function B64Encode(string) {
	return btoa(string)
}

function B64Decode(string) {
	return atob(string)
}



function GenerateWalletAddress() {
	document.getElementById('WalletAddressResult').style.display = 'block'
	document.getElementById('PrintWalletAddressResult').style.display = 'block'
	document.getElementById('EnterToGenerateWalletAddress').style.display = 'none'
	
	let SelectWordCount = document.getElementById('SelectWordCount')
	let ValueSelectWordCount = SelectWordCount.value
	let TextSelectWordCount = SelectWordCount.options[SelectWordCount.selectedIndex].text
	
	var WordCountForRandomBytes
	if (ValueSelectWordCount === '12') {
		WordCountForRandomBytes = 16
	} else if (ValueSelectWordCount === '15') {
		WordCountForRandomBytes = 20
	} else if (ValueSelectWordCount === '18') {
		WordCountForRandomBytes = 24
	} else if (ValueSelectWordCount === '21') {
		WordCountForRandomBytes = 28
	} else if (ValueSelectWordCount === '24') {
		WordCountForRandomBytes = '32'
	} else {
		WordCountForRandomBytes = 24
	}
	
	// Mnemonic
	// The mnemonic phrase for this mnemonic. It is 12, 15, 18, 21 or 24 words long and separated by the whitespace specified by the locale.
	// ethers.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16))
	// ethers.HDNode.entropyToMnemonic(ethers.utils.randomBytes(20))
	// ethers.HDNode.entropyToMnemonic(ethers.utils.randomBytes(24))
	// ethers.HDNode.entropyToMnemonic(ethers.utils.randomBytes(28))
	// ethers.HDNode.entropyToMnemonic(ethers.utils.randomBytes(32))
	// var RandomByteItems = Array(16, 20, 24, 28, 32)
	// var RandomByteItem = RandomByteItems[Math.floor(Math.random()*RandomByteItems.length)]
	var RandomByteItem = WordCountForRandomBytes
	
	const EthersUtilsRandomBytes = ethers.utils.randomBytes(RandomByteItem)
	const EthersUtilsEntropyToMnemonic = ethers.utils.entropyToMnemonic(EthersUtilsRandomBytes)
	document.getElementById('EthersUtilsEntropyToMnemonic').value = EthersUtilsEntropyToMnemonic
	
	// Password
	var SetPassword = document.getElementById('SetPassword')
	SetPassword = SetPassword.value
	if (SetPassword != '') {
		Password = SetPassword
	} else {
		Password = B64Encode('0x' + RandomByteItem + '' + RandomCharacter(8))
	}
	document.getElementById('Password').value = Password
	
	const EthersUtilsHDNodeFromMnemonicUsingPassword = ethers.utils.HDNode.fromMnemonic(EthersUtilsEntropyToMnemonic,Password)
	
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