function ShowSetPassword() {
  const el = document.getElementById('SetPassword');
  el.type = el.type === 'password' ? 'text' : 'password';
}

function ShowPassword() {
  const el = document.getElementById('GetPassword');
  el.type = el.type === 'password' ? 'text' : 'password';
}

function CheckWalletAddress() {
  const mnemonic = document.getElementById('SetMnemonic').value.trim();
  const password = document.getElementById('SetPassword').value.trim();
  const countInput = parseInt(document.getElementById('SetNumberOfWalletAddresses').value);
  const walletTable = document.getElementById('MultipleWallets');

  if (!mnemonic || mnemonic.split(' ').length < 12) {
    alert("Mnemonic tidak valid atau kurang dari 12 kata.");
    return;
  }

  // Tampilkan hasil, sembunyikan form input
  document.getElementById('WalletAddressResult').style.display = 'block';
  document.getElementById('EnterToCheckWalletAddress').style.display = 'none';
  walletTable.innerHTML = ''; // Kosongkan tabel jika ada data sebelumnya

  // Tampilkan ulang mnemonic dan password yang dimasukkan
  document.getElementById('GetMnemonic').value = mnemonic;
  document.getElementById('GetPassword').value = password;

  try {
    // Generate HDNode dari mnemonic + password
    const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic, password);

    // Default path pertama
    const path0 = "m/44'/60'/0'/0/0";
    const derived0 = hdNode.derivePath(path0);
    document.getElementById('DerivedNodePath').value = derived0.path;

    // Jumlah wallet
    const walletCount = (countInput >= 1 && countInput <= 250) ? countInput : 1;

    for (let i = 0; i < walletCount; i++) {
      const path = `m/44'/60'/0'/0/${i}`;
      const wallet = hdNode.derivePath(path);

      // Tambahkan ke tabel
      walletTable.innerHTML += `
        <tr>
          <td>${i}</td>
          <td>${wallet.privateKey}</td>
          <td>${wallet.publicKey}</td>
          <td>${wallet.address}</td>
        </tr>
      `;
    }

  } catch (err) {
    alert("Gagal memproses mnemonic atau password. Periksa kembali input Anda.");
    console.error(err);
  }
}