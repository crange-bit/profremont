function showStep(stepNumber) {
    // Скрыть все шаги формы
    const allSteps = document.querySelectorAll('.form-step');
    allSteps.forEach(function(step) {
        step.classList.remove('active');
    });
    
    // Показать текущий шаг
    const currentStep = document.getElementById('step' + stepNumber);
    if (currentStep) {
        currentStep.classList.add('active');
    }
    
    // Обновить индикаторы шагов
    const stepIndicators = document.querySelectorAll('.step');
    stepIndicators.forEach(function(stepIndicator, index) {
        if (index === stepNumber - 1) {
            stepIndicator.classList.add('active');
        } else {
            stepIndicator.classList.remove('active');
        }
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const areaSlider = document.getElementById('totalArea');
    if (areaSlider) {
        areaSlider.addEventListener('input', function() {
            const areaValueElement = document.getElementById('areaValue');
            if (areaValueElement) {
                areaValueElement.textContent = this.value + ' м²';
            }
        });
    }
});

function calculateCost() {
    // Получение значений из формы
    const areaElement = document.getElementById('totalArea');
    const area = areaElement ? parseInt(areaElement.value) : 60;
    
    const repairTypeElement = document.getElementById('repairType');
    const repairType = repairTypeElement ? repairTypeElement.value : 'cosmetic';
    
    const roomCountElement = document.getElementById('roomCount');
    const roomCount = roomCountElement ? parseInt(roomCountElement.value) : 2;
    
    const materialQualityElement = document.getElementById('materialQuality');
    const materialQuality = materialQualityElement ? materialQualityElement.value : 'standard';
    
    const urgencyElement = document.getElementById('urgency');
    const urgency = urgencyElement ? urgencyElement.value : 'normal';
    
    const ceilingHeightElement = document.getElementById('ceilingHeight');
    const ceilingHeight = ceilingHeightElement ? parseFloat(ceilingHeightElement.value) : 2.7;
    
    // Базовые ставки стоимости за квадратный метр
    const rates = {
        cosmetic: 3000,
        capital: 5000,
        euro: 8000,
        designer: 12000
    };

    // Базовая ставки стоимости за дизайна
    const designCosts = {
        none: 0,
        basic: 30000,
        full: 80000
    };

    // Множители в зависимости от качества материалов
    const materialMultipliers = {
        economy: 0.8,
        standard: 1,
        premium: 1.5,
        luxury: 2
    };

    // Множители в зависимости от срочности
    const urgencyMultipliers = {
        normal: 1,
        fast: 1.2,
        urgent: 1.4
    };

    // Расчет базовой стоимости работ
    let baseCost = 0;
    if (rates[repairType]) {
        baseCost = area * rates[repairType];
    } else {
        baseCost = area * rates.cosmetic;
    }
    
    // Наценка за количество комнат
    const roomMultiplier = 1 + (roomCount - 1) * 0.1;
    baseCost = baseCost * roomMultiplier;

    // Наценка за высоту потолков
    const heightMultiplier = 1 + (ceilingHeight - 2.5) * 0.2;
    baseCost = baseCost * heightMultiplier;

    // Расчет стоимости черновых материалов (40% от стоимости работ)
    let materialsCostMultiplier = materialMultipliers.standard;
    if (materialMultipliers[materialQuality]) {
        materialsCostMultiplier = materialMultipliers[materialQuality];
    }
    const materialsCost = baseCost * 0.4 * materialsCostMultiplier;

    // Расчет стоимости чистовых материалов (60% от стоимости работ)
    const finishCost = baseCost * 0.6 * materialsCostMultiplier;

    // Расчет стоимости дополнительных работ
    let additionalCost = 0;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(function(checkbox) {
        const checkboxValue = parseInt(checkbox.value);
        if (!isNaN(checkboxValue)) {
            additionalCost = additionalCost + checkboxValue;
        }
    });

    // Расчет стоимости дизайн-проекта
    const designElement = document.getElementById('design');
    const design = designElement ? designElement.value : 'none';
    
    let designCost = 0;
    if (designCosts[design]) {
        designCost = designCosts[design];
    }
    
    additionalCost = additionalCost + designCost;

    // Расчет итоговой стоимости с учетом срочности
    let urgencyMultiplier = urgencyMultipliers.normal;
    if (urgencyMultipliers[urgency]) {
        urgencyMultiplier = urgencyMultipliers[urgency];
    }
    
    const totalCost = (baseCost + materialsCost + finishCost + additionalCost) * urgencyMultiplier;

    // Обновление интерфейса с результатами расчета
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        totalPriceElement.textContent = formatPrice(totalCost);
    }
    
    const materialsCostElement = document.getElementById('materialsCost');
    if (materialsCostElement) {
        materialsCostElement.textContent = formatPrice(materialsCost);
    }
    
    const workCostElement = document.getElementById('workCost');
    if (workCostElement) {
        workCostElement.textContent = formatPrice(baseCost);
    }
    
    const finishCostElement = document.getElementById('finishCost');
    if (finishCostElement) {
        finishCostElement.textContent = formatPrice(finishCost);
    }
    
    const additionalCostElement = document.getElementById('additionalCost');
    if (additionalCostElement) {
        additionalCostElement.textContent = formatPrice(additionalCost);
    }

    // Расчет сроков выполнения работ
    const baseWeeks = Math.max(2, Math.ceil(area / 30));
    
    let urgencyWeeks = baseWeeks;
    if (urgency === 'urgent') {
        urgencyWeeks = Math.ceil(baseWeeks * 0.7);
    }
    
    const repairTimeElement = document.getElementById('repairTime');
    if (repairTimeElement) {
        repairTimeElement.textContent = urgencyWeeks + '-' + (urgencyWeeks + 1) + ' недель';
    }
}

// Функция форматирования цены в русский формат
function formatPrice(price) {
    const roundedPrice = Math.round(price);
    const formatter = new Intl.NumberFormat('ru-RU');
    const formattedPrice = formatter.format(roundedPrice);
    return formattedPrice + ' ₽';
}

function showContactForm() {
    window.location.href = 'contact.html';
}

// Выполнение первоначального расчета при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        calculateCost();
    }
});