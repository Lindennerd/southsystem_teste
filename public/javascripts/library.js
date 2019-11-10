function library() {
    const self = this;
    self.$bookList = document.querySelector('#books-list');
    self.$newBookForm = document.querySelector('#new-book-form');
    self.$newBookBtn = document.querySelector('#new-book-button');
    self.$bookTemplate = document.querySelector('#book-template');
    self.$bookCover = document.querySelector('#bookCover');
    self.$bookCoverPreview = document.querySelector('#book-cover-preview');
    self.fileBase64 = null;

    async function getBooks() {
        while (self.$bookList.firstChild) {
            self.$bookList.removeChild(self.$bookList.firstChild);
        }

        const response = await fetch('/books');
        if (response.status === 200) {
            self.books = await response.json();
            loadBooks();
        }
    }

    function loadBooks() {

        if (self.books.length > 0) {
            
            self.books.forEach(book => {
                const clone = document.importNode($bookTemplate.content, true);

                clone.querySelector('.card-image img').setAttribute('src', book.bookCover
                    ? book.bookCover : 'https://via.placeholder.com/150')
                clone.querySelector('.card-title').textContent = book.bookTitle;
                clone.querySelector('#book-author').textContent += ' ' + book.bookAuthor;
                clone.querySelector('#book-year').textContent += ' ' + book.bookYear;
                clone.querySelector('#book-isbn').textContent += ' ' + book.bookISBN;
                clone.querySelector('#book-category').textContent += ' ' + book.bookCategory;
                clone.querySelector('.card-action').setAttribute('data-id', book.id);

                clone.querySelector('#add-to-favs').onclick = addToFavs;
                clone.querySelector('#edit-book').onclick = editBook;
                clone.querySelector('#delete-book').onclick = deleteBook;

                self.$bookList.appendChild(clone);
            });
        }
    }

    function addToFavs() {
        if(!auth().user) {
            auth().displayLoginModal(true); /* warn the user */
        }
    }

    async function saveNewBook() {
        if (formIsValid(self.$newBookForm)) {
            const headers = auth().getAuthHeaders();
            const data = getFormAsJson($newBookForm);
            data.bookCover = self.fileBase64;
            const response = await fetch('/books', {
                method: data.id === '' ? 'POST' : 'PUT',
                body: JSON.stringify(data),
                headers: headers
            });

            if (response.status === 200) {
                M.toast({ html: 'Livro salvo com sucesso', classes: 'green', displayLength: 4000 });
                $newBookForm.reset();
                getBooks();
            } else {
                M.toast({ html: 'Ocorreu um erro ao salvar o livro', classes: 'red', displayLength: 4000 });
            }

        } else {
            M.toast({ html: 'Preencha todos campos obrigatórios', classes: 'red', displayLength: 4000 });
        }
    }

    async function editBook(e) {
        const editingId = e.target.parentElement.getAttribute('data-id');
        const editingBook = self.books.find(book => { return book.id === editingId });
        if (editingBook) {
            self.$newBookForm.querySelector('#id').value = editingBook.id;
            self.$newBookForm.querySelector('#bookTitle').value = editingBook.bookTitle;
            self.$newBookForm.querySelector('#bookISBN').value = editingBook.bookISBN;
            self.$newBookForm.querySelector('#bookCategory').value = editingBook.bookCategory;
            self.$newBookForm.querySelector('#bookYear').value = editingBook.bookYear;
            self.$newBookForm.querySelector('#bookAuthor').value = editingBook.bookAuthor;

            self.newBookModal[0].open();
        }
    }

    async function deleteBook(e) {
        const deletingId = e.target.parentElement.getAttribute('data-id');
        const response = await fetch('/books', {
            method: 'DELETE',
            body: JSON.stringify({'id': deletingId}),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });

        if(response.status === 200) {
            M.toast({ html: 'Excluido com sucesso', classes: 'green', displayLength: 4000 });
            getBooks();
        } else {
            M.toast({ html: 'Ocorreu um erro', classes: 'red', displayLength: 4000 });
        }
    }


    function displayCoverPreview(e) {
        if (e.target.files && e.target.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $bookCoverPreview.setAttribute('src', e.target.result);
                self.fileBase64 = e.target.result;
            }

            reader.readAsDataURL(e.target.files[0]);
        }
    }


    var elems = document.querySelectorAll('#new-book');
    self.newBookModal = M.Modal.init(elems);

    var elems = document.querySelectorAll('#new-user');
    self.newUserModal = M.Modal.init(elems);

    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);

    var elems = document.querySelectorAll('.tabs');
    M.Tabs.init(elems);

    var elems = document.querySelectorAll('.tooltipped');
    M.Tooltip.init(elems);

    self.$bookCover.onchange = displayCoverPreview;
    self.$newBookBtn.onclick = saveNewBook;

    getBooks();
}

window.addEventListener('DOMContentLoaded', library());