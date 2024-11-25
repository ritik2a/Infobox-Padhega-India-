// Function to toggle the visibility of the infobox
function toggleInfobox() {
    const infobox = document.getElementById("faq-infobox");
    infobox.classList.toggle("hidden");
}

// Load suggestions on page load
async function loadSuggestions() {
    const faqBody = document.getElementById("faq-body");

    try {
        const response = await fetch("http://127.0.0.1:5000/suggestions");
        if (response.ok) {
            const suggestions = await response.json();
            faqBody.innerHTML += `<p><strong>Ask questions like:</strong></p>`;
            suggestions.forEach((s) => {
                faqBody.innerHTML += `<div class="faq-suggestion">${s.question}</div>`;
            });
        } else {
            console.error("Failed to load suggestions.");
        }
    } catch (error) {
        console.error("Error loading suggestions:", error);
    }
}

// Submit question to the server
async function submitQuestion() {
    let query = document.getElementById("faq-query").value.trim();

    if (!query) {
        alert("Please enter a question.");
        return;
    }

    const faqBody = document.getElementById("faq-body");

    if (query.toLowerCase() === "clear") {
        faqBody.innerHTML = "<p><strong>Bot:</strong> Hi! How can I help you today?</p>";
        document.getElementById("faq-query").value = "";
        return;
    }

    if (query.endsWith("?")) {
        query = query.slice(0, -1);
    }

    faqBody.innerHTML += `<div class="faq-answer"><strong>You:</strong> ${query}</div>`;

    try {
        const response = await fetch("http://127.0.0.1:5000/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
                data.forEach((faq) => {
                    faqBody.innerHTML += `<div class="faq-answer"><strong>Bot:</strong> ${faq.answer}</div>`;
                });
            } else {
                faqBody.innerHTML += `<div class="faq-answer"><strong>Bot:</strong> Sorry, no matching queries found.</div>`;
            }
        } else {
            faqBody.innerHTML += `<div class="faq-answer"><strong>Bot:</strong> Error: Unable to process the request.</div>`;
        }
    } catch (error) {
        console.error("Error:", error);
        faqBody.innerHTML += `<div class="faq-answer"><strong>Bot:</strong> Sorry, something went wrong.</div>`;
    }

    document.getElementById("faq-query").value = "";
}

// Enable clicking on suggestions to autofill input
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("faq-suggestion")) {
        document.getElementById("faq-query").value = e.target.textContent;
    }
});

// Load suggestions when the page loads
document.addEventListener("DOMContentLoaded", loadSuggestions);
