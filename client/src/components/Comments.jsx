import React, {
  useState,
  useEffect
} from "react";

const Comments = ({ videoId }) => {

  const [comments, setComments] =
    useState([]);

  const [text, setText] =
    useState("");

  const [city, setCity] =
    useState("Loading...");

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

    fetch(
      `http://192.168.245.41:5000/api/comments/${videoId}`
    )
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) =>
        console.log("Comments Error:", err)
      );

  }, [videoId]);

  // ADD COMMENT
  const addComment = async () => {

    const specialCharRegex =
      /[@#$%^&*{}|<>]/;

    if (
      specialCharRegex.test(text)
    ) {
      alert(
        "Special characters are not allowed"
      );
      return;
    }

    if (
      text.trim() === ""
    ) {
      alert(
        "Comment cannot be empty"
      );
      return;
    }

    try {

      const response =
        await fetch(
          "http://192.168.245.41:5000/api/comments",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              videoId,
              username: "Vinay",
              text,
              city
            })
          }
        );

      const savedComment =
        await response.json();

      savedComment.translatedText =
        "";

      savedComment.selectedLanguage =
        "en";

      setComments([
        savedComment,
        ...comments
      ]);

      setText("");

    }

    catch (error) {

      console.log(
        "Comment Save Error:",
        error
      );
    }
  };

  // LIKE COMMENT
  const handleLike = async (id) => {

    try {

      const response =
        await fetch(
          `http://192.168.245.41:5000/api/comments/${id}/like`,
          {
            method: "PUT"
          }
        );

      const updatedComment =
        await response.json();

      setComments(
        comments.map((comment) =>
          comment._id === id
            ? {
              ...comment,
              likes:
                updatedComment.likes
            }
            : comment
        )
      );

    } catch (error) {

      console.log(
        "Like Error:",
        error
      );
    }
  };

  // DISLIKE COMMENT
  const handleDislike = async (id) => {

    try {

      const response =
        await fetch(
          `http://192.168.245.41:5000/api/comments/${id}/dislike`,
          {
            method: "PUT"
          }
        );

      const result =
        await response.json();

      if (result.deleted) {

        setComments(
          comments.filter(
            (comment) =>
              comment._id !== id
          )
        );

        return;
      }

      setComments(
        comments.map((comment) =>
          comment._id === id
            ? {
              ...comment,
              dislikes:
                result.dislikes
            }
            : comment
        )
      );

    } catch (error) {

      console.log(
        "Dislike Error:",
        error
      );
    }
  };

  // CHANGE LANGUAGE
  const handleLanguageChange = (
    id,
    language
  ) => {

    const updated =
      comments.map((comment) =>

        comment._id === id

          ? {
            ...comment,
            selectedLanguage:
              language
          }

          : comment
      );

    setComments(updated);
  };

  // TRANSLATE COMMENT
  const handleTranslate = async (
    id,
    text,
    targetLanguage
  ) => {

    try {

      let sourceLanguage =
        "en";

      if (
        /[\u0C00-\u0C7F]/.test(text)
      ) {
        sourceLanguage = "te";
      }

      else if (
        /[\u0900-\u097F]/.test(text)
      ) {
        sourceLanguage = "hi";
      }

      else if (
        /[\u0B80-\u0BFF]/.test(text)
      ) {
        sourceLanguage = "ta";
      }

      const response =
        await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`
        );

      const data =
        await response.json();

      let translatedText =
        data.responseData
          .translatedText;

      if (
        !translatedText ||
        translatedText.includes(
          "INVALID"
        ) ||
        translatedText === text
      ) {
        translatedText =
          "Translation unavailable";
      }

      const updated =
        comments.map((comment) =>

          comment._id === id

            ? {
              ...comment,
              translatedText
            }

            : comment
        );

      setComments(updated);

    }

    catch (error) {

      console.log(error);

      const updated =
        comments.map((comment) =>

          comment._id === id

            ? {
              ...comment,
              translatedText:
                "Translation failed"
            }

            : comment
        );

      setComments(updated);
    }
  };

  return (

    <div
      style={{
        marginTop: "30px",
        color: "white"
      }}
    >

      <h2>
        Comments ({comments.length})
      </h2>

      <textarea
        value={text}
        onChange={(e) =>
          setText(
            e.target.value
          )
        }
        placeholder="Write comment..."
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "10px",
          marginTop: "10px"
        }}
      />

      <button
        onClick={addComment}
        style={{
          marginTop: "10px",
          padding:
            "10px 20px",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        Add Comment
      </button>

      <div
        style={{
          marginTop: "20px"
        }}
      >

        {comments.map(
          (comment) => (

            <div
              key={comment._id}
              style={{
                border:
                  "1px solid gray",
                padding: "15px",
                marginBottom:
                  "15px",
                borderRadius:
                  "12px",
                backgroundColor:
                  "#1c1c1c"
              }}
            >

              <strong>
                {comment.username}
              </strong>

              <p>
                {comment.text}
              </p>

              <p
                style={{
                  color: "gray",
                  fontSize: "14px"
                }}
              >
                📍 {comment.city}
              </p>

              {comment.translatedText && (

                <p
                  style={{
                    color:
                      "lightblue"
                  }}
                >
                  Translation:
                  {" "}
                  {
                    comment.translatedText
                  }
                </p>
              )}

              <div
                style={{
                  marginTop: "10px"
                }}
              >

                <select
                  value={
                    comment.selectedLanguage ||
                    "en"
                  }
                  onChange={(e) =>
                    handleLanguageChange(
                      comment._id,
                      e.target.value
                    )
                  }
                >
                  <option value="en">
                    English
                  </option>

                  <option value="te">
                    Telugu
                  </option>

                  <option value="hi">
                    Hindi
                  </option>

                  <option value="ta">
                    Tamil
                  </option>

                  <option value="fr">
                    French
                  </option>
                </select>

              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px"
                }}
              >

                <button
                  onClick={() =>
                    handleLike(
                      comment._id
                    )
                  }
                >
                  👍 {
                    comment.likes || 0
                  }
                </button>

                <button
                  onClick={() =>
                    handleDislike(
                      comment._id
                    )
                  }
                >
                  👎 {
                    comment.dislikes || 0
                  }
                </button>

                <button
                  onClick={() =>
                    handleTranslate(
                      comment._id,
                      comment.text,
                      comment.selectedLanguage || "en"
                    )
                  }
                >
                  🌐 Translate
                </button>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
};

export default Comments;