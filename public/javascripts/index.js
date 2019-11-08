function Index() {
    const self = this;
    self.$bookList = document.querySelector('#books-list');
    self.$bookDetails = document.querySelector('#book-infos');
    self.$newBookForm = document.querySelector('#new-book-form');
    self.$saveNewBook = document.querySelector('#save-new-book');

    async function getBooks() {
        $bookList.innerHtml = '';

        const response = await fetch('/books');
        if(response.status === 200) {
            self.books = await response.json();
            loadBooks();
        }
    }

    function loadBooks() {
        if(self.books) {
            self.books.forEach(book => {
                const $bookItem = document.createElement('a');
                $bookItem.classList.add('collection-item');
                $bookItem.setAttribute('data-id', book.id);
                $bookItem.textContent = `Título: ${book.bookTitle} - Ano: ${book.bookYear}`; 
    
                $bookList.appendChild($bookItem);
            });
        }
    }

    async function saveNewBook() {
        if(newBookIsValid()) {
            const data = getFormAsJson($newBookForm);
            const response = await fetch('/books', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            if(response.status === 200) {
                M.toast({html: 'Livro salvo com sucesso', classes: 'green', displayLength: 4000})
                $newBookForm.reset();
                getBooks();
            } else {
                M.toast({html: 'Ocorreu um erro ao salvar o livro', classes: 'red', displayLength: 4000})
            }

        } else {
            M.toast({html: 'Preencha todos campos obrigatórios', classes: 'red', displayLength: 4000})
        }
    }

    function newBookIsValid() {
        let hasErrors = true;
        const inputs = self.$newBookForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            if(input.required && input.value === '') {
                hasErrors = false;
                input.parentElement.classList.add('invalid');
            }
        });

        return hasErrors;
    }

    function getFormAsJson(form) {
        const json = {};
        for(let pair of new FormData(form).entries()){
            json[pair[0]] = pair[1];
        }

        return json;
    }

    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);

    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);

    self.$saveNewBook.onclick = saveNewBook;
    
    getBooks();
}

window.addEventListener('DOMContentLoaded', Index());