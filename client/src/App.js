import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';
import sendImage from './assets/images/send.svg';
import user from './assets/images/user.png';
import loader from './assets/images/loader.svg';
import bot from './assets/images/bot.png';


function App() {
  const [input, setInput] = useState('');
  const [posts, setPosts] =  useState([]);

  useEffect(()=> {
      document.querySelector('.layout').scrollTop = document.querySelector('.layout').scrollHeight
  },[posts])

  const fetchBotResponse = async ()=> {
    const {data} = await axios.post('http://localhost:4000', {input}, {
      headers: {
        "Content-Type" : "application/json"
      }
    });
    return data;
  }
  
 

  const autoTypingBotResponse = (text)=> {
      let index = 0;
      let interval =setInterval(()=> {
          if(index < text.length) {
            setPosts(prevState => {
              let lastItem = prevState.pop();
              if (lastItem.type !== 'bot') {
                prevState.push({
                  type: 'bot',
                  post: text.charAt(index - 1)
                })
              }
              else {
                prevState.push({
                  type: 'bot',
                  post: lastItem.post + text.charAt(index - 1)
                })
              }
              return [...prevState];
            })
            index++;
          }
          else {
            clearInterval(interval)
          }
      }, 20)
  }

  const submitClick = ()=> {
    console.log('hello')
    if(input.trim() === "") return;
    updatePosts(input);
    updatePosts("Loading...", false, true);
    setInput('')
    fetchBotResponse().then((res)=> {
      console.log(res);
      updatePosts(res.bot.trim(), true);
    })
  }

  const updatePosts = (post, isBot, isLoading)=> {
    // use state m jo set wala variable hota h wo ek call back function bhi le skta h jisme apn ko previous data milta h taaki jab apn usme naya data bheje toh purana data delete na ho
    if(isBot) {
      autoTypingBotResponse(post)
    }else {
      setPosts(prevState => {
        return [
          ...prevState, {type: isLoading ? 'loading' : 'user', post}
        ]
      })
    }
  }

  const inputkeyUp = (e)=> {
    if(e.key === "Enter" || e.which === 13) {
      submitClick()
    }
  }

  return (
    <main className="chatGPT-app">
      <section className="chat-container">
        <div className="layout">
          {posts.map((post, index)=> (
            <div key={index} className={`chat-bubble ${post.type === 'bot' || post.type === 'loading' ? "bot" : ''}`}>
              <div className="avatar">
                <img src={post.type === 'bot' || post.type === 'loading' ? bot : user}/>
              </div>
              {post.type === 'loading' ? (
                <div className='loader'>
                  <img src={loader}/>
                </div>
              ) : (
                <div className="post">{post.post}</div>
              )}
            </div>
          ))}
        </div>
      </section>
      <footer>
        <input 
          type="text" 
          className="composebar" 
          autoFocus 
          value={input}
          placeholder=" Ask Anything!" 
          onChange={(e)=> setInput(e.target.value)}
          onKeyUp={inputkeyUp}
          />
        <div className="send-button" onClick={submitClick}>
          <img src={sendImage}/>
        </div>
      </footer>
    </main>
  );
}

export default App;
