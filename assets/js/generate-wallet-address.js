function GenerateWalletAddress() {
	const resultDiv = document.getElementById('WalletAddressResult')
	const inputDiv = document.getElementById('EnterToGenerateWalletAddress')
	resultDiv.style.display = 'block'
	inputDiv.style.display = 'none'

	// Kosongkan hasil sebelumnya
	document.getElementById('MultipleWallets').innerHTML = ''

	// Ambil jumlah kata mnemonic
	let wordCount = parseInt(document.getElementById('SelectWordCount').value)
	let byteCount
	switch (wordCount) {
		case 12: byteCount = 16; break
		case 15: byteCount = 20; break
		case 18: byteCount = 24; break
		case 21: byteCount = 28; break
		case 24: byteCount = 32; break
		default: byteCount = 24
	}

	// Buat mnemonic
	const randomBytes = ethers.utils.randomBytes(byteCount)
	const mnemonic = ethers.utils.entropyToMnemonic(randomBytes)
	document.getElementById('EthersUtilsEntropyToMnemonic').value = mnemonic

	// Ambil password atau buat random
	let inputPassword = document.getElementById('SetPassword').value
	if (!inputPassword) {
		inputPassword = B64Encode('0x' + byteCount + RandomCharacter(8))
	}
	document.getElementById('Password').value = inputPassword

	// Buat HDNode
	const rootNode = ethers.utils.HDNode.fromMnemonic(mnemonic, inputPassword)

	// Set path pertama
	const path0 = "m/44'/60'/0'/0/0"
	const node0 = rootNode.derivePath(path0)
	document.getElementById('DerivedNodePath').value = node0.path

	// Jumlah wallet
	let count = parseInt(document.getElementById('SetNumberOfWalletAddresses').value)
	if (isNaN(count) || count < 1 || count > 250) count = 1

	// Generate & tampilkan wallet
	const table = document.getElementById('MultipleWallets')
	for (let i = 0; i < count; i++) {
		const path = `m/44'/60'/0'/0/${i}`
		const wallet = rootNode.derivePath(path)
		table.innerHTML += `
			<tr>
				<th scope="row">${i}</th>
				<td>${wallet.privateKey}</td>
				<td>${wallet.publicKey}</td>
				<td>${wallet.address}</td>
			</tr>
		`
	}
}