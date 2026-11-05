
// ==========================================
// CYBERVERSE - TOPIC APPLICATION
// ==========================================

const API_BASE =
    "https://cyber-security-simulator-backend1.onrender.com/api/lessons";

const params = new URLSearchParams(window.location.search);

const topicId = params.get("id");
const lessonId = params.get("lessonId");

const topicTitle = document.getElementById("topicTitle");
const topicText = document.getElementById("topicText");
const backToLesson = document.getElementById("backToLesson");

// ==========================================
// SAFE HTML SANITIZER
// ==========================================

function sanitizeLessonHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(String(html), "text/html");

    const allowed = new Set([
        "H2", "H3", "H4", "P",
        "UL", "OL", "LI",
        "B", "STRONG", "I", "EM",
        "BR", "HR",
        "TABLE", "THEAD", "TBODY",
        "TR", "TH", "TD",
        "CODE", "PRE", "BLOCKQUOTE",
        "DIV", "SECTION", "SPAN"
    ]);

    const blocked = new Set([
        "SCRIPT", "STYLE", "IFRAME",
        "OBJECT", "EMBED", "SVG",
        "FORM", "INPUT", "BUTTON"
    ]);

    function cleanNode(parent) {
        [...parent.childNodes].forEach(child => {

            if (child.nodeType === Node.ELEMENT_NODE) {

                if (blocked.has(child.tagName)) {
                    child.remove();
                    return;
                }

                if (!allowed.has(child.tagName)) {
                    child.replaceWith(...child.childNodes);
                    return;
                }

                // Remove all attributes to prevent unsafe handlers/styles.
                [...child.attributes].forEach(attr => {
                    child.removeAttribute(attr.name);
                });

                cleanNode(child);

            } else if (child.nodeType !== Node.TEXT_NODE) {
                child.remove();
            }
        });
    }

    cleanNode(doc.body);

    return doc.body.innerHTML;
}

// ==========================================
// LOAD TOPIC CONTENT
// ==========================================

async function loadTopic() {

    if (!topicId || !/^[1-9]\d*$/.test(topicId)) {
        topicTitle.textContent = "Invalid topic";
        topicText.textContent = "Please return to the lesson.";
        return;
    }

    // Set the back button to the correct lesson.
    if (lessonId && /^[1-9]\d*$/.test(lessonId)) {
        backToLesson.href =
            `lesson.html?id=${encodeURIComponent(lessonId)}`;
    }

    try {

        const response = await fetch(
            `${API_BASE}/topics/${encodeURIComponent(topicId)}`
        );

        const data = await response.json();

        if (!response.ok || !data.success || !data.topic) {
            throw new Error("Unable to load topic");
        }

        // Display topic title.
        topicTitle.textContent = data.topic.title;

        document.title = `${data.topic.title} | CyberVerse`;

        // Display complete topic content.
        topicText.innerHTML = sanitizeLessonHTML(
            data.topic.content || "<p>No content available.</p>"
        );

    } catch (error) {

        console.error("Topic loading error:", error);

        topicTitle.textContent = "Unable to load topic";

        topicText.textContent =
            "The topic could not be loaded. Please try again.";
    }
}

// ==========================================
// INITIALIZE
// ==========================================

loadTopic();
