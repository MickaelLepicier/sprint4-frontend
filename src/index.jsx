import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { store } from './store/store'
import { RootCmp } from './RootCmp'

import './assets/styles/main.scss'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
            <Router>
                <RootCmp />
            </Router>
        </DndProvider>
    </Provider>
)