document.addEventListener("DOMContentLoaded", function () {
    const getDiseaseInfoBtn = document.getElementById("get-disease-info-btn");
    const loadingIndicator = document.getElementById("loading-indicator");
    const diseaseInfoDiv = document.getElementById("disease_info");

    if (getDiseaseInfoBtn) {
        getDiseaseInfoBtn.addEventListener("click", function () {
            loadingIndicator.style.display = "block";
            const diseaseName = "{{ predicted_class }}";

            fetch("/get_disease_info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ disease_name: diseaseName }),
            })
            .then((response) => response.json())
            .then((data) => {
                loadingIndicator.style.display = "none";
                if (data.disease_info) {
                    diseaseInfoDiv.innerHTML = `
                        <h5>病症資訊：</h5>
                        <div class="border p-3 rounded bg-light">${data.disease_info}</div>
                    `;
                } else {
                    diseaseInfoDiv.innerHTML = `<p>無法取得病症資訊，請稍後再試。</p>`;
                }
            })
            .catch((error) => {
                console.error("Error fetching disease info:", error);
                loadingIndicator.style.display = "none";
                diseaseInfoDiv.innerHTML = `
                    <p>無法取得病症資訊，請稍後再試。</p>
                `;
            });
        });
    }
});