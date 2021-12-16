import {db} from './firebase.js'
import {useEffect, useState} from 'react'
import firebase from 'firebase/compat';


export default function Post(props){

    const [comentarios, setComentarios] = useState([]);

    useEffect(() => {
        db.collection('posts').doc(props.id).collection('comentarios').orderBy('timestamp','desc').onSnapshot((snapshot)=>{
            setComentarios(snapshot.docs.map(function(document){
                return {id:document.id, info:document.data()}
            }))
        })
    }, [])


    function comentar(id, e){
        e.preventDefault();

        let comentarioAtual = document.querySelector('#comentario-'+id).value;
        db.collection('posts').doc(id).collection('comentarios').add({
            nome: props.user,
            comentario: comentarioAtual,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()

        })
        alert('comentando sucesso')
        document.querySelector('#comentario-'+id).value = "";
    }
      

    return(
        <div className="postSingle">
            <img src={props.info.image}></img>
            <p><b>{props.info.userName}</b>: {props.info.titulo}</p>

            <div className = "comments">
                <h2>Últimos Comentários</h2>
                {
                    comentarios.map(function(val){
                        return(
                            <div className='comment-single'>
                                <p><b>{val.info.nome}</b>: {val.info.comentario}</p>
                            </div>
                        )
                    })
                }

            </div>
            {
                (props.user)?
            <form onSubmit={(e)=>comentar(props.id,e)}>
                <textarea id={"comentario-"+props.id}></textarea>
                <input type="submit" value="Comentar!"></input>
            </form>
            :
            <div></div>
            }
        </div>
    )
}