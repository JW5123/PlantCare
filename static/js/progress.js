document.getElementById('get-disease-info-btn')?.addEventListener('click', function() {
    // 顯示進度條
    const progressBar = document.getElementById('progress-bar');
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = 'block';

    let progress = 0;
    const interval = setInterval(function() {
        progress += 10;
        progressBar.style.width = progress + '%';
        progressBar.setAttribute('aria-valuenow', progress);

        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 300);
});