import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { UserContext } from '../context/UserContext';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../url';
import HomePosts from "../components/HomePost";
import Loader from "../components/Loader";
import { Navigate } from "react-router-dom";

function MyBlogs() {
  const { search } = useLocation();
  const [posts, setPosts] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loader, setLoader] = useState(false);
  const { user } = useContext(UserContext);

  const fetchPosts = async () => {
    setLoader(true);
    try {
      const res = await axios.get(URL + "/api/posts/user/" + user._id);
      setPosts(res.data);
      setNoResults(res.data.length === 0);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user, search]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Navbar />
      <div className='px-8 md:px-[200px] min-h-[80vh]'>
        {loader ? (
          <div className='h-[40vh] flex justify-center items-center'>
            <Loader />
          </div>
        ) : !noResults ? (
          posts.map((post) => (
            <div key={post._id} className='w-[40vh] mt-5'>
              {/* Pass user and fetchPosts to HomePosts */}
              <HomePosts post={post} user={user} fetchPosts={fetchPosts} />
            </div>
          ))
        ) : (
          <h3 className='text-center font-bold mt-16'>No posts available</h3>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default MyBlogs;