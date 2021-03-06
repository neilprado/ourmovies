/* Chave da API */
const API_KEY = '76a5c60d4eb397b26f90d390c849ccbf'

/*  Query selectors */
const home = document.querySelector('#home-movies')
const popular = document.querySelector('#popular-movies')
const upcoming = document.querySelector('#upcoming-movies')
const now = document.querySelector('#now-playing')  
const contentPopularMovies = document.querySelector('#content-popular-movies')
const contentNowPlaying = document.querySelector('#content-now-playing')
const contentUpComingMovies = document.querySelector('#content-upcoming-movies')
const contentsearchMovies = document.querySelector('#search-movies')
const contentInfoMovie = document.querySelector('#info-movie')
const search = document.querySelector('#search')
const button = document.querySelector('#button')

/* Constantes e funções com a URL da API */
const upcomingMovies = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=pt-BR`
const popularMovies = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`
const nowPlayingMovies = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=pt-BR`

const searchMovie = (searchValue) =>
  `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${searchValue}`
const infoMovie = (id) => `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=pt-BR`
const videoMovie = (id) => `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
const actors = (id) => `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
const image = (image) => `https://image.tmdb.org/t/p/w500/${image}`

// Funções de Tratamento de imagem e de sinopse até o momento
const voidOverview = (data) => {
  if (data.overview === "")
    return data.overview = 'Sinopse indisponível em Português do Brasil, ajude-nos infomando ou traduzindo a sinopse.'
}

const voidImage = (data) => {
  if (data.poster_path == null)
    return data.poster_path = `<div class="imgFilme">
    <a href="javascript:;" " data-fancybox data-src="#info-movie" onclick="getMovieInfo(${data.id})">
      <img src="img/noimage.jpg""width="500" height="732">
    </a>`
}

const validateMovie = (string) => {
  const regex = /^[a-z 0-9]+/gi
  return (string.match(regex)) ? true : false
}

// Funções de obtenção de informações pelo id
const responseId = (id) => {
  return id.results = 
    `<div class="contentInfo">
      <div class="imgInfo"><img src="https://image.tmdb.org/t/p/w500/${id.poster_path}
        "width="500" height="732">
      </div>
      <div class="textInfo">
        <h1>${id.title}</h1>
        <p>${id.overview}</p>
      </div>`
}

// Função para obtenção das próximas estreias
const responseUpcoming = (data) => {
  return data.results
    .map(
      item =>
        `<div class="imgFilme"><a href="javascript:;" data-fancybox data-src="#info-movie" onclick="getMovieInfo(${item.id})">
          <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}"></a>
          <div class="nameFilme">${item.title}</div></div> `
    )
    .join('')
}

// Função para obtenção dos filmes populares do momento
const responsePopular = (data) => (
  data.results
    .sort((a, b) => b.vote_average - a.vote_average)
    .map(item => (
    `<div class="imgFilme">
      <a href="javascript:;" data-fancybox data-src="#info-movie" onclick="getMovieInfo(${item.id})">
        <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}">
      </a>
      <div class="popularity">${item.vote_average.toFixed(1)}</div>
      <div class="nameFilme titlePopular">${item.title}</div>
    </div>`
    )).join('')
)

// Função para obtenção do que está em cartaz
const responseNow = (data) => {
  return data.results
    .map(
      item =>
        `<div class="imgFilme">
          <a href="javascript:;" data-fancybox data-src="#info-movie" onclick="getMovieInfo(${item.id})">
            <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}">
          </a>
          <div class="nameFilme">${item.title}</div></div> `
    )
    .join('')
}

// Função para obtenção do resultado da pesquisa
const responseSearch = (data) => {
  return data.results
    .map(
      item =>
        `<div class="imgFilme">
          <a href="javascript:;" " data-fancybox data-src="#info-movie" onclick="getMovieInfo(${item.id})">
            <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}">
          </a>
        <div class="nameFilme">${item.title}</div></div> `
    )
    .join('')
}


// Função para pegar as informações pelo id do filme!
const getMovieInfo = (id) => {
    fetch(infoMovie(id))
      .then(resposta => resposta.json())
      .then((data) => {
          voidOverview (data)
          voidImage(data)     
          contentInfoMovie.innerHTML = responseId(data)
      })
  }


// Função para retornar os filmes populares do momento
const getPopularMovies = () => {
  fetch(popularMovies)
    .then(resposta => resposta.json())
    .then((data) => {
      contentPopularMovies.innerHTML = responsePopular(data)
    })
}


// Função para pegar os filmes que serão lançados, falta realização de filtros de data
const getUpcomingMovies = () => {
  fetch(upcomingMovies)
    .then(resposta => resposta.json())
    .then((data) => {
      contentUpComingMovies.innerHTML = responseUpcoming(data);
  })
}


// Função para retorno do que está em cartaz, falta realização de filtros de data!!
const getPlayingNow = () => {
  fetch(nowPlayingMovies)
    .then(resposta => resposta.json())
    .then((data) => {
     contentNowPlaying.innerHTML = responseNow(data)
    })
}


// Função para retorno da busca do formulário, falta realização de filtros de imagens que não aparece
const searchMovies = (data) => {
  fetch(searchMovie(data))
    .then(resposta => resposta.json())
    .then((data) => {
      voidImage(data)  
      contentsearchMovies.innerHTML = responseSearch(data)
    })
}

/* Event Listeners!! */
button.addEventListener('click', (event) => {
  event.preventDefault()
	if (validateMovie(search.value)){
  		searchMovies(search.value)
		contentPopularMovies.classList.add('hidden')
		contentUpComingMovies.classList.add('hidden')
		contentNowPlaying.classList.add('hidden')
		contentsearchMovies.classList.remove('hidden')
		contentsearchMovies.classList.add('flex')
	}
		else
		alert("Digite um nome corretamente!")
})


home.addEventListener('click', () => {
	contentPopularMovies.classList.remove('hidden','flex')
	contentUpComingMovies.classList.remove('hidden','flex')
	contentNowPlaying.classList.remove('hidden','flex')
	contentsearchMovies.classList.add('hidden')
	if(!contentPopularMovies.classList.contains('slick-initialized'))
	$('#content-popular-movies').slick();
	if(!contentNowPlaying.classList.contains('slick-initialized'))
	$('#content-now-playing').slick();
	if(!contentUpComingMovies.classList.contains('slick-initialized'))
	$('#content-upcoming-movies').slick();
	
})

popular.addEventListener('click', () => {
	if(contentPopularMovies.classList.contains('slick-initialized'))
	$('#content-popular-movies').slick("unslick");
	contentPopularMovies.classList.remove('hidden')
	contentUpComingMovies.classList.add('hidden')
	contentNowPlaying.classList.add('hidden')
	contentPopularMovies.classList.add('flex')
	contentsearchMovies.classList.add('hidden')
}) 

upcoming.addEventListener('click', () => {
	if(contentUpComingMovies.classList.contains('slick-initialized'))
	$('#content-upcoming-movies').slick("unslick");
	contentPopularMovies.classList.add('hidden')
	contentUpComingMovies.classList.remove('hidden')
	contentNowPlaying.classList.add('hidden')
	contentUpComingMovies.classList.add('flex')
	contentsearchMovies.classList.add('hidden')
})

now.addEventListener('click', () => {
	if(contentNowPlaying.classList.contains('slick-initialized'))
	$('#content-now-playing').slick("unslick");
	contentPopularMovies.classList.add('hidden')
	contentUpComingMovies.classList.add('hidden')
	contentNowPlaying.classList.remove('hidden')
	contentNowPlaying.classList.add('flex')
	contentsearchMovies.classList.add('hidden')
})

getPopularMovies();
getUpcomingMovies() ;
getPlayingNow();

$(document).ready(function () {
	$("[data-fancybox]").fancybox({
		smallBtn:true,
		buttons : [
			'fullScreen',
			'share',
			'close',
		],

	})
	
	$('#content-popular-movies').slick();
	$('#content-now-playing').slick();
	$('#content-upcoming-movies').slick();
	
});
