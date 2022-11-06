import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

let tweetsData1 = tweetsData;
const loggedInUserHandle = "@Scrimba";

if (localStorage.getItem("tweetsLocalStorage")) {
    tweetsData1 = JSON.parse(localStorage.getItem("tweetsLocalStorage"));
}

document.addEventListener("click", function (e) {
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like);
    } else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet);
    } else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply);
    } else if (e.target.id === "tweet-btn") {
        handleTweetBtnClick();
    } else if (e.target.dataset.replybtn) {
        handleReplyTweet(e.target.dataset.replybtn);
    } else if (e.target.dataset.deletebtn) {
        handleDeleteTweet(e.target.dataset.deletebtn);
    }
});

function handleLikeClick(tweetId) {
    const targetTweetObj = tweetsData1.filter(function (tweet) {
        return tweet.uuid === tweetId;
    })[0];

    if (targetTweetObj.isLiked) {
        targetTweetObj.likes--;
    } else {
        targetTweetObj.likes++;
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked;
    render();
}

function handleRetweetClick(tweetId) {
    const targetTweetObj = tweetsData1.filter(function (tweet) {
        return tweet.uuid === tweetId;
    })[0];

    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets--;
    } else {
        targetTweetObj.retweets++;
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
    render();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
    const tweetInput = document.getElementById("tweet-input");

    if (tweetInput.value) {
        tweetsData1.unshift({
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        likes: 0,
        retweets: 0,
        tweetText: tweetInput.value,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4(),
        });
        render();
        tweetInput.value = "";
    }
}

function handleReplyTweet(tweetId) {
    const replyInput = document.getElementById(`reply-${tweetId}`);
    const targetTweetObj = tweetsData1.filter(function (tweet) {
        return tweet.uuid === tweetId;
    })[0];
    targetTweetObj.replies.unshift({
        handle: "@Scrimba",
        profilePic: "images/scrimbalogo.png",
        tweetText: replyInput.value,
    });
    replyInput.value = "";
    render();
    handleReplyClick(tweetId);
}

function handleDeleteTweet(tweetId) {
    //2nd check server side
    const targetTweetObj = tweetsData1.filter(function (tweet) {
        return tweet.uuid === tweetId;
    })[0];

    if (targetTweetObj.handle !== loggedInUserHandle) {
        // console.log('You have no authority to delete other person posts')
        return;
    }

    tweetsData1 = tweetsData1.filter(function (tweet) {
        return tweet.uuid != tweetId;
    });
    render();
}

function getFeedHtml() {
    localStorage.setItem("tweetsLocalStorage", JSON.stringify(tweetsData1));
    let feedHtml = ``;

    tweetsData1.forEach(function (tweet) {

        const hiddenClass=tweet.handle !== loggedInUserHandle?"hidden":""
        const likeIconClass = tweet.isLiked?"liked":""
        const retweetIconClass=tweet.isRetweeted?"retweeted":""

        let repliesHtml = "";

        if (tweet.replies.length > 0) {
        tweet.replies.forEach(function (reply) {
            repliesHtml += `
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>
                    `;
        });
        }

        feedHtml += `
                <div class="tweet">
                    <div class="tweet-inner">
                        <img src="${tweet.profilePic}" class="profile-pic">
                        <div>
                            <p class="handle">${tweet.handle}</p>
                            <p class="tweet-text">${tweet.tweetText}</p>
                            <div class="tweet-details">
                                <span class="tweet-detail">
                                    <i class="fa-regular fa-comment-dots"
                                    data-reply="${tweet.uuid}"
                                    ></i>
                                    ${tweet.replies.length}
                                </span>
                                <span class="tweet-detail">
                                    <i class="fa-solid fa-heart ${likeIconClass}"
                                    data-like="${tweet.uuid}"
                                    ></i>
                                    ${tweet.likes}
                                </span>
                                <span class="tweet-detail">
                                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                                    data-retweet="${tweet.uuid}"
                                    ></i>
                                    ${tweet.retweets}
                                </span>
                            </div>
                            <div class="reply-div">
                                <input type="text" class="input-reply" placeholder="Reply here!" 
                                id="reply-${tweet.uuid}" data-replytweet=${tweet.uuid} />
                                <button class="btn-reply" data-replybtn=${tweet.uuid}>Reply</button>
                            </div>
                            
                            
                        </div> 
                            <div class=${hiddenClass}>
                                <i class="fa-solid fa-trash" data-deletebtn=${tweet.uuid}></i>
                            </div>
                                
                    </div>
                    <div class="hidden" id="replies-${tweet.uuid}">
                        ${repliesHtml}
                    </div>   
                </div>
                `;
    });
  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();
