# Steak In

> Statik, çoxsəhifəli restoran veb-sayt şablonu — saf HTML, SCSS və vanil JavaScript. Heç bir build aləti, framework və `package.json` yoxdur.

🇬🇧 [Read in English](README.md) | 🇦🇿 **Azərbaycan dilində**

---

## Ümumi baxış

**Steak In** ortaq başlıq (header), naviqasiya və footer bölmələrini paylaşan sadə `.html` səhifələrindən ibarət restoran/steykhaus veb-sayt şablonudur. Stil SCSS-də yazılır və tək bir CSS faylına compile olunur; interaktivlik (səhifə keçidləri, mobil naviqasiya, qaranlıq rejim, səbət, rezervasiya modalı, sürüşdürmə paneli/slider) iki kiçik vanil JS faylı ilə idarə olunur. Bundler, paket meneceri və test dəsti yoxdur — səhifələri birbaşa brauzerdə aça və ya istənilən statik fayl serveri ilə servis edə bilərsiniz.

## Səhifələr

| Fayl | Təsvir |
|---|---|
| `index.html` | Ana səhifə — hero, haqqımızda, menyu seçmələri, mükafat slideri, müştəri rəyləri, "Masa sifariş et" düyməsi |
| `chefs.html` | Aşpazlar / komanda səhifəsi |
| `menuboard.html` | Menyu lövhəsi |
| `story.html` | Haqqımızda / hekayəmiz səhifəsi |
| `products.html` | Səbətə əlavə etmə kartları olan məhsul/menyu elementləri |
| `contact.html` | Əlaqə forması olan səhifə |

Bütün səhifələr eyni compile edilmiş stil faylına (`assets/scss/main.css`) bağlanır və eyni `<head>` boilerplate-ni (anti-flash tema skripti, Font Awesome, Swiper CSS) paylaşır.

## Başlanğıc

Saytı görmək üçün build addımı tələb olunmur — `assets/scss/main.css` artıq compile edilib və repository-yə commit olunub.

1. Repository-ni klonlayın və ya yükləyin.
2. `index.html` faylını birbaşa brauzerdə açın, **və ya** layihə kök qovluğunu istənilən statik server ilə servis edin, məsələn:

```bash
# Python
python -m http.server 5500

# Node (npx, quraşdırma tələb olunmur)
npx serve .
```

3. Naviqasiya linkləri ilə saytda gəzin — səhifə keçidləri, qaranlıq rejim, səbət və sliderlər server olmadan da işləyir (lakin HTTP üzərindən servis etmək `file://` ilə bağlı qəribəlikləri aradan qaldırır).

### Stillərin redaktəsi (SCSS)

Mənbə stillər `assets/scss/` qovluğunda yerləşir və `assets/scss/main.css` (+ `main.css.map`) faylına compile olunur. npm skripti yoxdur — compile etmək üçün [Dart Sass CLI](https://sass-lang.com/install) və ya VS Code-un "Live Sass Compiler" kimi redaktor əlavəsindən istifadə edin:

```bash
sass assets/scss/main.scss assets/scss/main.css
```

> Hər hansı bir `.scss` partial faylını redaktə etdikdən sonra `main.css`-in sinxron qalması üçün **yenidən compile edin**. `main.css`-i birbaşa redaktə etmək sonradan üzərinə yazılacaq — həmişə mənbə partial fayllarını dəyişdirin.

## Arxitektura

### SCSS strukturu

İdxal sırası `assets/scss/main.scss` faylında mərkəzləşdirilib. Partial fayllar rollarına görə təşkil olunub:

| Qovluq | Məzmun | Qeydlər |
|---|---|---|
| `abstracts/` | `_mixin.scss`, `_variables.scss`, `_functions.scss` | CSS çıxışı yoxdur; ilk idxal olunur |
| `base/` | `_reset.scss`, `_typograpy.scss`, `_dark-mode.scss` | `_dark-mode.scss` **sonuncu** idxal olunur ki, override-ləri üstün gəlsin |
| `components/` | `_buttons.scss`, `_slider.scss`, `_theme-toggle.scss`, `_cart.scss`, `_modal.scss`, `_page-loader.scss` | Təkrar istifadə olunan UI hissələri |
| `layouts/` | `_header.scss`, `_navigation.scss`, `_footer.scss`, `_forms.scss`, `_menu.scss` | Bütün səhifələrdə paylaşılan struktur elementləri |
| `pages/` | `_home.scss`, `_story.scss`, `_chefs.scss`, `_product.scss`, `_contact.scss` | Hər səhifə üçün ayrı partial, səhifəyə xas stillər |

Qaranlıq rejim `<html>` üzərindəki `[data-theme="dark"]` atributu vasitəsilə tətbiq olunur. Yeni komponent və ya rəng əlavə edərkən, ikinci rəng sxemini kod daxilində sabitləmək əvəzinə, uyğun override-ləri `base/_dark-mode.scss` faylına əlavə edin.

### JavaScript

Bundler/modul yoxdur — `script.js` və `slider.js` adi `<script>` taqları kimi yüklənir. Hər səhifənin aşağı hissəsindəki `<script>` daxiletmələrini yoxlayın, çünki bütün səhifələrə `slider.js` lazım deyil. Swiper.js və Font Awesome hər səhifənin `<head>` hissəsində CDN-dən çəkilir.

**`script.js`** bir neçə müstəqil funksionallığı birləşdirir:

- **Səhifə yükləyicisi / keçid** — yüklənmə zamanı saxta yükləmə ekranı; eyni səhifəyə aid `.html` link kliklərini tutub səhifələr arasında animasiyalı keçid edir (`PAGE_TRANSITION_DELAY`).
- **Mobil naviqasiya açarı** — `.bars` hamburger düyməsi `.nav-list`-i aç/bağla edir.
- **Skrolla reaksiya verən naviqasiya** — `250px`-dən çox skroll edildikdə `.nav`-a `.active` sinfi əlavə olunur.
- **Qaranlıq rejim açarı** — tema, hər səhifənin `<head>` hissəsindəki inline anti-flash `<script>` tərəfindən rəngin çəkilməsindən əvvəl təyin olunur (`localStorage.theme` oxunur); sonra `script.js` `.theme-toggle` düyməsini `data-theme` atributunu dəyişmək və seçimi yadda saxlamaq üçün bağlayır.
- **Səbət sistemi** — yalnız client tərəfində işləyir, `localStorage`-da `steakin_cart` açarı altında saxlanılır. Səbət paneli/overlay markup-u dinamik olaraq JS-də yaradılır (HTML-də yoxdur). `.card-button` elementləri ən yaxın `.card`-dan `.name` / `.price` mətn məzmununu oxuyur, ona görə də məhsul kartları səbətə əlavə etmənin işləməsi üçün `.card > .name`, `.card > .price` strukturunu saxlamalıdır.
- **Masa sifariş modalı** — yalnız səhifədə `.book-table-trigger` elementləri olduqda işə düşür (hazırda `index.html`); modal markup-u da dinamik olaraq JS-də yaradılır.

**`slider.js`** yalnız Swiper instansiyalarını konfiqurasiya edir: `.card-swiper`, `.award-slider`, `.quoteSlider`, `.customer-slider`. Yalnız bu elementləri özündə saxlayan səhifələrə daxil edin.

### Tema / qaranlıq rejim axını

1. Hər səhifənin `<head>` hissəsindəki inline anti-flash `<script>` `localStorage.theme`-i oxuyur və ilk render-dən əvvəl `<html>` üzərində `data-theme="dark"` təyin edir (yanlış temanın anlıq görünməsinin qarşısını alır).
2. `script.js` `.theme-toggle` üzərində klik hadisəsi bağlayır ki, atributu dəyişdirsin və yeni dəyəri `localStorage`-a yazsın.
3. `base/_dark-mode.scss` `main.scss`-də sonuncu idxal olunur ki, `[data-theme="dark"]` override-ləri əsas stillərdən üstün olsun.

Yeni HTML səhifə əlavə edərkən, anti-flash kodunu mövcud səhifənin `<head>` hissəsindən eynilə köçürün.

## Layihə strukturu

```
Steakin---template/
├── index.html              # Ana səhifə
├── chefs.html               # Aşpazlar / komanda səhifəsi
├── menuboard.html            # Menyu lövhəsi
├── story.html                # Haqqımızda / hekayəmiz
├── products.html             # Səbətə əlavə etmə kartları olan məhsullar
├── contact.html               # Əlaqə forması
├── script.js                  # Səhifə yükləyicisi, naviqasiya, qaranlıq rejim, səbət, rezervasiya modalı
├── slider.js                  # Swiper slider konfiqurasiyaları
├── assets/
│   └── scss/
│       ├── main.scss          # İdxal giriş nöqtəsi (main.css-ə compile olunur)
│       ├── main.css           # Compile edilmiş çıxış (commit olunub)
│       ├── abstracts/         # Dəyişənlər, mixin-lər, funksiyalar
│       ├── base/              # Reset, tipoqrafiya, qaranlıq rejim
│       ├── components/        # Düymələr, slider, tema açarı, səbət, modal, page loader
│       ├── layouts/            # Header, naviqasiya, footer, formalar, menyu
│       └── pages/              # Hər səhifəyə xas stillər
├── images/                    # Məhsul, komanda, müştəri, müştəri-loqo və fon şəkilləri
└── CLAUDE.md                  # Bu repository ilə işləmək üçün təlimat qeydləri
```

## Konvensiyalar

- Paket meneceri, linter/formatter konfiqurasiyası, test dəsti yoxdur — HTML fayllarını brauzerdə açmaqdan və ya qovluğu statik şəkildə servis etməkdən başqa "işə salınacaq" heç nə yoxdur.
- Yeni səhifələri mövcud olanlarla uyğun saxlayın: paylaşılan `<head>` boilerplate-ni (anti-flash tema skripti, `main.css` linki, Font Awesome, Swiper CSS), naviqasiya markup-unu və footer-i yenidən yazmaq əvəzinə mövcud səhifədən köçürün.
- `script.js`-i genişləndirərkən, yeni funksionallığı mövcud kodla qarışdırmadan ayrıca, aydın şəkildə bölünmüş blokda saxlayın.
