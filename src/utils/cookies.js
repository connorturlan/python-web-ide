export function setCookie(cname, cvalue, exdays = 1) {
	const d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

export const SaveCode = (pageIndex, c) => {
	const safe = encodeURI(c);
	// setCookie(`Code${pageIndex}`, safe);
	localStorage.setItem(`Code${pageIndex}`, safe);
};

export const LoadCode = (pageIndex) => {
	// const safe = getCookie(`Code${pageIndex}`);
	const safe = localStorage.getItem(`Code${pageIndex}`);
	return safe === null ? undefined : decodeURI(safe);
};

export const SaveTestResult = (pageIndex, result) => {
	const safe = encodeURI(result);
	setCookie(`Code${pageIndex}Test`, safe);
};

export const LoadTestResult = (pageIndex) => {
	const safe = getCookie(`Code${pageIndex}Test`);
	return decodeURI(safe);
};
