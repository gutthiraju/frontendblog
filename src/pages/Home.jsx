import React, { useEffect, useContext, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import HomePosts from "../components/HomePost";
import Footer from "../components/Footer";
import { URL } from "../url";
import { Link, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import { UserContext } from "../context/UserContext";

function Home() {
  const { search } = useLocation();
  const { user } = useContext(UserContext);

  const [posts, setPosts] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [cat, setCat] = useState([]);
  const [loader, setLoader] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // ✅ Stable API function
  const fetchPosts = useCallback(async () => {
    setLoader(true);
    try {
      const res = await axios.get(`${URL}/api/posts${search}`);

      const data = res.data || [];

      setPosts(data);
      setFilterData(data);

      // ✅ Extract unique categories
      const categories = new Set();
      data.forEach((post) => {
        post.categories?.forEach((c) => categories.add(c));
      });

      setCat([...categories]);

      setNoResults(data.length === 0);
    } catch (err) {
      console.log("Fetch error:", err);
      setNoResults(true);
    } finally {
      setLoader(false);
    }
  }, [search]);

  // ✅ Proper useEffect
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ✅ Safe filter
  const filterPosts = (category) => {
    const newPosts = posts.filter((pos) =>
      pos?.categories?.includes(category)
    );
    setFilterData(newPosts);
  };

  // ✅ Reset filter
  const showAllPosts = () => {
    setFilterData(posts);
  };

  return (
    <div>
      <Navbar />

      <div>
        {/* ✅ Category Buttons */}
        <div className="flex flex-wrap justify-center p-3 m-5">
          
          {/* 🔥 All Button */}
          <button
            className="p-3 m-2 h-[90px] w-[150px] border text-lg font-semibold bg-gray-200 hover:shadow-blue-200 shadow shadow-black"
            onClick={showAllPosts}
          >
            All
          </button>

          {cat.length > 0 &&
            cat.map((category) => (
              <button
                key={category}
                className="p-3 m-2 h-[90px] w-[150px] border text-lg font-semibold bg-white hover:shadow-blue-200 shadow shadow-black"
                onClick={() => filterPosts(category)}
              >
                {category}
              </button>
            ))}
        </div>

        {/* ✅ Posts Section */}
        <div className="flex flex-wrap w-[95%] justify-center">
          
          {loader && <Loader />}

          {!loader && !noResults &&
            filterData.map((post) => (
              <div
                key={post._id}
                className="flex flex-wrap m-2 sm:w-[35vh] lg:w-[45vw] md:w-[50vw]"
              >
                <Link to={user ? `/posts/post/${post._id}` : "/login"}>
                  <HomePosts post={post} />
                </Link>
              </div>
            ))}

          {!loader && noResults && (
            <h3 className="text-center font-bold mt-16">
              No posts available
            </h3>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;