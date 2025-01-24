// This is a placeholder for future interactive features.
console.log('Welcome to Mop\'s personal website!');

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // 初期タブの内容を読み込む
    loadTabContent('about');

    // タブ切り替え機能
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // アクティブなタブを解除
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // クリックされたタブをアクティブに
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            // タブの内容を読み込む
            loadTabContent(tabId).then(() => {
                // Galleryタブの場合、モーダル機能を初期化
                if (tabId === 'gallery') {
                    initializeGallery();
                }
            });
        });
    });

    // タブの内容を非同期で読み込む関数
    async function loadTabContent(tabId) {
        try {
            const response = await fetch(`tabs/${tabId}.html`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const content = await response.text();
            document.getElementById(`${tabId}-content`).innerHTML = content;
        } catch (error) {
            console.error('Error loading tab content:', error);
        }
    }

    // ギャラリーのページネーション機能
    function initializeGalleryPagination() {
        const itemsPerPage = 10;
        let currentPage = 1;
        const galleryItems = document.querySelectorAll('.gallery-item');
        const totalPages = Math.ceil(galleryItems.length / itemsPerPage);
        const prevButton = document.querySelector('.page-button[data-page="prev"]');
        const nextButton = document.querySelector('.page-button[data-page="next"]');
        const currentPageSpan = document.getElementById('current-page');
        const totalPagesSpan = document.getElementById('total-pages');

        // ページ情報を更新
        function updatePageInfo() {
            currentPageSpan.textContent = currentPage;
            totalPagesSpan.textContent = totalPages;
            
            // ボタンの有効/無効を設定
            prevButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage === totalPages;

            // アイテムの表示/非表示を切り替え
            galleryItems.forEach((item, index) => {
                const itemPage = Math.floor(index / itemsPerPage) + 1;
                item.classList.toggle('active', itemPage === currentPage);
            });
        }

        // 前のページへ
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updatePageInfo();
            }
        });

        // 次のページへ
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updatePageInfo();
            }
        });

        // 初期表示
        updatePageInfo();
    }

    // ギャラリーモーダル機能
    function initializeGallery() {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const closeBtn = document.querySelector('.modal-close');

        // 画像クリックでモーダル表示
        document.querySelectorAll('.gallery-item img').forEach(img => {
            img.addEventListener('click', function() {
                if (this.src) {  // srcが設定されている場合のみモーダルを表示
                    modal.style.display = "flex";
                    modalImg.src = this.src;
                    modalCaption.textContent = this.alt;
                    document.body.style.overflow = 'hidden'; // スクロール防止
                }
            });
        });

        // モーダルを閉じる
        function closeModal() {
            modal.style.display = "none";
            document.body.style.overflow = 'auto'; // スクロール再開
        }

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // ESCキーでモーダルを閉じる
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === "flex") {
                closeModal();
            }
        });

        // ページネーション機能の初期化
        initializeGalleryPagination();
    }

    // スムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
