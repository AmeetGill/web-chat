import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/materialize-css/dist/css/materialize.min.css';
import 'react-virtualized/styles.css'
import 'antd/dist/antd.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware} from 'redux';
import reducers from './reducers';
import reduxThunk from 'redux-thunk';
import { unregister } from './registerServiceWorker';
const store = createStore(reducers,{},applyMiddleware(reduxThunk));

ReactDOM.render(<Provider store = {store}><App /></Provider>, document.getElementById('root'));
unregister();