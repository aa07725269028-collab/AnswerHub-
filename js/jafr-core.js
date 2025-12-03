// النظام الجفري المتكامل - النواة الجفرية
// إصدار متقدم بأقصى دقة حسابية

class JafrCore {
    constructor() {
        this.constants = window.JafrConstants;
        this.reset();
    }

    // ============================================
    // 1. إعادة التعيين والتجهيز
    // ============================================
    
    reset() {
        this.question = '';
        this.askerName = '';
        this.motherName = '';
        this.day = '';
        this.month = '';
        this.year = '';
        this.risingSign = '';
        this.moonSign = '';
        this.moonMansion = '';
        this.hourLord = '';
        
        this.letters = [];
        this.values = [];
        this.reducedValues = [];
        
        this.entrances = {
            madkhalKabir: 0,
            madkhalWaseetKabir: 0,
            majmooMadkhalWaseet: 0,
            madkhalSagheer: 0
        };
        
        this.steps = {
            asas: '',          // السطر 1
            nazir: '',         // السطر 2
            nisbatAsas: [],    // السطر 3
            nisbatNazir: [],   // السطر 4
            tatimma1: [],      // السطر 5
            asasNazir1: [],    // السطر 6
            asasNazir2: [],    // السطر 7
            tatimma2: [],      // السطر 8
            tatimmaTatimma: [], // السطر 9
            hasilAdad: [],     // السطر 10
            quwa: [],          // السطر 11
            hasel: [],         // السطر 12
            mustahsala: [],    // السطر 13
            nazirMustahsala: [], // السطر 14
            jawab: '',         // السطر 15
        };
        
        this.externalFactors = {
            timeFactor: '',
            astroFactor: '',
            nameFactor: '',
            combinedFactor: ''
        };
        
        this.analysis = {
            takseer: '',
            muwazana: '',
            tawil: '',
            finalAnswer: ''
        };
        
        this.status = 'ready';
        this.startTime = null;
        this.endTime = null;
    }

    // ============================================
    // 2. معالجة المدخلات الأولية
    // ============================================
    
    setQuestion(question) {
        this.question = question;
        this.processQuestion();
    }
    
    setPersonalInfo(name, motherName = '') {
        this.askerName = name;
        this.motherName = motherName;
    }
    
    setTimeFactors(day, month, year) {
        this.day = day;
        this.month = month;
        this.year = year;
    }
    
    setAstroFactors(risingSign, moonSign, moonMansion, hourLord) {
        this.risingSign = risingSign;
        this.moonSign = moonSign;
        this.moonMansion = moonMansion;
        this.hourLord = hourLord;
    }
    
    processQuestion() {
        // تنظيف النص وتقسيمه إلى حروف
        this.letters = this.constants.textToLetters(this.question);
        
        // حساب القيم العددية
        this.values = this.letters.map(char => 
            this.constants.getCharValueKabir(char)
        );
        
        // رد القيم إلى الآحاد
        this.reducedValues = this.values.map(value => 
            this.constants.reduceToOnes(value)
        );
        
        return this.letters.length;
    }

    // ============================================
    // 3. حساب المداخل الأربعة
    // ============================================
    
    calculateEntrances() {
        if (this.values.length === 0) {
            throw new Error('يجب معالجة السؤال أولاً');
        }
        
        // 1. المدخل الكبير
        this.entrances.madkhalKabir = this.values.reduce((sum, val) => sum + val, 0);
        
        // 2. المدخل الوسيط الكبير
        this.entrances.madkhalWaseetKabir = this.constants.reduceToOnes(
            this.entrances.madkhalKabir
        );
        
        // 3. مجموع المدخل الوسيط
        this.entrances.majmooMadkhalWaseet = this.reducedValues.reduce((sum, val) => sum + val, 0);
        
        // 4. المدخل الصغير
        this.entrances.madkhalSagheer = this.constants.reduceToOnes(
            this.entrances.majmooMadkhalWaseet
        );
        
        return this.entrances;
    }

    // ============================================
    // 4. توليد سطر الأساس (البسط الملفوظي)
    // ============================================
    
    generateAsas() {
        const entrancesStr = [
            this.entrances.madkhalKabir,
            this.entrances.madkhalWaseetKabir,
            this.entrances.majmooMadkhalWaseet,
            this.entrances.madkhalSagheer
        ].join('');
        
        // تحويل الأرقام إلى حروف (استنطاق)
        let asas = '';
        for (let i = 0; i < entrancesStr.length; i++) {
            const num = parseInt(entrancesStr[i]);
            if (!isNaN(num) && num > 0) {
                const letter = this.constants.numberToLettersString(num);
                asas += letter;
            }
        }
        
        // إذا كان الناتج قصيراً، نضيف حروفاً من السؤال
        if (asas.length < 8) {
            const questionLetters = this.letters.slice(0, 8 - asas.length).join('');
            asas = questionLetters + asas;
        }
        
        // نضمن أن السطر يحتوي على 16 حرفاً (القاعدة)
        if (asas.length > 16) {
            asas = asas.substring(0, 16);
        } else if (asas.length < 16) {
            // تكرار الحروف لملء 16 حرفاً
            while (asas.length < 16) {
                asas += asas;
            }
            asas = asas.substring(0, 16);
        }
        
        this.steps.asas = asas;
        return asas;
    }

    // ============================================
    // 5. سطر النظيرة
    // ============================================
    
    generateNazir() {
        const asas = this.steps.asas;
        let nazir = '';
        
        for (const char of asas) {
            nazir += this.constants.getNazir(char) || char;
        }
        
        this.steps.nazir = nazir;
        return nazir;
    }

    // ============================================
    // 6. حاصل نسبة سطر الأساس
    // ============================================
    
    calculateNisbatAsas() {
        const asas = this.steps.asas;
        const values = asas.split('').map(char => 
            this.constants.reduceToOnes(this.constants.getCharValueKabir(char))
        );
        
        const nisbat = [];
        for (let i = 0; i < values.length - 1; i++) {
            const a = values[i];
            const b = values[i + 1];
            nisbat.push(this.constants.getNisbat(a, b));
        }
        
        this.steps.nisbatAsas = nisbat;
        return nisbat;
    }

    // ============================================
    // 7. حاصل نسبة سطر النظيرة
    // ============================================
    
    calculateNisbatNazir() {
        const nazir = this.steps.nazir;
        const values = nazir.split('').map(char => 
            this.constants.reduceToOnes(this.constants.getCharValueKabir(char))
        );
        
        const nisbat = [];
        for (let i = 0; i < values.length - 1; i++) {
            const a = values[i];
            const b = values[i + 1];
            nisbat.push(this.constants.getNisbat(a, b));
        }
        
        this.steps.nisbatNazir = nisbat;
        return nisbat;
    }

    // ============================================
    // 8. سطر التتمة الأولى
    // ============================================
    
    calculateTatimma1() {
        const asasNisbat = this.steps.nisbatAsas;
        const nazirNisbat = this.steps.nisbatNazir;
        
        const tatimma = [];
        for (let i = 0; i < asasNisbat.length; i++) {
            const a = asasNisbat[i];
            const b = nazirNisbat[i];
            
            if (a === b) {
                tatimma.push(a + b);
            } else {
                tatimma.push(Math.abs(a - b));
            }
        }
        
        this.steps.tatimma1 = tatimma;
        return tatimma;
    }

    // ============================================
    // 9. حاصل نسبة الأساس والنظيرة (الأولى)
    // ============================================
    
    calculateAsasNazir1() {
        const asas = this.steps.asas;
        const nazir = this.steps.nazir;
        
        const valuesAsas = asas.split('').map(char => 
            this.constants.reduceToOnes(this.constants.getCharValueKabir(char))
        );
        
        const valuesNazir = nazir.split('').map(char => 
            this.constants.reduceToOnes(this.constants.getCharValueKabir(char))
        );
        
        const result = [];
        for (let i = 0; i < valuesAsas.length; i++) {
            const a = valuesAsas[i];
            const b = valuesNazir[i];
            result.push(this.constants.getNisbat(a, b));
        }
        
        this.steps.asasNazir1 = result;
        return result;
    }

    // ============================================
    // 10. حاصل نسبة الأساس والنظيرة (الثانية - التدوير)
    // ============================================
    
    calculateAsasNazir2() {
        const first = this.steps.asasNazir1;
        const result = [...first.slice(1), first[0]];
        
        this.steps.asasNazir2 = result;
        return result;
    }

    // ============================================
    // 11. سطر التتمة الثانية
    // ============================================
    
    calculateTatimma2() {
        const first = this.steps.asasNazir1;
        const second = this.steps.asasNazir2;
        
        const tatimma = [];
        for (let i = 0; i < first.length; i++) {
            const a = first[i];
            const b = second[i];
            
            if (a === b) {
                tatimma.push(a + b);
            } else {
                tatimma.push(Math.abs(a - b));
            }
        }
        
        this.steps.tatimma2 = tatimma;
        return tatimma;
    }

    // ============================================
    // 12. سطر تتمة التتمتين
    // ============================================
    
    calculateTatimmaTatimma() {
        const tatimma1 = this.steps.tatimma1;
        const tatimma2 = this.steps.tatimma2;
        
        const result = [];
        for (let i = 0; i < tatimma1.length; i++) {
            const a = tatimma1[i];
            const b = tatimma2[i];
            
            if (a === b) {
                result.push(a + b);
            } else {
                result.push(Math.abs(a - b));
            }
        }
        
        this.steps.tatimmaTatimma = result;
        return result;
    }

    // ============================================
    // 13. سطر حاصل الأعداد (الاستنطاق)
    // ============================================
    
    calculateHasilAdad() {
        const numbers = this.steps.tatimmaTatimma;
        const letters = [];
        
        for (const num of numbers) {
            if (num <= 28) {
                // البحث عن الحرف المناسب في الأبجد الوضعي
                let found = false;
                for (const [letter, value] of Object.entries(this.constants.ABJAD_WADII)) {
                    if (value === num) {
                        letters.push(letter);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    // إذا لم نجد، نستخدم الطرح 9-9
                    const reduced = this.constants.subtractNineNine(num);
                    for (const [letter, value] of Object.entries(this.constants.ABJAD_WADII)) {
                        if (value === reduced) {
                            letters.push(letter);
                            break;
                        }
                    }
                }
            } else {
                // تطبيق الطرح 9-9 للأعداد الكبيرة
                const reduced = this.constants.subtractNineNine(num);
                for (const [letter, value] of Object.entries(this.constants.ABJAD_WADII)) {
                    if (value === reduced) {
                        letters.push(letter);
                        break;
                    }
                }
            }
        }
        
        this.steps.hasilAdad = letters;
        return letters;
    }

    // ============================================
    // 14. سطر القوى (الأكثر تعقيداً)
    // ============================================
    
    calculateQuwa() {
        const letters = this.steps.hasilAdad;
        const quwa = [];
        
        for (const letter of letters) {
            // تطبيق الطروح الستة
            const value = this.constants.getCharValueKabir(letter);
            
            const results = {
                '4-4': this.constants.subtractFourFour(value),
                '7-7': this.constants.subtractSevenSeven(value),
                '9-9': this.constants.subtractNineNine(value),
                '12-12': this.constants.subtractTwelveTwelve(value),
                '28': this.constants.subtractTwentyEight(value),
                '30': this.constants.subtractThirty(value)
            };
            
            // اختيار أفضل نتيجة بناءً على القرب من القيمة الأصلية
            const bestResult = Object.values(results).reduce((closest, current) => {
                return Math.abs(current - value) < Math.abs(closest - value) ? current : closest;
            });
            
            // البحث عن الحرف المناسب للقيمة
            let foundLetter = letter;
            for (const [char, val] of Object.entries(this.constants.ABJAD_WADII)) {
                if (val === bestResult) {
                    foundLetter = char;
                    break;
                }
            }
            
            quwa.push(foundLetter);
        }
        
        this.steps.quwa = quwa;
        return quwa;
    }

    // ============================================
    // 15. حساب العوامل الخارجية
    // ============================================
    
    calculateExternalFactors() {
        // 1. عامل الزمن
        const timeValue = this.calculateTimeValue();
        this.externalFactors.timeFactor = this.constants.numberToLettersString(timeValue);
        
        // 2. عامل الفلك
        const astroValue = this.calculateAstroValue();
        this.externalFactors.astroFactor = this.constants.numberToLettersString(astroValue);
        
        // 3. عامل الاسم
        const nameValue = this.calculateNameValue();
        this.externalFactors.nameFactor = this.constants.numberToLettersString(nameValue);
        
        // 4. المجموع الكلي
        const total = timeValue + astroValue + nameValue;
        this.externalFactors.combinedFactor = this.constants.numberToLettersString(total);
        
        return this.externalFactors;
    }
    
    calculateTimeValue() {
        let value = 0;
        
        // حساب قيمة اليوم
        const days = {
            'السبت': 100, 'الأحد': 200, 'الاثنين': 300, 'الثلاثاء': 400,
            'الأربعاء': 500, 'الخميس': 600, 'الجمعة': 700
        };
        value += days[this.day] || 0;
        
        // حساب قيمة الشهر
        const months = {
            'محرم': 1, 'صفر': 2, 'ربيع الأول': 3, 'ربيع الآخر': 4,
            'جمادى الأولى': 5, 'جمادى الآخرة': 6, 'رجب': 7, 'شعبان': 8,
            'رمضان': 9, 'شوال': 10, 'ذو القعدة': 11, 'ذو الحجة': 12
        };
        value += (months[this.month] || 0) * 50;
        
        // حساب قيمة السنة
        const yearNum = parseInt(this.year) || 1446;
        value += yearNum;
        
        return this.constants.reduceToOnes(value);
    }
    
    calculateAstroValue() {
        let value = 0;
        
        // قيمة الطالع
        const rising = this.constants.BURUJ[this.risingSign];
        value += rising ? rising.value : 0;
        
        // قيمة برج القمر
        const moon = this.constants.BURUJ[this.moonSign];
        value += moon ? moon.value : 0;
        
        // قيمة منزلة القمر
        const mansion = this.constants.MANAZIL_ALQAMAR[this.moonMansion];
        value += mansion ? mansion.value : 0;
        
        return this.constants.reduceToOnes(value);
    }
    
    calculateNameValue() {
        let value = 0;
        
        // حساب قيمة اسم السائل
        const nameLetters = this.constants.textToLetters(this.askerName);
        value += nameLetters.reduce((sum, char) => 
            sum + this.constants.getCharValueKabir(char), 0
        );
        
        // حساب قيمة اسم الأم (إن وجد)
        if (this.motherName) {
            const motherLetters = this.constants.textToLetters(this.motherName);
            value += motherLetters.reduce((sum, char) => 
                sum + this.constants.getCharValueKabir(char), 0
            );
        }
        
        return this.constants.reduceToOnes(value);
    }

    // ============================================
    // 16. سطر الحاصل
    // ============================================
    
    calculateHasel() {
        const asas = this.steps.asas.split('');
        const nazir = this.steps.nazir.split('');
        const quwa = this.steps.quwa;
        const external = this.externalFactors.combinedFactor.split('');
        
        // دمج جميع الحروف
        const allLetters = [...asas, ...nazir, ...quwa, ...external];
        
        // تطبيق المسانخة (إسقاط الآحاد)
        const reduced = allLetters.map(letter => {
            const value = this.constants.getCharValueKabir(letter);
            return this.constants.reduceToOnes(value);
        });
        
        // تحويل الأرقام إلى حروف
        const hasel = reduced.map(num => {
            for (const [letter, value] of Object.entries(this.constants.ABJAD_WADII)) {
                if (value === num) {
                    return letter;
                }
            }
            return 'أ'; // القيمة الافتراضية
        });
        
        this.steps.hasel = hasel;
        return hasel;
    }

    // ============================================
    // 17. سطر المستحصلة الشريفة (الأكثر دقة)
    // ============================================
    
    calculateMustahsala() {
        const hasel = this.steps.hasel;
        const mustahsala = [];
        
        for (let i = 0; i < hasel.length; i++) {
            const char = hasel[i];
            const tabia = this.constants.getCharTabia(char);
            
            // تطبيق البعد الأبجدي
            const abjadValue = this.constants.getCharValueKabir(char);
            const abjadDistance = this.constants.subtractNineNine(abjadValue);
            
            // تطبيق البعد الجدولي
            const tableDistance = this.calculateTableDistance(char, tabia);
            
            // دمج البعدين
            const combined = (abjadDistance + tableDistance) % 9 || 9;
            
            // البحث عن الحرف المناسب
            let resultChar = char;
            for (const [letter, value] of Object.entries(this.constants.ABJAD_WADII)) {
                if (value === combined) {
                    resultChar = letter;
                    break;
                }
            }
            
            mustahsala.push(resultChar);
        }
        
        this.steps.mustahsala = mustahsala;
        return mustahsala;
    }
    
    calculateTableDistance(char, tabia) {
        // حساب البعد بناءً على دائرة الطبائع
        const circle = this.constants.DAWRA_AHTAM[tabia];
        if (!circle) return 1;
        
        const index = circle.indexOf(char);
        if (index === -1) return 1;
        
        return (index % 4) + 1;
    }

    // ============================================
    // 18. سطر نظير المستحصلة
    // ============================================
    
    calculateNazirMustahsala() {
        const mustahsala = this.steps.mustahsala;
        const nazir = mustahsala.map(char => 
            this.constants.getNazir(char) || char
        );
        
        this.steps.nazirMustahsala = nazir;
        return nazir;
    }

    // ============================================
    // 19. سطر الجواب (الصدر والمؤخر)
    // ============================================
    
    calculateJawab() {
        const nazir = this.steps.nazirMustahsala;
        const length = nazir.length;
        
        if (length === 0) return '';
        
        // تطبيق قاعدة "مؤخر صدر"
        const jawabArray = [];
        let start = 0;
        let end = length - 1;
        
        for (let i = 0; i < length; i++) {
            if (i % 2 === 0) {
                // حرف من المؤخر (النهاية)
                jawabArray.push(nazir[end]);
                end--;
            } else {
                // حرف من الصدر (البداية)
                jawabArray.push(nazir[start]);
                start++;
            }
        }
        
        const jawab = jawabArray.join('');
        this.steps.jawab = jawab;
        
        // تحويل الجواب إلى نص مفهوم
        this.analyzeJawab(jawab);
        
        return jawab;
    }
    
    analyzeJawab(jawab) {
        // محاولة تجميع الحروف إلى كلمات ذات معنى
        let interpretation = '';
        const words = this.splitIntoWords(jawab);
        
        for (const word of words) {
            if (word.length >= 2) {
                const meaning = this.getWordMeaning(word);
                if (meaning) {
                    interpretation += meaning + ' ';
                }
            }
        }
        
        if (!interpretation) {
            // إذا لم نجد تفسيراً مباشراً، نستخدم التكسير
            interpretation = this.performTakseer(jawab);
        }
        
        this.analysis.finalAnswer = interpretation || jawab;
        return interpretation;
    }
    
    splitIntoWords(text) {
        // محاولة تقسيم الحروف إلى كلمات عربية محتملة
        const words = [];
        let current = '';
        
        for (const char of text) {
            current += char;
            if (current.length >= 2 && this.isPossibleWord(current)) {
                words.push(current);
                current = '';
            }
        }
        
        if (current) words.push(current);
        return words;
    }
    
    isPossibleWord(word) {
        // قائمة ببعض الكلمات العربية الشائعة
        const commonWords = [
            'الله', 'الرحمن', 'الرحيم', 'العلم', 'الحكمة',
            'النور', 'الهدى', 'الخير', 'البركة', 'السعادة',
            'الصبر', 'اليقين', 'التوفيق', 'النجاح', 'الفوز'
        ];
        
        return commonWords.some(w => w.includes(word) || word.includes(w));
    }
    
    getWordMeaning(word) {
        const meanings = {
            'الله': 'الله سبحانه وتعالى',
            'رحمن': 'الرحمن الرحيم',
            'عليم': 'العليم الحكيم',
            'حكيم': 'الحكمة والإتقان',
            'نور': 'النور والهداية',
            'هدى': 'الهداية والتوفيق',
            'خير': 'الخير والبركة',
            'بركة': 'البركة والنماء',
            'صبر': 'الصبر والثبات',
            'يقين': 'اليقين والثقة',
            'توفيق': 'التوفيق والنجاح',
            'نجاح': 'النجاح والفلاح',
            'فتح': 'الفتح والنصر'
        };
        
        return meanings[word];
    }

    // ============================================
    // 20. التكسير والتحليل الإضافي
    // ============================================
    
    performTakseer(text) {
        // تطبيق التكسير العكسي
        const takseer = [];
        const chars = text.split('');
        const length = chars.length;
        
        for (let i = 0; i < Math.min(6, length); i++) {
            const step = [];
            for (let j = i; j < length; j += (i + 1)) {
                step.push(chars[j]);
            }
            takseer.push(step.join(''));
        }
        
        this.analysis.takseer = takseer.join(' | ');
        return this.analyzeTakseer(takseer);
    }
    
    analyzeTakseer(takseer) {
        // تحليل نتائج التكسير
        let result = '';
        
        for (let i = 0; i < takseer.length; i++) {
            const segment = takseer[i];
            if (segment.length >= 3) {
                const meaning = this.getSegmentMeaning(segment, i + 1);
                if (meaning) {
                    result += `(المرحلة ${i + 1}: ${meaning}) `;
                }
            }
        }
        
        return result || 'النتيجة تحتاج إلى تأمل وتفكير';
    }
    
    getSegmentMeaning(segment, stage) {
        const meaningsByStage = {
            1: {
                'خير': 'الخير حاضر',
                'نور': 'النور ساطع',
                'هدى': 'الهداية قريبة'
            },
            2: {
                'صبر': 'الصبر مطلوب',
                'عمل': 'العمل مجزٍ',
                'جهد': 'الجهد مثمر'
            },
            3: {
                'توفيق': 'التوفيق حليفك',
                'نجاح': 'النجاح في الطريق',
                'فتح': 'الفتح قادم'
            }
        };
        
        const meanings = meaningsByStage[stage];
        if (!meanings) return '';
        
        for (const [key, value] of Object.entries(meanings)) {
            if (segment.includes(key)) {
                return value;
            }
        }
        
        return '';
    }

    // ============================================
    // 21. تنفيذ الحساب الكامل
    // ============================================
    
    async calculateFullJafr() {
        try {
            this.status = 'processing';
            this.startTime = new Date();
            
            // المرحلة 1: المدخلات الأساسية
            await this.updateProgress(5, 'معالجة السؤال...');
            this.calculateEntrances();
            
            await this.updateProgress(10, 'توليد سطر الأساس...');
            this.generateAsas();
            
            // المرحلة 2: الأسطر الأساسية
            await this.updateProgress(15, 'حساب النظيرة...');
            this.generateNazir();
            
            await this.updateProgress(20, 'حساب نسب الأساس...');
            this.calculateNisbatAsas();
            
            await this.updateProgress(25, 'حساب نسب النظيرة...');
            this.calculateNisbatNazir();
            
            await this.updateProgress(30, 'سطر التتمة الأولى...');
            this.calculateTatimma1();
            
            // المرحلة 3: التدوير والتتمة
            await this.updateProgress(35, 'حساب الأساس والنظيرة...');
            this.calculateAsasNazir1();
            
            await this.updateProgress(40, 'تدوير الحساب...');
            this.calculateAsasNazir2();
            
            await this.updateProgress(45, 'سطر التتمة الثانية...');
            this.calculateTatimma2();
            
            await this.updateProgress(50, 'سطر تتمة التتمتين...');
            this.calculateTatimmaTatimma();
            
            // المرحلة 4: الاستنطاق والقوى
            await this.updateProgress(55, 'استنطاق الأعداد...');
            this.calculateHasilAdad();
            
            await this.updateProgress(60, 'حساب سطر القوى...');
            this.calculateQuwa();
            
            // المرحلة 5: العوامل الخارجية
            await this.updateProgress(65, 'حساب العوامل الزمنية...');
            this.calculateExternalFactors();
            
            await this.updateProgress(70, 'حساب سطر الحاصل...');
            this.calculateHasel();
            
            // المرحلة 6: المستحصلة والجواب
            await this.updateProgress(75, 'حساب المستحصلة الشريفة...');
            this.calculateMustahsala();
            
            await this.updateProgress(80, 'حساب نظير المستحصلة...');
            this.calculateNazirMustahsala();
            
            await this.updateProgress(85, 'توليد الجواب النهائي...');
            this.calculateJawab();
            
            // المرحلة 7: التحليل والتأويل
            await this.updateProgress(90, 'تحليل النتائج...');
            this.performTakseer(this.steps.jawab);
            
            await this.updateProgress(95, 'تأويل الجواب...');
            this.finalizeAnalysis();
            
            await this.updateProgress(100, 'اكتمل الحساب بنجاح!');
            
            this.endTime = new Date();
            this.status = 'completed';
            
            return {
                success: true,
                answer: this.analysis.finalAnswer,
                steps: this.steps,
                entrances: this.entrances,
                analysis: this.analysis,
                duration: this.getDuration()
            };
            
        } catch (error) {
            this.status = 'error';
            console.error('Error in Jafr calculation:', error);
            throw error;
        }
    }
    
    updateProgress(percent, message) {
        return new Promise(resolve => {
            setTimeout(() => {
                if (window.updateProgressUI) {
                    window.updateProgressUI(percent, message);
                }
                resolve();
            }, 100);
        });
    }
    
    finalizeAnalysis() {
        // دمج جميع التحليلات في نتيجة نهائية
        let finalAnswer = '';
        
        if (this.analysis.finalAnswer) {
            finalAnswer = this.analysis.finalAnswer;
        } else if (this.analysis.tawil) {
            finalAnswer = this.analysis.tawil;
        } else if (this.steps.jawab) {
            finalAnswer = this.steps.jawab;
        }
        
        // إضافة توصيات بناءً على التحليل
        const recommendations = this.generateRecommendations();
        if (recommendations) {
            finalAnswer += `\n\n📌 توصيات: ${recommendations}`;
        }
        
        this.analysis.finalAnswer = finalAnswer;
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        // تحليل الطبائع
        const tabaiCount = {
            'ناري': 0,
            'هوائي': 0,
            'مائي': 0,
            'ترابي': 0
        };
        
        const allChars = [
            ...this.steps.asas.split(''),
            ...this.steps.nazir.split(''),
            ...this.steps.quwa
        ];
        
        for (const char of allChars) {
            const tabia = this.constants.getCharTabia(char);
            if (tabaiCount[tabia] !== undefined) {
                tabaiCount[tabia]++;
            }
        }
        
        // إضافة توصيات بناءً على الغلبة
        const maxTabia = Object.entries(tabaiCount).reduce((a, b) => 
            a[1] > b[1] ? a : b
        )[0];
        
        switch (maxTabia) {
            case 'ناري':
                recommendations.push('الطاقة نارية تحتاج إلى توجيه صحيح');
                break;
            case 'هوائي':
                recommendations.push('التفكير مجرد يحتاج إلى تركيز');
                break;
            case 'مائي':
                recommendations.push('المشاعر غالبة تحتاج إلى توازن');
                break;
            case 'ترابي':
                recommendations.push('الواقعية غالبة تحتاج إلى مرونة');
                break;
        }
        
        return recommendations.join('، ');
    }
    
    getDuration() {
        if (!this.startTime || !this.endTime) return 'غير محسوب';
        
        const duration = this.endTime - this.startTime;
        const seconds = Math.floor(duration / 1000);
        const milliseconds = duration % 1000;
        
        return `${seconds}.${milliseconds} ثانية`;
    }

    // ============================================
    // 22. وظائف التصدير والاستيراد
    // ============================================
    
    exportData() {
        return {
            question: this.question,
            entrances: this.entrances,
            steps: this.steps,
            analysis: this.analysis,
            externalFactors: this.externalFactors,
            status: this.status,
            timestamp: new Date().toISOString()
        };
    }
    
    importData(data) {
        if (!data || typeof data !== 'object') {
            throw new Error('بيانات غير صالحة للاستيراد');
        }
        
        this.question = data.question || '';
        this.entrances = data.entrances || {};
        this.steps = data.steps || {};
        this.analysis = data.analysis || {};
        this.externalFactors = data.externalFactors || {};
        this.status = data.status || 'ready';
    }

    // ============================================
    // 23. وظائف التقرير
    // ============================================
    
    generateReport() {
        const report = {
            title: 'تقرير الحساب الجفري المتكامل',
            timestamp: new Date().toLocaleString('ar-SA'),
            question: this.question,
            entrances: this.entrances,
            finalAnswer: this.analysis.finalAnswer || this.steps.jawab,
            steps: Object.entries(this.steps).map(([key, value]) => ({
                step: this.getStepName(key),
                value: Array.isArray(value) ? value.join(', ') : value
            })),
            analysis: this.analysis,
            recommendations: this.generateRecommendations(),
            duration: this.getDuration()
        };
        
        return report;
    }
    
    getStepName(stepKey) {
        const names = {
            asas: 'السطر 1: سطر الأساس',
            nazir: 'السطر 2: سطر النظيرة',
            nisbatAsas: 'السطر 3: حاصل نسبة الأساس',
            nisbatNazir: 'السطر 4: حاصل نسبة النظيرة',
            tatimma1: 'السطر 5: سطر التتمة الأولى',
            asasNazir1: 'السطر 6: حاصل نسبة الأساس والنظيرة (الأولى)',
            asasNazir2: 'السطر 7: حاصل نسبة الأساس والنظيرة (الثانية)',
            tatimma2: 'السطر 8: سطر التتمة الثانية',
            tatimmaTatimma: 'السطر 9: سطر تتمة التتمتين',
            hasilAdad: 'السطر 10: سطر حاصل الأعداد',
            quwa: 'السطر 11: سطر القوى',
            hasel: 'السطر 12: سطر الحاصل',
            mustahsala: 'السطر 13: سطر المستحصلة الشريفة',
            nazirMustahsala: 'السطر 14: سطر نظير المستحصلة',
            jawab: 'السطر 15: سطر الجواب (الصدر والمؤخر)'
        };
        
        return names[stepKey] || stepKey;
    }
}

// تصدير الفئة للاستخدام العالمي
window.JafrCore = JafrCore;
console.log('✅ تم تحميل النواة الجفرية بنجاح');
