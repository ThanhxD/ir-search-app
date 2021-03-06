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

const suggestModeEl = document.getElementById('suggestMode');

function getSuggestMode() {
	return suggestModeEl.value;
}

function suggestClick(e) {
	setSuggestVisible(false);
	input.value = uniCodeCompoundToUnicode(e.target.innerText);
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
	fetch('/suggest/' + getSuggestMode() + '?query=' + value.toLowerCase())
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
	const query = input.value.trim();
	const regxs = query.split(" ").map(q => new RegExp(q, 'gi'));
	removeSuggestContent();
	if (!isSuggesstVisble()) {
		setSuggestVisible(true);
	}
	for (let i = 0; i < suggestData.length; i++) {
		text = suggestData[i];
		li = document.createElement('li');
		li.onclick = suggestClick;
		regxs.forEach(regx => {
			text = text.replace(regx, str => '<b>' + str + '</b>');
		});
		li.innerHTML = text;
		listSuggest.appendChild(li);
	}
}

function removeSuggestContent() {
	while (listSuggest.firstChild) {
		listSuggest.removeChild(listSuggest.firstChild);
	}
}

const maps = {
  '\u0065\u0309': '\u1EBB', //ẻ
  '\u0065\u0301': '\u00E9', //é
  '\u0065\u0300': '\u00E8', //è
  '\u0065\u0323': '\u1EB9', //ẹ
  '\u0065\u0303': '\u1EBD', //ẽ
  '\u00EA\u0309': '\u1EC3', //ể
  '\u00EA\u0301': '\u1EBF', //ế
  '\u00EA\u0300': '\u1EC1', //ề
  '\u00EA\u0323': '\u1EC7', //ệ
  '\u00EA\u0303': '\u1EC5', //ễ
  '\u0079\u0309': '\u1EF7', //ỷ
  '\u0079\u0301': '\u00FD', //ý
  '\u0079\u0300': '\u1EF3', //ỳ
  '\u0079\u0323': '\u1EF5', //ỵ
  '\u0079\u0303': '\u1EF9', //ỹ
  '\u0075\u0309': '\u1EE7', //ủ
  '\u0075\u0301': '\u00FA', //ú
  '\u0075\u0300': '\u00F9', //ù
  '\u0075\u0323': '\u1EE5', //ụ
  '\u0075\u0303': '\u0169', //ũ
  '\u01B0\u0309': '\u1EED', //ử
  '\u01B0\u0301': '\u1EE9', //ứ
  '\u01B0\u0300': '\u1EEB', //ừ
  '\u01B0\u0323': '\u1EF1', //ự
  '\u01B0\u0303': '\u1EEF', //ữ
  '\u0069\u0309': '\u1EC9', //ỉ
  '\u0069\u0301': '\u00ED', //í
  '\u0069\u0300': '\u00EC', //ì
  '\u0069\u0323': '\u1ECB', //ị
  '\u0069\u0303': '\u0129', //ĩ
  '\u006F\u0309': '\u1ECF', //ỏ
  '\u006F\u0301': '\u00F3', //ó
  '\u006F\u0300': '\u00F2', //ò
  '\u006F\u0323': '\u1ECD', //ọ
  '\u006F\u0303': '\u00F5', //õ
  '\u01A1\u0309': '\u1EDF', //ở
  '\u01A1\u0301': '\u1EDB', //ớ
  '\u01A1\u0300': '\u1EDD', //ờ
  '\u01A1\u0323': '\u1EE3', //ợ
  '\u01A1\u0303': '\u1EE1', //ỡ
  '\u00F4\u0309': '\u1ED5', //ổ
  '\u00F4\u0301': '\u1ED1', //ố
  '\u00F4\u0300': '\u1ED3', //ồ
  '\u00F4\u0323': '\u1ED9', //ộ
  '\u00F4\u0303': '\u1ED7', //ỗ
  '\u0061\u0309': '\u1EA3', //ả
  '\u0061\u0301': '\u00E1', //á
  '\u0061\u0300': '\u00E0', //à
  '\u0061\u0323': '\u1EA1', //ạ
  '\u0061\u0303': '\u00E3', //ã
  '\u0103\u0309': '\u1EB3', //ẳ
  '\u0103\u0301': '\u1EAF', //ắ
  '\u0103\u0300': '\u1EB1', //ằ
  '\u0103\u0323': '\u1EB7', //ặ
  '\u0103\u0303': '\u1EB5', //ẵ
  '\u00E2\u0309': '\u1EA9', //ẩ
  '\u00E2\u0301': '\u1EA5', //ấ
  '\u00E2\u0300': '\u1EA7', //ầ
  '\u00E2\u0323': '\u1EAD', //ậ
  '\u00E2\u0303': '\u1EAB', //ẫ
  '\u0045\u0309': '\u1EBA', //Ẻ
  '\u0045\u0301': '\u00C9', //É
  '\u0045\u0300': '\u00C8', //È
  '\u0045\u0323': '\u1EB8', //Ẹ
  '\u0045\u0303': '\u1EBC', //Ẽ
  '\u00CA\u0309': '\u1EC2', //Ể
  '\u00CA\u0301': '\u1EBE', //Ế
  '\u00CA\u0300': '\u1EC0', //Ề
  '\u00CA\u0323': '\u1EC6', //Ệ
  '\u00CA\u0303': '\u1EC4', //Ễ
  '\u0059\u0309': '\u1EF6', //Ỷ
  '\u0059\u0301': '\u00DD', //Ý
  '\u0059\u0300': '\u1EF2', //Ỳ
  '\u0059\u0323': '\u1EF4', //Ỵ
  '\u0059\u0303': '\u1EF8', //Ỹ
  '\u0055\u0309': '\u1EE6', //Ủ
  '\u0055\u0301': '\u00DA', //Ú
  '\u0055\u0300': '\u00D9', //Ù
  '\u0055\u0323': '\u1EE4', //Ụ
  '\u0055\u0303': '\u0168', //Ũ
  '\u01AF\u0309': '\u1EEC', //Ử
  '\u01AF\u0301': '\u1EE8', //Ứ
  '\u01AF\u0300': '\u1EEA', //Ừ
  '\u01AF\u0323': '\u1EF0', //Ự
  '\u01AF\u0303': '\u1EEE', //Ữ
  '\u0049\u0309': '\u1EC8', //Ỉ
  '\u0049\u0301': '\u00CD', //Í
  '\u0049\u0300': '\u00CC', //Ì
  '\u0049\u0323': '\u1ECA', //Ị
  '\u0049\u0303': '\u0128', //Ĩ
  '\u004F\u0309': '\u1ECE', //Ỏ
  '\u004F\u0301': '\u00D3', //Ó
  '\u004F\u0300': '\u00D2', //Ò
  '\u004F\u0323': '\u1ECC', //Ọ
  '\u004F\u0303': '\u00D5', //Õ
  '\u01A0\u0309': '\u1EDE', //Ở
  '\u01A0\u0301': '\u1EDA', //Ớ
  '\u01A0\u0300': '\u1EDC', //Ờ
  '\u01A0\u0323': '\u1EE2', //Ợ
  '\u01A0\u0303': '\u1EE0', //Ỡ
  '\u00D4\u0309': '\u1ED4', //Ổ
  '\u00D4\u0301': '\u1ED0', //Ố
  '\u00D4\u0300': '\u1ED2', //Ồ
  '\u00D4\u0323': '\u1ED8', //Ộ
  '\u00D4\u0303': '\u1ED6', //Ỗ
  '\u0041\u0309': '\u1EA2', //Ả
  '\u0041\u0301': '\u00C1', //Á
  '\u0041\u0300': '\u00C0', //À
  '\u0041\u0323': '\u1EA0', //Ạ
  '\u0041\u0303': '\u00C3', //Ã
  '\u0102\u0309': '\u1EB2', //Ẳ
  '\u0102\u0301': '\u1EAE', //Ắ
  '\u0102\u0300': '\u1EB0', //Ằ
  '\u0102\u0323': '\u1EB6', //Ặ
  '\u0102\u0303': '\u1EB4', //Ẵ
  '\u00C2\u0309': '\u1EA8', //Ẩ
  '\u00C2\u0301': '\u1EA4', //Ấ
  '\u00C2\u0300': '\u1EA6', //Ầ
  '\u00C2\u0323': '\u1EAC', //Ậ
  '\u00C2\u0303': '\u1EAA', //Ẫ
  '\u00D0': '\u0110', // Đ
  '\u00F0': '\u0111' // đ
}

const unicodeMap = Object.keys(maps).map(key => {
  return {
    regx: new RegExp(key, 'g'),
    replace: maps[key]
  }
});

function uniCodeCompoundToUnicode(_str) {
	let str = _str;
	unicodeMap.forEach(token => {
		str = str.replace(token.regx, token.replace);
	});
	return str;
}