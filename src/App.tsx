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
import UpdateService from './pages/Service/UpdateService';
import ServiceRequests from './pages/Service/ServiceRequests';
import ViewMore from './pages/Service//ViewMore';
import UserList from './pages/admin/UserList';
import MyProfile from './pages/Settings';
import Rental from './pages/Rental/Rental';
import Category from './pages/Rental/Category';
import AddRental from './pages/Rental/AddRental';
import Booking from './pages/Booking/Booking';
import AddBooking from './pages/Booking/AddBooking';
import AddCategory from './pages/Rental/AddCategory';
import ViewRental from './pages/Rental/ViewRental';
import DatePicker from './pages/DatePicker';
import Loader from './common/Loader'; 
import routes from './routes';

import {AuthProvider } from './js/auth/auth';
import {RequireAuth} from './js/auth/RequireAuth';

 import axios from 'axios' //${apiUrl}

const verifyUrl= 'http://localhost:3005/user/verify';

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
    if( (token=== null) &&(window.location.href.split("?time_samp=")[1] ==undefined)){
       navigate('/auth/signin') 
        
        }
  
      
    setTimeout(() => setLoading(false), 1000);
    
   
  }, []);

  useEffect(() => {
    verify()
      
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
          <Route path='/view/more/:id?' element={<RequireAuth><ViewMore/></RequireAuth>}></Route>
          <Route path='/service-request' element={<RequireAuth><ServiceRequests/></RequireAuth>}></Route>
          <Route path='/service/edit/:id?' element={<RequireAuth><EditServices/></RequireAuth>}></Route>
          <Route path='/update/service/:id?' element={<RequireAuth><UpdateService/></RequireAuth>}></Route>
          <Route path='/rental' element={<RequireAuth><Rental/></RequireAuth>}></Route>
          <Route path='/category' element={<RequireAuth><Category/></RequireAuth>}></Route>
          <Route path='/add/rental' element={<RequireAuth><AddRental/></RequireAuth>}></Route>
          <Route path='/view/rental' element={<RequireAuth><ViewRental/></RequireAuth>}></Route>
          <Route path='/add/rental/:id?' element={<RequireAuth><AddRental/></RequireAuth>}></Route>
          <Route path='/add/category' element={<RequireAuth><AddCategory/></RequireAuth>}></Route>
          <Route path='/add/category/:id?' element={<RequireAuth><AddCategory/></RequireAuth>}></Route>
          <Route path='/booking' element={<RequireAuth><Booking/></RequireAuth>}></Route>
          <Route path='/add/booking/:id?' element={<RequireAuth><AddBooking/></RequireAuth>}></Route>
          <Route path='/add/booking/:id?' element={<RequireAuth><AddBooking/></RequireAuth>}></Route>

          <Route path='/date' element={<RequireAuth><DatePicker/></RequireAuth>}></Route>
                
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
