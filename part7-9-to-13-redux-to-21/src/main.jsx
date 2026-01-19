import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import store from './reducers/store'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <div class="container">
            <App />
        </div>
    </Provider>
)
