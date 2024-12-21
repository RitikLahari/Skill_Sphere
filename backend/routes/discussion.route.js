import express from 'express';
import {  addComment, createDiscussionPost, discussionDelete, getallpost } from '../controllers/discussion.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';


const router = express.Router();

router.route('/discussionpost').post( createDiscussionPost);
router.route('/get').get( getallpost);
router.route('/discussion/:id/comment').post(addComment);
router.route('/discussion/:id').delete(discussionDelete);

export default router;
 