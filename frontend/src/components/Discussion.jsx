import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Thought from "./Thought";
import { useEffect, useState } from "react";
import axios from "axios";

const Discussion = () => {
  const [thoughts, setThoughts] = useState([]);
  const [newThought, setNewThought] = useState('');
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/discussion/get');
        if (response.data.success) {
          setThoughts(response.data.discussions || []); // Ensure it's an array
        } else {
          console.error('Failed to fetch thoughts:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching thoughts:', error);
      }
    };
    fetchThoughts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      thought: newThought,
      user: user?._id,
    };

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/discussion/discussionpost',
        dataToSend,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (response?.data?.success) {
        setThoughts([...thoughts, response.data.discussion]);
        setNewThought('');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-center font-bold uppercase">
        Share <span className="text-cyan-400">Your Thoughts</span> here
      </h1>
      <div className="text-center">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newThought}
            onChange={(e) => setNewThought(e.target.value)}
            placeholder="What's on your mind?"
            required
            className="rounded-md border border-x-violet-950 text-black"
          />
          <button type="submit" className="rounded bg-slate-700 text-white w-10">
            Post
          </button>
        </form>
      </div>
      <div>
        {Array.isArray(thoughts) && thoughts.length > 0 ? (
          thoughts.map((thought) => (
            <Thought
              key={thought._id}
              thought={thought}
              user={user}
              setThoughts={setThoughts}
              thoughts={thoughts}
            />
          ))
        ) : (
          <p>No thoughts to display</p>
        )}
      </div>
    </div>
  );
};

export default Discussion;
