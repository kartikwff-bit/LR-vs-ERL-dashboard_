// Fullscreen toggle function with cross-browser support
function toggleFullscreen() {
    const elem = document.documentElement;
    
    // Check if already in fullscreen
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    } else {
        // Request fullscreen
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.log(`Fullscreen error: ${err.message}`);
                alert('Fullscreen not supported in your browser');
            });
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else {
            alert('Fullscreen not supported in your browser');
        }
    }
}

// Calculate percentage when inputs change
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('target') || e.target.classList.contains('achieved')) {
        calculatePercentage(e.target);
    }
});

function calculatePercentage(input) {
    const section = input.dataset.section;
    const type = input.dataset.type;
    
    const targetInput = document.querySelector(`.target[data-section="${section}"][data-type="${type}"]`);
    const achievedInput = document.querySelector(`.achieved[data-section="${section}"][data-type="${type}"]`);
    const percentDisplay = document.getElementById(`${section}-${type}-percent`);
    
    const target = parseFloat(targetInput.value) || 0;
    const achieved = parseFloat(achievedInput.value) || 0;
    
    let percentage = 0;
    if (target > 0) {
        percentage = (achieved / target) * 100;
    }
    
    percentDisplay.textContent = percentage.toFixed(1) + '%';
    
    // Update color based on percentage
    percentDisplay.classList.remove('good', 'warning', 'danger');
    if (percentage >= 80) {
        percentDisplay.classList.add('good');
    } else if (percentage >= 50) {
        percentDisplay.classList.add('warning');
    } else {
        percentDisplay.classList.add('danger');
    }
}

// Quick fill with sample data
function quickFill() {
    const sections = ['ecs', 'cil', 'lr', 'erl'];
    const types = ['disbursement', 'collection'];
    
    sections.forEach(section => {
        types.forEach(type => {
            const targetInput = document.querySelector(`.target[data-section="${section}"][data-type="${type}"]`);
            const achievedInput = document.querySelector(`.achieved[data-section="${section}"][data-type="${type}"]`);
            
            // Generate random target between 100000 and 1000000
            const target = Math.floor(Math.random() * 900000) + 100000;
            // Generate achieved between 50% and 120% of target
            const achieved = Math.floor(target * (0.5 + Math.random() * 0.7));
            
            targetInput.value = target;
            achievedInput.value = achieved;
            
            calculatePercentage(targetInput);
        });
    });
}

// Clear all inputs
function clearAll() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.value = '';
    });
    
    const percentages = document.querySelectorAll('.percentage');
    percentages.forEach(percent => {
        percent.textContent = '0%';
        percent.classList.remove('good', 'warning', 'danger');
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data from localStorage if available
    loadData();
    
    // Save data when inputs change
    document.addEventListener('input', function(e) {
        if (e.target.tagName === 'INPUT') {
            saveData();
        }
    });
});

function saveData() {
    const data = {};
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        const key = `${input.dataset.section}-${input.dataset.type}-${input.classList[0]}`;
        data[key] = input.value;
    });
    localStorage.setItem('dashboardData', JSON.stringify(data));
}

function loadData() {
    const savedData = localStorage.getItem('dashboardData');
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            const [section, type, inputType] = key.split('-');
            const input = document.querySelector(`.${inputType}[data-section="${section}"][data-type="${type}"]`);
            if (input) {
                input.value = data[key];
                calculatePercentage(input);
            }
        });
    }
}
