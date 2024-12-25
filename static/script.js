// Function to toggle the visibility of the infobox
function toggleInfobox() {
    const infobox = document.getElementById("faq-infobox");
    infobox.classList.toggle("hidden");
}

// Load suggestions on page load
async function loadSuggestions() {
    const faqBody = document.getElementById("faq-body");
    const baseURL = window.location.origin; // Get the current deployed URL

    try {
        const response = await fetch(`${baseURL}/suggestions`);
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

// **Modified submitQuestion function**
async function submitQuestion() {
    let query = document.getElementById("faq-query").value.trim();

    if (!query) {
        alert("Please enter a question.");
        return;
    }

    const faqBody = document.getElementById("faq-body");
    const baseURL = window.location.origin; // Get the current deployed URL

    // **Check for "clear" command**
    if (query.toLowerCase() === "clear") {
        faqBody.innerHTML = `<p>Welcome! Type your question below or select a suggestion:</p>`;
        loadSuggestions(); // Reload suggestions
        document.getElementById("faq-query").value = ""; // Clear the input field
        return;
    }

    if (query.endsWith("?")) {
        query = query.slice(0, -1);
    }

    // **Clear previous responses before adding the new one**
    faqBody.innerHTML = `<p>Welcome! Type your question below or select a suggestion:</p>`;
    loadSuggestions(); // Reload suggestions

    faqBody.innerHTML += `<div class="faq-answer"><strong>You:</strong> ${query}</div>`; // User's query

    try {
        const response = await fetch(`${baseURL}/search`, {
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
                    faqBody.innerHTML += `<div class="faq-answer"><strong>PI Guide:</strong> ${faq.answer}</div>`;
                });
            } else {
                faqBody.innerHTML += `<div class="faq-answer"><strong>PI Guide:</strong> Sorry, no matching queries found.</div>`;
            }
        } else {
            faqBody.innerHTML += `<div class="faq-answer"><strong>PI Guide:</strong> Error: Unable to process the request.</div>`;
        }
    } catch (error) {
        console.error("Error:", error);
        faqBody.innerHTML += `<div class="faq-answer"><strong>PI Guide:</strong> Sorry, something went wrong.</div>`;
    }

    document.getElementById("faq-query").value = ""; // Clear the input field
}

// Enable clicking on suggestions to autofill input
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("faq-suggestion")) {
        document.getElementById("faq-query").value = e.target.textContent;
    }
});

// Load suggestions when the page loads
document.addEventListener("DOMContentLoaded", loadSuggestions);

// **Add event listener for "Enter" key to submit the question**
document.getElementById("faq-query").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent the default action (form submission)
        submitQuestion(); // Call submitQuestion() when "Enter" is pressed
    }
});
