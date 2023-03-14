const formNode = document.querySelector('#form');
const inputNode = document.querySelector('.js-search-input');
const resultNode = document.querySelector('.js-result');

inputNode.addEventListener("input", function (	) {
	if (inputNode.validity.tooShort) {
		inputNode.setCustomValidity("Введи больше :-)");
	} else {
		inputNode.setCustomValidity("");
	}
 });

formNode.addEventListener('submit', async (e) => {
	e.preventDefault();

	const inputsValue = Object.fromEntries(new FormData(e.target))
	const response = await fetch(`
		https://api.github.com/search/repositories?q=${inputsValue.name}
	`)

	const data = await response.json();

	if (response.ok && data.items.length != 0 ){
		resultNode.classList.remove('error');
		resultNode.innerHTML = "";
		resultNode.appendChild(createProfile(data));
		resultNode.appendChild(createDeleteBtn())
	} else {
		resultNode.classList.add('error');
		resultNode.innerHTML = "Ничего не найдено";	
	}
	
	inputNode.value = '';
})

function createProfile(profileData){
	const elem = document.createElement ('div');
	elem.classList.add('profile-wrapper')
	let out = ''
	for (let i = 0; i < profileData.items.length; i++) {
		const elem = profileData.items[i];
			out += `
			<div class="item-container">
				<div class="profile">
					<img class="search-img" src=${elem.owner.avatar_url}></img>	
					<p class="search-texst"><span>Имя: </span><a href="${elem.html_url}" target="_blank">${elem.name}</a></p>
					<p class="search-texst"><span>Описание: </span>${elem.description}</p>
					<p class="search-texst"><span>Дата создания: </span>${elem.created_at} </p>
					<p class="search-texst"><span>Дата последнего обновления: </span>${elem.updated_at}</p>
				</div>	
			</div>
	`		
	 if (i == 9) break
	}

	elem.innerHTML = out;
	
	return elem
}

function createDeleteBtn(){
	const elem = document.createElement('button');
	elem.classList.add('delete-btn', 'btn');
	elem.innerText = 'Удалить';
	elem.addEventListener ('click', (e) =>{
		resultNode.innerHTML = '';
	});
	return elem
}