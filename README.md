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

---

## 🚀 本地開發與預覽

由於專案使用 `js/include.js` 以 `fetch()` 非同步加載 `navbar.html`，本地預覽請透過本機 HTTP 伺服器開啟（避免直接以 `file:///` 開啟造成 CORS 限制）：

使用 Python 快速啟動伺服器：
```bash
# Python 3
python -m http.server 8000
```
開啟瀏覽器訪問 `http://localhost:8000` 即可預覽網站。
