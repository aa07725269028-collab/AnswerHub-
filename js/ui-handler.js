// النظام الجفري المتكامل - معالج الواجهة
// إصدار متقدم بأقصى دقة حسابية

class UIHandler {
    constructor() {
        this.jafrCore = null;
        this.currentPanel = 'panel-main';
        this.isCalculating = false;
        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.loadConstants();
        this.updateSystemStatus();
        this.initializeJafrCore();
    }

    setupEventListeners() {
        // تحديث عداد الأحرف
        document.getElementById('mainQuestion').addEventListener('input', (e) => {
            const count = e.target.value.length;
            this.updateCharCount(count);
        });

        // تحديث حالة النظام
        document.querySelectorAll('.input-field').forEach(input => {
            input.addEventListener('change', () => this.updateSystemStatus());
        });
    }

    loadConstants() {
        // التحقق من تحميل الثوابت
        if (!window.JafrConstants) {
            console.error('❌ لم يتم تحميل الثوابت الجفرية');
            this.showMessage('error', 'خطأ في تحميل النظام. يرجى تحديث الصفحة.');
            return;
        }
        console.log('✅ تم تحميل الثوابت بنجاح');
    }

    initializeJafrCore() {
        try {
            this.jafrCore = new JafrCore();
            console.log('✅ تم تهيئة النواة الجفرية بنجاح');
        } catch (error) {
            console.error('❌ خطأ في تهيئة النواة الجفرية:', error);
            this.showMessage('error', 'خطأ في تهيئة النظام الجفري');
        }
    }

    // ============================================
    // 1. إدارة الألواح والتبويبات
    // ============================================
    
    switchPanel(panelId) {
        // إخفاء جميع الألواح
        document.querySelectorAll('.main-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // إلغاء تنشيط جميع التبويبات
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // إظهار اللوحة المطلوبة
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.classList.add('active');
            
            // تنشيط التبويب المناسب
            const tab = document.querySelector(`.nav-tab[onclick*="${panelId}"]`);
            if (tab) tab.classList.add('active');
            
            this.currentPanel = panelId;
        }
    }

    // ============================================
    // 2. إدارة الحساب الرئيسي
    // ============================================
    
    async startCalculation() {
        if (this.isCalculating) {
            this.showMessage('warning', 'جاري تنفيذ عملية حسابية حالياً');
            return;
        }

        // التحقق من المدخلات
        if (!this.validateInputs()) {
            return;
        }

        try {
            this.isCalculating = true;
            this.showLoading(true);
            this.resetProgress();
            
            // جمع المدخلات
            const inputs = this.collectInputs();
            
            // تعيين المدخلات للنواة الجفرية
            this.jafrCore.setQuestion(inputs.question);
            this.jafrCore.setPersonalInfo(inputs.name, inputs.motherName);
            this.jafrCore.setTimeFactors(inputs.day, inputs.month, inputs.year);
            this.jafrCore.setAstroFactors(
                inputs.risingSign,
                inputs.moonSign,
                inputs.moonMansion,
                inputs.hourLord
            );

            // بدء الحساب الكامل
            const result = await this.jafrCore.calculateFullJafr();
            
            // عرض النتائج
            this.displayResults(result);
            this.updateCalculationSteps();
            this.updateAnalysisPanel();
            
            this.showMessage('success', 'تم الحساب الجفري بنجاح!');
            
        } catch (error) {
            console.error('❌ خطأ في الحساب الجفري:', error);
            this.showMessage('error', `خطأ في الحساب: ${error.message}`);
            
        } finally {
            this.isCalculating = false;
            this.showLoading(false);
            this.switchPanel('panel-calculation');
        }
    }

    validateInputs() {
        const inputs = this.collectInputs();
        const errors = [];

        if (!inputs.question || inputs.question.length < 3) {
            errors.push('السؤال الرئيسي قصير جداً (3 أحرف على الأقل)');
        }

        if (!inputs.name || inputs.name.length < 2) {
            errors.push('اسم السائل مطلوب');
        }

        if (!inputs.day) {
            errors.push('اليوم مطلوب');
        }

        if (!inputs.month) {
            errors.push('الشهر مطلوب');
        }

        if (!inputs.year || isNaN(inputs.year)) {
            errors.push('السنة الهجرية مطلوبة');
        }

        if (!inputs.risingSign) {
            errors.push('طالع البرج مطلوب');
        }

        if (errors.length > 0) {
            this.showMessage('error', errors.join('<br>'));
            return false;
        }

        return true;
    }

    collectInputs() {
        return {
            question: document.getElementById('mainQuestion').value.trim(),
            name: document.getElementById('askerName').value.trim(),
            motherName: document.getElementById('motherName').value.trim(),
            day: document.getElementById('day').value,
            month: document.getElementById('month').value,
            year: document.getElementById('year').value,
            risingSign: document.getElementById('risingSign').value,
            moonSign: document.getElementById('moonSign').value,
            moonMansion: document.getElementById('moonMansion').value,
            hourLord: document.getElementById('hourLord').value
        };
    }

    // ============================================
    // 3. عرض النتائج والتحديثات
    // ============================================
    
    displayResults(result) {
        // الجواب النهائي
        document.getElementById('finalAnswer').innerHTML = 
            `<div style="color: var(--primary-color); font-size: 1.2rem;">
                ${result.answer || 'لم يتم تحديد جواب'}
            </div>`;

        // المداخل الأربعة
        const entrances = result.entrances || {};
        document.getElementById('entrancesResult').innerHTML = `
            <span class="result-highlight">المدخل الكبير:</span> ${entrances.madkhalKabir || '--'}<br>
            <span class="result-highlight">المدخل الوسيط الكبير:</span> ${entrances.madkhalWaseetKabir || '--'}<br>
            <span class="result-highlight">مجموع المدخل الوسيط:</span> ${entrances.majmooMadkhalWaseet || '--'}<br>
            <span class="result-highlight">المدخل الصغير:</span> ${entrances.madkhalSagheer || '--'}
        `;

        // إحصائيات الحساب
        document.getElementById('calculationStats').innerHTML = `
            <span class="result-highlight">وقت البدء:</span> ${new Date().toLocaleTimeString('ar-SA')}<br>
            <span class="result-highlight">الوقت المستغرق:</span> ${result.duration || '--'}<br>
            <span class="result-highlight">عدد الخطوات:</span> 15<br>
            <span class="result-highlight">حالة:</span> ${result.success ? 'مكتمل' : 'فاشل'}
        `;
    }

    updateCalculationSteps() {
        if (!this.jafrCore) return;

        const container = document.getElementById('calculationSteps');
        const steps = this.jafrCore.steps;
        
        let html = '<div class="steps-container">';
        
        Object.entries(steps).forEach(([key, value], index) => {
            const stepName = this.jafrCore.getStepName(key);
            const stepValue = Array.isArray(value) ? value.join(', ') : value;
            
            html += `
                <div class="step">
                    <div class="step-header">
                        <div class="step-number">${index + 1}</div>
                        <div class="step-title">${stepName}</div>
                        <div class="step-status status-completed">مكتمل</div>
                    </div>
                    <div class="step-content">
                        ${stepValue || '---'}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    updateAnalysisPanel() {
        if (!this.jafrCore) return;

        const analysis = this.jafrCore.analysis;
        const container = document.getElementById('analysisContent');
        
        let html = `
            <div class="result-item">
                <div class="result-header">
                    <i>🔍</i>
                    <span class="result-title">التحليل التفصيلي</span>
                </div>
                <div class="result-content">
                    ${analysis.finalAnswer || 'لم يتم تحليل النتائج'}
                </div>
            </div>
        `;
        
        if (analysis.takseer) {
            html += `
                <div class="result-item">
                    <div class="result-header">
                        <i>⚡</i>
                        <span class="result-title">نتائج التكسير</span>
                    </div>
                    <div class="result-content">
                        ${analysis.takseer}
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
    }

    // ============================================
    // 4. إدارة الجداول والثوابت
    // ============================================
    
    showTableTab(tabId) {
        // تنشيط التبويبات
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // عرض الجدول المناسب
        let content = '';
        
        switch (tabId) {
            case 'abjad':
                content = this.generateAbjadTable();
                break;
            case 'circles':
                content = this.generateCirclesTable();
                break;
            case 'nisbat':
                content = this.generateNisbatTable();
                break;
            case 'tabai':
                content = this.generateTabaiTable();
                break;
        }
        
        document.getElementById('tablesContent').innerHTML = content;
    }

    generateAbjadTable() {
        const constants = window.JafrConstants;
        if (!constants) return '<div class="message message-error">لم يتم تحميل الجداول</div>';
        
        let html = `
            <h3 style="color: var(--primary-color); margin-bottom: 20px; text-align: center;">
                جدول الأبجدية الكبير (حساب الجمل)
            </h3>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>الحرف</th>
                            <th>القيمة</th>
                            <th>النظير</th>
                            <th>الطبعة</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        Object.entries(constants.ABJAD_KABIR).forEach(([char, value]) => {
            if (char.length === 1) {
                const nazir = constants.getNazir(char) || '--';
                const tabia = constants.getCharTabia(char);
                
                html += `
                    <tr>
                        <td><strong>${char}</strong></td>
                        <td>${value}</td>
                        <td>${nazir}</td>
                        <td><span class="result-highlight">${tabia}</span></td>
                    </tr>
                `;
            }
        });
        
        html += '</tbody></table></div>';
        return html;
    }

    generateCirclesTable() {
        const constants = window.JafrConstants;
        if (!constants) return '<div class="message message-error">لم يتم تحميل الجداول</div>';
        
        let html = `
            <h3 style="color: var(--primary-color); margin-bottom: 20px; text-align: center;">
                دوائر الأسرار الجفرية
            </h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
        `;
        
        // دائرة القوى
        html += `
            <div class="result-item">
                <div class="result-header">
                    <i>🌀</i>
                    <span class="result-title">دائرة القوى</span>
                </div>
                <div class="result-content">
                    <div class="code-block">
                        الطرح العنصري (4-4)<br>
                        الطرح الكوكبي (7-7)<br>
                        الطرح الأفلاكي (9-9)<br>
                        الطرح البروجي (12-12)<br>
                        الطرح المنازلي (28-28)<br>
                        الطرح الدرجي (30-30)
                    </div>
                </div>
            </div>
        `;
        
        // دائرة الطبائع
        html += `
            <div class="result-item">
                <div class="result-header">
                    <i>🔥</i>
                    <span class="result-title">دائرة الطبائع</span>
                </div>
                <div class="result-content">
                    <strong>ناري:</strong> ${constants.TABAII.nاري.join(', ')}<br>
                    <strong>هوائي:</strong> ${constants.TABAII.هوائي.join(', ')}<br>
                    <strong>مائي:</strong> ${constants.TABAII.مائي.join(', ')}<br>
                    <strong>ترابي:</strong> ${constants.TABAII.ترابي.join(', ')}
                </div>
            </div>
        `;
        
        html += '</div>';
        return html;
    }

    generateNisbatTable() {
        const constants = window.JafrConstants;
        if (!constants) return '<div class="message message-error">لم يتم تحميل الجداول</div>';
        
        let html = `
            <h3 style="color: var(--primary-color); margin-bottom: 20px; text-align: center;">
                جدول حاصل النسب الجفري (9×9)
            </h3>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>النسبة</th>
                            <th>1</th>
                            <th>2</th>
                            <th>3</th>
                            <th>4</th>
                            <th>5</th>
                            <th>6</th>
                            <th>7</th>
                            <th>8</th>
                            <th>9</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        for (let i = 1; i <= 9; i++) {
            html += '<tr>';
            html += `<td><strong>${i}</strong></td>`;
            
            for (let j = 1; j <= 9; j++) {
                const value = constants.getNisbat(i, j);
                html += `<td>${value}</td>`;
            }
            
            html += '</tr>';
        }
        
        html += '</tbody></table></div>';
        return html;
    }

    generateTabaiTable() {
        const constants = window.JafrConstants;
        if (!constants) return '<div class="message message-error">لم يتم تحميل الجداول</div>';
        
        let html = `
            <h3 style="color: var(--primary-color); margin-bottom: 20px; text-align: center;">
                جدول الطبائع والعناصر
            </h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
        `;
        
        // العناصر الأربعة
        const elements = [
            { name: '🔥 ناري', color: '#ef4444', chars: constants.TABAII.nاري },
            { name: '💨 هوائي', color: '#3b82f6', chars: constants.TABAII.هوائي },
            { name: '💧 مائي', color: '#06b6d4', chars: constants.TABAII.مائي },
            { name: '🌍 ترابي', color: '#10b981', chars: constants.TABAII.ترابي }
        ];
        
        elements.forEach(element => {
            html += `
                <div class="result-item" style="border-color: ${element.color}">
                    <div class="result-header">
                        <span style="color: ${element.color}">${element.name}</span>
                    </div>
                    <div class="result-content">
                        ${element.chars.join(' • ')}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    // ============================================
    // 5. وظائف المساعدة
    // ============================================
    
    updateCharCount(count) {
        const element = document.getElementById('question-count');
        if (element) {
            element.textContent = `عدد الأحرف: ${count} / 200`;
            
            if (count > 200) {
                element.style.color = 'var(--danger-color)';
            } else if (count > 150) {
                element.style.color = 'var(--warning-color)';
            } else {
                element.style.color = 'var(--text-muted)';
            }
        }
    }

    updateSystemStatus() {
        const inputs = this.collectInputs();
        let status = 'جاهز';
        let color = 'var(--secondary-color)';
        
        // التحقق من اكتمال المدخلات الأساسية
        if (!inputs.question) {
            status = 'بانتظار السؤال';
            color = 'var(--warning-color)';
        } else if (!inputs.name) {
            status = 'بانتظار الاسم';
            color = 'var(--warning-color)';
        } else if (this.isCalculating) {
            status = 'جاري الحساب...';
            color = 'var(--primary-color)';
        }
        
        document.getElementById('systemStatus').innerHTML = 
            `<span class="result-highlight" style="color: ${color}">${status}</span>`;
    }

    updateProgressUI(percent, message) {
        // تحديث شريط التقدم
        const fill = document.getElementById('progressFill');
        const percentElement = document.getElementById('progressPercent');
        
        if (fill) fill.style.width = `${percent}%`;
        if (percentElement) percentElement.textContent = `${percent}%`;
        
        // تحديث تفاصيل التحميل
        const details = document.getElementById('loadingDetails');
        if (details && message) {
            details.textContent = message;
        }
    }

    resetProgress() {
        const fill = document.getElementById('progressFill');
        const percent = document.getElementById('progressPercent');
        
        if (fill) fill.style.width = '0%';
        if (percent) percent.textContent = '0%';
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        const startBtn = document.getElementById('startBtn');
        
        if (overlay) overlay.style.display = show ? 'flex' : 'none';
        if (startBtn) startBtn.disabled = show;
    }

    showMessage(type, text) {
        // إخفاء جميع الرسائل
        document.querySelectorAll('.message').forEach(msg => {
            msg.style.display = 'none';
        });
        
        // إظهار الرسالة المطلوبة
        const messageId = `${type}-message`;
        const messageElement = document.getElementById(messageId);
        
        if (messageElement) {
            messageElement.innerHTML = text;
            messageElement.style.display = 'block';
            
            // إخفاء تلقائي بعد 5 ثوانٍ
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        } else {
            // إذا لم يكن هناك عنصر رسالة، نستخدم alert
            alert(text);
        }
    }

    // ============================================
    // 6. وظائف التحكم
    // ============================================
    
    resetAll() {
        if (this.isCalculating) {
            this.showMessage('warning', 'لا يمكن الإعادة أثناء الحساب');
            return;
        }
        
        if (confirm('هل أنت متأكد من رغبتك في مسح جميع البيانات؟')) {
            // إعادة تعيين الحقول
            document.getElementById('mainQuestion').value = '';
            document.getElementById('askerName').value = '';
            document.getElementById('motherName').value = '';
            document.getElementById('day').value = '';
            document.getElementById('month').value = '';
            document.getElementById('year').value = '';
            document.getElementById('risingSign').value = '';
            document.getElementById('moonSign').value = '';
            document.getElementById('moonMansion').value = '';
            document.getElementById('hourLord').value = '';
            
            // إعادة تعيين النتائج
            document.getElementById('finalAnswer').innerHTML = 'لم يتم حساب جواب بعد';
            document.getElementById('entrancesResult').innerHTML = `
                المدخل الكبير: --<br>
                المدخل الوسيط الكبير: --<br>
                مجموع المدخل الوسيط: --<br>
                المدخل الصغير: --
            `;
            document.getElementById('calculationStats').innerHTML = `
                وقت البدء: --<br>
                الوقت المستغرق: --<br>
                عدد الخطوات: 0<br>
                حالة: غير مبدأ
            `;
            document.getElementById('calculationSteps').innerHTML = `
                <div class="message message-info">
                    ⏳ لم تبدأ عملية الحساب بعد. يرجى ملء المدخلات والضغط على "بدء الحساب الجفري"
                </div>
            `;
            
            // إعادة تعيين النواة الجفرية
            if (this.jafrCore) {
                this.jafrCore.reset();
            }
            
            // تحديث الحالة
            this.updateCharCount(0);
            this.updateSystemStatus();
            this.resetProgress();
            
            this.showMessage('success', 'تم إعادة تعيين جميع البيانات بنجاح');
        }
    }

    exportCalculation() {
        if (!this.jafrCore) {
            this.showMessage('error', 'لم يتم إجراء أي حساب للتصدير');
            return;
        }
        
        try {
            const data = this.jafrCore.exportData();
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `jafr-calculation-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showMessage('success', 'تم تصدير الحساب بنجاح');
            
        } catch (error) {
            console.error('❌ خطأ في التصدير:', error);
            this.showMessage('error', 'خطأ في تصدير البيانات');
        }
    }

    showDetailedResults() {
        if (!this.jafrCore || !this.jafrCore.steps.asas) {
            this.showMessage('warning', 'لم يتم إجراء أي حساب لعرض التفاصيل');
            return;
        }
        
        this.switchPanel('panel-calculation');
    }

    refreshTables() {
        this.showTableTab('abjad');
        this.showMessage('info', 'تم تحديث الجداول بنجاح');
    }
}

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تعيين دالة تحديث التقدم للنواة الجفرية
    window.updateProgressUI = (percent, message) => {
        const handler = window.uiHandler;
        if (handler) handler.updateProgressUI(percent, message);
    };
    
    // تهيئة معالج الواجهة
    window.uiHandler = new UIHandler();
    
    console.log('✅ تم تحميل النظام الجفري المتكامل بنجاح');
});
