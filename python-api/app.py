from flask import Flask, request, jsonify
import pickle
import pandas as pd

# Load các mô hình đã huấn luyện
decision_tree_model = pickle.load(open('model-deployment/decision_tree.pkl', 'rb'))
random_forest_model = pickle.load(open('model-deployment/random_forest.pkl', 'rb'))
lightgbm_model = pickle.load(open('model-deployment/light_gbm.pkl', 'rb'))

# Load danh sách cột từ columns.pkl
with open('model-deployment/columns.pkl', 'rb') as file:
    columns = pickle.load(file)

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    input_data = data['input']  # Dữ liệu đầu vào (16 cột ban đầu)
    model_type = data['model']  # Loại model ("decision_tree", "random_forest", "lightgbm")

    # Chuyển dữ liệu đầu vào thành DataFrame
    input_df = pd.DataFrame([input_data])

    # One-Hot Encoding dữ liệu đầu vào theo đúng columns.pkl
    input_df = pd.get_dummies(input_df)
    input_df = input_df.reindex(columns=columns, fill_value=0)

    # Dự đoán theo loại model
    if model_type == 'decision_tree':
        prediction = decision_tree_model.predict(input_df)[0]
        probability = decision_tree_model.predict_proba(input_df)[0][1]  # Xác suất lớp 1
    elif model_type == 'random_forest':
        prediction = random_forest_model.predict(input_df)[0]
        probability = random_forest_model.predict_proba(input_df)[0][1]
    elif model_type == 'lightgbm':
        prediction = lightgbm_model.predict(input_df)[0]
        probability = lightgbm_model.predict_proba(input_df)[0][1]
    else:
        return jsonify({'error': 'Invalid model type'}), 400

    # Chuyển đổi prediction sang kiểu Python thuần
    prediction = int(prediction)
    probability = float(probability)  # Đảm bảo xác suất là float

    return jsonify({'prediction': prediction, 'probability': probability})  # Trả về cả kết quả và xác suất

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)  # Flask sẽ chạy trên cổng 8080
