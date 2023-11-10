import {Routes, Route} from 'react-router-dom'

import './App.css';

import Chat from './component/Chat'
import Layout from './layout/Layout'
import Register from './auth/Register'
import Login from './auth/Login'
import PersistLogin from './layout/PersistLogin'

function App() {
  return (
    <div className="App">
      <Routes path='/' element={<Layout/>}>
        <Route element={<PersistLogin/>}>
          <Route index element={<Chat/>}/>
        </Route> {/*end persist login */}

        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes> {/* end path='/' */}
      
    </div>
  );
}

export default App;
