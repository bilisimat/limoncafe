/* =========================================================
   Limos Kahvaltı — çoklu dil (TR / EN / AR / DE)
   Strateji: orijinal Türkçe metin anahtar olarak tutulur,
   sözlükte karşılığı yoksa metin Türkçe kalır (no-op).
   ========================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "limosLang";
  var LANGS = ["tr", "en", "ar", "de"];
  var LANG_LABEL = { tr: "TR", en: "EN", ar: "AR", de: "DE" };
  var LANG_NAME = {
    tr: "Türkçe", en: "English", ar: "العربية", de: "Deutsch"
  };

  /* ---------- Genel arayüz metinleri (menü + ortak) ---------- */
  var TEXT = {
    "İçeriğe geç": { en: "Skip to content", de: "Zum Inhalt springen", ar: "الانتقال إلى المحتوى" },
    "Kahvaltı": { en: "Breakfast", de: "Frühstück", ar: "الفطور" },
    "Menü": { en: "Menu", de: "Speisekarte", ar: "القائمة" },
    "Galeri": { en: "Gallery", de: "Galerie", ar: "المعرض" },
    "Yorumlar": { en: "Reviews", de: "Bewertungen", ar: "التقييمات" },
    "İletişim": { en: "Contact", de: "Kontakt", ar: "تواصل" },
    "Rezervasyon & Bilgi": { en: "Reservation & Info", de: "Reservierung & Info", ar: "الحجز والمعلومات" },
    "Yol Tarifi": { en: "Directions", de: "Route", ar: "الاتجاهات" },
    "Bizi Arayın": { en: "Call Us", de: "Anrufen", ar: "اتصل بنا" },
    "Menüyü aç / kapat": { en: "Open / close menu", de: "Menü öffnen / schließen", ar: "فتح / إغلاق القائمة" },
    "Yukarı çık": { en: "Back to top", de: "Nach oben", ar: "العودة للأعلى" },
    "Kapat": { en: "Close", de: "Schließen", ar: "إغلاق" },
    "Hızlı erişim": { en: "Quick access", de: "Schnellzugriff", ar: "الوصول السريع" },
    "Ana menü": { en: "Main menu", de: "Hauptmenü", ar: "القائمة الرئيسية" },
    "Kategoriler arası gezinme": { en: "Navigate between categories", de: "Zwischen Kategorien wechseln", ar: "التنقل بين الفئات" },
    "Ara": { en: "Call", de: "Anrufen", ar: "اتصال" },
    "Konum": { en: "Location", de: "Standort", ar: "الموقع" },
    "Masada görüşürüz.": { en: "See you at the table.", de: "Wir sehen uns am Tisch.", ar: "نراكم على المائدة." },
    "Beşiktaş Sinanpaşa'da, kahvaltı sokağında. Serpme ve à la carte kahvaltı, taze pişiler ve demli çay.": {
      en: "In Beşiktaş Sinanpaşa, on breakfast street. Sharing and à la carte breakfast, fresh pişi and brewed tea.",
      de: "In Beşiktaş Sinanpaşa, in der Frühstücksstraße. Serpme- und à-la-carte-Frühstück, frisches Pişi und aufgebrühter Tee.",
      ar: "في سينان باشا ببشيكطاش، في شارع الفطور. فطور سربمة وأطباق فردية، بيشي طازج وشاي مغلي."
    },
    "Keşfet": { en: "Explore", de: "Entdecken", ar: "استكشف" },
    "Alt menü": { en: "Footer menu", de: "Fußzeilenmenü", ar: "قائمة إضافية" },
    "Her gün · 18:00'de kapanır": { en: "Open daily · closes at 18:00", de: "Täglich geöffnet · schließt um 18:00 Uhr", ar: "يومياً · يُغلق الساعة ١٨:٠٠" },
    "Tüm hakları saklıdır.": { en: "All rights reserved.", de: "Alle Rechte vorbehalten.", ar: "جميع الحقوق محفوظة." },
    "Google Haritalar'da aç": { en: "Open in Google Maps", de: "In Google Maps öffnen", ar: "افتح في خرائط جوجل" },
    "Instagram — @limoskahvalti": { en: "Instagram — @limoskahvalti", de: "Instagram — @limoskahvalti", ar: "إنستغرام — @limoskahvalti" },

    /* menu.html */
    "Sofradaki her şey.": { en: "Everything on the table.", de: "Alles, was auf den Tisch gehört.", ar: "كل ما تحتاجه على المائدة." },
    "Serpme tabaklarda ilk çay ikramımızdır. Bir kategori seçin.": {
      en: "First tea is on us with sharing plates. Choose a category.",
      de: "Bei Serpme-Tellern geht der erste Tee auf uns. Wählen Sie eine Kategorie.",
      ar: "الشاي الأول ضيافة منّا مع أطباق سربمة. اختر فئة."
    },

    /* kategori sayfası ortak parçalar */
    "← Tüm menü": { en: "← All menu", de: "← Ganzes Menü", ar: "← كل القائمة" },
    "Kategoriler": { en: "Categories", de: "Kategorien", ar: "الفئات" },
    "← Önceki": { en: "← Previous", de: "← Zurück", ar: "→ السابق" },
    "Sonraki →": { en: "Next →", de: "Weiter →", ar: "التالي ←" },

    /* breadcrumb (Menü · 0X / 10) */
    "Menü · 01 / 10": { en: "Menu · 01 / 10", de: "Speisekarte · 01 / 10", ar: "القائمة · ٠١ / ١٠" },
    "Menü · 02 / 10": { en: "Menu · 02 / 10", de: "Speisekarte · 02 / 10", ar: "القائمة · ٠٢ / ١٠" },
    "Menü · 03 / 10": { en: "Menu · 03 / 10", de: "Speisekarte · 03 / 10", ar: "القائمة · ٠٣ / ١٠" },
    "Menü · 04 / 10": { en: "Menu · 04 / 10", de: "Speisekarte · 04 / 10", ar: "القائمة · ٠٤ / ١٠" },
    "Menü · 05 / 10": { en: "Menu · 05 / 10", de: "Speisekarte · 05 / 10", ar: "القائمة · ٠٥ / ١٠" },
    "Menü · 06 / 10": { en: "Menu · 06 / 10", de: "Speisekarte · 06 / 10", ar: "القائمة · ٠٦ / ١٠" },
    "Menü · 07 / 10": { en: "Menu · 07 / 10", de: "Speisekarte · 07 / 10", ar: "القائمة · ٠٧ / ١٠" },
    "Menü · 08 / 10": { en: "Menu · 08 / 10", de: "Speisekarte · 08 / 10", ar: "القائمة · ٠٨ / ١٠" },
    "Menü · 09 / 10": { en: "Menu · 09 / 10", de: "Speisekarte · 09 / 10", ar: "القائمة · ٠٩ / ١٠" },
    "Menü · 10 / 10": { en: "Menu · 10 / 10", de: "Speisekarte · 10 / 10", ar: "القائمة · ١٠ / ١٠" },

    /* pişiler h1 (nested <small>) */
    "Pişiler <small>(4 Adet)</small>": { en: "Pişi <small>(4 pcs)</small>", de: "Pişi <small>(4 Stück)</small>", ar: "بيشي <small>(٤ قطع)</small>" }
  };

  /* ---------- Kategori adları / açıklamaları ---------- */
  /* key = TR ad; name aynı anahtar hem başlık hem sidebar hem prevnext için kullanılır */
  var CAT = {
    "Serpme & Tabaklar": {
      name: { en: "Sharing & Plates", de: "Serpme & Teller", ar: "سربمة وأطباق" },
      listDesc: {
        tr: "Serpme kahvaltılar ve tek kişilik tabaklar. İlk çay ikramımızdır.",
        en: "Sharing breakfasts and single-person plates. First tea is on us.",
        de: "Serpme-Frühstück zum Teilen und Teller für eine Person. Der erste Tee geht auf uns.",
        ar: "فطور سربمة للمشاركة وأطباق فردية. الشاي الأول ضيافة منّا."
      },
      blurb: {
        tr: "Sofranın tamamı: serpme kahvaltılar ve tek kişilik tabaklar. İlk çay ikramımızdır.",
        en: "The whole table: sharing breakfasts and single-person plates. First tea is on us.",
        de: "Der ganze Tisch: Serpme-Frühstück zum Teilen und Teller für eine Person. Der erste Tee geht auf uns.",
        ar: "المائدة كاملة: فطور سربمة للمشاركة وأطباق فردية. الشاي الأول ضيافة منّا."
      }
    },
    "Menemenler": {
      name: { en: "Menemen", de: "Menemen", ar: "منمن" },
      listDesc: {
        tr: "Tereyağında domates-biber, üstüne yumurta; klasikten kavurmalıya.",
        en: "Tomato-pepper sautéed in butter, topped with egg; from classic to seasoned.",
        de: "Tomate-Paprika in Butter geschmort, mit Ei; vom Klassiker bis würzig.",
        ar: "طماطم وفلفل يُطهيان بالزبدة، مع البيض؛ من الكلاسيكي إلى المتبل."
      },
      blurb: { same: true }
    },
    "Sahanda Yumurtalar": {
      name: { en: "Pan-Fried Eggs", de: "Pfannenspiegeleier", ar: "بيض بالمقلاة" },
      listDesc: {
        tr: "Bakır sahanda; sadeden sucuklu, sosisli, kavurmalıya.",
        en: "In a copper pan; from plain to sujuk, sausage, or seasoned mince.",
        de: "In der Kupferpfanne; pur bis mit Sucuk, Würstchen oder Kavurma.",
        ar: "في مقلاة نحاسية؛ من السادة إلى السجق والنقانق والقاورما."
      },
      blurb: {
        tr: "Bakır sahanda pişen yumurta; sadeden sucuklu, sosisli, kavurmalıya.",
        en: "Eggs cooked in a copper pan; from plain to sujuk, sausage, or seasoned mince.",
        de: "In der Kupferpfanne gebratene Eier; pur bis mit Sucuk, Würstchen oder Kavurma.",
        ar: "بيض يُطهى في مقلاة نحاسية؛ من السادة إلى السجق والنقانق والقاورما."
      }
    },
    "Omletler": {
      name: { en: "Omelettes", de: "Omeletts", ar: "أومليت" },
      listDesc: {
        tr: "Kabaran omlet; kaşarlı, sucuklu, kıymalı, karışık.",
        en: "Fluffy omelette; with cheese, sujuk, minced meat, or mixed.",
        de: "Fluffiges Omelett; mit Käse, Sucuk, Hackfleisch oder gemischt.",
        ar: "أومليت هش؛ بالجبن أو السجق أو اللحم المفروم أو مشكّل."
      },
      blurb: {
        tr: "Bakır tavada kabaran omlet; kaşarlı, sucuklu, kıymalı, karışık.",
        en: "Fluffy omelette from the copper pan; with cheese, sujuk, minced meat, or mixed.",
        de: "Fluffiges Omelett aus der Kupferpfanne; mit Käse, Sucuk, Hackfleisch oder gemischt.",
        ar: "أومليت هش من المقلاة النحاسية؛ بالجبن أو السجق أو اللحم المفروم أو مشكّل."
      }
    },
    "Tavalar": {
      name: { en: "Skillets", de: "Pfannengerichte", ar: "مقالي" },
      listDesc: {
        tr: "Bakır tavada sıcacık: mıhlama, sucuk, kavurma, sigara böreği.",
        en: "Warm from the copper pan: mıhlama, sujuk, kavurma, cigar börek.",
        de: "Warm aus der Kupferpfanne: Mıhlama, Sucuk, Kavurma, Cigarettenbörek.",
        ar: "دافئة من المقلاة النحاسية: مِهلاما، سجق، قاورما، بوريك السيجار."
      },
      blurb: { same: true }
    },
    "Pişiler": {
      name: { en: "Pişi", de: "Pişi", ar: "بيشي" },
      listDesc: {
        tr: "Tavadan yeni çıkmış, içi hava gibi çıtır pişiler.",
        en: "Fresh from the pan, light and crispy inside.",
        de: "Frisch aus der Pfanne, innen luftig-knusprig.",
        ar: "مقلية طازجة، هشة من الداخل."
      },
      blurb: {
        tr: "Tavadan yeni çıkmış, içi hava gibi 4 adet çıtır pişi.",
        en: "Fresh from the pan, 4 pieces of light, crispy pişi.",
        de: "Frisch aus der Pfanne, 4 Stück luftig-knuspriges Pişi.",
        ar: "٤ قطع بيشي طازجة من المقلاة، هشة من الداخل."
      }
    },
    "Gözlemeler": {
      name: { en: "Gözleme", de: "Gözleme", ar: "غوزلمة" },
      listDesc: {
        tr: "İnce açılmış hamur, sacda; peynirli, patatesli, kavurmalı.",
        en: "Thin dough on a griddle; with cheese, potato, or kavurma.",
        de: "Dünn ausgerollter Teig vom Blech; mit Käse, Kartoffel oder Kavurma.",
        ar: "عجين رقيق على الصاج؛ بالجبن أو البطاطس أو القاورما."
      },
      blurb: { same: true }
    },
    "Krep & Pankek Çeşitleri": {
      name: { en: "Crêpes & Pancakes", de: "Crêpes & Pancakes", ar: "كريب وبان كيك" },
      listDesc: {
        tr: "Nutellalı krep ve tereyağlı pankek çeşitleri.",
        en: "Nutella crêpes and buttery pancake varieties.",
        de: "Nutella-Crêpes und buttrige Pancake-Variationen.",
        ar: "كريب بالنوتيلا وأنواع بان كيك بالزبدة."
      },
      blurb: { same: true }
    },
    "Ekstralar": {
      name: { en: "Extras", de: "Extras", ar: "إضافات" },
      listDesc: {
        tr: "Sofraya eklemelik: peynirler, bal-kaymak, zeytin, söğüş.",
        en: "To add to the table: cheeses, honey & clotted cream, olives, sliced vegetables.",
        de: "Zum Ergänzen: Käsesorten, Honig-Kaymak, Oliven, Rohkost.",
        ar: "لإثراء المائدة: أجبان، عسل وقشطة، زيتون، خضار طازجة."
      },
      blurb: { same: true }
    },
    "İçecekler": {
      name: { en: "Drinks", de: "Getränke", ar: "مشروبات" },
      listDesc: {
        tr: "Sınırsız demli çay, taze sıkma portakal ve tüm kahveler.",
        en: "Unlimited brewed tea, fresh orange juice and all coffees.",
        de: "Unbegrenzt Tee, frisch gepresster Orangensaft und alle Kaffeesorten.",
        ar: "شاي مغلي غير محدود، عصير برتقال طازج وجميع أنواع القهوة."
      },
      blurb: { same: true }
    }
  };
  // "same: true" olan blurb'lar listDesc ile aynı metni paylaşır
  Object.keys(CAT).forEach(function (k) {
    if (CAT[k].blurb && CAT[k].blurb.same) CAT[k].blurb = CAT[k].listDesc;
  });

  /* ---------- Menü ürünleri: TR ad -> {en,de,ar}{name,desc} ---------- */
  var ITEM = {
    "Limos Serpme Kahvaltı": { en: { n: "Limos Sharing Breakfast", d: "A selection of cheeses, honey, clotted cream, homemade jams, olives and breakfast mezze, with a hot plate on the side. Unlimited tea included." }, de: { n: "Limos Serpme-Frühstück", d: "Käseauswahl, Honig, Kaymak, hausgemachte Marmeladen, Oliven und Frühstücksmezze; dazu ein warmer Teller. Unbegrenzt Tee inklusive." }, ar: { n: "فطور ليموس سربمة", d: "تشكيلة أجبان، عسل، قشطة، مربيات منزلية، زيتون ومقبلات فطور؛ مع طبق ساخن جانبي. شاي غير محدود ضمن الطلب." } },
    "Full Serpme Kahvaltı": { en: { n: "Full Sharing Breakfast", d: "Everything in the Limos Sharing plus buttery village-style menemen, mıhlama, sujuk skillet and pişi. Unlimited tea included." }, de: { n: "Full Serpme-Frühstück", d: "Alles vom Limos Serpme plus buttriges Dorf-Menemen, Mıhlama, Sucuk-Pfanne und Pişi. Unbegrenzt Tee inklusive." }, ar: { n: "فطور فُل سربمة", d: "كل ما في فطور ليموس سربمة، إضافة إلى منمن قروي بالزبدة، مِهلاما، سجق بالمقلاة وبيشي. شاي غير محدود ضمن الطلب." } },
    "Special Serpme Kahvaltı": { en: { n: "Special Sharing Breakfast", d: "A wide cheese and mezze selection, seasonal produce and an enriched hot plate. Unlimited tea included." }, de: { n: "Special Serpme-Frühstück", d: "Große Käse- und Mezzeauswahl, saisonale Produkte und ein reichhaltiger warmer Teller. Unbegrenzt Tee inklusive." }, ar: { n: "فطور سبيشل سربمة", d: "تشكيلة واسعة من الأجبان والمقبلات، منتجات موسمية وطبق ساخن غني. شاي غير محدود ضمن الطلب." } },
    "Kahvaltı Tabağı": { en: { n: "Breakfast Plate", d: "For one. Ezine white cheese, fresh kaşar, tomato, cucumber, Erzincan honey, buffalo clotted cream, homemade jam, black and green olives, omelette and one cigar börek. First tea is on us." }, de: { n: "Frühstücksteller", d: "Für eine Person. Ezine-Weißkäse, frischer Kaşar, Tomate, Gurke, Erzincan-Honig, Büffel-Kaymak, hausgemachte Marmelade, schwarze und grüne Oliven, Omelett und ein Cigarettenbörek. Der erste Tee geht auf uns." }, ar: { n: "طبق الفطور", d: "لشخص واحد. جبنة إزينة البيضاء، كاشار طازج، طماطم، خيار، عسل أرزنجان، قشطة الجاموس، مربى منزلي، زيتون أسود وأخضر، أومليت وقطعة بوريك سيجار واحدة. الشاي الأول ضيافة منّا." } },
    "Pişi Tabağı": { en: { n: "Pişi Plate", d: "For one. Three plain pişi, tomato, cucumber, Ezine white cheese, homemade jam, black and green olives. First tea is on us." }, de: { n: "Pişi-Teller", d: "Für eine Person. Drei Pişi, Tomate, Gurke, Ezine-Weißkäse, hausgemachte Marmelade, schwarze und grüne Oliven. Der erste Tee geht auf uns." }, ar: { n: "طبق البيشي", d: "لشخص واحد. ثلاث قطع بيشي سادة، طماطم، خيار، جبنة إزينة البيضاء، مربى منزلي، زيتون أسود وأخضر. الشاي الأول ضيافة منّا." } },

    "Klasik Menemen": { en: { n: "Classic Menemen", d: "Tomato and green pepper cooked in butter, bound with egg. Served hot in a copper pan." }, de: { n: "Klassisches Menemen", d: "Tomate und grüne Paprika in Butter geschmort, mit Ei gebunden. Heiß serviert in der Kupferpfanne." }, ar: { n: "منمن كلاسيكي", d: "طماطم وفلفل أخضر يُطهيان بالزبدة، ويُضاف البيض. يُقدَّم ساخناً في مقلاة نحاسية." } },
    "Kaşarlı Menemen": { en: { n: "Menemen with Kaşar", d: "Plenty of fresh kaşar cheese melted over the classic menemen." }, de: { n: "Menemen mit Kaşar", d: "Reichlich frischer Kaşar-Käse, in der Pfanne über dem klassischen Menemen geschmolzen." }, ar: { n: "منمن بالكاشار", d: "جبنة كاشار طازجة وفيرة تُذاب فوق المنمن الكلاسيكي." } },
    "Beyaz Peynirli Menemen": { en: { n: "White Cheese Menemen", d: "Menemen made with Ezine white cheese. Served with fresh bread." }, de: { n: "Menemen mit Weißkäse", d: "Menemen mit Ezine-Weißkäse. Serviert mit frischem Brot." }, ar: { n: "منمن بالجبنة البيضاء", d: "منمن مُحضَّر بجبنة إزينة البيضاء. يُقدَّم مع خبز طازج." } },
    "Karışık Menemen": { en: { n: "Mixed Menemen", d: "Tomato, pepper, sujuk, kavurma and kaşar cooked together." }, de: { n: "Gemischtes Menemen", d: "Tomate, Paprika, Sucuk, Kavurma und Kaşar gemeinsam geschmort." }, ar: { n: "منمن مشكّل", d: "طماطم، فلفل، سجق، قاورما وكاشار تُطهى معاً." } },
    "Kavurmalı Menemen": { en: { n: "Menemen with Kavurma", d: "Hand-cured kavurma, sautéed in its own fat, added to the menemen." }, de: { n: "Menemen mit Kavurma", d: "Handgemachte Kavurma, im eigenen Fett angebraten und zum Menemen gegeben." }, ar: { n: "منمن بالقاورما", d: "قاورما يدوية الصنع تُشوى بدهنها وتُضاف إلى المنمن." } },
    "Sucuklu Menemen": { en: { n: "Menemen with Sujuk", d: "Sliced sujuk fried in the pan and cooked together with the menemen." }, de: { n: "Menemen mit Sucuk", d: "In Scheiben geschnittene Sucuk wird angebraten und mit dem Menemen zusammen gegart." }, ar: { n: "منمن بالسجق", d: "شرائح سجق تُقلى في المقلاة وتُطهى مع المنمن." } },
    "Sosisli Menemen": { en: { n: "Menemen with Sausage", d: "Sliced beef sausage fried in the pan and cooked together with the menemen." }, de: { n: "Menemen mit Würstchen", d: "In Scheiben geschnittene Rinderwürstchen werden angebraten und mit dem Menemen zusammen gegart." }, ar: { n: "منمن بالنقانق", d: "شرائح نقانق بقري تُقلى في المقلاة وتُطهى مع المنمن." } },

    "Sade Yumurta": { en: { n: "Plain Fried Eggs", d: "Two eggs, cooked in butter in a copper pan." }, de: { n: "Pfannenspiegeleier pur", d: "Zwei Eier, in Butter in der Kupferpfanne gebraten." }, ar: { n: "بيض سادة بالمقلاة", d: "بيضتان تُطهيان بالزبدة في مقلاة نحاسية." } },
    "Kaşarlı Yumurta": { en: { n: "Fried Eggs with Kaşar", d: "Fresh kaşar cheese added over the pan-fried eggs." }, de: { n: "Spiegeleier mit Kaşar", d: "Frischer Kaşar-Käse über den Spiegeleiern." }, ar: { n: "بيض بالمقلاة والكاشار", d: "جبنة كاشار طازجة تُضاف فوق البيض المقلي." } },
    "Beyaz Peynirli Yumurta": { en: { n: "Fried Eggs with White Cheese", d: "Pan-fried eggs prepared with pieces of Ezine white cheese." }, de: { n: "Spiegeleier mit Weißkäse", d: "Spiegeleier mit Stücken von Ezine-Weißkäse." }, ar: { n: "بيض بالمقلاة والجبنة البيضاء", d: "بيض بالمقلاة مع قطع من جبنة إزينة البيضاء." } },
    "Sucuklu Yumurta": { en: { n: "Fried Eggs with Sujuk", d: "Eggs cracked over sujuk slices fried in the copper pan." }, de: { n: "Spiegeleier mit Sucuk", d: "Eier über in der Kupferpfanne gebratenen Sucuk-Scheiben." }, ar: { n: "بيض بالمقلاة والسجق", d: "يُكسر البيض فوق شرائح السجق المقلية في المقلاة النحاسية." } },
    "Sosisli Yumurta": { en: { n: "Fried Eggs with Sausage", d: "Beef sausage slices fried in the pan, eggs cracked on top." }, de: { n: "Spiegeleier mit Würstchen", d: "Rinderwürstchen-Scheiben in der Pfanne gebraten, Eier darüber." }, ar: { n: "بيض بالمقلاة والنقانق", d: "شرائح نقانق بقري تُقلى في المقلاة ويُكسر البيض فوقها." } },
    "Patatesli Yumurta": { en: { n: "Fried Eggs with Potato", d: "Diced potato fried and cooked together with egg." }, de: { n: "Spiegeleier mit Kartoffel", d: "Kartoffelwürfel gebraten und zusammen mit Ei gegart." }, ar: { n: "بيض بالمقلاة والبطاطس", d: "مكعبات بطاطس مقلية تُطهى مع البيض." } },
    "Kavurmalı Yumurta": { en: { n: "Fried Eggs with Kavurma", d: "Egg cracked over kavurma sautéed in its own fat." }, de: { n: "Spiegeleier mit Kavurma", d: "Ei über im eigenen Fett angebratener Kavurma." }, ar: { n: "بيض بالمقلاة والقاورما", d: "يُكسر البيض فوق القاورما المشوية بدهنها." } },

    "Sade Omlet": { en: { n: "Plain Omelette", d: "Beaten eggs cooked in butter in a copper pan." }, de: { n: "Omelett pur", d: "Verquirlte Eier, in Butter in der Kupferpfanne gebraten." }, ar: { n: "أومليت سادة", d: "بيض مخفوق يُطهى بالزبدة في مقلاة نحاسية." } },
    "Kaşarlı Omlet": { en: { n: "Kaşar Omelette", d: "Omelette filled with fresh kaşar cheese." }, de: { n: "Omelett mit Kaşar", d: "Omelett gefüllt mit frischem Kaşar-Käse." }, ar: { n: "أومليت بالكاشار", d: "أومليت محشو بجبنة كاشار طازجة." } },
    "Beyaz Peynirli Omlet": { en: { n: "White Cheese Omelette", d: "Omelette prepared with Ezine white cheese and parsley." }, de: { n: "Omelett mit Weißkäse", d: "Omelett mit Ezine-Weißkäse und Petersilie." }, ar: { n: "أومليت بالجبنة البيضاء", d: "أومليت مُحضَّر بجبنة إزينة البيضاء والبقدونس." } },
    "Karışık Omlet": { en: { n: "Mixed Omelette", d: "Omelette prepared with sujuk, kaşar and pepper." }, de: { n: "Gemischtes Omelett", d: "Omelett mit Sucuk, Kaşar und Paprika." }, ar: { n: "أومليت مشكّل", d: "أومليت مُحضَّر بالسجق والكاشار والفلفل." } },
    "Sucuklu Omlet": { en: { n: "Sujuk Omelette", d: "Omelette folded with fried sujuk slices." }, de: { n: "Omelett mit Sucuk", d: "Omelett gefaltet mit gebratenen Sucuk-Scheiben." }, ar: { n: "أومليت بالسجق", d: "أومليت مطوي بشرائح السجق المقلية." } },
    "Sosisli Omlet": { en: { n: "Sausage Omelette", d: "Omelette prepared with pieces of beef sausage." }, de: { n: "Omelett mit Würstchen", d: "Omelett mit Stücken von Rinderwürstchen." }, ar: { n: "أومليت بالنقانق", d: "أومليت مُحضَّر بقطع النقانق البقري." } },
    "Patatesli Omlet": { en: { n: "Potato Omelette", d: "Omelette prepared with fried potato." }, de: { n: "Omelett mit Kartoffel", d: "Omelett mit gebratener Kartoffel." }, ar: { n: "أومليت بالبطاطس", d: "أومليت مُحضَّر بالبطاطس المقلية." } },
    "Kıymalı Omlet": { en: { n: "Minced Meat Omelette", d: "Omelette prepared with spiced sautéed minced meat." }, de: { n: "Omelett mit Hackfleisch", d: "Omelett mit gewürztem, angebratenem Hackfleisch." }, ar: { n: "أومليت باللحم المفروم", d: "أومليت مُحضَّر باللحم المفروم المتبل والمشوّح." } },
    "Kavurmalı Omlet": { en: { n: "Kavurma Omelette", d: "Omelette prepared with kavurma sautéed in its own fat." }, de: { n: "Omelett mit Kavurma", d: "Omelett mit im eigenen Fett angebratener Kavurma." }, ar: { n: "أومليت بالقاورما", d: "أومليت مُحضَّر بالقاورما المشوية بدهنها." } },

    "Mıhlama (Kuymak)": { en: { n: "Mıhlama (Kuymak)", d: "Made Black Sea-style with butter, corn flour and fresh cheese. Served hot in a copper pan." }, de: { n: "Mıhlama (Kuymak)", d: "Nach Schwarzmeer-Art mit Butter, Maismehl und frischem Käse. Heiß in der Kupferpfanne serviert." }, ar: { n: "مِهلاما (كويماك)", d: "تُحضَّر على طريقة البحر الأسود بالزبدة ودقيق الذرة والجبنة الطازجة. تُقدَّم ساخنة في مقلاة نحاسية." } },
    "Sucuk Tava": { en: { n: "Sujuk Skillet", d: "Sliced sujuk pan-fried in its own fat until the edges crisp up." }, de: { n: "Sucuk-Pfanne", d: "In Scheiben geschnittene Sucuk im eigenen Fett gebraten, bis die Ränder knusprig sind." }, ar: { n: "سجق بالمقلاة", d: "شرائح سجق تُقلى بدهنها حتى تحمّر الأطراف." } },
    "Sıcak Tabağı": { en: { n: "Hot Plate", d: "A hot selection of mıhlama, sujuk, hand-cut potato and cigar börek." }, de: { n: "Warmer Teller", d: "Warme Auswahl aus Mıhlama, Sucuk, handgeschnittener Kartoffel und Cigarettenbörek." }, ar: { n: "طبق ساخن", d: "تشكيلة ساخنة من المِهلاما، السجق، البطاطس المقطعة يدوياً وبوريك السيجار." } },
    "Kavurma Tava": { en: { n: "Kavurma Skillet", d: "Hand-cured kavurma sautéed in its own fat. Served with fresh bread." }, de: { n: "Kavurma-Pfanne", d: "Handgemachte Kavurma im eigenen Fett angebraten. Serviert mit frischem Brot." }, ar: { n: "قاورما بالمقلاة", d: "قاورما يدوية تُشوى بدهنها. تُقدَّم مع خبز طازج." } },
    "Hellim Tava": { en: { n: "Halloumi Skillet", d: "Halloumi cheese pan-fried, served with lemon." }, de: { n: "Halloumi-Pfanne", d: "Halloumi-Käse in der Pfanne gebraten, serviert mit Zitrone." }, ar: { n: "حلوم بالمقلاة", d: "جبنة الحلوم تُقلى في المقلاة وتُقدَّم مع الليمون." } },
    "Sosis Tava": { en: { n: "Sausage Skillet", d: "Beef sausage sliced and pan-fried." }, de: { n: "Würstchen-Pfanne", d: "Rinderwürstchen in Scheiben, in der Pfanne gebraten." }, ar: { n: "نقانق بالمقلاة", d: "نقانق بقري مقطّعة تُقلى في المقلاة." } },
    "Salçalı Sosis": { en: { n: "Sausage in Tomato Sauce", d: "Sausage cooked in the pan with tomato and pepper paste." }, de: { n: "Würstchen in Tomatensoße", d: "Würstchen in der Pfanne mit Tomaten- und Paprikamark gegart." }, ar: { n: "نقانق بالصلصة", d: "نقانق تُطهى في المقلاة مع معجون الطماطم والفلفل." } },
    "Anne Dilim Patates Tava": { en: { n: "Hand-Cut Potato Skillet", d: "Thick, hand-cut potato slices deep-fried." }, de: { n: "Handgeschnittene Kartoffel-Pfanne", d: "Dick von Hand geschnittene Kartoffelscheiben, frittiert." }, ar: { n: "بطاطس مقطّعة يدوياً", d: "شرائح بطاطس سميكة مقطّعة يدوياً وتُقلى في زيت وفير." } },
    "Sigara Böreği": { en: { n: "Cigar Börek", d: "Six thin pastries rolled with white cheese and parsley, then fried." }, de: { n: "Cigarettenbörek", d: "Sechs dünne, mit Weißkäse und Petersilie gefüllte und frittierte Teigröllchen." }, ar: { n: "بوريك السيجار", d: "ست قطع بوريك رفيعة محشوة بالجبنة البيضاء والبقدونس ومقلية." } },
    "Yumurtalı Ekmek": { en: { n: "Egg Bread", d: "Six slices of bread dipped in egg and fried in butter." }, de: { n: "Eierbrot", d: "Sechs Brotscheiben, in Ei getaucht und in Butter gebraten." }, ar: { n: "خبز بالبيض", d: "ست شرائح خبز تُغمس بالبيض وتُقلى بالزبدة." } },

    "Sade Pişi": { en: { n: "Plain Pişi", d: "Four hot pişi, made from yeast dough and fried to order." }, de: { n: "Pişi pur", d: "Vier heiße Pişi aus Hefeteig, frisch auf Bestellung frittiert." }, ar: { n: "بيشي سادة", d: "أربع قطع بيشي ساخنة من عجين مخمّر، تُقلى عند الطلب." } },
    "Kaşarlı Pişi": { en: { n: "Pişi with Kaşar", d: "Pişi fried with kaşar cheese inside." }, de: { n: "Pişi mit Kaşar", d: "Pişi mit Kaşar-Käse gefüllt und frittiert." }, ar: { n: "بيشي بالكاشار", d: "بيشي محشو بجبنة الكاشار ومقلي." } },
    "Beyaz Peynirli Pişi": { en: { n: "Pişi with White Cheese", d: "Pişi filled with Ezine white cheese." }, de: { n: "Pişi mit Weißkäse", d: "Pişi gefüllt mit Ezine-Weißkäse." }, ar: { n: "بيشي بالجبنة البيضاء", d: "بيشي محشو بجبنة إزينة البيضاء." } },
    "Sucuklu Pişi": { en: { n: "Pişi with Sujuk", d: "Pişi filled with fried sujuk." }, de: { n: "Pişi mit Sucuk", d: "Pişi gefüllt mit gebratener Sucuk." }, ar: { n: "بيشي بالسجق", d: "بيشي محشو بالسجق المقلي." } },
    "Nutella'lı Pişi": { en: { n: "Pişi with Nutella", d: "Pişi filled with Nutella, served hot." }, de: { n: "Pişi mit Nutella", d: "Pişi gefüllt mit Nutella, heiß serviert." }, ar: { n: "بيشي بالنوتيلا", d: "بيشي محشو بالنوتيلا، يُقدَّم ساخناً." } },
    "Kavurma Kaşarlı Pişi": { en: { n: "Pişi with Kavurma and Kaşar", d: "Pişi filled with kavurma and kaşar cheese." }, de: { n: "Pişi mit Kavurma und Kaşar", d: "Pişi gefüllt mit Kavurma und Kaşar-Käse." }, ar: { n: "بيشي بالقاورما والكاشار", d: "بيشي محشو بالقاورما وجبنة الكاشار." } },

    "Kaşarlı Gözleme": { en: { n: "Gözleme with Kaşar", d: "Thin dough filled with plenty of kaşar, cooked on a griddle." }, de: { n: "Gözleme mit Kaşar", d: "Dünn ausgerollter Teig mit reichlich Kaşar, auf dem Blech gebacken." }, ar: { n: "غوزلمة بالكاشار", d: "عجين رقيق محشو بكمية وفيرة من الكاشار، يُطهى على الصاج." } },
    "Beyaz Peynirli Gözleme": { en: { n: "Gözleme with White Cheese", d: "Gözleme prepared with Ezine white cheese and parsley." }, de: { n: "Gözleme mit Weißkäse", d: "Gözleme mit Ezine-Weißkäse und Petersilie." }, ar: { n: "غوزلمة بالجبنة البيضاء", d: "غوزلمة مُحضَّرة بجبنة إزينة البيضاء والبقدونس." } },
    "Patatesli Gözleme": { en: { n: "Gözleme with Potato", d: "Gözleme filled with spiced potato mash." }, de: { n: "Gözleme mit Kartoffel", d: "Gözleme gefüllt mit gewürztem Kartoffelpüree." }, ar: { n: "غوزلمة بالبطاطس", d: "غوزلمة محشوة بخليط البطاطس المتبل." } },
    "Patatesli Kaşarlı Gözleme": { en: { n: "Gözleme with Potato and Kaşar", d: "Gözleme filled with potato and kaşar cheese." }, de: { n: "Gözleme mit Kartoffel und Kaşar", d: "Gözleme gefüllt mit Kartoffel und Kaşar-Käse." }, ar: { n: "غوزلمة بالبطاطس والكاشار", d: "غوزلمة محشوة بالبطاطس وجبنة الكاشار." } },
    "Ispanaklı Gözleme": { en: { n: "Gözleme with Spinach", d: "Gözleme prepared with sautéed spinach and cheese." }, de: { n: "Gözleme mit Spinat", d: "Gözleme mit gedünstetem Spinat und Käse." }, ar: { n: "غوزلمة بالسبانخ", d: "غوزلمة مُحضَّرة بالسبانخ المشوّح والجبنة." } },
    "Kıymalı Gözleme": { en: { n: "Gözleme with Minced Meat", d: "Gözleme with spiced minced meat filling, cooked on a griddle." }, de: { n: "Gözleme mit Hackfleisch", d: "Gözleme mit gewürzter Hackfleischfüllung, auf dem Blech gebacken." }, ar: { n: "غوزلمة باللحم المفروم", d: "غوزلمة بحشوة اللحم المفروم المتبل، تُطهى على الصاج." } },
    "Sucuklu Gözleme": { en: { n: "Gözleme with Sujuk", d: "Gözleme prepared with sliced sujuk and spices." }, de: { n: "Gözleme mit Sucuk", d: "Gözleme mit Sucuk-Scheiben und Gewürzen." }, ar: { n: "غوزلمة بالسجق", d: "غوزلمة مُحضَّرة بشرائح السجق والتوابل." } },
    "Sucuklu Kaşarlı Gözleme": { en: { n: "Gözleme with Sujuk and Kaşar", d: "Gözleme filled with sujuk and kaşar cheese." }, de: { n: "Gözleme mit Sucuk und Kaşar", d: "Gözleme gefüllt mit Sucuk und Kaşar-Käse." }, ar: { n: "غوزلمة بالسجق والكاشار", d: "غوزلمة محشوة بالسجق وجبنة الكاشار." } },
    "Kavurmalı Kaşarlı Gözleme": { en: { n: "Gözleme with Kavurma and Kaşar", d: "Gözleme filled with kavurma and kaşar cheese." }, de: { n: "Gözleme mit Kavurma und Kaşar", d: "Gözleme gefüllt mit Kavurma und Kaşar-Käse." }, ar: { n: "غوزلمة بالقاورما والكاشار", d: "غوزلمة محشوة بالقاورما وجبنة الكاشار." } },

    "Sade Krep": { en: { n: "Plain Crêpe", d: "Thin crêpe, served with powdered sugar." }, de: { n: "Crêpe pur", d: "Dünner Crêpe, serviert mit Puderzucker." }, ar: { n: "كريب سادة", d: "كريب رقيق يُقدَّم مع سكر بودرة." } },
    "Nutella'lı Krep": { en: { n: "Nutella Crêpe", d: "Crêpe served with Nutella and seasonal fruit." }, de: { n: "Nutella-Crêpe", d: "Crêpe serviert mit Nutella und saisonalem Obst." }, ar: { n: "كريب بالنوتيلا", d: "كريب يُقدَّم مع النوتيلا والفواكه الموسمية." } },
    "Pankek": { en: { n: "Pancakes", d: "Four pancakes, served with butter, Nutella and seasonal fruit." }, de: { n: "Pancakes", d: "Vier Pancakes, serviert mit Butter, Nutella und saisonalem Obst." }, ar: { n: "بان كيك", d: "أربع قطع بان كيك تُقدَّم مع الزبدة والنوتيلا والفواكه الموسمية." } },

    "Beyaz Peynir": { en: { n: "White Cheese", d: "Full-fat Ezine white cheese, one slice." }, de: { n: "Weißkäse", d: "Vollfetter Ezine-Weißkäse, eine Scheibe." }, ar: { n: "جبنة بيضاء", d: "جبنة إزينة البيضاء كاملة الدسم، شريحة واحدة." } },
    "Kaşar Peyniri": { en: { n: "Kaşar Cheese", d: "Fresh kaşar, one slice." }, de: { n: "Kaşar-Käse", d: "Frischer Kaşar, eine Scheibe." }, ar: { n: "جبنة كاشار", d: "كاشار طازج، شريحة واحدة." } },
    "Çeçil Peynir": { en: { n: "Çeçil Cheese", d: "String (braided) çeçil cheese." }, de: { n: "Çeçil-Käse", d: "Gezupfter (geflochtener) Çeçil-Käse." }, ar: { n: "جبنة تشتشيل", d: "جبنة تشتشيل المضفّرة (خيوط)." } },
    "Karışık Peynir Tabağı": { en: { n: "Mixed Cheese Plate", d: "A cheese plate of white cheese, kaşar and çeçil." }, de: { n: "Gemischter Käseteller", d: "Käseteller aus Weißkäse, Kaşar und Çeçil." }, ar: { n: "طبق جبن مشكّل", d: "طبق جبن يضم الجبنة البيضاء والكاشار والتشتشيل." } },
    "Tereyağı": { en: { n: "Butter", d: "Village butter, served with honey and bread." }, de: { n: "Butter", d: "Landbutter, serviert mit Honig und Brot." }, ar: { n: "زبدة", d: "زبدة قروية، تُقدَّم مع العسل والخبز." } },
    "Bal & Kaymak": { en: { n: "Honey & Clotted Cream", d: "Strained flower honey and buffalo clotted cream." }, de: { n: "Honig & Kaymak", d: "Sortenreiner Blütenhonig und Büffel-Kaymak." }, ar: { n: "عسل وقشطة", d: "عسل زهور مصفّى وقشطة الجاموس." } },
    "Tahin Pekmez": { en: { n: "Tahini & Grape Molasses", d: "Tahini and grape molasses (pekmez)." }, de: { n: "Tahin-Pekmez", d: "Sesampaste (Tahin) und Traubensirup (Pekmez)." }, ar: { n: "طحينة ودبس", d: "طحينة ودبس العنب." } },
    "Reçel": { en: { n: "Jam", d: "Homemade seasonal jam." }, de: { n: "Marmelade", d: "Hausgemachte saisonale Marmelade." }, ar: { n: "مربى", d: "مربى منزلي موسمي." } },
    "Nutella": { en: { n: "Nutella", d: "A portion of Nutella." }, de: { n: "Nutella", d: "Eine Portion Nutella." }, ar: { n: "نوتيلا", d: "حصة من النوتيلا." } },
    "Zeytin Tabağı": { en: { n: "Olive Plate", d: "Spiced black olives and cracked green olives." }, de: { n: "Oliventeller", d: "Gewürzte schwarze Oliven und angeschlagene grüne Oliven." }, ar: { n: "طبق زيتون", d: "زيتون أسود متبل وزيتون أخضر مكسور." } },
    "Söğüş": { en: { n: "Sliced Vegetables", d: "Tomato, cucumber, pepper and parsley." }, de: { n: "Rohkost", d: "Tomate, Gurke, Paprika und Petersilie." }, ar: { n: "خضار طازجة", d: "طماطم، خيار، فلفل وبقدونس." } },
    "Yeşillik": { en: { n: "Greens", d: "Lettuce, arugula, parsley and fresh onion." }, de: { n: "Grünzeug", d: "Salat, Rucola, Petersilie und frische Zwiebel." }, ar: { n: "خضرة", d: "خس، جرجير، بقدونس وبصل طازج." } },
    "Acuka": { en: { n: "Acuka", d: "An Antakya-style mezze made with walnuts, pepper paste and spices." }, de: { n: "Acuka", d: "Antakya-Mezze aus Walnüssen, Paprikamark und Gewürzen." }, ar: { n: "عجوقة", d: "مقبّلات أنطاكية من الجوز ومعجون الفلفل والتوابل." } },
    "Biber Kızartması": { en: { n: "Fried Peppers", d: "Fried green peppers, served with garlic yoghurt." }, de: { n: "Gebratene Paprika", d: "Gebratene spitze Paprika, serviert mit Knoblauchjoghurt." }, ar: { n: "فلفل مقلي", d: "فلفل حار مقلي، يُقدَّم مع اللبن بالثوم." } },
    "Yoğurt": { en: { n: "Yoghurt", d: "A portion of strained yoghurt." }, de: { n: "Joghurt", d: "Eine Portion griechischer Joghurt." }, ar: { n: "لبن", d: "حصة من اللبن المصفّى." } },
    "Haşlanmış Yumurta": { en: { n: "Boiled Egg", d: "One boiled egg." }, de: { n: "Gekochtes Ei", d: "Ein gekochtes Ei." }, ar: { n: "بيضة مسلوقة", d: "بيضة مسلوقة واحدة." } },
    "Simit": { en: { n: "Simit", d: "Daily-baked sesame simit." }, de: { n: "Simit", d: "Frisches Sesam-Simit vom Tag." }, ar: { n: "سيميت", d: "سيميت طازج بالسمسم يُخبز يومياً." } },

    "Su": { en: { n: "Water", d: "0.5 litre spring water." }, de: { n: "Wasser", d: "0,5 Liter Quellwasser." }, ar: { n: "ماء", d: "٠٫٥ لتر مياه ينابيع." } },
    "Sade Soda": { en: { n: "Soda Water", d: "Bottled mineral water." }, de: { n: "Soda", d: "Mineralwasser in der Flasche." }, ar: { n: "صودا سادة", d: "مياه معدنية بالزجاجة." } },
    "Meyveli Soda": { en: { n: "Fruit Soda", d: "Fruit-flavoured mineral water." }, de: { n: "Frucht-Soda", d: "Mineralwasser mit Fruchtgeschmack." }, ar: { n: "صودا بالفواكه", d: "مياه معدنية بنكهة الفواكه." } },
    "Ayran": { en: { n: "Ayran", d: "Homemade yoghurt drink." }, de: { n: "Ayran", d: "Hausgemachtes Joghurtgetränk." }, ar: { n: "أيران", d: "مشروب اللبن المنزلي." } },
    "Coca-Cola": { en: { n: "Coca-Cola", d: "Can, 330 ml." }, de: { n: "Coca-Cola", d: "Dose, 330 ml." }, ar: { n: "كوكا كولا", d: "علبة، ٣٣٠ مل." } },
    "Coca-Cola Zero": { en: { n: "Coca-Cola Zero", d: "Sugar-free can, 330 ml." }, de: { n: "Coca-Cola Zero", d: "Zuckerfreie Dose, 330 ml." }, ar: { n: "كوكا كولا زيرو", d: "علبة خالية من السكر، ٣٣٠ مل." } },
    "Naneli Limonata": { en: { n: "Mint Lemonade", d: "Homemade lemonade with fresh lemon and mint." }, de: { n: "Minz-Limonade", d: "Hausgemachte Limonade mit frischer Zitrone und Minze." }, ar: { n: "ليموناضة بالنعناع", d: "ليموناضة منزلية بالليمون الطازج والنعناع." } },
    "Taze Sıkma Portakal Suyu": { en: { n: "Fresh Orange Juice", d: "Orange juice squeezed to order." }, de: { n: "Frisch gepresster Orangensaft", d: "Auf Bestellung frisch gepresster Orangensaft." }, ar: { n: "عصير برتقال طازج", d: "عصير برتقال يُعصر عند الطلب." } },
    "Karışık Meyve Suyu": { en: { n: "Mixed Fruit Juice", d: "Boxed fruit juice." }, de: { n: "Multivitaminsaft", d: "Fruchtsaft im Tetrapack." }, ar: { n: "عصير فواكه مشكّل", d: "عصير فواكه معلّب." } },
    "Vişne Suyu": { en: { n: "Sour Cherry Juice", d: "Boxed sour cherry juice." }, de: { n: "Sauerkirschsaft", d: "Sauerkirschsaft im Tetrapack." }, ar: { n: "عصير كرز حامض", d: "عصير كرز حامض معلّب." } },
    "Şeftali Suyu": { en: { n: "Peach Juice", d: "Boxed peach juice." }, de: { n: "Pfirsichsaft", d: "Pfirsichsaft im Tetrapack." }, ar: { n: "عصير خوخ", d: "عصير خوخ معلّب." } },
    "Ice Tea Şeftali": { en: { n: "Peach Ice Tea", d: "Peach-flavoured iced tea." }, de: { n: "Ice Tea Pfirsich", d: "Eistee mit Pfirsichgeschmack." }, ar: { n: "شاي مثلج بالخوخ", d: "شاي بارد بنكهة الخوخ." } },
    "Ice Tea Limon": { en: { n: "Lemon Ice Tea", d: "Lemon-flavoured iced tea." }, de: { n: "Ice Tea Zitrone", d: "Eistee mit Zitronengeschmack." }, ar: { n: "شاي مثلج بالليمون", d: "شاي بارد بنكهة الليمون." } },
    "Süt": { en: { n: "Milk", d: "A glass of milk, hot or cold." }, de: { n: "Milch", d: "Ein Glas Milch, warm oder kalt." }, ar: { n: "حليب", d: "كوب حليب، ساخن أو بارد." } },
    "Çay": { en: { n: "Tea", d: "Freshly brewed Turkish tea." }, de: { n: "Tee", d: "Frisch aufgebrühter türkischer Tee." }, ar: { n: "شاي", d: "شاي تركي مغلي طازج." } },
    "Türk Kahvesi": { en: { n: "Turkish Coffee", d: "Stove-brewed Turkish coffee, served with Turkish delight." }, de: { n: "Türkischer Kaffee", d: "Auf dem Herd gekochter türkischer Kaffee, mit Lokum serviert." }, ar: { n: "قهوة تركية", d: "قهوة تركية تُحضَّر على الموقد، تُقدَّم مع الحلقوم." } },
    "Espresso": { en: { n: "Espresso", d: "Single shot espresso." }, de: { n: "Espresso", d: "Espresso, einfacher Shot." }, ar: { n: "إسبريسو", d: "إسبريسو شوت واحد." } },
    "Americano": { en: { n: "Americano", d: "Espresso and hot water." }, de: { n: "Americano", d: "Espresso und heißes Wasser." }, ar: { n: "أمريكانو", d: "إسبريسو وماء ساخن." } },
    "Latte": { en: { n: "Latte", d: "Espresso and steamed milk." }, de: { n: "Latte", d: "Espresso und aufgeschäumte Milch." }, ar: { n: "لاتيه", d: "إسبريسو وحليب مبخّر." } },
    "Cappuccino": { en: { n: "Cappuccino", d: "Espresso, milk and milk foam." }, de: { n: "Cappuccino", d: "Espresso, Milch und Milchschaum." }, ar: { n: "كابتشينو", d: "إسبريسو وحليب ورغوة حليب." } },
    "Mocha": { en: { n: "Mocha", d: "Espresso, chocolate and milk." }, de: { n: "Mocha", d: "Espresso, Schokolade und Milch." }, ar: { n: "موكا", d: "إسبريسو وشوكولاتة وحليب." } },
    "Filtre Kahve": { en: { n: "Filter Coffee", d: "Filter coffee of the day." }, de: { n: "Filterkaffee", d: "Filterkaffee des Tages." }, ar: { n: "قهوة فلتر", d: "قهوة فلتر اليوم." } }
  };

  /* ---------- Yardımcılar ---------- */
  function getLang() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      if (v && LANGS.indexOf(v) > -1) return v;
    } catch (e) {}
    return "tr";
  }
  function setLang(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {}
  }

  function lookupText(orig, lang) {
    var e = TEXT[orig];
    if (e && e[lang]) return e[lang];
    return orig;
  }
  function lookupCatName(trName, lang) {
    var c = CAT[trName];
    if (c && c.name && c.name[lang]) return c.name[lang];
    return trName;
  }

  /* Element(ler)i tara: çocuğu yoksa textContent, varsa innerHTML üzerinden çevir. */
  function translateEls(nodeList, lang) {
    nodeList.forEach(function (el) {
      if (el.children.length === 0) {
        if (el.dataset.i18nOrig === undefined) el.dataset.i18nOrig = el.textContent;
        el.textContent = lookupText(el.dataset.i18nOrig, lang);
      } else {
        if (el.dataset.i18nOrig === undefined) el.dataset.i18nOrig = el.innerHTML;
        var e = TEXT[el.dataset.i18nOrig.trim()];
        if (e && e[lang]) el.innerHTML = e[lang];
        else if (lang === "tr") el.innerHTML = el.dataset.i18nOrig;
      }
    });
  }

  /* Sadece ilk metin düğümünü çevir (nested span'lı .cat-name için) */
  function translateLeadingText(nodeList, lang) {
    nodeList.forEach(function (el) {
      for (var i = 0; i < el.childNodes.length; i++) {
        var n = el.childNodes[i];
        if (n.nodeType === 3 && n.textContent.trim()) {
          if (el.dataset.i18nLead === undefined) el.dataset.i18nLead = n.textContent;
          n.textContent = lookupText(el.dataset.i18nLead.trim(), lang);
          break;
        }
      }
    });
  }

  /* Sadece son metin düğümünü çevir (footer copyright satırı için) */
  function translateTrailingText(nodeList, lang) {
    nodeList.forEach(function (el) {
      for (var i = el.childNodes.length - 1; i >= 0; i--) {
        var n = el.childNodes[i];
        if (n.nodeType === 3 && n.textContent.trim()) {
          if (el.dataset.i18nTrail === undefined) el.dataset.i18nTrail = n.textContent;
          var orig = el.dataset.i18nTrail;
          var e = TEXT[orig.trim()];
          n.textContent = (e && e[lang]) ? e[lang] : orig;
          break;
        }
      }
    });
  }

  function translateAttr(selector, attr, lang) {
    document.querySelectorAll(selector).forEach(function (el) {
      var key = "i18nAttr" + attr.replace(/[^a-zA-Z0-9]/g, "");
      if (el.dataset[key] === undefined) el.dataset[key] = el.getAttribute(attr) || "";
      var orig = el.dataset[key];
      el.setAttribute(attr, lookupText(orig, lang));
    });
  }

  /* .mi menü ürün butonları: data-name/desc/cat + görünen ad */
  function translateMenuItems(lang) {
    document.querySelectorAll(".mi").forEach(function (btn) {
      if (btn.dataset.nameTr === undefined) {
        btn.dataset.nameTr = btn.getAttribute("data-name") || "";
        btn.dataset.descTr = btn.getAttribute("data-desc") || "";
        btn.dataset.catTr = btn.getAttribute("data-cat") || "";
      }
      var trName = btn.dataset.nameTr;
      var trDesc = btn.dataset.descTr;
      var trCat = btn.dataset.catTr;
      var item = ITEM[trName];

      var name = trName, desc = trDesc;
      if (item && item[lang]) {
        name = item[lang].n || trName;
        desc = item[lang].d || trDesc;
      }
      btn.setAttribute("data-name", name);
      btn.setAttribute("data-desc", desc);
      btn.setAttribute("data-cat", lookupCatName(trCat, lang));

      var nameSpan = btn.querySelector(".mi-name");
      if (nameSpan) nameSpan.textContent = name;
    });
  }

  /* Kategori kartları (menu.html): .cat-name (leading text) + .cat-desc (ayrı) */
  function translateCatList(lang) {
    document.querySelectorAll(".cat-card").forEach(function (card) {
      var nameEl = card.querySelector(".cat-name");
      var descEl = card.querySelector(".cat-desc");
      if (!nameEl) return;
      if (nameEl.dataset.i18nLead === undefined) {
        var n0 = nameEl.childNodes[0];
        nameEl.dataset.i18nLead = n0 ? n0.textContent : "";
      }
      var trName = nameEl.dataset.i18nLead.trim();
      var n0 = nameEl.childNodes[0];
      if (n0 && n0.nodeType === 3) n0.textContent = lookupCatName(trName, lang);

      if (descEl) {
        if (descEl.dataset.i18nOrig === undefined) descEl.dataset.i18nOrig = descEl.textContent;
        var trDesc = descEl.dataset.i18nOrig.trim();
        var c = CAT[trName];
        if (c && c.listDesc && c.listDesc[lang]) descEl.textContent = c.listDesc[lang];
        else descEl.textContent = trDesc;
      }
    });
  }

  /* Kategori sayfası: sidebar linkler + prevnext <b> */
  function translateCatLinks(lang) {
    document.querySelectorAll(".cat-side a, .cat-prevnext b").forEach(function (el) {
      if (el.dataset.i18nOrig === undefined) el.dataset.i18nOrig = el.textContent;
      var tr = el.dataset.i18nOrig.trim();
      el.textContent = lookupCatName(tr, lang);
    });
  }

  /* Kategori sayfası: başlık (h1#cat-baslik) ve blurb (.cat-blurb) */
  function translateCatHero(lang) {
    var h1 = document.getElementById("cat-baslik");
    if (h1) {
      if (h1.children.length === 0) {
        if (h1.dataset.i18nOrig === undefined) h1.dataset.i18nOrig = h1.textContent;
        var tr = h1.dataset.i18nOrig.trim();
        h1.textContent = lookupCatName(tr, lang) !== tr ? lookupCatName(tr, lang) : lookupText(tr, lang);
      } else {
        // Pişiler gibi <small> içeren başlıklar TEXT sözlüğünden innerHTML ile çevrilir
        if (h1.dataset.i18nOrig === undefined) h1.dataset.i18nOrig = h1.innerHTML;
        var e = TEXT[h1.dataset.i18nOrig.trim()];
        h1.innerHTML = (e && e[lang]) ? e[lang] : h1.dataset.i18nOrig;
      }
    }
    var blurb = document.querySelector(".cat-blurb");
    if (blurb) {
      if (blurb.dataset.i18nOrig === undefined) blurb.dataset.i18nOrig = blurb.textContent;
      var trB = blurb.dataset.i18nOrig.trim();
      var found = null;
      Object.keys(CAT).forEach(function (k) {
        if (CAT[k].blurb && CAT[k].blurb.tr === trB) found = CAT[k].blurb;
      });
      blurb.textContent = (found && found[lang]) ? found[lang] : trB;
    }
  }

  /* ---------- Ana uygulama fonksiyonu ---------- */
  function applyLang(lang) {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    var commonSel = [
      "#main-nav a", ".header-phone", ".header-cta", ".skip-link",
      ".footer-cta", ".footer-brand p", ".footer-col nav a", ".footer-col h4",
      ".footer-col p:not(.footer-addr)", ".footer-bottom a",
      ".mobile-bar span", ".cat-side-label",
      ".menu-hero .sec-index", ".menu-hero h1", ".menu-hero .sec-sub"
    ].join(",");
    translateEls(document.querySelectorAll(commonSel), lang);

    // footer telif satırı (yıl span'ı hariç, sadece son metin düğümü)
    translateTrailingText(document.querySelectorAll(".footer-bottom p:first-child"), lang);

    // breadcrumb (Menü · 0X / 10)
    translateEls(document.querySelectorAll(".cat-hero .sec-index"), lang);

    // aria-label / attribute çevirileri
    translateAttr(".nav-toggle", "aria-label", lang);
    translateAttr(".back-to-top", "aria-label", lang);
    translateAttr(".mi-dlg-x", "aria-label", lang);
    translateAttr("nav.mobile-bar", "aria-label", lang);
    translateAttr("#main-nav", "aria-label", lang);
    translateAttr(".cat-prevnext", "aria-label", lang);

    // kategori listesi (menu.html)
    translateCatList(lang);

    // kategori sayfası: sidebar, prevnext, başlık, blurb, geri linki
    translateCatLinks(lang);
    translateCatHero(lang);
    translateEls(document.querySelectorAll(".cat-back"), lang);
    translateEls(document.querySelectorAll(".cat-prevnext a > span"), lang);

    // menü ürünleri
    translateMenuItems(lang);

    // dil düğmelerinin görünümü
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-lang") === lang);
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    });
  }

  /* ---------- Dil değiştirici arayüzü ---------- */
  function buildSwitcher(extraClass) {
    var wrap = document.createElement("div");
    wrap.className = "lang-switch" + (extraClass ? " " + extraClass : "");
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Dil seçimi / Language");
    LANGS.forEach(function (code) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "lang-btn";
      b.setAttribute("data-lang", code);
      b.setAttribute("aria-pressed", "false");
      b.title = LANG_NAME[code];
      b.textContent = LANG_LABEL[code];
      b.addEventListener("click", function () {
        setLang(code);
        applyLang(code);
      });
      wrap.appendChild(b);
    });
    return wrap;
  }

  function mountSwitchers() {
    var actions = document.querySelector(".header-actions");
    if (actions && !actions.querySelector(".lang-switch")) {
      actions.insertBefore(buildSwitcher(), actions.firstChild);
    }
    var nav = document.getElementById("main-nav");
    if (nav && !nav.querySelector(".lang-switch")) {
      nav.appendChild(buildSwitcher("lang-switch--mobile"));
    }
  }

  /* ---------- İlk ziyaret: dil seçim ekranı ---------- */
  function hasSavedLang() {
    try { return !!localStorage.getItem(STORAGE_KEY); } catch (e) { return true; }
  }

  function closeLangGate() {
    var g = document.getElementById("lang-gate");
    if (g && g.parentNode) g.parentNode.removeChild(g);
    document.documentElement.classList.remove("lang-gate-open");
    document.removeEventListener("keydown", onLangGateKeydown);
  }
  function onLangGateKeydown(e) {
    if (e.key === "Escape") { setLang("tr"); closeLangGate(); }
  }

  function showLangGate() {
    var overlay = document.createElement("div");
    overlay.className = "lang-gate";
    overlay.id = "lang-gate";

    var backdrop = document.createElement("div");
    backdrop.className = "lang-gate-backdrop";
    overlay.appendChild(backdrop);

    var box = document.createElement("div");
    box.className = "lang-gate-box";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-labelledby", "lang-gate-title");

    var title = document.createElement("p");
    title.className = "lang-gate-title";
    title.id = "lang-gate-title";
    title.innerHTML = "Dilinizi seçin<br>Choose your language<br>اختر لغتك<br>Sprache wählen";
    box.appendChild(title);

    var grid = document.createElement("div");
    grid.className = "lang-gate-grid";
    LANGS.forEach(function (code) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "lang-gate-btn";
      b.setAttribute("data-lang", code);
      b.textContent = LANG_NAME[code];
      b.addEventListener("click", function () {
        setLang(code);
        applyLang(code);
        closeLangGate();
      });
      grid.appendChild(b);
    });
    box.appendChild(grid);

    var skip = document.createElement("button");
    skip.type = "button";
    skip.className = "lang-gate-skip";
    skip.textContent = "Türkçe ile devam et";
    skip.addEventListener("click", function () { setLang("tr"); closeLangGate(); });
    box.appendChild(skip);

    overlay.appendChild(box);
    document.body.appendChild(overlay);
    document.documentElement.classList.add("lang-gate-open");
    document.addEventListener("keydown", onLangGateKeydown);

    window.setTimeout(function () {
      var first = grid.querySelector(".lang-gate-btn");
      if (first) first.focus();
    }, 50);
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Dil özelliği yalnızca menü sayfalarında (menu.html + menu-<slug>.html) etkin
    if (!document.body.classList.contains("menu-page")) return;
    mountSwitchers();
    applyLang(getLang());
    if (!hasSavedLang()) showLangGate();
  });
})();
