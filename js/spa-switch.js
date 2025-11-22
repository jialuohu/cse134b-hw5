
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const viewPanels = document.querySelectorAll('.view-panel');

    function switchView(targetView) {
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                updateActiveView(targetView);
            });
        } else {
            updateActiveView(targetView);
        }
    }

    function updateActiveView(targetView) {
        tabButtons.forEach(btn => {
            if (btn.dataset.view === targetView) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        viewPanels.forEach(panel => {
            if (panel.id === `view-${targetView}`) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetView = this.dataset.view;
            switchView(targetView);
        });
    });
});
