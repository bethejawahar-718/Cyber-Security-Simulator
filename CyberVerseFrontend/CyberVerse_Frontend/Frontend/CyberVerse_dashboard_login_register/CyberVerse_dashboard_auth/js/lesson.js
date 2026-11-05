
// ==========================================
// CYBERVERSE - LESSON APPLICATION
// ==========================================

const API_BASE =
    "https://cyber-security-simulator-backend1.onrender.com/api/lessons";

const params = new URLSearchParams(window.location.search);
const lessonId = params.get("id");

// HTML ELEMENTS
const lessonTitle = document.getElementById("lessonTitle");
const lessonDescription = document.getElementById("lessonDescription");
const topicsList = document.getElementById("topicsList");


// ==========================================
// LOAD LESSON
// ==========================================

async function loadLesson() {

    if (!lessonId || !/^[1-9]\d*$/.test(lessonId)) {
        lessonTitle.textContent = "Invalid lesson";
        topicsList.textContent = "Please return to the roadmap.";
        return;
    }

    try {
        const response = await fetch(API_BASE);
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error("Unable to load lessons");
        }

        const lesson = data.lessons.find(
            item => String(item.id) === lessonId
        );

        if (!lesson) {
            lessonTitle.textContent = "Lesson not found";
            topicsList.textContent = "This lesson is unavailable.";
            return;
        }

        lessonTitle.textContent = lesson.title;

        lessonDescription.textContent =
            lesson.description || "";

        document.title = `${lesson.title} | CyberVerse`;

        await loadTopics();

    } catch (error) {

        console.error("Lesson loading error:", error);

        lessonTitle.textContent = "Unable to load lesson";

        topicsList.textContent =
            "Please check your backend server and try again.";
    }
}


// ==========================================
// LOAD LESSON TOPICS
// ==========================================

async function loadTopics() {

    try {

        const response = await fetch(
            `${API_BASE}/${encodeURIComponent(lessonId)}/topics`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error("Unable to load topics");
        }

        if (!Array.isArray(data.topics) || data.topics.length === 0) {
            topicsList.textContent = "No topics available.";
            return;
        }

        topicsList.innerHTML = data.topics.map((topic, index) => `

            <article class="roadmap-item">

                <div class="roadmap-number">
                    ${String(index + 1).padStart(2, "0")}
                </div>

                <div>
                    <h3>${escapeHTML(topic.title)}</h3>
                </div>

                <a
                    class="card-link"
                    href="topic.html?lessonId=${encodeURIComponent(lessonId)}&id=${encodeURIComponent(topic.id)}"
                >
                    Read &rarr;
                </a>

            </article>

        `).join("");

    } catch (error) {

        console.error("Topic loading error:", error);

        topicsList.textContent =
            "Unable to load topics. Please try again.";
    }
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);

}


// ==========================================
// SANITIZE LESSON HTML
// ==========================================

function sanitizeLessonHTML(html) {

    const parser = new DOMParser();

    const doc = parser.parseFromString(
        String(html),
        "text/html"
    );

    const allowed = new Set([
        "H2", "H3", "H4",
        "P",
        "UL", "OL", "LI",
        "B", "STRONG",
        "I", "EM",
        "BR", "HR",
        "TABLE", "THEAD", "TBODY",
        "TR", "TH", "TD",
        "CODE", "PRE",
        "BLOCKQUOTE",
        "DIV", "SECTION", "SPAN"
    ]);

    const blocked = new Set([
        "SCRIPT", "STYLE",
        "IFRAME", "OBJECT", "EMBED",
        "SVG", "FORM", "INPUT",
        "BUTTON"
    ]);

    const cleanNode = node => {

        [...node.childNodes].forEach(child => {

            if (child.nodeType === Node.ELEMENT_NODE) {

                if (blocked.has(child.tagName)) {
                    child.remove();
                    return;
                }

                if (!allowed.has(child.tagName)) {
                    child.replaceWith(...child.childNodes);
                    return;
                }

                [...child.attributes].forEach(attr => {
                    child.removeAttribute(attr.name);
                });

                cleanNode(child);

            } else if (child.nodeType !== Node.TEXT_NODE) {

                child.remove();

            }

        });

    };

    cleanNode(doc.body);

    return doc.body.innerHTML;

}


// ==========================================
// INITIALIZE
// ==========================================

loadLesson();
