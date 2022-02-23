const form=document.getElementById("form");  //Agarro el formulario 
const search=document.getElementById("search");//Agarro el input dentro del formulario
const result=document.getElementById("result");//Agarro el result que es todo el div donde van a ir las canciones buscadas
const more=document.getElementById("more");//Este va a ser el boton de siguiente

const API_URL="https://api.lyrics.ovh";  //le asigo la url de la api a API_URL


//FUNCION PARA BUSCAR LAS CANCIONES
const searchSongs=async(value) =>{      //Declaro la funcion asincrona   
    const res=await fetch(`${API_URL}/suggest/${value}`);   //Hago un fetch desde la url de la API y el suggest es la forma de la api de buscar. 
    const data=await res.json()                  //Como la linea 9 me devuelve una promesa lo paso a json
    showData(data)
};

const showData=({data,next,prev}) =>{   //cuando pongo el data entre llaves es para desestructurarlo
    result.innerHTML=`
    <ul class="songs">
    ${
        data.map(song=>`<li><span><strong>${song.artist.name}
        </strong>-${song.title}</span><button class="btn" data-artist="${song.artist.name}"
        data-songtitle="${song.title}">Letra</button></li>`
        ).join("")
    }
    </ul>
    `;
    if(prev || next){
        more.innerHTML=`
        ${
            prev? `<button class="btn" onclick="getMoreSongs('${prev}')">Anterior</button>`:""
        }

        ${
            next? `<button class="btn" onclick="getMoreSongs('${next}')">Siguiente</button>`:""
        }
        `;
    }else{
        more.innerHTML=""
    }
};

const getMoreSongs=async (url)=>{
    const res=await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
    const data= await res.json();
    showData(data)
};

const getLyrics=async (artist,songtitle) =>{
    const res=await fetch(`${API_URL}/v1/${artist}/${songtitle}`)
    const data =await res.json()

    //EXPRESIONES REGULARES: r return value| n new line| g es global
    const lyrics=data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>")  //return value y new line lo cambio globalmente por br
    result.innerHTML= `<h2><strong>${artist}</strong>-${songtitle}</h2>
                        <span>${lyrics}</span>
                        :`
    more.innerHTML=""                    
}

//INIT
function init(){
    form.addEventListener("submit",(e) =>{
        e.preventDefault()
        const searchValue=search.value.trim();
        if(!searchValue){
            return
        }
        searchSongs(searchValue)
    })

    result.addEventListener("click",(e)=>{
        const element=e.target;
        if(element.nodeName==="BUTTON"){
            const artist=element.dataset.artist
            const songtitle=element.dataset.songtitle

            getLyrics(artist,songtitle);
        }
    })
}

init();