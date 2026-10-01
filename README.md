# 中山大學網路程式設計研究社 第十五屆官方網站

本專案為國立中山大學網路程式設計研究社（NSYSUMIS Web Design Club）第十五屆官方網站原始碼。

---

## 📁 專案檔案架構

```text
NsysuWebDesignClub15th/
├── class/                   # 課程內容資料夾（存放各學期社課詳細資訊與每週大綱）
│   ├── class.html           # 第一學期社課詳細資訊頁面
│   └── class2.html          # 第二學期社課詳細資訊頁面
├── css/                     # 樣式庫資料夾
│   ├── style.css            # 網站全域核心樣式表
│   └── animate.css          # 動畫效果樣式庫
├── js/                      # 前端 JavaScript 資料夾
│   ├── include.js           # 動態引入導航列組件（navbar.html）之前端腳本
│   ├── scrollIt.min.js      # 平滑滾動套件
│   └── wow.min.js           # 滾動觸發動畫套件
├── images/                  # 網站圖片資源資料夾
│   ├── ui/                  # 全站共用素材（Logo、Favicon、FB 圖示、輪播箭頭、底紋背景等）
│   ├── 10th/                # 第十屆（110 學年度）黑客松活動照片（110_1.jpg）
│   ├── 11th/                # 第十一屆（111 學年度）黑客松活動照片（111_1.webp）
│   ├── 12th/                # 第十二屆（112 學年度）黑客松活動照片（11201黑客松.webp）
│   ├── 13th/                # 第十三屆幹部、課程與活動照片
│   ├── 14th/                # 第十四屆幹部、講師、教授與課程照片
│   └── 15th/                # 第十五屆專用素材目錄（預留給本屆新增之幹部與活動照片）
├── index.html               # 社團首頁（社團簡介、社團目的、課程資訊、幹部名單、專案成果、心得分享）
├── navbar.html              # 全站通用導航列組件
├── history.html             # 歷代網研頁面（收錄第 9 屆至第 14 屆官方網站與歷屆幹部名錄）
├── robots.txt               # 搜尋引擎檢索設定
└── License.txt              # 專案授權條款
```

---

## 💡 架構說明與設計規範

### 1. 課程內容管理（`class/` 資料夾）
* **課程內容存放**：各學期的詳細社課資訊、講師介紹與每週教學大綱皆統一放置於 `class/` 資料夾內（如 `class/class.html`、`class/class2.html`）。
* **首頁連結串接**：首頁 `index.html` 的「課程資訊」區塊可直接導向 `class/` 資料夾內的對應課程頁面，利於內容分流維護。

### 2. 圖片素材分類規範（`images/` 資料夾）
* **全站共用素材 (`images/ui/`)**：存放全站通用之 Logo、Favicon、社群按鈕圖示、輪播箭頭與樣式背景底紋。
* **歷屆成果依屆數分流 (`images/10th/` ~ `14th/`)**：過往屆數的黑客松回顧照、幹部照依屆數各自收納，根目錄不再散落孤立圖片檔。
* **本屆獨立空間 (`images/15th/`)**：預留給第 15 屆日後放置新幹部合照、新社課封面等素材，讓專案結構長久維持整潔。

### 3. 歷屆成果與歷史網站整合
* **連結至各屆獨立網站**：為避免專案累積過多舊檔案，歷屆期末活動成果（黑客松競賽、歷屆作品）均直接以外部超連結指向對應屆數的 GitHub Pages 官方網站：
  * **114 學年度**：[第十四屆官方網站](https://nsysuwebdesignclub-org.github.io/NsysuWebDesignClub14th/)
  * **113 學年度**：[第十三屆官方網站](https://nsysuwebdesignclub-org.github.io/NsysuWebDesignClub13th/)
  * **112 學年度**：[第十二屆官方網站](https://nsysuwebdesignclub-org.github.io/NsysuWebDesignClub12th/)
* **輕量化維護**：本專案僅保留第 15 屆運作所需之檔案，保持專案乾淨且易於交接。

### 4. 通用導航列機制（`navbar.html` + `js/include.js`）
* 全站導航列透過 `js/include.js` 動態非同步載入 `navbar.html`。
* 若需新增或調整頂部導航連結（例如外部教材連結、各區塊錨點），只需修改 `navbar.html` 一處，全站頁面即同步生效。

### 5. 🔒 個資隱私保護與姓名編碼機制（防網路爬蟲）

#### 📌 設計目的與背景
網站中包含社團幹部、講師及「社課報名名單」之真實姓名。為保護社員與幹部的**個人資料隱私**，避免姓名直接以純文字（Plaintext）形式暴露於 HTML 靜態原始碼中，被網路自動化爬蟲（Scrapers）、搜尋引擎索引或惡意機器人隨意抓取與收錄，本站採用前端編碼與動態還原機制。

#### ⚙️ 實現原理
* **HTML 原始碼層級**：所有真實姓名均不直接寫出中文字，改用自訂的 `<span class="enc" data-n="Base64編碼字串"></span>` 標籤替換。
* **瀏覽器渲染層級**：在 `index.html` 頁面載入完成（`DOMContentLoaded` 事件觸發）時，透過原生的 `TextDecoder` 與 `atob()` 自動將 UTF-8 編碼還原為真實姓名並填入畫面：
  ```javascript
  document.querySelectorAll(".enc").forEach((el) => {
    try {
      const bin = atob(el.dataset.n);
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      el.textContent = new TextDecoder("utf-8").decode(bytes);
    } catch (e) {
      /* 解碼失敗維持空白，不影響頁面其餘內容 */
    }
  });
  ```
* **報名課程與系級**：社課名稱（如「Web全端開發入門」、「從零開始寫C++」）與學期系級為公開課程資訊，不具個資識別敏感性，維持明文以保持結構清晰。

#### 🛠️ 後續維護：如何為新名單進行編碼
若未來學期需更換或新增名單，請先將姓名轉換為 UTF-8 Base64 字串後填入 `data-n` 屬性中：
* **Node.js**：
  ```javascript
  Buffer.from("學生姓名", "utf-8").toString("base64");
  ```
* **Python**：
  ```python
  import base64
  base64.b64encode("學生姓名".encode("utf-8")).decode("ascii")
  ```
* **瀏覽器 Console**：
  ```javascript
  btoa(encodeURIComponent("學生姓名").replace(/%([0-9A-F]{2})/g, (m, p) => String.fromCharCode('0x' + p)))
  ```

#### ⚠️ 注意事項與防護邊界說明
1. **編碼 vs. 加密**：此機制本質為 **Base64 混淆編碼**，並非包含金鑰的強密碼學加密（如 AES/RSA）。
2. **防護範圍**：能有效阻擋**直接檢視原始碼（View Source / Ctrl+U）搜尋姓名**、**一般靜態 HTML 網路爬蟲**與**搜尋引擎文字檢索**。
3. **技術限制**：若訪問者具備前端開發背景，透過瀏覽器開發者工具（DevTools / F12）檢視已執行 JS 的動態 DOM 樹，或是分析 JS 解碼邏輯，仍能取得還原資料。此機制屬於**強化個人隱私防禦的前端過濾措施**。

---

## 🚀 本地開發與預覽

由於專案使用 `js/include.js` 以 `fetch()` 非同步加載 `navbar.html`，本地預覽請透過本機 HTTP 伺服器開啟（避免直接以 `file:///` 開啟造成 CORS 限制）：

使用 Python 快速啟動伺服器：
```bash
# Python 3
python -m http.server 8000
```
開啟瀏覽器訪問 `http://localhost:8000` 即可預覽網站。
