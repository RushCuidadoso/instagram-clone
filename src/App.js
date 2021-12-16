import './App.css';
import {db,auth} from './firebase.js'
import {useEffect, useState} from 'react'
import Header from './Header.js'
import Post from './Post.js'

function App() {

  const [user, setUser] = useState();
  const [posts, setPosts] = useState([])

  useEffect(()=>{
  
    auth.onAuthStateChanged(function(val){
      if(val!=null){
        setUser(val.displayName)
      }
    })

    db.collection('posts').orderBy('timestamp','desc').onSnapshot((snapshot)=>{
      setPosts(snapshot.docs.map(function(document){
        return {id:document.id, info:document.data()}
      }))
    })
  },[])

  return (
    <div className="App">
      <Header setUser={setUser} user={user}/>
      {
        posts.map(function(val){
          return(
            <div>
              <Post user={user} info={val.info} id={val.id} />
            </div>
          )
        })
      }
    </div>
  );
}

export default App;
