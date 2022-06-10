const $app = document.getElementById('app')
const $items = document.getElementById('items')
const $observe = document.getElementById('observe')
const API = 'https://api.escuelajs.co/api/v1/products'

/* Pagination Variables */
const defaultOffset = '180'
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
    console.log(key, value)
    localStorage.setItem(key, value)
  },
  getLocalStore: key => localStorage.getItem(key),
  clear: () => localStorage.clear(),
}

/* LocalStorage END */

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      let products = response
      let output = products.map(product => {
        const {images, description} = product
        const card = productCard(product)
        // template
        let newItem = document.createElement('section')
        newItem.classList.add('Item')
        newItem.innerHTML = card
        $items.appendChild(newItem)
        return product
      })
      console.log({output, size: output.length})
    })
    .catch(error => console.log(error))
}

const loadData = async ({offset, limit}) => {
  try {
    await getData(`${API}?offset=${offset}&limit=${limit}`)
    const pagination = store.getLocalStore('pagination')
    if (Number(pagination) <= 200) return
    intersectionObserver.disconnect()
    messageAllProductsGetted()
  } catch (error) {}
}

const intersectionObserver = new IntersectionObserver(
  entries => {
    // logic...
    const pagination = store.getLocalStore('pagination') ?? defaultOffset
    const nextPagination = Number(pagination) + LIMIT
    loadData({
      offset: pagination,
      limit: LIMIT,
    })

    console.log({pagination, newPagination: nextPagination})

    store.setLocalStore({key: 'pagination', value: nextPagination})
    console.log('Look')
  },
  {
    rootMargin: '0px 0px 100% 0px',
  },
)

intersectionObserver.observe($observe)

/* RESTart LOCAl */
window.addEventListener('beforeunload', event => {
  store.clear()
})

window.onunload = function (e) {
  store.clear()
}
