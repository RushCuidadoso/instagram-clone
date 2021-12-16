import {useEffect, useState} from 'react'
import firebase from 'firebase/compat';
import {auth, storage, db} from './firebase.js'

export default function Header(props){

    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState(null);

    useEffect(() => {
    }, [])

    function abrirCriarConta(e){
        e.preventDefault();
        let modal = document.querySelector('.abrirCriarConta');
        modal.style.display = "block";
    }

    function fecharCriarConta(){
        let modal = document.querySelector('.abrirCriarConta');
        modal.style.display = "none";
    }

    function criarConta(e){
        e.preventDefault();
        //Criar conta Firebase
        let email = document.getElementById('email').value;
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;

        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser)=>{
            authUser.user.updateProfile({
                displayName:username
            })
            alert('Conta criada');
            fecharCriarConta();

        }).catch((error)=>{
            alert(error.message);
        })
    }

    function logar(e){
        e.preventDefault();
        let email = document.getElementById('email-login').value;
        let password = document.getElementById('password-login').value;

        auth.signInWithEmailAndPassword(email,password)
        .then((auth)=>{
            props.setUser(auth.user.displayName)
            alert('Logado com sucesso')
            window.location.href = "/"

        }).catch((error)=>{
            alert(error.message)
        })
    }

    function abrirUpload(e){
        e.preventDefault();
        let modal = document.querySelector('.abrirUpload');
        modal.style.display = "block";
    }

    function fecharUpload(){
        let modal = document.querySelector('.abrirUpload');
        modal.style.display = "none";
    }

    function uploadPost(e){
        e.preventDefault();
        let tituloPost = document.getElementById('titulo-upload').value

        const uploadTask = storage.ref(`images/${file.name}`).put(file);
        uploadTask.on("state_changed", function(snapshot){
            const progress = Math.round(snapshot.bytesTransferred/snapshot.totalBytes) * 1;
            setProgress(progress);
        },function(error){
            alert('Deu erro')
        },function(){
            storage.ref("images").child(file.name).getDownloadURL()
            .then(function(url){
                db.collection('posts').add({
                    titulo: tituloPost,
                    image: url,
                    userName: props.user,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                })

                setProgress(0);
                setFile(null);
                alert('Upload Realizado')

                document.getElementById('form-upload').reset();
                fecharUpload();
            })
        })
    }

    function deslogar(e){
        e.preventDefault();
        auth.signOut().then(function(val){
            props.setUser(null)
            window.location.href = "/";
        }) 
    }

    return(
        <div className="header">
            <div className="abrirCriarConta">
                <div className="formCriarConta">
                    <div onClick={()=>fecharCriarConta()} className="closeCriarConta">X</div>
                    <h2>Criar Conta</h2>
                    <form onSubmit={(e)=>criarConta(e)}>
                        <input id="email" type="text" placeholder="Email"/>
                        <input id="username" type="text" placeholder="Username"/>
                        <input id="password" type="password" placeholder="Password"/>
                        <input type="submit" value="Criar Conta!"/>
                    </form>
                </div>
            </div>

            <div className="abrirUpload">
                <div className="formUpload">
                    <div onClick={()=>fecharUpload()} className="closeUpload">X</div>
                    <h2>Upload</h2>
                    <form id="form-upload" onSubmit={(e)=>uploadPost(e)}>
                        <input id="titulo-upload" type="text" placeholder="Nome da sua foto"/>
                        <input onChange={(e)=>setFile(e.target.files[0])} type="file" name="file"/>
                        <progress id="progress-upload" value={progress}/>
                        <input type="submit" value="Postar no instagram!"/>
                    </form>
                </div>
            </div>

            <div className="center">
                <div className="header-logo">
                    <a href=""><img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"></img> </a>
                </div>

                {
                (props.user)?
                <div className="header-loggedInfo">
                    <span>Hola! <b>{props.user}</b></span>
                    <a onClick={(e)=>abrirUpload(e)} href="#">Post!</a>
                    <a onClick={(e)=>deslogar(e)}>Deslogar</a>
                </div>
                :
                <div className="header-loginForm">
                    <form onSubmit={(e)=>logar(e)}>
                        <input id="email-login" type="text" placeholder="Login"></input>
                        <input id="password-login" type="password" placeholder="Senha"></input>
                        <input type="submit" name="acao" value="Entrar"></input>
                    </form>
                    <div className="btn-criarConta">
                        <a onClick={(e)=>abrirCriarConta(e)} href="#">Criar Conta!</a>
                    </div>
                </div>
                }

                
            </div>
        </div>
    );
}

