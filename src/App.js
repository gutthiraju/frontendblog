import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Routes,Route } from "react-router-dom";
import CreatePost from "./pages/CreatePost";
import MyBlog from "./pages/MyBlogs"
import PostDetails from "./pages/postDetails";
import EditPost from "./pages/EditPost";
import Profile from "./pages/Profile";
import { UserProvider } from "./context/UserContext"; // ✅ Correct
function App() {
  return (
    <UserProvider>
   <Routes>
<Route exact path='/' element={<Home/>}/>

<Route exact path='/login' element={<Login/>}/>

<Route exact path='/register' element={<Register/>}/>

<Route exact path='/write' element={<CreatePost/>}/>

<Route exact path='/posts/post/:id' element={<PostDetails/>}/>

<Route exact path='/edit/:id' element={<EditPost/>}/>

<Route path='/myblogs/:id' element={<MyBlog/>}/>

<Route exact path='/profile/:id' element={<Profile/>}/>

</Routes>
</UserProvider>
  );
}

export default App;
