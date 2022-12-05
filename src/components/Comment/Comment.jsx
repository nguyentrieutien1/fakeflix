import "./comment.scss";
import React, { useState } from "react";
import CommentUser from "./CommentUser/CommentUser";
// import ReactStars from "react-rating-stars-component";
import { useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { selectCurrentUser } from "./../../redux/auth/auth.selectors";
import { db } from "../../firebase/firebaseUtils";
export default function Comment({ movieId, commentList, getList }) {
  console.log("====================================");
  console.log(commentList);
  console.log("====================================");
  const alert = useAlert();
  const [content, setContent] = useState("");
  const [contentchild, setContentchild] = useState("");
  const [start] = useState(0);
  const currentUser = useSelector(selectCurrentUser);
  const { displayName, id } = currentUser;
  const handleSubmit = () => {
    try {
      alert.info("Commenting . . .");
      const obj = {
        movieId,
        username: displayName,
        content,
        start,
        img: currentUser?.photoURL
          ? currentUser?.photoURL
          : "https://chieuta.com/wp-content/uploads/2018/01/anh-girl-xinh-mac-vay-ngan-360x250.jpg",
      };
      db.collection("comment").add(obj);
      setTimeout(() => {
        getList().then(() => {
          alert.success("Commented . . .");
          setContent("");
        });
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitComment = (idP, e) => {
    e.preventDefault();

    alert.info("Commenting . . .");
    const obj = {
      content: contentchild,
      parent_id: idP?.idComment,
      username: displayName,
      img: currentUser?.photoURL
        ? currentUser?.photoURL
        : "https://chieuta.com/wp-content/uploads/2018/01/anh-girl-xinh-mac-vay-ngan-360x250.jpg",
    };
    db.collection("comment_child").add(obj);
    setTimeout(() => {
      getList().then(() => {
        alert.success("Commented . . .");
        setContentchild("");
        document.getElementById("comc").value = "";
      });
    }, 500);
  };
  return (
    <div>
      <div className="Comment__container">
        <div className="Comment__header">
          <h3>TOP Comment</h3>
        </div>
        <div className="Comment__content">
          <div className="Comment__list">
            {commentList?.length > 0 &&
              [...commentList].map((item, index) => {
                return (
                  <div key={index} className="Comment__item">
                    <CommentUser
                      username={item?.username}
                      image={item?.img}
                      starts={parseInt(item?.start)}
                      content={item?.content}
                      isReply={false}
                      id={item?.idComment}
                      user_id={id}
                      like={item?.like}
                      disLike={item?.disLike}
                      isLike={item?.isLike}
                      isDisLike={item?.isDisLike}
                      getList={getList}
                    />
                    {item?.commentChildList?.length > 0 &&
                      item?.commentChildList.map((c, index) => {
                        if (c) {
                          return (
                            <div key={index} className="Comment__item--reply">
                              <CommentUser
                                username={c?.username}
                                image={c?.img}
                                content={c?.content}
                                isReply={true}
                              />
                            </div>
                          );
                        }
                      })}
                    <form
                      className="my-5 Comment__item--reply"
                      onSubmit={handleSubmitComment.bind(this, item)}
                    >
                      <p>Enter reply comment</p>
                      <div className="form-group">
                        <input
                          onChange={(e) => setContentchild(e.target.value)}
                          type="text"
                          className="form-control"
                          id="comc"
                          placeholder="Enter Comment"
                        />
                      </div>
                    </form>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="Comment--form">
          <div className="Comment__user">
            <div className="Comment__header--bottom">
              <div className="Comment__avatar--bottom">
                <img
                  src={
                    currentUser?.photoURL
                      ? currentUser?.photoURL
                      : "https://chieuta.com/wp-content/uploads/2018/01/anh-girl-xinh-mac-vay-ngan-360x250.jpg"
                  }
                />
              </div>
              <div className="Comment__username--bottom">
                <h4>{currentUser?.displayName}</h4>
              </div>
            </div>
          </div>
          <div className="Comment__form--bottom">
            <div className="Comment__reply--input">
              <input
                type="text"
                placeholder="Enter Your Comment"
                onChange={(e) => setContent(e.target.value)}
                value={content}
              />
            </div>
            <div className="Comment__reply--submit">
              <button onClick={handleSubmit}>Comment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
