import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaPlus, FaTimes } from "react-icons/fa";
import "./FAQ.css";

const faqData = [
  {
    question: "What is Intervista AI?",
    answer:
      "Intervista AI is an AI interview coach. It runs realistic mock interviews, provides instant feedback, and helps you improve before real interviews.",
  },
  {
    question: "How does the AI interview work?",
    answer:
      "Choose a role, experience level, and interview type. Intervista AI asks realistic questions, listens to your answers, analyzes your performance, and gives detailed feedback.",
  },
  {
    question: "How long is a practice interview?",
    answer:
      "Practice interviews usually last between 15–45 minutes depending on the selected interview type.",
  },
  {
    question: "Can I repeat an interview?",
    answer:
      "Absolutely. You can practice the same interview multiple times and compare your improvement over time.",
  },
];

export default function FAQ() {
  const [openQuestion, setOpenQuestion] = useState(faqData[0].question);
  const [search, setSearch] = useState("");

  const filtered = faqData.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="faq-page">
      <div className="faq-container">
        <p className="small-title">Help Center</p>

        <h1 className="faq-heading">
          Questions, <span>Answered.</span>
        </h1>

        <p className="faq-subtitle">
          Everything you need to know before your next great interview.
        </p>

        <label className="faq-search-box">
          <FiSearch />
          <input
            placeholder="Search for an answer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <section className="faq-list">
          {filtered.map((item) => {
            const isOpen = openQuestion === item.question;

            return (
              <article className="faq-card" key={item.question}>
                <button
                  className="faq-question"
                  onClick={() =>
                    setOpenQuestion(isOpen ? null : item.question)
                  }
                >
                  <h3>{item.question}</h3>

                  {isOpen ? (
                    <FaTimes className="faq-icon" />
                  ) : (
                    <FaPlus className="faq-icon" />
                  )}
                </button>

                <div className={`faq-answer ${isOpen ? "show" : ""}`}>
                  <p>{item.answer}</p>
                </div>
              </article>
            );
          })}
        </section>

        <section className="support-card">
          <h2>Still need a hand?</h2>

          <p>
            Our support team is here to help you make every practice session
            count.
          </p>

          <button>Contact Support</button>
        </section>
      </div>
    </main>
  );
}