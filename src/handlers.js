/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const allBooks = require('./books');

const saveBook = (request, h) => {
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;

  if (pageCount === readPage) {
    finished = true;
  }

  const newBook = {
    name, year, author, summary, publisher, pageCount, readPage, finished, reading, id, insertedAt, updatedAt,
  };

  allBooks.push(newBook);

  const isSuccess = allBooks.filter((book) => book.id === id).length > 0;

  if (!name) {
    const index = allBooks.findIndex((book) => book.id === id);
    if (index !== -1) {
      allBooks.splice(index, 1);
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
  };

  if (readPage > pageCount) {
    const index = allBooks.findIndex((book) => book.id === id);
    if (index !== -1) {
      allBooks.splice(index, 1);
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
  }

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  };

  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku',
  });
  response.code(500);
  return response;
};

const getBooks = (request, h) => {
  const {name, reading, finished} = request.query;

  const spesificBooks = allBooks.map((allBooks) => ({
    id: allBooks.id,
    name: allBooks.name,
    publisher: allBooks.publisher,
  }));

  if (name !== undefined) {
    const filterBooks = (array, name) => {
      return array.filter((x) => x.name.toLowerCase().includes(name.toLowerCase()));
    };

    const books = filterBooks(spesificBooks, name);

    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }

  if (reading == 1) {
    const filterBooks = allBooks.filter((book) => book.reading === true);
    const books = filterBooks.map((filterBooks) => ({
      id: filterBooks.id,
      name: filterBooks.name,
      publisher: filterBooks.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  } else if (reading == 0) {
    const filterBooks = allBooks.filter((book) => book.reading === false);
    const books = filterBooks.map((filterBooks) => ({
      id: filterBooks.id,
      name: filterBooks.name,
      publisher: filterBooks.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  } else if (finished == 1) {
    const filterBooks = allBooks.filter((book) => book.finished === true);
    const books = filterBooks.map((filterBooks) => ({
      id: filterBooks.id,
      name: filterBooks.name,
      publisher: filterBooks.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  } else if (finished == 0) {
    const filterBooks = allBooks.filter((book) => book.finished === false);
    const books = filterBooks.map((filterBooks) => ({
      id: filterBooks.id,
      name: filterBooks.name,
      publisher: filterBooks.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }

  const books = spesificBooks;

  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200);
  return response;
};

const getBookById = (request, h) => {
  const {id} = request.params;

  const book = allBooks.filter((n) => n.id === id) [0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBook = (request, h) => {
  const {id} = request.params;

  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
  const updatedAt = new Date().toISOString();

  const index = allBooks.findIndex((book) => book.id === id);

  if (index !== -1) {
    allBooks[index] = {
      ...allBooks[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    };

    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBook = (request, h) => {
  const {id} = request.params;
  const index = allBooks.findIndex((book) => book.id === id);

  if (index !== -1) {
    allBooks.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  };

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};


module.exports = {saveBook, getBooks, getBookById, updateBook, deleteBook};
