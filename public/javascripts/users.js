	function Users() {
		const self = this;

		self.$usersList = document.querySelector('#users-list');
		self.$userTemplate = document.querySelector('#user-template');
		self.$newUserForm = document.querySelector('#new-user-form');
		self.$newUserBtn = document.querySelector('#new-user-button');

		async function getUsers() {
			while (self.$usersList.firstChild) {
	            self.$usersList.removeChild(self.$usersList.firstChild);
	        }

	        const response = await fetch('/users');
	        if(response.status === 200) {
	        	self.users = await response.json();
	        	loadUsers();
	        }
		}

		async function loadUsers() {
			if(self.users.length > 0) {
				self.users.forEach(user => {
	                const clone = document.importNode(self.$userTemplate.content, true);

	                clone.querySelector('#user-name').textContent = user.userName;
	                clone.querySelector('#user-email').textContent += ' ' + user.userEmail;
					const $favoriteBooks = clone.querySelector('#user-favorite-books')
	                if(user.favoriteBooks) {               
		                user.favoriteBooks.forEach(async favBook => {
		                	const response = await fetch(`/books?id=${favBook.id}`);
		                	const book = await response.json();
		                	const item = document.createElement('div');
		                	item.classList.add('collection-item');
		                	item.textContent = `${book.bookTitle} - ${book.bookAuthor}`;		            

		                	const favBtn = document.createElement('a');
		                	favBtn.classList.add('secondary-content yellow');
		                	favBtn.setAttribute('href', '');

		                	const icon = document.createElement('i');
		                	icon.classList.add('material-icons');
		                	icon.textContent = 'grade';

		                	favBtn.appendChild(icon);
		                	item.appendChild(favBtn);

		                	$favoriteBooks.appendChild(item);

		                });	                	
	                } else {
	                	const item = document.createElement('div');
	                	item.classList.add('collection-item');
	                	item.textContent = 'Nenhum livro adicionado a lista de favoritos desse usuário';

	                	$favoriteBooks.appendChild(item);
	                }
	   
	                clone.querySelector('#edit-user').onclick = editUser;
	                clone.querySelector('#delete-user').onclick = deleteUser;

	                self.$usersList.appendChild(clone);

				})
			}
		}

		function editUser(e) {

		}

		async function deleteUser(e) {

		}

		async function saveUser() {
			if(self.$newUserForm.userPassword.value === self.$newUserForm.userPasswordConfirmation.value) {
				if (formIsValid(self.$newUserForm)) {
				    const data = getFormAsJson(self.$newUserForm);
				    delete data.userPasswordConfirmation;
				    
				    const response = await fetch('/users', {
				        method: data.id === '' ? 'POST' : 'PUT',
				        body: JSON.stringify(data),
				        headers: new Headers({
				            'Content-Type': 'application/json'
				        })
				    });

				    if (response.status === 200) {
				        M.toast({ html: 'Usuário salvo com sucesso', classes: 'green', displayLength: 4000 });
				        self.$newUserForm.reset();
				        getUsers();
				    } else {
				        M.toast({ html: 'Ocorreu um erro ao salvar o Usuário', classes: 'red', displayLength: 4000 });
				    }

				} else {
				    M.toast({ html: 'Preencha todos campos obrigatórios', classes: 'red', displayLength: 4000 });
				}				
			} else {
				M.toast({ html: 'As senhas não conferem', classes: 'red', displayLength: 4000 });
			}
		
		}

		self.$newUserBtn.onclick = saveUser;

		getUsers();
	}

	document.addEventListener('DOMContentLoaded', Users);