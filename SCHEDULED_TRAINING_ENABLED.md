# 🤖 ML 模型自動訓練排程 - 已啟用

**更新時間**: 2025-11-12 00:50 UTC

---

## ⏰ 排程資訊
- **Worker**: `unified-ai-quantum`
- **Cron 表達式**: `0 0 * * *`
- **執行頻率**: 每日 UTC 00:00，自動訓練一次防禦模型
- **首次排程執行**: 下一個 UTC 00:00 時間點

---

## 📋 執行步驟
1. 從 D1 資料庫 `attack_logs`、`defense_responses` 取得最近 1000 筆高風險樣本
2. 進行特徵提取與簡化模型訓練
3. 產生新模型版本號（例：`v1.20251112.1234`）
4. 將訓練結果寫入 `ml_training_data` 資料表
5. 更新 `MODEL_CONFIG.version`，提供 Backend Worker 最新決策閾值

---

## ✅ 成功訓練紀錄內容
每次訓練成功會在 `ml_training_data` 表中新增一筆紀錄，包含：
- `model_version`：新版本號
- `accuracy`、`precision_score`、`recall_score`、`f1_score`
- `training_time_ms`：訓練耗時
- `training_samples`：使用樣本數
- `features_used`：採用的特徵集合
- `notes`：訓練來源（手動或排程）

---

## 🔍 監控方式
- Cloudflare Dashboard → Workers & Pages → `unified-ai-quantum` → Logs
- 或使用 CLI：
```bash
wrangler tail unified-ai-quantum
```

排程執行時的日誌範例：
```
🕒 Scheduled model training triggered at: 2025-11-12T00:00:00.000Z
✅ Scheduled model training result: { "model_version": "v1.20251112.0001", ... }
```

---

## ⚠️ 注意事項
- 若訓練樣本少於 10 筆，排程會跳過並記錄警告日誌
- 可透過手動端點強制訓練：
```bash
curl -X POST https://unified-ai-quantum.pcleegood.workers.dev/train-model
```
- 若需調整頻率，請修改 `wrangler-ai.toml` 中的 `crons` 設定並重新部署
