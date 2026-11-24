import { useState, useEffect } from 'react'
import './App.css'
import BookList from './components/BookList'
import BookDetail from './components/BookDetail'
import BookCreate from './components/BookCreate'
import BookEdit from './components/BookEdit'
import AiCover from './components/AiCover'

const API_URL = 'http://localhost:3000/books'
const BOOKS_PER_PAGE = 8

function App() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('전체')
  const [selectedId, setSelectedId] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editBook, setEditBook] = useState(null)
  const [lightTheme, setLightTheme] = useState('sage')
  const [view, setView] = useState('library')
  const [page, setPage] = useState(1)
  
  
  

  

  const selectLightTheme = (nextTheme) => {
    setLightTheme(nextTheme)
    
  }

  // 도서 목록 조회
  useEffect(() => {
    const controller = new AbortController()

    const fetchBooks = async () => {
      try {
        const response = await fetch(API_URL, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`도서 목록 조회 실패 (${response.status})`)
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error('도서 목록 응답 형식 오류')
        }

        if (!controller.signal.aborted) {
          setBooks(data)
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('도서 조회 오류:', error)
          setListError(true)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchBooks()

    return () => controller.abort()
  }, [])

  // 도서 등록
  const handleCreate = async (newBook) => {
    const now = new Date().toISOString()

    const bookData = {
      ...newBook,
      likes: 0,
      liked: false,
      createdAt: now,
      updatedAt: now
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
      })

      if (!response.ok) {
        throw new Error('도서 등록 실패')
      }

      const data = await response.json()
      setBooks([...books, data])
      setShowCreate(false)

      alert('도서가 등록되었습니다.')
    } catch (error) {
      console.log('도서 등록 오류:', error)
      alert('도서 등록에 실패했습니다. 서버 연결을 확인해주세요.')
    }
  }

  // 도서 수정
  const handleUpdate = async (id, updateBook) => {
    const now = new Date().toISOString()

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...updateBook,
          updatedAt: now
        })
      })

      if (!response.ok) {
        throw new Error('도서 수정 요청 실패')
      }

      const data = await response.json()

      setBooks((prevBooks) => prevBooks.map((book) =>
        book.id === id ? data : book
      ))
      setEditBook(null)

      alert('도서 정보가 수정되었습니다.')
    } catch (error) {
      console.log('도서 수정 오류:', error)
      alert('도서 수정에 실패했습니다. 다시 시도해 주세요.')
    }
  }

  // 도서 삭제
  const handleDelete = async (id) => {
    const result = window.confirm('정말 삭제하시겠습니까?')

    if (!result) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('도서 삭제 요청 실패')
      }

      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id))
      setSelectedId(null)

      alert('도서가 삭제되었습니다.')
    } catch (error) {
      console.log('도서 삭제 오류:', error)
      alert('도서 삭제에 실패했습니다. 다시 시도해 주세요.')
    }
  }

  // AI 표지 저장
  const handleCoverSave = async (id, imageSrc) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coverImageUrl: imageSrc
        })
      })

      if (!response.ok) {
        throw new Error('표지 저장 요청 실패')
      }

      const data = await response.json()

      setBooks((prevBooks) => prevBooks.map((book) =>
        book.id === id ? data : book
      ))

      alert('AI 표지가 저장되었습니다.')
    } catch (error) {
      console.log('표지 저장 오류:', error)
      alert('표지 저장에 실패했습니다. 서버 연결을 확인해주세요.')
    }
  }

  // 좋아요 변경
  const handleLike = async (book) => {
    let newLikes = book.likes
    let newLiked = book.liked

    if (book.liked) {
      newLikes = book.likes - 1
      newLiked = false
    } else {
      newLikes = book.likes + 1
      newLiked = true
    }

    try {
      const response = await fetch(`${API_URL}/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          likes: newLikes,
          liked: newLiked
        })
      })

      const data = await response.json()

      const newBooks = books.map((item) => {
        if (item.id === book.id) {
          return data
        }

        return item
      })

      setBooks(newBooks)
    } catch (error) {
      console.log('좋아요 오류:', error)
    }
  }

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.includes(search) ||
      book.author.includes(search)

    const matchesType =
      typeFilter === '전체' ||
      book.type === typeFilter

    return matchesSearch && matchesType
  })

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / BOOKS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pagedBooks = filteredBooks.slice(
    (currentPage - 1) * BOOKS_PER_PAGE,
    currentPage * BOOKS_PER_PAGE
  )

  const popularBooks = [...books]

  popularBooks.sort((a, b) => {
    return b.likes - a.likes
  })

  const selectedBook = books.find((book) => {
    return book.id === selectedId
  })

  return (
   <div className="app-layout" data-theme={lightTheme}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">B</span>
          <span>Bookworm</span>
        </div>

        <nav className="side-menu">
          <button
            className={view === 'library' ? 'active' : ''}
            onClick={() => setView('library')}
          >
            ▤ Library
          </button>

          <button
            className={view === 'ai' ? 'active' : ''}
            onClick={() => setView('ai')}
          >
            ✧ AI Integration
          </button>

          <button>
            ⚙︎ Settings
          </button>

        
        </nav>
      </aside>

      {view === 'ai' && (
        <main className="main-content">
          <AiCover books={books} onCoverSave={handleCoverSave} />
        </main>
      )}

      {view === 'library' && (
      <main className="main-content">
        <header className="top-header">
          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="제목 또는 작가 검색"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>

          <select
            className="filter-button"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value)
              setPage(1)
            }}
          >
            <option value="전체">전체 종류</option>

            {/* 문학 및 장르소설 */}
            <option value="일반 소설">일반 소설</option>
            <option value="로맨스">로맨스</option>
            <option value="판타지 / 무협">판타지 / 무협</option>
            <option value="추리 / 미스터리 / 스릴러">추리 / 미스터리 / 스릴러</option>
            <option value="공포 / 호러 / 오컬트">공포 / 호러 / 오컬트</option>
            <option value="SF">SF</option>
            <option value="라이트노벨">라이트노벨</option>
            <option value="시 / 희곡">시 / 희곡</option>
            <option value="에세이">에세이</option>

            {/* 인문 및 지식 분야 */}
            <option value="경제 / 경영 / 재테크">경제 / 경영 / 재테크</option>
            <option value="자기계발">자기계발</option>
            <option value="인문 / 철학 / 역사">인문 / 철학 / 역사</option>
            <option value="사회 / 정치">사회 / 정치</option>
            <option value="과학 / 기술">과학 / 기술</option>

            {/* 문화 및 생활 */}
            <option value="예술 / 대중문화">예술 / 대중문화</option>
            <option value="실용 / 취미">실용 / 취미</option>
            <option value="여행">여행</option>
            <option value="만화 / 웹툰">만화 / 웹툰</option>
            <option value="어린이 / 청소년">어린이 / 청소년</option>
            <option value="기타">기타</option>
          </select>

          
        </header>

        <section className="page-title">
          <div>
            <span className="breadcrumb">My Library / Books</span>
            <h1>My Library</h1>
            <p>나만의 책을 관리하는 공간입니다.</p>
          </div>

          <span className="total-books">{books.length} Books</span>
        </section>

        <section className="popular-section">
          <div className="section-title">
            <div>
              <h2>Popular Books</h2>
              <p>좋아요가 많은 인기 도서 TOP 3</p>
            </div>

            <span className="top-label">TOP 3</span>
          </div>

          <div className="popular-list">
            {popularBooks.slice(0, 3).map((book, index) => (
              <div className="popular-card" key={book.id}>
                <span className="popular-rank">0{index + 1}</span>

                <div className="popular-cover">
                  {book.coverImageUrl ? (
                    <img src={book.coverImageUrl} alt={book.title} />
                  ) : (
                    <span>📖</span>
                  )}
                </div>

                <div className="popular-info">
                  <strong>{book.title}</strong>
                  <small>{book.author}</small>
                </div>

                <span className="popular-like">♥ {book.likes}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="library-section">
          <div className="section-title">
            <div>
              <h2>My Books ({filteredBooks.length})</h2>
              <p>내 서재에 등록된 도서 목록</p>
            </div>

            <button
              className="save-button"
              onClick={() => setShowCreate(true)}
              style={{ padding: '10px 18px', border: 'none', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}
            >
              + New Book
            </button>
          </div>

          {loading ? (
  <p className="empty-message" role="status">
    도서 목록을 불러오는 중입니다.
  </p>
) : listError ? (
  <p className="empty-message" role="alert">
    도서 목록을 불러오지 못했습니다. 서버가 실행 중인지 확인해 주세요.
  </p>
) : (
  <>
    {books.length === 0 && (
      <p className="empty-message">등록된 도서가 없습니다.</p>
    )}

    {books.length > 0 && filteredBooks.length === 0 && (
      <p className="empty-message">검색 조건에 맞는 도서가 없습니다.</p>
    )}

    <BookList
      books={pagedBooks}
      onSelect={setSelectedId}
      onLike={handleLike}
    />

    {totalPages > 1 && (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '30px' }}>
        <button
          className="filter-button"
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹ 이전
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
          <button
            key={number}
            className="filter-button"
            onClick={() => setPage(number)}
            style={number === currentPage ? { background: 'var(--main-dark)', color: 'white' } : undefined}
          >
            {number}
          </button>
        ))}

        <button
          className="filter-button"
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음 ›
        </button>
      </div>
    )}
  </>
)}
        </section>
      </main>
      )}

      {showCreate && (
        <BookCreate
          onCreate={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {selectedBook && !editBook && (
        <BookDetail
          book={selectedBook}
          onClose={() => setSelectedId(null)}
          onEdit={() => setEditBook(selectedBook)}
          onDelete={() => handleDelete(selectedBook.id)}
        />
      )}

      {editBook && (
        <BookEdit
          book={editBook}
          onUpdate={handleUpdate}
          onCancel={() => setEditBook(null)}
        />
      )}
    </div>
  )
}

export default App