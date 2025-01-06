import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score, confusion_matrix, classification_report
from sklearn.preprocessing import LabelEncoder
import pickle
import os

# Đọc dữ liệu
data = pd.read_csv('bank.csv')

X = data.drop(columns=['deposit'])
y = data['deposit']

# Chuyển đổi nhãn phân loại thành số
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y)

# Chuyển cột phân loại sang mã hóa số (One-Hot Encoding)
X = pd.get_dummies(X, drop_first=True)

# Lưu danh sách các cột sau khi mã hóa
columns = X.columns.tolist()

# Tách dữ liệu thành tập huấn luyện và kiểm tra
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Huấn luyện mô hình Decision Tree
model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)

# Dự đoán và đánh giá mô hình
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)[:, 1]

accuracy = accuracy_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
auc = roc_auc_score(y_test, y_pred_proba)
conf_matrix = confusion_matrix(y_test, y_pred)

# Hiển thị ma trận nhầm lẫn
plt.figure(figsize=(6, 5))
sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues', xticklabels=['No', 'Yes'], yticklabels=['No', 'Yes'])
plt.title('Confusion Matrix')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.show()

# Hiển thị các chỉ số đánh giá
scores_df = pd.DataFrame({
    'Metric': ['Accuracy', 'F1 Score', 'AUC'],
    'Score': [accuracy, f1, auc]
})

plt.figure(figsize=(6, 4))
bar_plot = sns.barplot(x='Metric', y='Score', data=scores_df, palette='viridis')
plt.title('Evaluation Metrics')
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
with open(os.path.join(model_deployment_path, 'decision_tree.pkl'), 'wb') as file:
    pickle.dump(model, file)

# Lưu danh sách cột đã mã hóa vào tệp columns.pkl
with open(os.path.join(model_deployment_path, 'columns.pkl'), 'wb') as file:
    pickle.dump(columns, file)

print("Mô hình đã được lưu vào thư mục 'model-deployment' với tên file 'decision_tree.pkl'")
print("Danh sách cột đã được lưu vào thư mục 'model-deployment' với tên file 'columns.pkl'")
