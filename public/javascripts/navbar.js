function navbar() {
	const self = this;

	self.$userInfo = document.querySelector('#user-info');
	self.$user = document.querySelector('#user');
	self.$loginMenu = document.querySelector('#login-menu');
	
	self.$userInfo.style.display = auth().user ? 'block' : 'none';
	self.$loginMenu.style.display = auth().user ? 'none' : 'block';

	if(auth().user) {
		setUserInfo();
	}

	document.addEventListener('isAuthenticatedEvent', () => {
		self.$loginMenu.style.display = 'none';
		self.$userInfo.style.display = 'block';

		setUserInfo();
	});

	function setUserInfo() {
		const user = auth().user;
		self.$user.innerHTML = '';
		self.$user.innerHTML += `Encerrar sessão de ${user.userName}`;
	}

	self.$user.onclick = e =>{
		e.preventDefault();
	    auth().logout();

  		self.$loginMenu.style.display = 'block';
		self.$userInfo.style.display = 'none';
	}

	self.$loginMenu.querySelector('a').onclick = e => {
		e.preventDefault();
		auth().displayLoginModal(false); /*do not warn the user*/
	};

	var elems = document.querySelectorAll('#new-user');
	self.newUserModal = M.Modal.init(elems);

    var elems = document.querySelectorAll('#new-book');
	self.newBookModal = M.Modal.init(elems);
	
	var elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);

    return {
    	newUserModal: self.newUserModal[0],
    	newBookModal: self.newBookModal[0]
    }	

}

document.addEventListener('DOMContentLoaded', () => {
	navbar = new navbar();
});