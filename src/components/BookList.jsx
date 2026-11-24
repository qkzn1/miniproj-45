
function BookList({ books, onSelect, onLike }) {

  return (
    <div className="book-grid">

      {/* 등록된 도서 목록 */}
      {books.map((book) => (

        <div className="book-card" key={book.id}>

          {/* 책 표지 */}
          <div
            className="book-cover"
            onClick={() => onSelect(book.id)}
          >

            {book.coverImageUrl ? (
              <img
                src={book.coverImageUrl}
                alt={book.title}
              />
            ) : (
              <div className="cover-placeholder">
                <strong>{book.title}</strong>
                <small>{book.author}</small>
              </div>
            )}

          </div>

          {/* 책 정보 */}
          <div className="book-info">

            <h3>{book.title}</h3>

            <p>{book.author}</p>

            <span className="book-genre">
              {book.type}
            </span>
            <span style={{ float: 'right', color: 'var(--sub-text-color)', fontSize: '12px' }}>
              {book.createdAt ? new Date(book.createdAt).toLocaleDateString('ko-KR') : ''}
            </span>

            {/* 좋아요 및 상세보기 */}
            <div className="book-card-bottom">

              <button
                className={book.liked ? "like-button liked" : "like-button"}
                onClick={() => onLike(book)}
              >
                ♥ {book.likes}
              </button>

              <button
                className="detail-button"
                onClick={() => onSelect(book.id)}
              >
                상세보기
              </button>

            </div>

          </div>

        </div>

      ))}

    </div>
  )
}

export default BookList