window.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', () => {
        const scrollTop = (window.pageYOffset || document.scrollTop)  - (document.clientTop || 0);
        const head = document.querySelector('.fixed-header');

        if (screenTop && scrollTop > 250) {
            head.classList.add('fixed-small');
        } else {
            head.classList.remove('fixed-small');
        }
    })
});

const input = document.getElementById('query');
const listSuggest = document.getElementsByClassName('list-suggest')[0];
const form = document.getElementsByClassName('search-container')[0];
let timeout = 0;
let suggestData = [];

window.addEventListener('click', (e) => {
	if (isSuggesstVisble() && !form.contains(e.target)) {
		setSuggestVisible(false);
	}
});

input.onfocus = function(e) {
	if (!isSuggesstVisble()) {
		if (suggestData.length > 0) {
			setSuggestVisible(true);
		}
	}
	if (e.target.value) {
		input.select();
	}
}

input.oninput = function(e) {
	clearTimeout(timeout);
	const val = e.target.value;
	if (val) {
		timeout = setTimeout(() => {
			getSugesstion(val);
		}, 200);
	} else {
		if (isSuggesstVisble()) {
			setSuggestVisible(false);
		}
	}
}

function suggestClick(e) {
	setSuggestVisible(false);
	input.value = e.target.innerText;
	form.submit();
}

function isSuggesstVisble() {
	return listSuggest.style.display !== 'none';
}

function setSuggestVisible(visible) {
	if (visible) {
		listSuggest.style.display = 'block';		
	} else {
		listSuggest.style.display = 'none';
	}
}

function getSugesstion(value) {
	fetch('/suggest?query=' + value.toLowerCase())
	.then(result => result.json())
	.then(result => {
		suggestData = result;
		renderSuggest();
	})
	.catch(err => {
		console.error(err);
	})
}

function renderSuggest() {
	let text, li;
	const query = input.value;
	const regx = new RegExp(query, 'gi');
	removeSuggestContent();
	if (!isSuggesstVisble()) {
		setSuggestVisible(true);
	}
	for (let i = 0; i < suggestData.length; i++) {
		text = suggestData[i];
		li = document.createElement('li');
		li.onclick = suggestClick;
		li.innerHTML = text.replace(regx, str => '<b>' + str + '</b>');;
		listSuggest.appendChild(li);
	}
}

function removeSuggestContent() {
	while (listSuggest.firstChild) {
		listSuggest.removeChild(listSuggest.firstChild);
	}
}