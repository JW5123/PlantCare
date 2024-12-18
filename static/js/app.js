function previewImage(event) {
    const preview = document.getElementById('preview');
    const imageInput = event.target;

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block'; // 顯示圖片
        };
        reader.readAsDataURL(imageInput.files[0]);
    }
}

// 開始預測前檢查圖片是否選擇
function startPrediction() {
    const imageInput = document.getElementById('image');
    if (!imageInput.files.length) {
        alert('請上傳圖片後再進行檢測');
    } else {
        document.getElementById('upload-form').submit(); // 提交表單以進行預測
    }
}
