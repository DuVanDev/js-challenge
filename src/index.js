const $app = document.getElementById('app')
const $observe = document.getElementById('observe')
const API = 'https://api.escuelajs.co/api/v1/products'

/* Pagination Variables */
const defaultOffset = '5'
const LIMIT = 10

/* Message All products */

const messageAllProductsGetted = () => {
  const message = ` 
    😁 All products were loaded
`
  let messageSpan = document.createElement('p')
  messageSpan.classList.add('loaded-message')
  messageSpan.innerHTML = message
  $app.appendChild(messageSpan)
}

/* Message All products END */

/* Pagination Variables END */

const productCard = ({images, description, price, title}) => {
  return `
    <article class="Card">
      <img src='${images[0]}' alt='${title}' />
      <h2>
        ${title}
        <small>$ ${price}</small>
      </h2>

        <h2
        <p>
          ${description}
        </p>
    </article>
  `
}

/* LocalStorage */

const store = {
  setLocalStore: ({key, value}) => {
    localStorage.setItem(key, value)
  },
  getLocalStore: key => localStorage.getItem(key),
  clear: () => localStorage.clear(),
}

/* LocalStorage END */

const getData = api => {
  return fetch(api)
    .then(response => response.json())
    .then(response => {
      return response
    })
    .catch(error => console.log(error))
}

const renderProducts = products => {
  const output = products.map(product => {
    const card = productCard(product)
    // template

    return card
  })

  let newItem = document.createElement('section')
  newItem.classList.add('Items')
  newItem.innerHTML = output.join('')
  $app.appendChild(newItem)
}

const disabledInfiniteScroll = () => {
  intersectionObserver.disconnect()
  messageAllProductsGetted()
}

const loadData = async ({offset, limit}) => {
  try {
    const response = await getData(`${API}?offset=${offset}&limit=${limit}`)
    if (!response.length) disabledInfiniteScroll()

    renderProducts(response)
    const pagination = store.getLocalStore('pagination')
  } catch (error) {
    console.error({
      error,
    })
  }
}

const intersectionObserver = new IntersectionObserver(
  entries => {
    // logic...
    entries.forEach(entry => {
      if (!entry.intersectionRatio) return

      const pagination = store.getLocalStore('pagination')
        ? Number(store.getLocalStore('pagination')) + LIMIT
        : defaultOffset
      loadData({
        offset: pagination,
        limit: LIMIT,
      })

      if (!store.getLocalStore('pagination')) {
        store.setLocalStore({key: 'pagination', value: defaultOffset})
        return
      }
      store.setLocalStore({key: 'pagination', value: pagination})
    })
  },
  {
    rootMargin: '20px 20px 100% 20px',
    threshold: 0.1,
  },
)

intersectionObserver.observe($observe)

/* Reset storage */
window.addEventListener('beforeunload', event => {
  store.clear()
})

window.onunload = function (e) {
  store.clear()
}

/* Reset storage END */
