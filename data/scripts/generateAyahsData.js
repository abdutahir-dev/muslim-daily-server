import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..');

const ayahs = [
  // Surah 1: Al-Fatihah (1:1 - 1:7)
  {
    verse_key: "1:1",
    surah_number: 1,
    verse_number: 1,
    text_uthmani: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    translation_en: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    translation_am: "በአላህ ስም እጅግ በጣም ሩኅሩህ በጣም አዛኝ በሆነው።",
    tafsir_ar: "أبتدئ قراءة القرآن باسم الله مستعيناً به، (الله) علم على الرب تبارك وتعالى، (الرحمن) ذي الرحمة الواسعة الشاملة لجميع الخلائق، (الرحيم) بالمؤمنين خاصة.",
    tafsir_en: "I begin reciting the Quran with the name of Allah, seeking His divine assistance. Ar-Rahman: the One whose vast mercy encompasses all of creation; Ar-Raheem: specifically merciful to the faithful.",
    tafsir_am: "የቁርአን ንባቤን በአላህ ስም እገዛን በመፈለግ እጀምራለሁ። አር-ራሕማን ለፍጥረታት ሁሉ እዝነቱ ሰፊ የሆነ፣ አር-ረሒም ደግሞ ለምእመናን እጅግ አዛኝ የሆነው ነው።"
  },
  {
    verse_key: "1:2",
    surah_number: 1,
    verse_number: 2,
    text_uthmani: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
    translation_en: "[All] praise is [due] to Allah, Lord of the worlds -",
    translation_am: "ምስጋና ለአላህ ይገባው የዓለማት ጌታ ለሆነው፤",
    tafsir_ar: "الثناء الكامل والشكر الخالص لله وحده دون سواه، المربي لجميع العالمين -وهم كل ما سوى الله- بنعمه وخلقه وتدبيره.",
    tafsir_en: "All praise and utmost gratitude belong purely to Allah alone, the Creator, Nourisher, Sustainer, and Ruler of all created realms.",
    tafsir_am: "ፍጹም ምስጋናና ክብር ለአላህ ብቻ የተገባ ነው፤ እርሱ የፍጥረታት ሁሉ ፈጣሪ፣ አስገኚና አስተናባሪ የሆነው ጌታ ነው።"
  },
  {
    verse_key: "1:3",
    surah_number: 1,
    verse_number: 3,
    text_uthmani: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    translation_en: "The Entirely Merciful, the Especially Merciful,",
    translation_am: "እጅግ በጣም ሩኅሩህ በጣም አዛኝ፤",
    tafsir_ar: "ثناء على الله بعد حمده ببيان سعة رحمته وإحسانه الفائض على عباده.",
    tafsir_en: "Reiterating praise of Allah by invoking His infinite grace and enduring mercy toward His servants.",
    tafsir_am: "ለባሮቹ ያለውን ሰፊ እዝነትና ቸርነት በመግለጽ አላህን ማሞገስ ነው።"
  },
  {
    verse_key: "1:4",
    surah_number: 1,
    verse_number: 4,
    text_uthmani: "مَٰلِكِ يَوْمِ ٱلدِّينِ",
    translation_en: "Sovereign of the Day of Recompense.",
    translation_am: "የፍርዱ ቀን ባለቤት (ንጉሥ) ለሆነው።",
    tafsir_ar: "المتصرف الأوحد بالعدل المطلق في يوم القيامة، وهو يوم الجزاء والحساب، حيث لا يملك أحد شفاعة ولا نفعاً إلا بإذنه.",
    tafsir_en: "The exclusive and absolute Ruler of the Day of Judgment, wherein all beings are rewarded or held accountable in perfect justice.",
    tafsir_am: "በቂያማ ቀን፣ በፍርድና በምንዳ ቀን ብቸኛ ገዢና ፍጹም ፍትሃዊ ንጉሥ ለሆነው አላህ።"
  },
  {
    verse_key: "1:5",
    surah_number: 1,
    verse_number: 5,
    text_uthmani: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    translation_en: "It is You we worship and You we ask for help.",
    translation_am: "አንተን ብቻ እንገዛለን፤ አንተንም ብቻ እርዳታን እንለምናለን።",
    tafsir_ar: "نخصك وحدك بالعبادة والخضوع، ونبرأ من الشرك، ونخصك وحدك بطلب العون على طاعتك وسائر شؤون ديننا ودنيانا.",
    tafsir_en: "We dedicate all devotion, prayer, and submission exclusively to You, and from You alone do we seek strength and succor in all affairs.",
    tafsir_am: "አንተን ብቻ በብቸኝነት እናመልካለን፣ ከማጋራትም እንጠራለን፤ በዲናችንና በዱንያችን ጉዳይ ሁሉ ከአንተ ብቻ እገዛን እንሻለን።"
  },
  {
    verse_key: "1:6",
    surah_number: 1,
    verse_number: 6,
    text_uthmani: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
    translation_en: "Guide us to the straight path -",
    translation_am: "ቀጥተኛውን መንገድ ምራን፤",
    tafsir_ar: "دلنا وأرشدنا ووفقنا وثبتنا على الصراط الواضح المستقيم الذي لا عوج فيه، وهو دين الإسلام الموصل إلى رضوانك وجنتك.",
    tafsir_en: "Direct us, inspire us, and firmly establish our hearts upon the clear straight path without deviation—the religion of Islam.",
    tafsir_am: "ምንም አይነት መጥመምና ጉድለት ወደሌለበት ቀጥተኛው ጎዳና (ወደ እስልምና ዲን) ምራን፤ በእርሱም ላይ አጽናን።"
  },
  {
    verse_key: "1:7",
    surah_number: 1,
    verse_number: 7,
    text_uthmani: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
    translation_en: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
    translation_am: "የእነዚያን በእነርሱ ላይ ጸጋህን የለገስክላቸውን ሰዎች መንገድ፤ በእነርሱ ላይ ቁጣ ያልወረደባቸውንና ያልተሳሳቱትንም (መንገድ)።",
    tafsir_ar: "طريق النبيين والصديقين والشهداء والصالحين، غير طريق اليهود الذين علموا الحق ولم يعملوا به فغضب الله عليهم، ولا طريق النصارى الذين عبدوا الله بجهل وضلال.",
    tafsir_en: "The highway traversed by the Prophets, the truthful, the martyrs, and the righteous; not the course of those who earned wrath by knowingly defying truth, nor of those who strayed into confusion without knowledge.",
    tafsir_am: "የነቢያቶች፣ የእውነተኛ አማኞች፣ የሰማዕታትና የደጋግ ባሮችህን መንገድ፤ እውነቱን እያወቁ እንቢ ብለው ቁጣህ የወረደባቸውን ሳይሆን፤ በእውቀት ማጣትም የተሳሳቱትን መንገድ እንዳንከተል ጠብቀን።"
  },

  // Surah 2: Al-Baqarah
  {
    verse_key: "2:255",
    surah_number: 2,
    verse_number: 255,
    text_uthmani: "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ",
    translation_en: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that could intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
    translation_am: "አላህ ከእርሱ በስተቀር ሌላ አምላክ የለም፤ ሕያው ሁሉን ነገር አስተናባሪ ነው። እንቅልፍም ሆነ እንቅልፍ ማሸለብ አይዘውም፤ በሰማያትና በምድር ውስጥ ያለው ሁሉ የእርሱ ብቻ ነው። እርሱ ዘንድ በእርሱ ፈቃድ ካልሆነ በስተቀር የሚያማልድ ማነው? በፊታቸው ያለውንና ከበስተኋላቸው ያለውን ሁሉ ያውቃል፤ እርሱ ከሻው በስተቀር ከእውቀቱ ምንም ነገር አያካብቡም። ኩርሲዩ (ዙፋኑ) ሰማያትንና ምድርን አዳረሰ፤ ሁለቱንም መጠበቅ አያደክመውም፤ እርሱም የበላይ ታላቁ ነው።",
    tafsir_ar: "آية الكرسي أعظم آية في كتاب الله. تضمنت عشر جمل مستقلة في توحيد الذات والصفات، وإثبات الحياة الكاملة والقيومية التامة ونفي النعاس والنوم، وإحاطة العلم الشامل وعظمة الملك والكرسي، وعلو الذات والقدر والقهر.",
    tafsir_en: "Ayat al-Kursi is the supreme verse of the Holy Quran, containing ten sublime statements declaring Allah's absolute oneness, eternal life, vigilance, infinite dominion, all-encompassing knowledge, and supreme grandeur.",
    tafsir_am: "አያተል ኩርሲ በቁርአን ውስጥ ታላቋ አንቀጽ ናት። የአላህን ብቸኛ አምላክነት፣ ሕያውነት፣ እንቅልፍ አልባ ጥበቃ፣ ሁሉን አዋቂነትና ሰማያትና ምድርን ያካተተውን ዙፋኑን ታላቅነት ይዛለች።"
  },
  {
    verse_key: "2:285",
    surah_number: 2,
    verse_number: 285,
    text_uthmani: "ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ ۚ كُلٌّ ءَامَنَ بِٱللَّهِ وَمَلَٰٓئِكَتِهِۦ وَكُتُبِهِۦ وَرُسُلِهِۦ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِۦ ۚ وَقَالُوا۟ سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ ٱلْمَصِيرُ",
    translation_en: "The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers, [saying], 'We make no distinction between any of His messengers.' And they say, 'We hear and we obey. [We seek] Your forgiveness, our Lord, and to You is the [final] destination.'",
    translation_am: "መልእክተኛው ከጌታው ወደ እርሱ በተወረደው አመነ፤ ምእመናንም (እንደዚሁ)። ሁሉም በአላህ፣ በመላእክቱ፣ በመጽሐፍቱና በመልእክተኞቹ አመኑ፤ 'ከመልእክተኞቹ በአንዱም መካከል አንለይም' (አሉ)። 'ሰማን፤ ታዘዝንም፤ ጌታችን ሆይ ምህረትህን እንሻለን፤ መመለሻም ወዳንተ ብቻ ነው' አሉ።",
    tafsir_ar: "شهادة من الله لرسوله والمؤمنين بالإيمان بجميع أركان العقيدة، والسمع والطاعة لأوامر الله والاستغفار والإقرار بالمصير إليه.",
    tafsir_en: "Allah testifies to the faith of His Messenger and the believers, encompassing all articles of faith: belief in Allah, angels, scriptures, and prophets, alongside total submission and repentance.",
    tafsir_am: "አላህ በመልእክተኛውና በምእመናን እውነተኛ እምነት መስክሯል፤ ሁሉንም የመልእክተኞች ትምህርት በማመንና ለአላህ ትዕዛዝ ፍጹም ታዛዥ በመሆን ምህረትን ጠይቀዋል።"
  },
  {
    verse_key: "2:286",
    surah_number: 2,
    verse_number: 286,
    text_uthmani: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا ٱكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَآ إِن نَّسِينَآ أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَآ إِصْرًا كَمَا حَمَلْتَهُۥ عَلَى ٱلَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِۦ ۖ وَٱعْفُ عَنَّا وَٱغْفِرْ لَنَا وَٱرْحَمْنَآ ۚ أَنتَ مَوْلَىٰنَا فَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَٰفِرِينَ",
    translation_en: "Allah does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned. 'Our Lord, do not impose blame upon us if we have forgotten or erred. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people.'",
    translation_am: "አላህ ነፍስን ከችሎታዋ በላይ አያስገድዳትም፤ የሰራችው መልካም ስራ ለራሷ ነው፤ የሰራችውም መጥፎ ነገር በራሷ ላይ ነው። 'ጌታችን ሆይ! ብንረሳ ወይም ብንሳሳት አትያዘን፤ ጌታችን ሆይ! ከእኛ በፊት በነበሩት ላይ የጫንከውን ከባድ ሸክም በእኛ ላይ አትጫንብን፤ ጌታችን ሆይ! ለእኛ አቅም የሌለንን ነገር አታሸክመን፤ ለእኛም ይቅር በለን፣ ምህረትም አድርግልን፣ እዘንልንም፤ አንተ ረዳታችን ነህና በከሓዲዎች ሕዝቦች ላይ እርዳን።'",
    tafsir_ar: "رحمة الله بعباده أنه لا يكلفهم إلا ما يطيقون، ودعاء جامع بالرحمة والعفو والنصر على الأعداء، وقد أجاب الله هذا الدعاء كما صح في الحديث.",
    tafsir_en: "The manifestation of divine compassion: Allah never tasks any soul beyond its endurance. The verse concludes with an exalted prayer for pardon, relief, and victory.",
    tafsir_am: "አላህ ለባሮቹ ያለውን ርህራሄ የሚያሳይ ነው፤ አቅማቸው የማይፈቅደውን አይጥልባቸውም። በይቅርታ፣ በምህረትና በድል የተሞላ የተሟላ ዱዓ ነው።"
  },

  // Surah 3: Ali 'Imran
  {
    verse_key: "3:18",
    surah_number: 3,
    verse_number: 18,
    text_uthmani: "شَهِدَ ٱللَّهُ أَنَّهُۥ لَآ إِلَٰهَ إِلَّا هُوَ وَٱلْمَلَٰٓئِكَةُ وَأُو۟لُوا۟ ٱلْعِلْمِ قَآئِمًۢا بِٱلْقِسْطِ ۚ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْعَزِيزُ ٱلْحَكِيمُ",
    translation_en: "Allah witnesses that there is no deity except Him, and [so do] the angels and those of knowledge - [that He is] maintaining [creation] in justice. There is no deity except Him, the Exalted in Might, the Wise.",
    translation_am: "አላህ እርሱ በስተቀር ሌላ አምላክ አለመኖሩን መሰከረ፤ መላእክትና የእውቀት ባለቤቶችም (መሰከሩ)፤ በፍትህ ላይ የቆመ ሆኖ፤ ከእርሱ በስተቀር አሸናፊው ጥበበኛው ሌላ አምላክ የለም።",
    tafsir_ar: "أعظم شهادة من أعظم شاهد: شهد الله لنفسه بالوحدانية والعدل، وقرن شهادة الملائكة وأهل العلم بشهادته، تكريماً لعلماء الحق وفضيلة العلم.",
    tafsir_en: "The greatest testimony of monotheism: Allah bears witness to His own oneness and equity, coupling His testimony with that of the angels and scholars of truth.",
    tafsir_am: "አላህ በብቸኛ አምላክነቱና ፍትሃዊነቱ መሰከረ፤ የመላእክትንና የእውቀት ባለቤቶችን ምስክርነት ከራሱ ጋር በማያያዝ የዕውቀትን ክብር አጎላ።"
  },

  // Surah 18: Al-Kahf
  {
    verse_key: "18:109",
    surah_number: 18,
    verse_number: 109,
    text_uthmani: "قُل لَّوْ كَانَ ٱلْبَحْرُ مِدَادًا لِّكَلِمَٰتِ رَبِّى لَنَفِدَ ٱلْبَحْرُ قَبْلَ أَن تَنفَدَ كَلِمَٰتُ رَبِّى وَلَوْ جِئْنَا بِمِثْلِهِۦ مَدَدًا",
    translation_en: "Say, 'If the sea were ink for [writing] the words of my Lord, the sea would be exhausted before the words of my Lord were exhausted, even if We brought the like of it in [continual] supplement.'",
    translation_am: "በላቸው፡- 'ባሕሩ ለጌታዬ ቃላት (መጻፊያ) ቀለም ቢሆን ኖሮ፣ የጌታዬ ቃላት ሳያልቁ በፊት ባሕሩ በእርግጥ ባለቀ ነበር፤ ምንም እንኳን አምሳያውን ሌላ ባሕር በእርዳታ ብናመጣበትም።'",
    tafsir_ar: "بيان لسعة علم الله وحكمته وكلماته التامة التي لا تنفد ولا يحصيها مخلوق، حتى لو تحولت بحار الأرض حبراً وتضاعفت مدداً.",
    tafsir_en: "Proclamation of the boundless, unfathomable scope of Allah's wisdom and words, which would surpass oceans of ink even if renewed infinitely.",
    tafsir_am: "የአላህ እውቀትና ቃላት ማለቂያ የሌላቸው መሆናቸውን፣ የምድር ውቅያኖሶች በሙሉ ቀለም ሆነው ቢጻፍ እንኳ እንደማይሟጠጡ ማረጋገጫ ነው።"
  },
  {
    verse_key: "18:110",
    surah_number: 18,
    verse_number: 110,
    text_uthmani: "قُلْ إِنَّمَآ أَنَا۠ بَشَرٌ مِّثْلُكُمْ يُوحَىٰٓ إِلَىَّ أَنَّمَآ إِلَٰهُكُمْ إِلَٰهٌ وَٰحِدٌ ۖ فَمَن كَانَ يَرْجُوا۟ لِقَآءَ رَبِّهِۦ فَلْيَعْمَلْ عَمَلًا صَٰلِحًا وَلَا يُشْرِكْ بِعِبَادَةِ رَبِّهِۦٓ أَحَدًۢا",
    translation_en: "Say, 'I am only a man like you, to whom has been revealed that your god is one God. So whoever would hope for the meeting with his Lord - let him do righteous work and not associate in the worship of his Lord anyone.'",
    translation_am: "በላቸው፡- 'እኔ ልክ እንደናንተ ሰው ብቻ ነኝ፤ ወደ እኔ የሚወረደው አምላካችሁ አንድ አምላክ ብቻ መሆኑ ነው። የጌታውን መገናኘት የሚከጅል ሰው መልካም ስራን ይስራ፤ በጌታውም መገዛት ላይ አንዱንም አያጋራ።'",
    tafsir_ar: "خاتمة سورة الكهف: تبيان بشرية النبي ﷺ مع شرف الوحي، والتذكير بشرطي قبول العمل الصالح: الإخلاص لله والمتابعة لشرعه.",
    tafsir_en: "The conclusion of Surah Al-Kahf, affirming the human nature of the Prophet ﷺ elevated by revelation, and highlighting the two conditions for acceptance of deeds: sincere devotion to Allah and alignment with His law.",
    tafsir_am: "የአል-ካህፍ ማጠቃለያ፤ ነቢዩ ሰው መሆናቸውንና ወደ እርሳቸው ወሕይ እንደሚወርድ በመግለጽ፣ መልካም ስራ ተቀባይነት የሚያገኘው በአላህ ላላጋሩና በቅን ልቦና ለሰሩ ብቻ መሆኑን ያስተምራል።"
  },

  // Surah 36: Ya-Sin
  {
    verse_key: "36:82",
    surah_number: 36,
    verse_number: 82,
    text_uthmani: "إِنَّمَآ أَمْرُهُۥٓ إِذَآ أَرَادَ شَيْـًٔا أَن يَقُولَ لَهُۥ كُن فَيَكُونُ",
    translation_en: "His command is only when He intends a thing that He says to it, 'Be,' and it is.",
    translation_am: "ትእዛዙ አንዱን ነገር በሻ ጊዜ ለእርሱ 'ሁን' ማለት ብቻ ነው፤ ወዲያውም ይሆናል።",
    tafsir_ar: "بيان لقدرة الله المطلقة التي لا يعجزها شيء في الأرض ولا في السماء، فإذا أراد خلق أمر قال له 'كن' فيوجد فوراً بلا كلفة.",
    tafsir_en: "A sublime declaration of Allah's omnipotence: whenever He decrees a matter, He simply says 'Be,' and instantaneously it comes into existence.",
    tafsir_am: "የአላህን ፍጹም ሀይል የሚያሳይ ነው፤ አላህ ማንኛውንም ነገር ሲሻ 'ሁን' ይለዋል፣ ያለምንም ድካም ወዲያው ይፈጸማል።"
  },
  {
    verse_key: "36:83",
    surah_number: 36,
    verse_number: 83,
    text_uthmani: "فَسُبْحَٰنَ ٱلَّذِى بِيَدِهِۦ مَلَكُوتُ كُلِّ شَىْءٍ وَإِلَيْهِ تُرْجَعُونَ",
    translation_en: "So exalted is He in whose hand is the realm of all things, and to Him you will be returned.",
    translation_am: "ያ የነገሩ ሁሉ ግዛት በእጁ የሆነው ጌታ ጥራት ይገባው፤ ወደ እርሱም ትመለሳላችሁ።",
    tafsir_ar: "تنزيه لله تعالى عن العجز والنقص، المالك لخزائن السماوات والأرض ومدبر الملك والملكوت، والكل صائر إليه للحساب والجزاء.",
    tafsir_en: "Glorified and sanctified is Allah, the absolute Master of cosmic sovereignty, unto whom all souls shall inevitably return for reckoning.",
    tafsir_am: "የፍጥረታት ሁሉ የበላይ ባለቤት የሆነው አላህ ከጉድለት ሁሉ የጠራ ነው፤ ሁላችሁም ወደ እርሱ ተመላሾች ናችሁ።"
  },

  // Surah 55: Ar-Rahman
  {
    verse_key: "55:13",
    surah_number: 55,
    verse_number: 13,
    text_uthmani: "فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ",
    translation_en: "So which of the favors of your Lord would you deny?",
    translation_am: "ከጌታችሁ ጸጋዎች በየትኛው ታስተባብላላችሁ?",
    tafsir_ar: "خطاب للإنس والجن: بأي نعمة من نعم الله الدينية والدنيوية تكذبان وتجحدون؟ والواجب شكرها والإقرار بفضل المنعم سبحانه.",
    tafsir_en: "An address directed to both mankind and jinn: which of your Lord's immense spiritual and material favors can you possibly deny or repudiate?",
    tafsir_am: "የሰውን ልጅና አጋንንትን የሚያናግር ጥያቄ ነው፤ ከጌታችሁ በርካታ መንፈሳዊና ቁሳዊ ጸጋዎች የትኛውን ትክዳላችሁ? ምስጋናን ማብዛት ግዴታ ነው።"
  },

  // Surah 67: Al-Mulk
  {
    verse_key: "67:1",
    surah_number: 67,
    verse_number: 1,
    text_uthmani: "تَبَٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ",
    translation_en: "Blessed is He in whose hand is dominion, and He is over all things competent -",
    translation_am: "ያ ንግሥናው በእጁ የሆነው ጌታ ክብሩ እጅግ ላቀ፤ እርሱም በነገሩ ሁሉ ላይ ቻይ ነው።",
    tafsir_ar: "تعاظم وكثر خير الله وبركته، الذي له السلطان التام على السماوات والأرض والدنيا والآخرة، القادر على كل شيء فلا يعجزه أمر.",
    tafsir_en: "Exalted and brimming with abundance is Allah, who commands complete dominion over heaven and earth, possessing omnipotent power over all things.",
    tafsir_am: "ንግሥና ሁሉ በእጁ የሆነው አላህ ክብሩና በረከቱ እጅግ የላቀ ነው፤ እርሱ በሁሉም ነገር ላይ አድራጊና ቻይ ነው።"
  },
  {
    verse_key: "67:2",
    surah_number: 67,
    verse_number: 2,
    text_uthmani: "ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ",
    translation_en: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -",
    translation_am: "ያ ሞትንና ሕይወትን ከእናንተ ስራው ይበልጥ ያማረ ማናችሁ መሆኑን ሊፈትናችሁ የፈጠረ ነው፤ እርሱም አሸናፊው መሓሪው ነው።",
    tafsir_ar: "الغاية من خلق الموت والحياة هي ابتلاء المكلفين: أيهم أخلص عملاً وأصوبه لله تعالى، وهو القوي الذي لا يُغلب، الغفور لذنوب من تاب.",
    tafsir_en: "The profound purpose of life and mortality is to test who among humans executes the most sincere and righteous deeds. And He is the Almighty, the All-Forgiving.",
    tafsir_am: "ሕይወትና ሞት የተፈጠሩት የሰው ልጅን ለመፈተን ነው፤ ከእናንተ ይበልጥ መልካም ስራን የሚሰራው ማን እንደሆነ ለመለየት። አላህ አሸናፊና መሓሪ ነው።"
  },

  // Surah 93: Ad-Duhaa
  {
    verse_key: "93:3",
    surah_number: 93,
    verse_number: 3,
    text_uthmani: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",
    translation_en: "Your Lord has not taken leave of you, [O Muhammad], nor has He detested [you].",
    translation_am: "ጌታህ አልተወህም፤ አልጠላህምም።",
    tafsir_ar: "جواب القسم: ما تركك ربك يا محمد وما أبغضك منذ اختارك، بل رعايته لك دائمة وإحسانه إليك متصل.",
    tafsir_en: "The divine reassurance: Your Lord has neither abandoned you, O Muhammad, nor has He ever despised you; His divine care is constant and everlasting.",
    tafsir_am: "ለነቢዩ የተሰጠ መጽናኛ ነው፤ ጌታህ አልተወህም፣ ፈጽሞም አልጠላህም፤ ጥበቃው ሁሌም ከአንተ ጋር ነው።"
  },
  {
    verse_key: "93:4",
    surah_number: 93,
    verse_number: 4,
    text_uthmani: "وَلَلْـَٔاخِرَةُ خَيْرٌ لَّكَ مِنَ ٱلْأُولَىٰ",
    translation_en: "And the Hereafter is better for you than the first [life].",
    translation_am: "መጨረሻይቱም (አኺራ) ከመጀመሪያይቱ (ከቅርቢቱ ዓለም) ለአንተ በእርግጥ በላጭ ናት።",
    tafsir_ar: "والدار الآخرة وما أعد الله لك فيها من المقامات والنعيم أعظم وأكمل من دار الدنيا الفانية.",
    tafsir_en: "The eternal abode of the Hereafter, with its unmatched honors and rewards, is far superior for you than this transient worldly life.",
    tafsir_am: "የመጨረሻይቱ ዓለም (አኺራ) እና በአላህ ዘንድ የተዘጋጀልህ ክብር ከዚህች አላፊ አለም እጅግ የበላይና የተሻለ ነው።"
  },
  {
    verse_key: "93:5",
    surah_number: 93,
    verse_number: 5,
    text_uthmani: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
    translation_en: "And your Lord is going to give you, and you will be satisfied.",
    translation_am: "ወደፊትም ጌታህ ይሰጥሃል፤ ትረካለህም።",
    tafsir_ar: "وعد إلهي كريم بإعطاء النبي ﷺ من الشفاعة وعلو المنزلة لأمته والنصر في الدنيا حتى يرضى تمام الرضا.",
    tafsir_en: "A magnificent divine promise that Allah will bestow upon the Prophet ﷺ such vast bounties, intercession, and glory for his community that he will be thoroughly pleased.",
    tafsir_am: "አላህ ለነቢዩ ታላቅ ክብርን፣ ምልጃንና ድልን እንደሚሰጣቸውና እርሳቸውም ፍጹም እንደሚረኩ የተገባላቸው ቃል ነው።"
  },

  // Surah 94: Ash-Sharh
  {
    verse_key: "94:5",
    surah_number: 94,
    verse_number: 5,
    text_uthmani: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
    translation_en: "For indeed, with hardship [will be] ease.",
    translation_am: "ከችግር ጋር በእርግጥ ምቾት አለ።",
    tafsir_ar: "بشارة عظيمة بأن كل شدة يمر بها الإنسان يرافقها لطف وتيسير من الله يفرج كربها.",
    tafsir_en: "A monumental guarantee that every trial and affliction is inherently accompanied by divine ease and relief.",
    tafsir_am: "ታላቅ የምስራች ቃል፤ የሰው ልጅ ከሚገጥመው ከማንኛውም ችግርና መከራ ጋር የአላህ እፎይታና ምቾት አብሮ አለ።"
  },
  {
    verse_key: "94:6",
    surah_number: 94,
    verse_number: 6,
    text_uthmani: "إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
    translation_en: "Indeed, with hardship [will be] ease.",
    translation_am: "ከችግር ጋር በእርግጥ ምቾት አለ።",
    tafsir_ar: "تأكيد التيسير، قال ابن عباس: 'لن يغلب عسر يسرين'، لأن العسر معرف واليسر منكر متجدد.",
    tafsir_en: "Reiterated to reinforce certainty; as Ibn Abbas observed: 'One hardship will never overcome two eases.'",
    tafsir_am: "እውነታውን ለማረጋገጥ የተደገመ ቃል ነው፤ አንድ ችግር ሁለቱን ምቾቶች ፈጽሞ አያሸንፍም።"
  },

  // Surah 97: Al-Qadr
  {
    verse_key: "97:1",
    surah_number: 97,
    verse_number: 1,
    text_uthmani: "إِنَّآ أَنزَلْنَٰهُ فِى لَيْلَةِ ٱلْقَدْرِ",
    translation_en: "Indeed, We sent the Qur'an down during the Night of Decree.",
    translation_am: "እኛ (ቁርአኑን) በውሳኔዋ ሌሊት (በለይለተል ቀድር) አወረድነው።",
    tafsir_ar: "ابتدأ الله إنزال القرآن الكريم جملة واحدة من اللوح المحفوظ إلى بيت العزة في السماء الدنيا في ليلة الشرف وعظيم القدر.",
    tafsir_en: "Allah initiated the descent of the Holy Quran from the Preserved Tablet to the lowest heaven on the magnificent Night of Decree in Ramadan.",
    tafsir_am: "አላህ ቁርአንን ከተጠበቀው ሰሌዳ (ለውሐል መሕፉዝ) ወደ ቅርቢቱ ሰማይ በታላቋ የውሳኔ ሌሊት በረመዳን ወር አወረደው።"
  },
  {
    verse_key: "97:3",
    surah_number: 97,
    verse_number: 3,
    text_uthmani: "لَيْلَةُ ٱلْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ",
    translation_en: "The Night of Decree is better than a thousand months.",
    translation_am: "የውሳኔዋ ሌሊት ከአንድ ሺህ ወር በላጭ ናት።",
    tafsir_ar: "العمل الصالح والعبادة في ليلة القدر خير وأعظم أجراً من عبادة ألف شهر ليس فيها ليلة قدر (ما يزيد عن 83 سنة).",
    tafsir_en: "Worship and righteous deeds on Laylat al-Qadr surpass in reward the devotion of an entire thousand months (over 83 years) without this night.",
    tafsir_am: "በለይለተል ቀድር የሚሰራ መልካም ስራና አምልኮ ይህች ሌሊት ከሌለችባቸው አንድ ሺህ ወራት (ከ83 ዓመታት በላይ) አምልኮ ይበልጣል።"
  },

  // Surah 103: Al-'Asr
  {
    verse_key: "103:1",
    surah_number: 103,
    verse_number: 1,
    text_uthmani: "وَٱلْعَصْرِ",
    translation_en: "By time,",
    translation_am: "በጊዜው እምላለሁ፤",
    tafsir_ar: "قسم من الله بالدهر والزمان لما فيه من العبر والعجائب وتقلب الأحوال.",
    tafsir_en: "An oath sworn by time itself, which bears witness to the rise and fall of nations and passing of opportunity.",
    tafsir_am: "አላህ በጊዜና በዘመን ምሏል፤ በእርሱ ውስጥ ታላላቅ ማስተንተኛና የሁኔታዎች መለዋወጥ ስላለ።"
  },
  {
    verse_key: "103:2",
    surah_number: 103,
    verse_number: 2,
    text_uthmani: "إِنَّ ٱلْإِنسَٰنَ لَفِى خُسْرٍ",
    translation_en: "Indeed, mankind is in loss,",
    translation_am: "የሰው ልጅ ሁሉ በእርግጥ በኪሳራ ውስጥ ነው፤",
    tafsir_ar: "كل جنس الإنسان في هلكة ونقصان وخسارة محققة في تجارته الدنيوية والأخروية.",
    tafsir_en: "Every human being is inevitably in a condition of spiritual bankruptcy and existential loss.",
    tafsir_am: "የሰው ልጅ በሙሉ በመንፈሳዊም ሆነ በዘለአለማዊ ጉዳዩ በእርግጠኝነት በከባድ ኪሳራ ውስጥ ነው።"
  },
  {
    verse_key: "103:3",
    surah_number: 103,
    verse_number: 3,
    text_uthmani: "إِلَّا ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّٰلِحَٰتِ وَتَوَاصَوْا۟ بِٱلْحَقِّ وَتَوَاصَوْا۟ بِٱلصَّبْرِ",
    translation_en: "Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.",
    translation_am: "እነዚያ ያመኑት፣ መልካም ስራዎችን የሰሩት፣ በእውነት አደራ የተባባሉትና በትዕግስትም አደራ የተባባሉት ብቻ ሲቀሩ።",
    tafsir_ar: "استثناء الناجين الأربعة: من جمع بين الإيمان الصحيح، والعمل الصالح، والتواصي بالحق والخير، والتواصي بالصبر على الطاعات والمصائب.",
    tafsir_en: "The four essential pillars of salvation: genuine faith, righteous conduct, mutually advocating truth, and counseling one another in steadfast endurance.",
    tafsir_am: "ከኪሳራ የሚድኑት አራቱ መስፈርቶች የተሟሉላቸው ብቻ ናቸው፡- በእውነተኛ እምነት ያመኑ፣ መልካም ስራ የሰሩ፣ በእውነትና በትዕግስት አደራ የተባባሉ ናቸው።"
  },

  // Surah 108: Al-Kawthar
  {
    verse_key: "108:1",
    surah_number: 108,
    verse_number: 1,
    text_uthmani: "إِنَّآ أَعْطَيْنَٰكَ ٱلْكَوْثَرَ",
    translation_en: "Indeed, We have granted you, [O Muhammad], al-Kawthar.",
    translation_am: "እኛ (ሙሐመድ ሆይ) የተትረፈረፈውን በጎ ነገር (ከውሠርን) በእርግጥ ሰጠንህ።",
    tafsir_ar: "إنا منحناك يا رسول الله الخير الكثير في الدارين، ومنه نهر الكوثر في الجنة وحوضك المورود.",
    tafsir_en: "We have bestowed upon you, O Prophet, boundless goodness in both worlds, including the celestial river Al-Kawthar and your heavenly reservoir.",
    tafsir_am: "እኛ ለአንተ በሁለቱም ዓለም የተትረፈረፈውን ጸጋና በጀነት ውስጥ ያለውን የከውሠርን ወንዝ ሰጠንህ።"
  },
  {
    verse_key: "108:2",
    surah_number: 108,
    verse_number: 2,
    text_uthmani: "فَصَلِّ لِرَبِّكَ وَٱنْحَرْ",
    translation_en: "So pray to your Lord and sacrifice [to Him alone].",
    translation_am: "ስለዚህ ለጌታህ ብቻ ስገድ፤ (መስዋዕትም) እረድ።",
    tafsir_ar: "أخلص لربك صلاتك كلها وانحر أضحيتك باسمه وحده شكراً لنعمه، خلافاً لمن يذبح للأصنام.",
    tafsir_en: "Dedicate your prayers and slaughter your sacrifices purely for your Lord alone in gratitude, in contrast to those who dedicate offerings to idols.",
    tafsir_am: "ለጌታህ ጸጋዎች ምስጋና በማድረስ ሰላትህን ለእርሱ ብቻ ስገድ፤ መስዋዕትህንም በስሙ ብቻ እረድ።"
  },
  {
    verse_key: "108:3",
    surah_number: 108,
    verse_number: 3,
    text_uthmani: "إِنَّ شَانِئَكَ هُوَ ٱلْأَبْتَرُ",
    translation_en: "Indeed, your enemy is the one cut off.",
    translation_am: "ጠላትህ እርሱ በእርግጥ ዘረ-ቆራጩ (ከበጎ ነገር ሁሉ የተቆረጠው) ነው።",
    tafsir_ar: "إن مبغضك وعدوك يا محمد هو المقطوع ذكره من كل خير وأثر صالح، بينما ذكرك مرفوع إلى يوم القيامة.",
    tafsir_en: "Surely he who hates and despises you is the one genuinely severed from posterity, legacy, and all goodness.",
    tafsir_am: "አንተን የሚጠላህና የሚያቃልልህ ጠላትህ እርሱ ከማንኛውም በጎ ነገርና ዝና የተቆረጠ ነው፤ ያንተ ዝና ግን ለዘላለም የገነነ ነው።"
  },

  // Surah 112: Al-Ikhlas (112:1 - 112:4)
  {
    verse_key: "112:1",
    surah_number: 112,
    verse_number: 1,
    text_uthmani: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
    translation_en: "Say, 'He is Allah, [who is] One,",
    translation_am: "በላቸው፡- 'እርሱ አላህ አንድ ነው።'",
    tafsir_ar: "قل يا محمد لمن سألك عن صفة ربك: هو الله المتفرد بالألوهية والربوبية والأسماء والصفات، لا شريك له ولا نظير.",
    tafsir_en: "Say, O Muhammad, to whoever asks of your Lord: He is Allah, uniquely One, without associate, partner, or peer in His essence and attributes.",
    tafsir_am: "ስለ ጌታህ ለጠየቁህ በላቸው፡- 'እርሱ አላህ በጌትነቱ፣ በአምላክነቱና በመልካም ስሞቹ ብቸኛ አንድ የሆነ አምላክ ነው።'"
  },
  {
    verse_key: "112:2",
    surah_number: 112,
    verse_number: 2,
    text_uthmani: "ٱللَّهُ ٱلصَّمَدُ",
    translation_en: "Allah, the Eternal Refuge.",
    translation_am: "አላህ (የሁሉ) መጠጊያ ነው፤ (የሚከጅሉት)።",
    tafsir_ar: "السيد الذي كمل في سؤدده وشرفه وعظمته، والذي تصمد إليه الخلائق وتقصده في جميع حوائجها ورغائبها، لا يطعم ولا يشرب.",
    tafsir_en: "Allah, the Self-Sufficient Master upon whom all creatures depend for their needs, while He needs nothing from any creation.",
    tafsir_am: "ፍጥረታት ሁሉ ፍላጎታቸውን ለማሟላት ወደ እርሱ የሚከጅሉትና የሚጠጉበት፣ እርሱ ግን ከምንም ነገር ተብቃቂ የሆነ ጌታ ነው።"
  },
  {
    verse_key: "112:3",
    surah_number: 112,
    verse_number: 3,
    text_uthmani: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    translation_en: "He neither begets nor is born,",
    translation_am: "አልወለደም፤ አልተወለደምም።",
    tafsir_ar: "تنزه سبحانه عن الولد والوالد والصاحبة، فليس له مثيل يماثله ولا أصل يسبقه، فهو الأول بلا ابتداء.",
    tafsir_en: "Far exalted is He above having offspring, parentage, or spouse; having neither beginning nor predecessor, and leaving no progeny.",
    tafsir_am: "ልጅ አልወለደም፣ ከማንም አልተወለደም፣ ሚስትም የለውም፤ እርሱ መጀመሪያ የሌለው ብቸኛ ፈጣሪ ነው።"
  },
  {
    verse_key: "112:4",
    surah_number: 112,
    verse_number: 4,
    text_uthmani: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
    translation_en: "Nor is there to Him any equivalent.'",
    translation_am: "ለእርሱም አምሳያ አንድም የለም።'",
    tafsir_ar: "ليس له مكافئ ولا مماثل ولا شبيه في ذاته ولا في صفاته ولا في أفعاله جل في علاه.",
    tafsir_en: "And there is nothing comparable, equal, or similar to Him in His supreme essence, majesty, or attributes.",
    tafsir_am: "በማንነቱ፣ በባህሪያቱና በስራዎቹ ሁሉ ለእርሱ አምሳያ፣ ወደር ወይም ተጋሪ ፈጽሞ የለም።"
  },

  // Surah 113: Al-Falaq (113:1 - 113:5)
  {
    verse_key: "113:1",
    surah_number: 113,
    verse_number: 1,
    text_uthmani: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ",
    translation_en: "Say, 'I seek refuge in the Lord of daybreak",
    translation_am: "በላቸው፡- 'በማለዳው ጎህ ጌታ እጠበቃለሁ፤'",
    tafsir_ar: "قل أعتصم وأتحصن برب الصبح وفالق الإصباح والنوى والحب.",
    tafsir_en: "Say: I seek sanctuary, shelter, and divine protection with the Lord of the morning dawn.",
    tafsir_am: "በላቸው፡- 'ጨለማን ሰንጥቆ ጎህን በሚያወጣው የንጋት ጌታ እጠበቃለሁ፤'"
  },
  {
    verse_key: "113:2",
    surah_number: 113,
    verse_number: 2,
    text_uthmani: "مِن شَرِّ مَا خَلَقَ",
    translation_en: "From the evil of that which He created",
    translation_am: "ከፈጠረው ፍጡር ክፋት ሁሉ፤",
    tafsir_ar: "من شر جميع المخلوقات من إنس وجن وحيوان وهوام وظواهر مؤذية.",
    tafsir_en: "From the harm and malice of any entity among His creations, visible or unseen.",
    tafsir_am: "ከፈጠራቸው ፍጥረታት ሁሉ (ከሰው፣ ከጂንና ከእንስሳት) ክፋትና ተንኮል፤"
  },
  {
    verse_key: "113:3",
    surah_number: 113,
    verse_number: 3,
    text_uthmani: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
    translation_en: "And from the evil of darkness when it settles",
    translation_am: "ከጨለማም ክፋት በገባ ጊዜ፤",
    tafsir_ar: "ومن شرور الليل وظلامه إذا دخل ودجى، لما ينتشر فيه من الشياطين وأهل السوء والسباع.",
    tafsir_en: "And from the evils that proliferate in the intense darkness of the night when it blankets the earth.",
    tafsir_am: "ሌሊት ጨለማው በገባና በሰፈነ ጊዜ ከሚሰራጩ ክፉ ነገሮች፤"
  },
  {
    verse_key: "113:4",
    surah_number: 113,
    verse_number: 4,
    text_uthmani: "وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ",
    translation_en: "And from the evil of the blowers in knots",
    translation_am: "በቋጠሮዎች ላይ ተፊዎች ከሆኑት (ደጋሚዎች) ክፋት፤",
    tafsir_ar: "ومن شر الساحرات والساحرين الذين ينفثون بريقهم على العقد لإلحاق الضرر بالناس بالأسحار.",
    tafsir_en: "And from the malice of sorcerers who blow with incantations upon knots to inflict harm.",
    tafsir_am: "ሰዎችን ለመጉዳት ክር እየቋጠሩ በሚተፉ የድግምት አድራጊዎች ተንኮል፤"
  },
  {
    verse_key: "113:5",
    surah_number: 113,
    verse_number: 5,
    text_uthmani: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    translation_en: "And from the evil of an envier when he envies.'",
    translation_am: "ከምቀኛም ክፋት በምቀኘ ጊዜ።'",
    tafsir_ar: "ومن شر الحاسد الذي يتمنى زوال النعمة عن غيره ويؤذي بعينه ونواياه الخبيثة.",
    tafsir_en: "And from the insidious harm of the jealous envier when he harbors or acts upon malice.",
    tafsir_am: "የሌላውን ሰው ጸጋ እንዲወገድ ከሚመኝ ምቀኛ ተንኮልና አይነ-ጥላ እጠበቃለሁ።"
  },

  // Surah 114: An-Nas (114:1 - 114:6)
  {
    verse_key: "114:1",
    surah_number: 114,
    verse_number: 1,
    text_uthmani: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ",
    translation_en: "Say, 'I seek refuge in the Lord of mankind,",
    translation_am: "በላቸው፡- 'በሰዎች ጌታ እጠበቃለሁ፤",
    tafsir_ar: "قل أعتصم وألوذ برب جميع البشر وخالقهم ومدبر أمورهم.",
    tafsir_en: "Say: I seek refuge in the Creator, Sustainer, and Caretaker of all humanity,",
    tafsir_am: "በላቸው፡- 'የሰዎች ሁሉ ፈጣሪና ጠባቂ በሆነው ጌታ እጠበቃለሁ፤'"
  },
  {
    verse_key: "114:2",
    surah_number: 114,
    verse_number: 2,
    text_uthmani: "مَلِكِ ٱلنَّاسِ",
    translation_en: "The Sovereign of mankind,",
    translation_am: "የሰዎች ንጉሥ በሆነው፤",
    tafsir_ar: "الملك الحق الذي يدبر شؤون العباد ويحكم فيهم بأمره ونهيه وقضائه.",
    tafsir_en: "The true King and Ruler of mankind, whose decree governs all,",
    tafsir_am: "በሰዎች ላይ ፍጹም ስልጣን ባለው እውነተኛው ንጉሥ፤"
  },
  {
    verse_key: "114:3",
    surah_number: 114,
    verse_number: 3,
    text_uthmani: "إِلَٰهِ ٱلنَّاسِ",
    translation_en: "The God of mankind,",
    translation_am: "የሰዎች አምላክ በሆነው፤",
    tafsir_ar: "معبودهم الحق الذي لا إله لهم سواه ولا تجوز العبادة إلا لوجهه الكريم.",
    tafsir_en: "The true Deity of mankind, beside whom there is no rightful object of worship,",
    tafsir_am: "ከእርሱ በስተቀር ሌላ አምላክ በሌለው እውነተኛው የሰው ልጆች አምላክ፤"
  },
  {
    verse_key: "114:4",
    surah_number: 114,
    verse_number: 4,
    text_uthmani: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ",
    translation_en: "From the evil of the retreating whisperer -",
    translation_am: "ከአሳሳቹና ተሸሻዩ (ሸይጣን) ክፋት፤",
    tafsir_ar: "من شر الشيطان الذي يوسوس في قلوب الناس بالشر والشكوك، فإذا ذكر الله خنس وتوارى.",
    tafsir_en: "From the malicious whispers of Satan, who tempts and casts doubts into human hearts, then slinks away when Allah is remembered.",
    tafsir_am: "በሰዎች ልብ ውስጥ መጥፎ ሀሳብን ከሚዘራውና የአላህ ስም ሲወሳ ወደኋላ ከሚሸሸው ሸይጣን ተንኮል፤"
  },
  {
    verse_key: "114:5",
    surah_number: 114,
    verse_number: 5,
    text_uthmani: "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ",
    translation_en: "Who whispers [evil] into the breasts of mankind -",
    translation_am: "ያ በሰዎች ደረቶች ውስጥ (ክፉን) የሚያንሾካሹከው፤",
    tafsir_ar: "الذي يلقي الشبهات والشهوات والوساوس في قلوب بني آدم لصدهم عن الهدى.",
    tafsir_en: "Who instills insidious doubts, deceit, and false desires within the chests of humanity to divert them from guidance.",
    tafsir_am: "ሰዎችን ከቀጥተኛው መንገድ ለማሳት በልቦቻቸው ውስጥ ጥርጣሬንና ክፉ ምኞትን የሚተፋው፤"
  },
  {
    verse_key: "114:6",
    surah_number: 114,
    verse_number: 6,
    text_uthmani: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ",
    translation_en: "From among the jinn and mankind.'",
    translation_am: "ከአጋንንትም ከሰዎችም የሆነው።'",
    tafsir_ar: "سواء كان هذا الموسوس من شياطين الجن الخفيين، أو من شياطين الإنس الذين يزينون الباطل.",
    tafsir_en: "Whether those tempters are from among the unseen jinn or from human beings who disguise evil as good.",
    tafsir_am: "ይህ አሳሳች ከማይታዩት የጂን ሰራዊት ወይም መጥፎ ነገርን ከሚያስተዋውቁ የሰው አጋንንት ሊሆን ይችላል።"
  }
];

fs.writeFileSync(path.join(dataDir, 'quran_ayahs.json'), JSON.stringify(ayahs, null, 2), 'utf-8');
console.log(`Generated ${ayahs.length} curated ayahs in data/quran_ayahs.json`);
