import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Avatar, AvatarImage } from './ui/avatar';
import axios from 'axios';

const Thought = ({ thought, user, setThoughts, thoughts }) => {
  const [comment, setComment] = useState('');

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8000/api/v1/discussion/${thought._id}/comment`,
        { comment },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      // Update the comments locally
      const updatedThoughts = thoughts.map((t) =>
        t._id === thought._id ? { ...t, comments: [...t.comments, comment] } : t
      );
      setThoughts(updatedThoughts);
      setComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/discussion/${thought._id}`, {
        withCredentials: true,
      });

      // Remove the deleted thought from the list
      setThoughts(thoughts.filter((t) => t._id !== thought._id));
    } catch (error) {
      console.error('Error deleting thought:', error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out">
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.profile?.profilePhoto} alt={user?.profile?.fullname} />
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="p-4">
          <div className="flex gap-2 items-center">
            <Avatar className="cursor-pointer">
              <AvatarImage src={user?.profile?.profilePhoto} alt={user?.profile?.fullname} />
            </Avatar>
            <div>
              <h4 className="font-medium text-lg">{user?.profile?.fullname}</h4>
              <p className="text-sm text-gray-500">{user?.profile?.bio}</p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>

    <h3 className="text-lg font-semibold text-center">{thought.content}</h3>

    {/* Show Delete button only if the user is the owner */}
    {thought.user === user?._id && (
      <button
        className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition-all duration-200"
        onClick={handleDelete}
      >
        Delete
      </button>
    )}

    <div className="w-full">
      <ul className="space-y-2 mb-4">
        {(thought.comments || []).map((c, index) => (
          <li key={index} className="bg-gray-100 p-2 rounded-md shadow-sm text-sm">
            {c}
          </li>
        ))}
      </ul>

      <form onSubmit={handleCommentSubmit} className="flex flex-col space-y-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          required
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
        <button
          type="submit"
          className="self-end px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-all duration-200"
        >
          Comment
        </button>
      </form>
    </div>
  </div>
);
};

export default Thought;
