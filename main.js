const form=document.getElementById("form");  //Agarro el formulario 
const search=document.getElementById("search");//Agarro el input dentro del formulario
const result=document.getElementById("result");//Agarro el result que es todo el div donde van a ir las canciones buscadas
const more=document.getElementById("more");//Este va a ser el boton de siguiente

const API_URL="https://api.lyrics.ovh";  //le asigo la url de la api a API_URL


//FUNCION PARA BUSCAR LAS CANCIONES
const searchSongs=async(value) =>{      //Declaro la funcion asincrona   
    const res=await fetch(`${API_URL}/suggest/${value}`);   //Hago un fetch desde la url de la API y el suggest es la forma de la api de buscar. 
    const data=await res.json()                  //Como la linea 9 me devuelve una promesa lo paso a json
    showData(data)                              //Data van a ser todas las canciones devueltas por la api
};


//FUNCION PARA MOSTRAR LAS CANCIONES EN PANTALLA
//El next y prev son argumentos que se encuentran en la api
const showData=({data,next,prev}) =>{   //cuando pongo el data entre llaves es para desestructurarlo
    result.innerHTML=`                 //Al div result le inyecto el html con las canciones
    
    <ul class="songs">                  //Inyecto un ul para las 15 canciones
    ${
        data.map(song=>                 //Utilizo  un map para que a todos los data que reciba le aplique las propiedades
            `<li>                       //Voy a inyectar un li por c/cancion
    
            <span>                                      //Uso el span para organizar las canciones en linea
                <strong>${song.artist.name}</strong>    //Cancion y artista van a ir haciendo enfasis por el strong
                -${song.title}
            </span>
            
            <button class="btn" data-artist="${song.artist.name}"data-songtitle="${song.title}">Letra   //Boton para verletra
            </button>
        
            </li>`)
        .join("")  //El join me va a devolver todo como string
    }
    </ul> 
    `;

    if(prev || next){   //Si existe prev o next inyecto el boton Anterior o Siguiente
        more.innerHTML=`
        ${
            prev? `<button class="btn" onclick="getMoreSongs('${prev}')">Anterior</button>`:""
        }

        ${
            next? `<button class="btn" onclick="getMoreSongs('${next}')">Siguiente</button>`:""
        }
        `;
    }else{
        more.innerHTML=""  //sino existe no inyecto nada
    }
};

//FUNCION PARA TRAER MAS CANCIONES CON EL PROXY
const getMoreSongs=async (url)=>{           //Declaro funcion asincrona
    const res=await fetch(`https://cors-anywhere.herokuapp.com/${url}`) //Hago  un fetch desde la url del proxy a usar
    const data= await res.json();       //A lo que me devuelva el proxy lo paso a json
    showData(data)              //Muestro lo que trajo
};

//FUNCION PARA VER LAS LETRAS
const getLyrics=async (artist,songtitle) =>{    //Declaro funcion asincrona
    const res=await fetch(`${API_URL}/v1/${artist}/${songtitle}`)   //Busco que me traiga con fetch desde la url de la apilas letras de las canciones
    const data =await res.json()// paso a json lo devuelto

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