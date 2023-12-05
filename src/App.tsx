import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes,useNavigate, useLocation  } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Product from './pages/Product/Product';
import Settings from './pages/Settings./Settings';
import Services from './pages/Service/Services';
import AddServices from './pages/Service/AddServices';
import EditServices from './pages/Service/EditServices';
import UserList from './pages/admin/UserList';
import MyProfile from './pages/Settings';
import Loader from './common/Loader';
import routes from './routes';

import {AuthProvider } from './js/auth/auth';
import {RequireAuth} from './js/auth/RequireAuth';

 import axios from 'axios' //${apiUrl}

const verifyUrl= 'https://baatestapi.hash.mv/user/verify';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const token= localStorage.getItem('token');
  const verify = async()=>{
   
      if(token==='undefined' || token===undefined || token=== null || !token ){
       return;
     }
    const requestBody={
       email:localStorage.getItem('email'),
       token:token
    }
    const requestConfig = {
      headers: {
        'token': localStorage.getItem('token'),
        'uu_id': localStorage.getItem('uuID')
  
      }
    }
   await axios.post(verifyUrl,requestBody,requestConfig).then(response=>{
    }).catch(error=>{
      localStorage.clear();
      console.log(error)
        })

  }

  useEffect(() => {
   if( (token=== null)){
         navigate('/auth/signin') 
       
       }
    setTimeout(() => setLoading(false), 1000);
    
   
  }, []);

  useEffect(() => {
    verify()
      // if( (token=== null) && (sign_up===null)){
      //    navigate('/auth/signin') 
         
      //  }
      //  if(sign_up !=null){
      //   navigate('/auth/signup') 
        
      // }
       
  
    
  }, [location]);
  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      /> 
       <AuthProvider>
       <Routes>
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route element={<DefaultLayout />}>
          <Route index element={<ECommerce />} /> 
          <Route path='/products' element={<RequireAuth><Product/></RequireAuth>}></Route>
          <Route path='/calendar' element={<RequireAuth><Calendar/></RequireAuth>}></Route>
          <Route path='/myprofile' element={<RequireAuth><MyProfile/></RequireAuth>}></Route>
          <Route path='/user-list' element={<RequireAuth><UserList/></RequireAuth>}></Route>
          <Route path='/setting' element={<RequireAuth><Settings/></RequireAuth>}></Route>
          <Route path='/service' element={<RequireAuth><Services/></RequireAuth>}></Route>
          <Route path='/add/service' element={<RequireAuth><AddServices/></RequireAuth>}></Route>
          <Route path='/service/edit/:id?' element={<RequireAuth><EditServices/></RequireAuth>}></Route>

          {routes.map((routes, index) => {
            const { path, component: Component } = routes;
            return (
              <Route
                key={index}
                path={path}
                element={
                  <Suspense fallback={<Loader />}>
                    <Component />
                  </Suspense>
                }
              />
            );
          })}
        </Route>
      </Routes>
       </AuthProvider>
      
    </>
  );
}

export default App;
