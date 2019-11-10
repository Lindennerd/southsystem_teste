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
                	clone.querySelector('.card-action').setAttribute('data-id', user.id);

					const $favoriteBooks = clone.querySelector('#user-favorite-books')
	                if(user.favoriteBooks) {               
		                user.favoriteBooks.forEach(async favBook => {
		                	const response = await fetch(`/books?id=${favBook}`);
		                	const book = await response.json();
		                	const item = document.createElement('div');
		                	item.classList.add('collection-item');
		                	item.textContent = `${book[0].bookTitle} - ${book[0].bookAuthor}`;		            
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
			const editingId = e.target.parentElement.getAttribute('data-id');
	        const editingUser = self.users.find(user => { return user.id === editingId });
	        if (editingUser) {
	            self.$newUserForm.id.value = editingUser.id;
	            self.$newUserForm.userName.value = editingUser.userName;
	            self.$newUserForm.userEmail.value = editingUser.userEmail;

	            self.$newUserForm.userPassword.required = false;
	            self.$newUserForm.userPasswordConfirmation.required = false;

	            navbar.newUserModal.open();
	        }
		}

		async function deleteUser(e) {
			const deletingId = e.target.parentElement.getAttribute('data-id');
			const response = await fetch('/users', {
			    method: 'DELETE',
			    body: JSON.stringify({'id': deletingId}),
			    headers: new Headers({
			        'Content-Type': 'application/json'
			    })
			});

			if(response.status === 200) {
			    M.toast({ html: 'Excluido com sucesso', classes: 'green', displayLength: 4000 });
			    getUsers();
			} else {
			    M.toast({ html: 'Ocorreu um erro', classes: 'red', displayLength: 4000 });
			}
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

	document.addEventListener('DOMContentLoaded', Users());