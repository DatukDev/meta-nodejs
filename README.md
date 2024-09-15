<p align="center"><i><b>Otomasi WhatsApp Meta Facebook</i></b></p>
<p align="center"><img src="https://gifdb.com/images/high/glitching-whatsapp-meta-facebook-automation-biwszmcveudzaori.gif" width="300"/></p>
<div align="center">
  <p>
    <img src="https://img.shields.io/badge/Author-VNIX%20TEAM-green?style=flat-square">
    <img src="https://img.shields.io/badge/Written%20In-Python-green?style=flat-square">
    <img src="https://img.shields.io/badge/Open%20Source-Yes-green?style=flat-square">
    <img src="https://img.shields.io/badge/Premium-No-red?style=flat-square">
  </p>
</div>

### Jika Anda sudah menginstal sebelumnya
   ```
   cd $HOME
   cd Otomasi-WhatsApp-Meta-Facebook
   git pull
   python send.py
   ```
    
### Jika Anda belum menginstal
   ```
   pkg update && pkg upgrade
   pkg install python
   pkg install git
   rm -rf Otomasi-WhatsApp-Meta-Facebook
   pip install selenium python-dotenv colorama
   git clone https://github.com/vnix-team/Otomasi-WhatsApp-Meta-Facebook
   cd Otomasi-WhatsApp-Meta-Facebook
   python send.py
   ```

### Catatan
Gunakan alat ini dengan bijak. Admin tidak akan bertanggung jawab jika terjadi hal-hal yang tidak diinginkan.
Dengan menginstal alat ini, Anda menyetujui semua risiko yang mungkin terjadi!

### Termux & Kontak
<div>
  <p>
    Unduh aplikasi <a href="https://f-droid.org/repo/com.termux_118.apk">Termux</a> di sini untuk menghindari kesalahan saat instalasi. Anda dapat menghubungi kami melalui <a href="https://github.com/vnix-team">GitHub</a> atau <a href="mailto:vnixteam@example.com">Email</a>. Hindari akun palsu dan ikuti tautan yang kami berikan di setiap repo.
  </p>
</div>

## Fitur
- Otomatisasi pengiriman pesan WhatsApp melalui Meta Business Suite Facebook
- Dukungan untuk multiple templates pesan
- Pengiriman pesan acak untuk setiap kontak
- Waktu jeda yang dapat dikustomisasi antara setiap pengiriman
- Mode headless browser untuk operasi latar belakang
- Pembersihan profil otomatis setelah eksekusi
- Pelacakan progress dan penanganan error

## Persyaratan
- Python 3.7+
- Chrome Browser
- ChromeDriver yang kompatibel dengan versi Chrome Anda

## Konfigurasi
1. Buat file `.env` dengan konten:
   ```
   INBOX_URL=url_inbox_facebook_business_suite_anda
   SLEEP_TIME=waktu_jeda_dalam_detik
   HEADLESS=0  # Ubah ke 1 untuk mode headless
   ```
2. Siapkan `nomor.txt` dengan format:
   ```
   nomor_telepon,nama
   nomor_telepon,nama
   ```
3. Siapkan `pesan.txt` dengan template pesan yang dipisahkan oleh `|`
4. Simpan cookie Facebook Anda dalam `cookie.json`

## Penggunaan
Jalankan script dengan perintah:
```
python send.py
```

## Lisensi
Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file [LICENSE](LICENSE) untuk detailnya.

---

Dibuat dengan ❤️ oleh VNIX TEAM
