import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from lightgbm import LGBMClassifier
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score, confusion_matrix, classification_report
from sklearn.preprocessing import LabelEncoder
import pickle
import os

data = pd.read_csv('bank.csv')

X = data.drop(columns=['deposit'])  
y = data['deposit']    

# Chuyển đổi nhãn thành số (nếu là nhãn phân loại)
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y)

# Chuyển đổi các cột phân loại sang mã hóa số (One-Hot Encoding cho các biến phân loại)
X = pd.get_dummies(X, drop_first=True)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

model = LGBMClassifier(random_state=42, n_estimators=100)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)[:, 1]

accuracy = accuracy_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
auc = roc_auc_score(y_test, y_pred_proba)
conf_matrix = confusion_matrix(y_test, y_pred)

plt.figure(figsize=(6, 5))
sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues', xticklabels=['No', 'Yes'], yticklabels=['No', 'Yes'])
plt.title('Confusion Matrix - LightGBM')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.show()

scores_df = pd.DataFrame({
    'Metric': ['Accuracy', 'F1 Score', 'AUC'],
    'Score': [accuracy, f1, auc]
})

plt.figure(figsize=(6, 4))
bar_plot = sns.barplot(x='Metric', y='Score', data=scores_df, palette='viridis')
plt.title('Evaluation Metrics - LightGBM')
plt.ylim(0, 1)
for index, row in scores_df.iterrows():
    bar_plot.text(index, row['Score'] + 0.02, f"{row['Score']:.2f}", ha='center', color='black')
plt.show()

# Đảm bảo đường dẫn từ thư mục model-training đến model-deployment là chính xác
model_deployment_path = os.path.join(os.path.dirname(__file__), '..', 'model-deployment')

# Kiểm tra nếu thư mục model-deployment không tồn tại, tạo thư mục
if not os.path.exists(model_deployment_path):
    os.makedirs(model_deployment_path)

# Lưu mô hình vào thư mục model-deployment
with open(os.path.join(model_deployment_path, 'light_gbm.pkl'), 'wb') as file:
    pickle.dump(model, file)

print("Mô hình đã được lưu vào thư mục 'model-deployment' với tên file 'light_gbm.pkl'")
