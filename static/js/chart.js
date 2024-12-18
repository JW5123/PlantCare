window.onload = function() {
    // 從後端傳遞的數據
    const rawProbabilities = document.getElementById('result-box').getAttribute('data-probabilities');
    const probabilities = rawProbabilities ? JSON.parse(rawProbabilities) : [0, 0, 0, 0, 0, 0];

    // 預設的病症標籤
    const labels = ['健康', '黃葉片', '軟腐病', '炭疽病', '白粉病', '葉燒症'];

    // 使用 Chart.js 繪製直方圖
    const ctx = document.getElementById('probability-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '病症機率 (%)',
                data: probabilities,
                backgroundColor: [
                    '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6f42c1', '#fd7e14'
                ],
                borderColor: [
                    '#1e7e34', '#d39e00', '#bd2130', '#117a8b', '#564ab1', '#d9551f'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: '機率 (%)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false  // 不顯示圖例
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.formattedValue + '%';
                        }
                    }
                },
                // 顯示數據標籤
                datalabels: {
                    display: true,
                    color: '#fff', // 標籤文字顏色
                    font: {
                        weight: 'bold',
                        size: 14
                    },
                    formatter: function(value) {
                        return value.toFixed(2) + '%'; // 顯示百分比，保留小數點後兩位
                    }
                }
            }
        },
        plugins: [ChartDataLabels]  // 註冊 datalabels 插件
    });
};z