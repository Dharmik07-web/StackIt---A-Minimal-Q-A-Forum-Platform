// ====== API Configuration ======
const API_BASE_URL = "http://localhost:5000/api";

// ====== API Functions ======
async function fetchQuestions() {
  try {
    const response = await fetch(`${API_BASE_URL}/questions`);
    const questions = await response.json();
    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}

async function submitQuestion(questionData) {
  try {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questionData),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error submitting question:", error);
    throw error;
  }
}

async function fetchTags() {
  try {
    const response = await fetch(`${API_BASE_URL}/tags`);
    const tags = await response.json();
    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

// ====== DOM Update Functions ======
function renderQuestions(questions) {
  const questionsList = document.querySelector(".questions-list");
  if (!questionsList) return;

  questionsList.innerHTML = "";

  questions.forEach((question) => {
    const questionElement = createQuestionElement(question);
    questionsList.appendChild(questionElement);
  });
}

function createQuestionElement(question) {
  const article = document.createElement("article");
  article.className = "question-item";

  const timeAgo = getTimeAgo(question.createdAt);

  article.innerHTML = `
    <div class="question-stats">
      <div class="stat-item">
        <span class="stat-number">${question.votes}</span>
        <span class="stat-label">votes</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">${question.answers}</span>
        <span class="stat-label">${
          question.answers === 1 ? "answer" : "answers"
        }</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">${question.views}</span>
        <span class="stat-label">views</span>
      </div>
    </div>
    
    <div class="question-content">
      <h3 class="question-title">
        <a href="#" class="question-link">${question.title}</a>
      </h3>
      <p class="question-excerpt">
        ${question.description.replace(/<[^>]*>/g, "").substring(0, 150)}...
      </p>
      <div class="question-meta">
        <div class="question-tags">
          ${question.tags
            .map((tag) => `<span class="tag">${tag}</span>`)
            .join("")}
        </div>
        <div class="question-author">
          <span>asked ${timeAgo} by </span>
          <a href="#" class="author-link">@${question.author}</a>
        </div>
      </div>
    </div>
  `;

  return article;
}

function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
}

// ====== Initialize App ======
async function initializeApp() {
  try {
    // Load questions from API
    const questions = await fetchQuestions();
    renderQuestions(questions);

    // Update questions count
    const statsElement = document.querySelector(".questions-stats span");
    if (statsElement) {
      statsElement.textContent = `${questions.length} questions`;
    }
  } catch (error) {
    console.error("Error initializing app:", error);
  }
}

// ====== Quill Rich Text Editor Initialization ======
let quill;
if (document.getElementById("editor")) {
  quill = new Quill("#editor", {
    theme: "snow",
    placeholder: "Write your question details here...",
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image"],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
    },
  });
}

// ====== Modal Open/Close ======
const askBtn = document.getElementById("askQuestionBtn");
const askModal = document.getElementById("askQuestionModal");
const closeModal = document.getElementById("closeModal");
const cancelQuestion = document.getElementById("cancelQuestion");

if (askBtn && askModal) {
  askBtn.onclick = () => (askModal.style.display = "flex");
}
if (closeModal && askModal) {
  closeModal.onclick = () => (askModal.style.display = "none");
}
if (cancelQuestion && askModal) {
  cancelQuestion.onclick = () => (askModal.style.display = "none");
}
window.onclick = function (event) {
  if (askModal && event.target === askModal) {
    askModal.style.display = "none";
  }
};

// ====== Notification Dropdown ======
const notificationBtn = document.getElementById("notificationBtn");
const notificationDropdown = document.getElementById("notificationDropdown");
if (notificationBtn && notificationDropdown) {
  notificationBtn.onclick = (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle("show");
    if (userDropdown) userDropdown.classList.remove("show");
  };
}

// ====== User Dropdown ======
const userBtn = document.getElementById("userBtn");
const userDropdown = document.getElementById("userDropdown");
if (userBtn && userDropdown) {
  userBtn.onclick = (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle("show");
    if (notificationDropdown) notificationDropdown.classList.remove("show");
  };
}


window.addEventListener("click", function () {
  if (notificationDropdown) notificationDropdown.classList.remove("show");
  if (userDropdown) userDropdown.classList.remove("show");
});

// ====== Sidebar Filter Selection ======
document.querySelectorAll(".category-item").forEach((item) => {
  item.onclick = function () {
    document
      .querySelectorAll(".category-item")
      .forEach((i) => i.classList.remove("active"));
    this.classList.add("active");
    // TODO: Filter questions by category
  };
});
document
  .querySelectorAll(".filter-label input[type=radio]")
  .forEach((radio) => {
    radio.onchange = function () {
      
    };
  });


document.querySelectorAll(".page-btn").forEach((btn) => {
  btn.onclick = function () {
    document
      .querySelectorAll(".page-btn")
      .forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    // TODO: Load questions for selected page
  };
});

// ====== Tag Input Handling ======
const tagsInput = document.getElementById("tagsInput");
const tagsList = document.getElementById("tagsList");
let tags = [];
if (tagsInput && tagsList) {
  tagsInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && this.value.trim()) {
      e.preventDefault();
      if (tags.length < 5 && !tags.includes(this.value.trim())) {
        tags.push(this.value.trim());
        renderTags();
        this.value = "";
      }
    }
  });
}
function renderTags() {
  if (!tagsList) return;
  tagsList.innerHTML = "";
  tags.forEach((tag, idx) => {
    const tagEl = document.createElement("span");
    tagEl.className = "tag";
    tagEl.textContent = tag;
    tagEl.onclick = () => {
      tags.splice(idx, 1);
      renderTags();
    };
    tagsList.appendChild(tagEl);
  });
}

// ====== Ask Question Form Submission ======
const askForm = document.getElementById("askQuestionForm");
if (askForm) {
  askForm.onsubmit = async function (e) {
    e.preventDefault();
    const title = document.getElementById("questionTitle").value.trim();
    const description = quill ? quill.root.innerHTML : "";
    if (!title || !description || tags.length === 0) {
      alert("Please fill in all fields and add at least one tag.");
      return;
    }

    try {
      const questionData = {
        title,
        description,
        tags,
        author: "john_doe", // TODO: Get from user session
      };

      await submitQuestion(questionData);

      // Close modal and reset form
      askModal.style.display = "none";
      askForm.reset();
      if (quill) quill.setContents([]);
      tags = [];
      renderTags();

      // Reload questions to show the new one
      const questions = await fetchQuestions();
      renderQuestions(questions);

      // Update questions count
      const statsElement = document.querySelector(".questions-stats span");
      if (statsElement) {
        statsElement.textContent = `${questions.length} questions`;
      }

      alert("Question submitted successfully!");
    } catch (error) {
      alert("Error submitting question. Please try again.");
      console.error("Error:", error);
    }
  };
}

// ====== Search Functionality ======
const searchInput = document.querySelector(".search-input");
if (searchInput) {
  searchInput.addEventListener("input", async function () {
    const searchTerm = this.value.trim().toLowerCase();
    if (searchTerm.length === 0) {
      // Show all questions
      const questions = await fetchQuestions();
      renderQuestions(questions);
      return;
    }

    // Filter questions locally (in a real app, this would be done on the backend)
    const questions = await fetchQuestions();
    const filteredQuestions = questions.filter(
      (question) =>
        question.title.toLowerCase().includes(searchTerm) ||
        question.description.toLowerCase().includes(searchTerm) ||
        question.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
    renderQuestions(filteredQuestions);
  });
}

// ====== Initialize the app when DOM is loaded ======
document.addEventListener("DOMContentLoaded", initializeApp);
