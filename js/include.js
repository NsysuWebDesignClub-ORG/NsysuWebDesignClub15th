// js/include.js

class HTMLInclude {
  static getPathInfo() {
    // 標準化路徑（兼容本地 Windows 反斜線與標準 URL 斜線）
    const pathname = window.location.pathname.replace(/\\/g, '/');
    const isSub = pathname.includes('/class/');
    const rootPrefix = isSub ? '../' : '';

    // 判斷是否為首頁 index.html
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
    const isIndex = (filename === '' || filename === 'index.html' || pathname.endsWith('/'));

    return { isSub, rootPrefix, isIndex, filename };
  }

  static async loadComponent(containerId, filePath) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`找不到元素: ${containerId}`);
      return;
    }

    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      container.innerHTML = html;

      // 自動依所在頁面修復導航列的 Logo、圖片與各項連結
      this.fixNavbarLinks(container);

      // 執行載入的 HTML 中的 script 標籤
      const scripts = container.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        script.parentNode.removeChild(script);
        document.head.appendChild(newScript);
      });

      // 初始化下拉選單與滾動事件
      this.initializeComponents();

    } catch (error) {
      console.error('載入導航列失敗:', error);
      container.innerHTML = `
        <div class="alert alert-warning" role="alert" style="margin: 10px;">
          <i class="fas fa-exclamation-triangle"></i> 載入導航列失敗，請重新整理頁面
        </div>
      `;
    }
  }

  static fixNavbarLinks(container) {
    const { rootPrefix, isIndex } = this.getPathInfo();

    // 1. 修正 Logo 連結與圖片路徑（避免在 /class/ 等子資料夾中 404）
    const logoLink = container.querySelector('.navbar-brand.navbar-logo');
    if (logoLink) {
      logoLink.setAttribute('href', rootPrefix + 'index.html');
    }

    const logoImg = container.querySelector('.navbar-brand.navbar-logo img');
    if (logoImg) {
      logoImg.setAttribute('src', rootPrefix + 'images/ui/logo.jpg');
    }

    // 2. 修正「歷代網研」連結路徑
    container.querySelectorAll('a[href="history.html"], a[href$="/history.html"]').forEach(a => {
      a.setAttribute('href', rootPrefix + 'history.html');
    });

    // 3. 處理「社團介紹」、「課程資訊」等區塊滾動/跨頁跳轉連結
    const scrollNavLinks = container.querySelectorAll('[data-scroll-nav]');
    scrollNavLinks.forEach(link => {
      const scrollIndex = link.getAttribute('data-scroll-nav');
      if (!isIndex) {
        // 在非首頁（如 history.html, class/class.html, class/class2.html 等）
        // 必須移除 data-scroll-nav，避免本頁引入的 scrollIt.js 攔截點擊 (preventDefault) 導致無法跳轉
        link.removeAttribute('data-scroll-nav');
        // 設定標準跳轉網址，指回首頁對應錨點
        link.setAttribute('href', `${rootPrefix}index.html?data-scroll-index=${scrollIndex}#${scrollIndex}`);
      } else {
        // 在首頁，設置 href 錨點便於直接跳轉或無 JS 降級
        link.setAttribute('href', `#${scrollIndex}`);
      }
    });
  }

  static initializeComponents() {
    // 重新初始化 Bootstrap 下拉選單
    if (typeof bootstrap !== 'undefined') {
      const dropdowns = document.querySelectorAll('.dropdown-toggle');
      dropdowns.forEach(dropdown => {
        new bootstrap.Dropdown(dropdown);
      });
    }

    // 初始化多層下拉選單
    this.initializeSubmenu();

    // 重新綁定滾動時 Logo 替換路徑
    const { rootPrefix } = this.getPathInfo();
    this.initializeScrollEvents(rootPrefix);
  }

  static initializeSubmenu() {
    if (typeof $ === 'undefined') return;

    // 手機版本的多層下拉選單處理
    $('.dropdown-submenu').off('click').on('click', function(e) {
      if ($(window).width() <= 991) {
        e.preventDefault();
        e.stopPropagation();

        const $submenu = $(this).find('.dropdown-menu').first();
        if ($submenu.is(':visible')) {
          $submenu.slideUp(200);
        } else {
          $('.dropdown-submenu .dropdown-menu').slideUp(200);
          $submenu.slideDown(200);
        }
      }
    });

    // 點擊子選單項目時不關閉選單
    $('.dropdown-submenu .dropdown-menu .dropdown-item').off('click').on('click', function(e) {
      e.stopPropagation();
    });
  }

  static initializeScrollEvents(rootPrefix = '') {
    if (typeof $ === 'undefined') return;

    const logoSrc = rootPrefix + 'images/ui/logo.jpg';
    $(window).off("scroll.navbar").on("scroll.navbar", function () {
      var bodyScroll = $(window).scrollTop(),
        navbar = $(".navbar");

      if (bodyScroll > 50) {
        $('.navbar-logo img').attr('src', logoSrc);
        navbar.addClass("nav-scroll");
      } else {
        $('.navbar-logo img').attr('src', logoSrc);
        navbar.removeClass("nav-scroll");
      }
    });
  }
}

// 相容大寫小寫調用
const HTMLinclude = HTMLInclude;

// 頁面載入完成後自動加載導航列
document.addEventListener('DOMContentLoaded', function() {
  const { rootPrefix } = HTMLInclude.getPathInfo();
  const navPath = rootPrefix ? (rootPrefix + 'navbar.html') : 'navbar.html';
  HTMLInclude.loadComponent('navbar-container', navPath)
    .catch(error => {
      console.error('Error loading navbar:', error);
    });
});
