// النظام الجفري المتكامل - وظائف الحساب المتقدمة
// إصدار متقدم بأقصى دقة حسابية

class JafrCalculations {
    constructor() {
        this.constants = window.JafrConstants;
    }

    // ============================================
    // 1. حساب المداخل الأربعة المتقدمة
    // ============================================
    
    calculateAdvancedEntrances(letters) {
        const values = letters.map(char => 
            this.constants.getCharValueKabir(char)
        );
        
        const reduced = values.map(val => 
            this.constants.reduceToOnes(val)
        );
        
        // المدخل الكبير (مع مراعاة المواضع)
        let madkhalKabir = 0;
        values.forEach((value, index) => {
            madkhalKabir += value * (index + 1);
        });
        
        // المدخل الوسيط الكبير (مع التدوير)
        let madkhalWaseetKabir = madkhalKabir;
        while (madkhalWaseetKabir > 9) {
            madkhalWaseetKabir = this.constants.reduceToOnes(madkhalWaseetKabir);
            madkhalWaseetKabir = this.constants.subtractNineNine(madkhalWaseetKabir);
        }
        
        // مجموع المدخل الوسيط (مع الترجيح)
        let majmooMadkhalWaseet = 0;
        reduced.forEach((value, index) => {
            const weight = index % 4 + 1; // 1-4
            majmooMadkhalWaseet += value * weight;
        });
        
        // المدخل الصغير (مع التنقية)
        let madkhalSagheer = majmooMadkhalWaseet;
        for (let i = 0; i < 3; i++) {
            madkhalSagheer = this.constants.reduceToOnes(madkhalSagheer);
            madkhalSagheer = this.constants.subtractFourFour(madkhalSagheer);
        }
        
        return {
            madkhalKabir,
            madkhalWaseetKabir,
            majmooMadkhalWaseet,
            madkhalSagheer,
            values,
            reduced
        };
    }

    // ============================================
    // 2. توليد سطر الأساس المتقدم
    // ============================================
    
    generateAdvancedAsas(entrances, questionLetters) {
        // استخدام خوارزمية خاصة لتوليد سطر الأساس
        const components = [
            // 1. حروف من المداخل
            this.numberToAdvancedLetters(entrances.madkhalKabir),
            this.numberToAdvancedLetters(entrances.madkhalWaseetKabir),
            
            // 2. حروف من القيم المختزلة
            this.reducedToLetters(entrances.reduced),
            
            // 3. حروف من السؤال (مرتبة)
            this.arrangeQuestionLetters(questionLetters)
        ];
        
        // دجم المكونات
        let asas = components.join('');
        
        // تطبيق الدوران
        asas = this.applyRotation(asas, 3);
        
        // ضبط الطول إلى 16 حرفاً
        asas = this.adjustLength(asas, 16);
        
        return asas;
    }
    
    numberToAdvancedLetters(number) {
        // تحويل الرقم إلى حروف باستخدام نظام متقدم
        let result = '';
        let remaining = number;
        
        // استخدام مضاعفات خاصة
        const multipliers = [7, 13, 19, 28];
        for (const mult of multipliers) {
            const count = Math.floor(remaining / mult);
            if (count > 0) {
                const letter = this.getLetterByMultiple(mult, count);
                result += letter;
                remaining %= mult;
            }
        }
        
        // الباقي
        if (remaining > 0) {
            result += this.constants.numberToLettersString(remaining);
        }
        
        return result;
    }
    
    getLetterByMultiple(multiplier, count) {
        // حرف خاص لكل مضاعف
        const map = {
            7: 'ز',
            13: 'م',
            19: 'ق',
            28: 'غ'
        };
        
        const base = map[multiplier] || 'أ';
        return base.repeat(count % 9 || 1);
    }
    
    reducedToLetters(reducedValues) {
        // تحويل القيم المختزلة إلى حروف باستخدام الدوائر
        let result = '';
        
        for (const value of reducedValues) {
            // البحث في دوائر القوى
            const circle = this.findCircleForValue(value);
            if (circle) {
                result += circle[value % circle.length];
            } else {
                result += this.constants.numberToLettersString(value);
            }
        }
        
        return result;
    }
    
    findCircleForValue(value) {
        // البحث في دوائر الأسرار للقيمة
        const circles = [
            this.constants.DAWRA_ALQUWA['4-4']['أ'],
            this.constants.DAWRA_ALQUWA['7-7']['أ'],
            this.constants.DAWRA_ALQUWA['9-9']['أ']
        ];
        
        return circles[value % circles.length];
    }
    
    arrangeQuestionLetters(letters) {
        // ترتيب حروف السؤال بشكل خاص
        if (letters.length <= 4) {
            return letters.join('');
        }
        
        // تقسيم وتدوير
        const mid = Math.floor(letters.length / 2);
        const first = letters.slice(0, mid);
        const second = letters.slice(mid);
        
        return second.join('') + first.join('');
    }
    
    applyRotation(text, times) {
        // تطبيق التدوير على النص
        let result = text;
        for (let i = 0; i < times; i++) {
            result = result.slice(-1) + result.slice(0, -1);
        }
        return result;
    }
    
    adjustLength(text, targetLength) {
        // ضبط طول النص إلى القيمة المطلوبة
        if (text.length === targetLength) return text;
        
        if (text.length > targetLength) {
            return text.slice(0, targetLength);
        } else {
            // تكرار مع تعديل
            while (text.length < targetLength) {
                text += this.applyMutation(text);
            }
            return text.slice(0, targetLength);
        }
    }
    
    applyMutation(text) {
        // تطبيق تحول على النص لإنشاء محتوى جديد
        const lastChar = text.slice(-1);
        const value = this.constants.getCharValueKabir(lastChar) || 1;
        const nextValue = (value % 9) + 1;
        
        return this.constants.numberToLettersString(nextValue);
    }

    // ============================================
    // 3. حسابات النسب المتقدمة
    // ============================================
    
    calculateAdvancedNisbat(values) {
        // حساب النسب باستخدام خوارزمية متقدمة
        const nisbat = [];
        
        for (let i = 0; i < values.length - 1; i++) {
            const a = values[i];
            const b = values[i + 1];
            
            // استخدام جدول النسب الأساسي
            const basic = this.constants.getNisbat(a, b);
            
            // إضافة عوامل الترجيح
            const weighted = this.applyWeighting(basic, i + 1);
            
            // تطبيع القيمة
            const normalized = this.normalizeValue(weighted);
            
            nisbat.push(normalized);
        }
        
        return nisbat;
    }
    
    applyWeighting(value, position) {
        // تطبيق ترجيح بناءً على الموضع
        const weights = [1, 1.2, 1.4, 1.6, 1.8, 2.0, 1.8, 1.6, 1.4, 1.2];
        const weight = weights[position % weights.length] || 1;
        
        return Math.round(value * weight);
    }
    
    normalizeValue(value) {
        // تطبيع القيمة إلى نطاق 1-81
        while (value > 81) {
            value = this.constants.reduceToOnes(value);
        }
        
        while (value <= 0) {
            value += 9;
        }
        
        return value;
    }

    // ============================================
    // 4. حسابات القوى المتقدمة
    // ============================================
    
    calculateAdvancedQuwa(letters) {
        // حساب القوى باستخدام جميع الطروح الستة
        const quwa = [];
        
        for (const letter of letters) {
            const value = this.constants.getCharValueKabir(letter);
            
            // تطبيق جميع الطروح
            const results = {
                'elemental': this.constants.subtractFourFour(value),
                'planetary': this.constants.subtractSevenSeven(value),
                'celestial': this.constants.subtractNineNine(value),
                'zodiacal': this.constants.subtractTwelveTwelve(value),
                'lunar': this.constants.subtractTwentyEight(value),
                'gradient': this.constants.subtractThirty(value)
            };
            
            // اختيار أفضل نتيجة بناءً على معايير متعددة
            const bestResult = this.selectBestResult(results, value, letter);
            quwa.push(bestResult);
        }
        
        return quwa;
    }
    
    selectBestResult(results, originalValue, originalLetter) {
        // اختيار أفضل نتيجة بناءً على معايير متعددة
        
        // 1. القرب من القيمة الأصلية
        const byProximity = Object.entries(results).reduce((best, [key, value]) => {
            const distance = Math.abs(value - originalValue);
            const bestDistance = Math.abs(best.value - originalValue);
            return distance < bestDistance ? { key, value } : best;
        }, { key: '', value: originalValue });
        
        // 2. التوافق مع طبعة الحرف
        const tabia = this.constants.getCharTabia(originalLetter);
        const byTabia = this.getBestByTabia(results, tabia);
        
        // 3. التوازن العددي
        const byBalance = this.getBestByBalance(results);
        
        // الجمع بين المعايير
        const scores = {};
        Object.entries(results).forEach(([key, value]) => {
            let score = 0;
            
            if (byProximity.key === key) score += 3;
            if (byTabia.key === key) score += 2;
            if (byBalance.key === key) score += 1;
            
            scores[key] = score;
        });
        
        // اختيار الأعلى درجة
        const bestKey = Object.entries(scores).reduce((a, b) => 
            a[1] > b[1] ? a : b
        )[0];
        
        return results[bestKey];
    }
    
    getBestByTabia(results, tabia) {
        // اختيار أفضل نتيجة بناءً على الطبعة
        const tabiaMap = {
            'ناري': ['elemental', 'celestial'],
            'هوائي': ['planetary', 'gradient'],
            'مائي': ['lunar', 'celestial'],
            'ترابي': ['elemental', 'zodiacal']
        };
        
        const preferred = tabiaMap[tabia] || [];
        for (const key of preferred) {
            if (results[key] !== undefined) {
                return { key, value: results[key] };
            }
        }
        
        return { key: 'celestial', value: results.celestial };
    }
    
    getBestByBalance(results) {
        // اختيار أفضل نتيجة بناءً على التوازن العددي
        const values = Object.values(results);
        const average = values.reduce((a, b) => a + b, 0) / values.length;
        
        return Object.entries(results).reduce((best, [key, value]) => {
            const distance = Math.abs(value - average);
            const bestDistance = Math.abs(best.value - average);
            return distance < bestDistance ? { key, value } : best;
        }, { key: '', value: average });
    }

    // ============================================
    // 5. حسابات التكسير والتأويل
    // ============================================
    
    performAdvancedTakseer(text, levels = 6) {
        // تطبيق التكسير المتقدم
        const takseerLevels = [];
        const chars = text.split('');
        
        for (let level = 1; level <= levels; level++) {
            const pattern = this.generateTakseerPattern(level, chars.length);
            const levelText = this.applyPattern(chars, pattern);
            takseerLevels.push({
                level,
                pattern,
                text: levelText,
                analysis: this.analyzeTakseerLevel(levelText, level)
            });
        }
        
        return takseerLevels;
    }
    
    generateTakseerPattern(level, length) {
        // توليد نمط تكسير بناءً على المستوى
        const pattern = [];
        
        switch (level) {
            case 1: // كل حرف
                for (let i = 0; i < length; i++) pattern.push(i);
                break;
                
            case 2: // حرف ونحوه
                for (let i = 0; i < length; i += 2) pattern.push(i);
                break;
                
            case 3: // مثلثات
                for (let i = 0; i < length; i += 3) pattern.push(i);
                break;
                
            case 4: // مربعات
                for (let i = 0; i < length; i += 4) pattern.push(i);
                break;
                
            case 5: // مخمسات
                for (let i = 0; i < length; i += 5) pattern.push(i);
                break;
                
            case 6: // مسدسات
                for (let i = 0; i < length; i += 6) pattern.push(i);
                break;
                
            default:
                // نمط فيبوناتشي
                let a = 0, b = 1;
                while (a < length) {
                    pattern.push(a);
                    const temp = a;
                    a = b;
                    b = temp + b;
                }
        }
        
        return pattern;
    }
    
    applyPattern(chars, pattern) {
        // تطبيق النمط على الحروف
        return pattern.map(index => chars[index] || '').join('');
    }
    
    analyzeTakseerLevel(text, level) {
        // تحليل مستوى التكسير
        const analysis = {
            length: text.length,
            uniqueChars: new Set(text).size,
            numericalValue: this.calculateTextValue(text),
            tabaiBalance: this.analyzeTabaiBalance(text),
            potentialWords: this.findPotentialWords(text)
        };
        
        // إضافة تفسير بناءً على المستوى
        analysis.interpretation = this.generateTakseerInterpretation(analysis, level);
        
        return analysis;
    }
    
    calculateTextValue(text) {
        // حساب القيمة العددية للنص
        return text.split('').reduce((sum, char) => 
            sum + this.constants.getCharValueKabir(char), 0
        );
    }
    
    analyzeTabaiBalance(text) {
        // تحليل توازن الطبائع في النص
        const balance = {
            'ناري': 0,
            'هوائي': 0,
            'مائي': 0,
            'ترابي': 0
        };
        
        for (const char of text) {
            const tabia = this.constants.getCharTabia(char);
            if (balance[tabia] !== undefined) {
                balance[tabia]++;
            }
        }
        
        return balance;
    }
    
    findPotentialWords(text) {
        // البحث عن كلمات محتملة في النص
        const words = [];
        const arabicWords = [
            'الله', 'رحمن', 'رحيم', 'ملك', 'قدوس',
            'سلام', 'مؤمن', 'مهيمن', 'عزيز', 'جبار',
            'متكبر', 'خالق', 'بارئ', 'مصور', 'غفار',
            'قهار', 'وهاب', 'رزاق', 'فتاح', 'عليم'
        ];
        
        for (const word of arabicWords) {
            if (text.includes(word)) {
                words.push(word);
            }
        }
        
        return words;
    }
    
    generateTakseerInterpretation(analysis, level) {
        // توليد تفسير لمستوى التكسير
        const interpretations = {
            1: 'المستوى الأساسي - جوهر الأمر',
            2: 'المستوى الثنائي - التوازن والازدواج',
            3: 'المستوى الثلاثي - التكامل والثبات',
            4: 'المستوى الرباعي - الاستقرار والأركان',
            5: 'المستوى الخماسي - الديناميكية والتغير',
            6: 'المستوى السداسي - الكمال والانسجام'
        };
        
        let interpretation = interpretations[level] || `المستوى ${level}`;
        
        // إضافة ملاحظات بناءً على التحليل
        if (analysis.potentialWords.length > 0) {
            interpretation += ` - يحتوي على: ${analysis.potentialWords.join(', ')}`;
        }
        
        if (analysis.tabaiBalance.ناري > analysis.tabaiBalance.ترابي * 2) {
            interpretation += ' - الطاقة نارية تحتاج إلى تهدئة';
        }
        
        return interpretation;
    }

    // ============================================
    // 6. حسابات الموازنة والتحكيم
    // ============================================
    
    performMuwazana(text1, text2) {
        // تطبيق قواعد الموازنة بين نصين
        const value1 = this.calculateTextValue(text1);
        const value2 = this.calculateTextValue(text2);
        
        const comparison = {
            text1: { text: text1, value: value1 },
            text2: { text: text2, value: value2 },
            difference: Math.abs(value1 - value2),
            ratio: value1 > value2 ? value1 / value2 : value2 / value1,
            winner: value1 > value2 ? 'text1' : value2 > value1 ? 'text2' : 'equal',
            analysis: this.analyzeMuwazana(value1, value2)
        };
        
        return comparison;
    }
    
    analyzeMuwazana(value1, value2) {
        // تحليل نتائج الموازنة
        const diff = Math.abs(value1 - value2);
        const sum = value1 + value2;
        const ratio = diff / sum;
        
        let analysis = '';
        
        if (ratio < 0.1) {
            analysis = 'التوازن قريب جداً - الأمر متساوٍ';
        } else if (ratio < 0.3) {
            analysis = 'تفوق طفيف - يحتاج إلى جهد إضافي';
        } else if (ratio < 0.5) {
            analysis = 'تفوق واضح - الميزة لطرف';
        } else {
            analysis = 'تفوق كبير - الغلبة واضحة';
        }
        
        // إضافة ملاحظة بناءً على نوعية الأرقام
        if (value1 % 2 === value2 % 2) {
            analysis += ' - كلا الطرفين ' + (value1 % 2 === 0 ? 'زوجيان' : 'فرديان');
        } else {
            analysis += ' - أحدهما زوجي والآخر فردي';
        }
        
        return analysis;
    }

    // ============================================
    // 7. توليد التقارير المتقدمة
    // ============================================
    
    generateAdvancedReport(data) {
        // توليد تقرير مفصل
        const report = {
            metadata: {
                timestamp: new Date().toISOString(),
                version: '2.0',
                algorithm: 'الجفري المتقدم'
            },
            inputs: data.inputs,
            calculations: {
                entrances: data.entrances,
                steps: data.steps,
                advancedMetrics: this.calculateAdvancedMetrics(data)
            },
            analysis: {
                takseer: data.takseer || this.performAdvancedTakseer(data.steps?.jawab || ''),
                muwazana: data.muwazana || this.performMuwazana(
                    data.steps?.asas || '',
                    data.steps?.jawab || ''
                ),
                interpretations: this.generateInterpretations(data)
            },
            recommendations: this.generateAdvancedRecommendations(data)
        };
        
        return report;
    }
    
    calculateAdvancedMetrics(data) {
        // حساب مقاييس متقدمة
        const allText = Object.values(data.steps || {}).join('');
        const allChars = allText.split('');
        
        return {
            charCount: allChars.length,
            uniqueChars: new Set(allChars).size,
            tabaiDistribution: this.analyzeTabaiDistribution(allChars),
            numericalPattern: this.analyzeNumericalPattern(allChars),
            symmetryScore: this.calculateSymmetryScore(allText)
        };
    }
    
    analyzeTabaiDistribution(chars) {
        // تحليل توزيع الطبائع
        const distribution = {
            'ناري': 0, 'هوائي': 0, 'مائي': 0, 'ترابي': 0
        };
        
        for (const char of chars) {
            const tabia =
