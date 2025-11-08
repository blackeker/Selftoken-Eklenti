# Discord Token Aracı Eklentisi

Bu Chrome eklentisi, kullanıcıların Discord token'larını almalarına ve belirtilen bir token ile Discord'a giriş yapmalarına olanak tanır.

## Özellikler

- **Token Alma:** Aktif Discord sekmesinden mevcut kullanıcı token'ını alır ve görüntüler.
- **Token ile Giriş:** Sağlanan bir token'ı kullanarak Discord hesabına otomatik olarak giriş yapar.

## Nasıl Kullanılır?

### Token Almak İçin:

1.  Bir Discord sekmesi açıkken eklenti ikonuna tıklayın.
2.  Açılan pencerede **"Token Al"** düğmesine tıklayın.
3.  Kullanıcı token'ınız aşağıdaki metin kutusunda görünecektir.

### Token ile Giriş Yapmak İçin:

1.  Eklenti ikonuna tıklayın.
2.  Giriş yapmak istediğiniz Discord token'ını metin kutusuna yapıştırın.
3.  **"Giriş Yap"** düğmesine tıklayın.
4.  Eklenti, Discord giriş sayfasına yönlendirecek ve token ile otomatik olarak giriş yapacaktır.

## Proje Dosyaları ve Açıklamaları

-   **`manifest.json`**: Eklentinin adı, versiyonu, izinleri ve temel yapılandırması gibi meta verileri içeren standart Chrome eklentisi manifest dosyası.
-   **`popup.html`**: Eklentinin kullanıcı arayüzünü (butonlar, metin kutuları vb.) tanımlayan HTML dosyası.
-   **`popup.js`**: Kullanıcı arayüzündeki etkileşimleri yöneten JavaScript kodu. "Token Al" ve "Giriş Yap" butonlarının işlevselliğini içerir.
-   **`alan.js`**: Aktif Discord sayfasından kullanıcı token'ını çekmek için sayfaya enjekte edilen JavaScript kodunu barındırır.
-   **`giren.js`**: Kullanıcının girdiği token ile Discord'a otomatik giriş yapmak için `localStorage`'a token'ı enjekte eden içerik betiği.
