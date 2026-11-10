// ---- Edit these if you ever want different answers ----
const RADIOS = {
  // Excellent (5) for the rating questions
  question_1: "5", question_2: "5", question_3: "5",
  question_5: "5", question_6: "5", question_7: "5",
  question_8: "5", question_9: "5", question_10: "5",
  question_4: "53",   // Pace: Just Right
  question_13: "3",   // Your effort: Average
  question_14: "3"    // Workload vs other courses: Average
};

const TEXTS = {
  question_11_1: "Very strong command of the subject and explains difficult concepts clearly with good examples. Approachable and encourages students to ask questions during lectures.",
  question_11_2: "No major weaknesses. Occasionally a few more worked examples and short recaps of previous lectures would make complex topics even easier to follow.",
  question_12_1: "Well-structured course with a good balance of theory and practical applications. Topics are relevant, build logically on each other, and the assignments reinforce the concepts taught in class.",
  question_12_2: "The syllabus is quite broad, so some topics are covered briefly. More time on advanced topics and a few additional practice problems would be helpful.",
  question_15: "Overall a great course. Sharing lecture slides and notes in advance, and adding a few more practice problem sets before exams, would be very helpful for students."
};
// --------------------------------------------------------

function fillFeedback(force) {
  const form = document.querySelector("#studentFeedbackResponseForm");
  if (!form) return false;
  const table = form.querySelector("#fdQuestionAnsTab");
  if (!table || !table.querySelector('input[name="question_1"]')) return false;

  // Fill each freshly rendered question table once; manual refill forces it.
  if (table.dataset.autofilled === "1" && !force) return false;
  table.dataset.autofilled = "1";

  // Radios: only touch a question if nothing is selected yet (or when forced).
  for (const [name, value] of Object.entries(RADIOS)) {
    const group = form.querySelectorAll(`input[type="radio"][name="${name}"]`);
    if (!group.length) continue;
    const already = Array.from(group).some((r) => r.checked);
    if (already && !force) continue;
    const target = form.querySelector(`input[type="radio"][name="${name}"][value="${value}"]`);
    if (target) target.click(); // click so the page's own handlers run
  }

  // Text boxes: only fill empty ones (or when forced).
  for (const [name, text] of Object.entries(TEXTS)) {
    const el = form.querySelector(`textarea[name="${name}"]`);
    if (!el) continue;
    if (el.value.trim() && !force) continue;
    el.focus();
    el.value = text;
    ["input", "change", "keyup", "blur"].forEach((e) =>
      el.dispatchEvent(new Event(e, { bubbles: true }))
    );
  }
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();

  showBanner("Feedback auto-filled. Enter the captcha and click Submit.");
  return true;
}

function showBanner(msg) {
  let b = document.getElementById("__fb_autofill_banner");
  if (!b) {
    b = document.createElement("div");
    b.id = "__fb_autofill_banner";
    b.style.cssText =
      "position:fixed;bottom:16px;right:16px;z-index:2147483647;background:#198754;" +
      "color:#fff;padding:10px 14px;border-radius:6px;font:13px Segoe UI,sans-serif;" +
      "box-shadow:0 2px 8px rgba(0,0,0,.3);";
    document.body.appendChild(b);
  }
  b.textContent = msg;
  clearTimeout(b.__t);
  b.__t = setTimeout(() => b.remove(), 6000);
}

// The questions load dynamically after a faculty member is selected,
// so watch for them to appear.
let timer = null;
const observer = new MutationObserver(() => {
  clearTimeout(timer);
  timer = setTimeout(() => fillFeedback(false), 300);
});
observer.observe(document.documentElement, { childList: true, subtree: true });
fillFeedback(false);

chrome.runtime.onMessage.addListener((msg) => {
  if (msg && msg.type === "refill") fillFeedback(true);
});
