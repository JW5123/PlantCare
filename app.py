from flask import Flask, request, render_template, jsonify
import tensorflow as tf
from PIL import Image
import numpy as np
import google.generativeai as genai
from dotenv import load_dotenv
import os
import re

load_dotenv()

# 設定 Gemini API
api_key = os.environ.get('GEMINI_API_KEY')
genai.configure(api_key=api_key)

app = Flask(__name__)

# 設定圖片上傳路徑
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 載入模型
model = tf.keras.models.load_model('keras_model.h5')

# 檢測函式
def predict_leaf_health(image_path):
    img = Image.open(image_path).resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)
    class_names = ['健康', '黃葉片', '軟腐病', '炭疽病', '白粉病', '葉燒症']

    predicted_class = class_names[np.argmax(predictions)]
    predicted_prob = np.max(predictions) * 100
    predicted_prob = round(predicted_prob, 2)
    all_probabilities = np.round(predictions[0] * 100, 2)

    return predicted_class, predicted_prob, all_probabilities

# 查詢 Gemini 的函式
def get_disease_info(disease_name):
    prompt = f"""
    我有一個植物病症需要了解更多資訊，病症名稱是：{disease_name}。
    請以條列式提供以下詳細信息：
    1. 症狀描述
    2. 可能的病因
    3. 治療方式
    4. 預防措施
    請用繁體中文回答。
    """
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)

        result = response.text.strip() if response.text else "無法取得病症資訊，請稍後再試。"

        response_text = re.sub(r'(\*\*|\*|\-)', '', result).replace("\n", "<br>")

        return response_text

    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return "<p>無法取得病症資訊，請稍後再試。</p>"


# 路由：首頁
@app.route('/', methods=['GET', 'POST'])
def index():
    image_src = None
    predicted_class = None
    predicted_prob = None
    all_probabilities = None
    disease_info = None  # 用來儲存病症信息

    if request.method == 'POST':
        # 獲取上傳的圖片
        image_file = request.files['image']
        if image_file:
            # 儲存圖片並獲取路徑
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_file.filename)
            image_file.save(image_path)
            image_src = f'/static/uploads/{image_file.filename}'

            # 預測
            predicted_class, predicted_prob, all_probabilities = predict_leaf_health(image_path)

    all_probabilities_list = all_probabilities.tolist() if all_probabilities is not None else None

    return render_template('index.html', image_src=image_src, 
                           predicted_class=predicted_class, 
                           predicted_prob=predicted_prob, 
                           all_probabilities=all_probabilities_list,
                           disease_info=disease_info)

# 路由：獲取病症資訊
@app.route('/get_disease_info', methods=['POST'])
def get_disease_info_route():
    data = request.get_json()
    disease_name = data.get('disease_name')
    disease_info = get_disease_info(disease_name)
    return jsonify({"disease_info": disease_info})

if __name__ == '__main__':
    app.run(debug=True)
