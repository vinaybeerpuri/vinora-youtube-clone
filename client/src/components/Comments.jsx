import React, { useState, useEffect } from "react";
import API from "../config/api";
import "./Comments.css";

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [city, setCity] = useState("Loading...");

  // FETCH USER CITY
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        setCity(data.city);
      })
      .catch(() => {
        setCity("Unknown");
      });
  }, []);

  // FETCH COMMENTS FROM DATABASE
  useEffect(() => {
    fetch(`${API}/api/comments/${videoId}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.log("Comments Error:", err));
  }, [videoId]);

  // ADD COMMENT
  const addComment = async () => {
    const specialCharRegex = /[@#$%^&*{}|<>]/;
    if (specialCharRegex.test(text)) {
      alert("Special characters are not allowed");
      return;
    }
    if (text.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${API}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          username: "Vinay",
          text,
          city
        })
      });

      const savedComment = await response.json();
      savedComment.translatedText = "";
      savedComment.selectedLanguage = "en";

      setComments([savedComment, ...comments]);
      setText("");
    } catch (error) {
      console.log("Comment Save Error:", error);
    }
  };

  // LIKE COMMENT
  const handleLike = async (id) => {
    try {
      const response = await fetch(`${API}/api/comments/${id}/like`, { method: "PUT" });
      const updatedComment = await response.json();
      setComments(
        comments.map((comment) =>
          comment._id === id ? { ...comment, likes: updatedComment.likes } : comment
        )
      );
    } catch (error) {
      console.log("Like Error:", error);
    }
  };

  // DISLIKE COMMENT
  const handleDislike = async (id) => {
    try {
      const response = await fetch(`${API}/api/comments/${id}/dislike`, { method: "PUT" });
      const result = await response.json();

      if (result.deleted) {
        setComments(comments.filter((comment) => comment._id !== id));
        return;
      }

      setComments(
        comments.map((comment) =>
          comment._id === id ? { ...comment, dislikes: result.dislikes } : comment
        )
      );
    } catch (error) {
      console.log("Dislike Error:", error);
    }
  };

  // CHANGE LANGUAGE
  const handleLanguageChange = (id, language) => {
    const updated = comments.map((comment) =>
      comment._id === id ? { ...comment, selectedLanguage: language } : comment
    );
    setComments(updated);
  };

  // TRANSLATE COMMENT
  const handleTranslate = async (id, text, targetLanguage) => {
    try {
      let sourceLanguage = "en";
      if (/[\u0C00-\u0C7F]/.test(text)) {
        sourceLanguage = "te";
      } else if (/[\u0900-\u097F]/.test(text)) {
        sourceLanguage = "hi";
      } else if (/[\u0B80-\u0BFF]/.test(text)) {
        sourceLanguage = "ta";
      }

      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`
      );
      const data = await response.json();

      let translatedText = data.responseData.translatedText;
      if (!translatedText || translatedText.includes("INVALID") || translatedText === text) {
        translatedText = "Translation unavailable";
      }

      const updated = comments.map((comment) =>
        comment._id === id ? { ...comment, translatedText } : comment
      );
      setComments(updated);
    } catch (error) {
      console.log(error);
      const updated = comments.map((comment) =>
        comment._id === id ? { ...comment, translatedText: "Translation failed" } : comment
      );
      setComments(updated);
    }
  };

  return (
    <div className="cm-section">
      <h2>Comments ({comments.length})</h2>

      <div className="cm-input-row">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="cm-textarea"
        />
        <button onClick={addComment} className="cm-submit-btn">
          Comment
        </button>
      </div>

      <div className="cm-list">
        {comments.map((comment) => {
          const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            comment.username || "U"
          )}&backgroundColor=2a2a2a`;

          return (
            <div key={comment._id} className="cm-card">
              <div className="cm-card-header">
                <img
                  className="cm-avatar"
                  src={avatarUrl}
                  alt={comment.username}
                  loading="lazy"
                />
                <div className="cm-user-info">
                  <strong className="cm-username">{comment.username}</strong>
                  <span className="cm-city">ðŸ“ {comment.city}</span>
                </div>
              </div>

              <div className="cm-body">
                <p className="cm-text">{comment.text}</p>

                {comment.translatedText && (
                  <p className="cm-translation">
                    Translation: {comment.translatedText}
                  </p>
                )}

                <div className="cm-lang-wrap">
                  <select
                    value={comment.selectedLanguage || "en"}
                    onChange={(e) => handleLanguageChange(comment._id, e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="te">Telugu</option>
                    <option value="hi">Hindi</option>
                    <option value="ta">Tamil</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div className="cm-btn-row">
                  <button className="cm-action-btn" onClick={() => handleLike(comment._id)}>
                    ðŸ‘ {comment.likes || 0}
                  </button>
                  <button className="cm-action-btn" onClick={() => handleDislike(comment._id)}>
                    ðŸ‘Ž {comment.dislikes || 0}
                  </button>
                  <button
                    className="cm-action-btn cm-translate-btn"
                    onClick={() =>
                      handleTranslate(
                        comment._id,
                        comment.text,
                        comment.selectedLanguage || "en"
                      )
                    }
                  >
                    ðŸŒ Translate
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Comments;
