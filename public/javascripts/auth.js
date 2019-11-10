function auth() {
	const self = this;
    self.$login = document.querySelector('#login');

    const isAuthenticatedEvent = new CustomEvent("isAuthenticatedEvent", {
    	bubbles: true,
    	cancelable: true
    });

	async function login(e) {
	    const $loginForm = document.querySelector('#not-logged-form');
	    if(formIsValid($loginForm)) {
	        const response = await fetch('/auth', {
	            method: 'POST',
            	'headers': new Headers({
                	'Content-Type': 'application/json'
            	}),
	            body: JSON.stringify({
	                userEmail: $loginForm.userEmail.value,
	                userPassword: $loginForm.userPassword.value
	            })
	        });

	        if(response.status === 200) {
	            const user = await response.json();
	            window.sessionStorage.setItem('user', JSON.stringify(user));
	            M.toast({ html: 'Usuário autenticado com sucesso', classes: 'green', displayLength: 4000 });

                document.dispatchEvent(isAuthenticatedEvent);
                self.loginModal[0].close();
	        } else {
                M.toast({ html: 'Ocorreu algo errado... Verifique as informações e tente novamente', classes: 'red', displayLength: 4000 });
	        }
	    } else {
            M.toast({ html: 'Digite as informações para logar', classes: 'red', displayLength: 4000 });
	    }
	}

	function displayLoginModal(warn) {
		const warnPanel = self.loginModal[0].el.querySelector('.card-panel');
		warnPanel.style.display = warn ? 'block' : 'none';
        self.loginModal[0].open();
	}

	function getAuthHeaders() {
		return new Headers({
	        'Content-Type': 'application/json',
	        'Authorization': self.user
    	});
	}

	function logout() {
		window.sessionStorage.clear();
	    M.toast({ html: 'Usuário desconectado com sucesso', classes: 'green', displayLength: 4000 });
	}

	var elems = document.querySelectorAll('#login-modal');
    self.loginModal = M.Modal.init(elems);

    self.$login.onclick = login;

    return {
    	user: JSON.parse(window.sessionStorage.getItem('user')),
    	displayLoginModal: displayLoginModal,
    	getAuthHeaders: getAuthHeaders,
    	logout: logout
    	
    }
}