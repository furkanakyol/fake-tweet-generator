import React, {useState, createRef, useEffect} from "react";
import {ReplyIcon, RetweetIcon, HeartIcon, ShareIcon, VerifiedIcon} from "./icons.js";
import {AvatarLoader} from "./loaders"
import { useScreenshot } from 'use-react-screenshot';

function convertImgToBase64(url, callback, outputFormat) {
  var canvas = document.createElement('CANVAS');
  var ctx = canvas.getContext('2d');
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL(outputFormat || 'image/png');
    callback.call(this, dataURL);
    // Clean up
    canvas = null;
  };
  img.src = url;
}
const tweetFormat = tweet =>{
  tweet = tweet
  .replace(/@([\w]+)/gi,"<span>@$1</span>")
  .replace(/#([\wşçöğüıİ]+)/gi,"<span>#$1</span>")
  .replace(/(https?:\/\/[\w\./]+)/gi,"<span>$1</span>")
  return tweet;
}
const formatNumber = number =>{
  if(number < 1000){
    return number;
  }
  number /= 1000;
  number = String(number).split('.');
  return number[0] + (number[1] > 100 ? ","+number[1].slice(0,1) + "B": 'B')
  return number;
}
function App() {
  const tweetRef = createRef(null)
  const downRef = createRef()
  const [Name, setName] = useState();
  const [Username, setUsername] = useState();
  const [IsVerified, setIsVerified] = useState()
  const [Tweet, setTweet] = useState();
  const [Avatar, setAvatar] = useState();
  const [Retweet, setRetweet] = useState(0);
  const [QuoteTweets, setQuoteTweets] = useState(0);
  const [Likes, setLikes] = useState(0);
  const [image, takeScreenshot] = useScreenshot()
  const getImage = () => takeScreenshot(tweetRef.current)
  useEffect(() => {
    if(image){
    downRef.current.click();
    }
  }, [image])

  const avatarHandle = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader()
    reader.addEventListener("load", function(){
      setAvatar(this.result);
    });
    reader.readAsDataURL(file)
  }
  const fetchTwitterInfo = () => {
    fetch(`https://typeahead-js-twitter-api-proxy.herokuapp.com/demo/search?q=${Username}`)
    .then(res => res.json())
    .then(data => {
      const twitter = data[0];
     console.log(data[0])
      convertImgToBase64(twitter.profile_image_url_https, function(base64Image){
        setAvatar(base64Image);
      })
      setName(twitter.name);
      setUsername(twitter.screen_name);
      setTweet(twitter.status.text)
      setRetweet(twitter.status.retweet_count);
      setLikes(twitter.status.favorite_count);
      if(twitter.verified == false){
        setIsVerified("");
      }else if(twitter.verified == true){
        setIsVerified(twitter.verified);
      }
      
    })
  }
  return (
    <>
    <div className="tweet-settings">
      <h3>Tweet ayarları</h3>
      <ul>
        <li>
          <label>Ad soyad</label>
          <input type="text" className="input" value={Name} onChange={e =>setName(e.target.value)}></input>
        </li>
        <li>
        <label>Kullanıcı adı</label>
          <input type="text" className="input" value={Username} onChange={e =>setUsername(e.target.value)}></input>
        </li>
        <li>
        <label>Tweet</label>
          <textarea type="text" maxLength="290" className="input" value={Tweet} onChange={e =>setTweet(e.target.value)}></textarea>
        </li>
        <li>
        <label>Avatar</label>
          <input type="file" className="input" onChange={avatarHandle}></input>
        </li>
        <li>
        <label>Retweet</label>
          <input type="number" className="input" value={Retweet} onChange={e =>setRetweet(e.target.value)}></input>
        </li>
        <li>
          <label>Alıntı Tweet</label>
          <input type="number" className="input" value={QuoteTweets} onChange={e =>setQuoteTweets(e.target.value)}></input>
        </li>
        <li>
          <label>Beğeni</label>
          <input type="number" className="input" value={Likes} onChange={e =>setLikes(e.target.value)}></input>
        </li>
        <li>
          <label>Doğrulanmış hesap</label>
          <select id="verified" //defaultValue={IsVerified == true && 1 || IsVerified == "" && 0} 
            onChange={e =>setIsVerified(e.target.value)} value={IsVerified} >
            <option value={true}>evet</option>
            <option value="">hayır</option>
          </select>
        </li>
        <button onClick={getImage}>Oluştur</button>
        <div className="down-url">
          <a href={image} download="tweet.png" ref={downRef} style={{display:"none"}}>Tweeti indir</a>
        </div>
      </ul>
    </div>
    <div className="tweet-container">
      <div className="fetch-info">
        <input type="text" placeholder="Çekmek istediğiniz kullanıcının kullanıcı adını yazın" value={Username} onChange={(e) => setUsername(e.target.value)}/><button onClick={fetchTwitterInfo}>Bilgileri çek</button>
      </div>
      <div className="tweet" ref={tweetRef}>
        <div className="tweet-author">
        {Avatar && <img src={Avatar}/> || <AvatarLoader/>}
          
          <div>
            <div className="name">{Name || "Ad Soyad"} {
              IsVerified && <VerifiedIcon width="19" height="19" />
            }</div>
            <div className="username">@{Username || "Kullanıcıadı"}</div>
          </div>
        </div>
        <div className="tweet-content">
        <p dangerouslySetInnerHTML = {{__html:(Tweet && tweetFormat(Tweet)) || "Buraya örnek tweet yazın"}}></p>
        </div>
        <div className="tweet-stats">
          <span>
            <b>{formatNumber(Retweet)|| "0"}</b> Retweet
          </span>
          <span>
            <b>{formatNumber(QuoteTweets)|| "0"}</b> Alıntı Tweetler
          </span>
          <span>
            <b>{formatNumber(Likes)|| "0"}</b> Beğeni
          </span>
        </div>
        <div className="tweet-actions">
        <span>
          <ReplyIcon color="#6e767d" />
        </span>
        <span>
          <RetweetIcon color="#6e767d" />
        </span>
        <span>
          <HeartIcon/>
        </span>
        <span>
          <ShareIcon/>
        </span>
        </div>
      
      
      
      </div>
    </div>
    </>
  );
}

export default App;
