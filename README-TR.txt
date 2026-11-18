RAWEXxELVİX - NETLIFY KURULUMU

1) ZIP dosyasını telefona indir ve çıkart.
2) GitHub uygulamasını veya github.com sitesini açıp hesap oluştur/giriş yap.
3) New repository ile rawexxelvix-site adında yeni bir repository oluştur.
4) Add file > Upload files bölümünden ZIP içindeki DOSYALARI (ZIP'in kendisini değil) yükle. index.html, package.json, netlify.toml ve netlify klasörü en üst seviyede görünmeli.
5) netlify.com adresini aç, GitHub ile giriş yap.
6) Add new site > Import an existing project > GitHub seç ve rawexxelvix-site deposunu seç.
7) Build command boş, Publish directory olarak . (nokta) gir. Deploy et.
8) Netlify site panelinde Site configuration > Environment variables bölümüne gir.
9) ADMIN_PASSWORD isimli değişken ekle. Değer olarak admin şifreni yaz. Şifreyi herkese açık paylaşma.
10) Deploys bölümünden Trigger deploy > Deploy site yap. Böylece yeni ortam değişkeni devreye girer.

KULLANIM
- Sitenin adresini aç.
- ADMIN butonuna basıp ADMIN_PASSWORD değerini gir.
- Bölüm ekleyebilir, mevcut bölümleri düzenleyebilir veya silebilirsin.
- Kaydedilen içerik Netlify Blobs üzerinde tutulur ve siteyi ziyaret eden herkese görünür.

ÖNEMLİ
- Admin şifresini HTML veya GitHub dosyalarına yazma. Yalnızca Netlify Environment Variables alanına gir.
- Şifreyi bilen herkes admin işlemi yapabilir. Bu nedenle sadece güvendiğin kişilerle paylaş.
- Bu başlangıç sürümünde admin şifresi tarayıcı oturumu boyunca saklanır; çıkış yapınca silinir.
- SIZINTI ve TOOL butonları şimdilik içerik bölümleridir; herhangi bir dış sistemde sorgu veya işlem yapmaz.
