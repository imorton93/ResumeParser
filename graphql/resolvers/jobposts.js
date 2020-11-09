const { AuthenticationError, UserInputError } = require('apollo-server');
const JobPost = require('../../models/JobPost');
const checkAuth = require('../../util/authenticators');
module.exports= {
    Query:{
        async getJobPosts(){
            try{
                const jobposts = await JobPost.find().sort({ createdAt: -1 });
                return jobposts;
            } catch(err){
                throw new Error(err);
            }
        },
        async getJobPost(_, {postId}){
            try{
                const jobPost = await JobPost.findById(postId);
                if(jobPost){
                    return jobPost;
                }
                else{
                    throw new Error('Job post not found')
                }
            } catch(err){
                throw new Error(err);
            }
        }
    },
    Mutation:{
        async createJobPost(_, { body, company, salary, title, location }, context) {
            const user = checkAuth(context);
      
            if (body.trim() === '') {
              throw new Error('Post body must not be empty');
            }
            if (company.trim() === '') {
              throw new Error('Company field must not be empty');
            }
            if (salary.trim() === '') {
              throw new Error('Salary must not be empty');
            }
            if (title.trim() === '') {
              throw new Error('Title must not be empty');
            }
            if (location.trim() === '') {
              throw new Error('Location must not be empty');
            }
      
            const newJobPost = new JobPost({
              body,
              company,
              salary,
              title,
              location,
              user: user.id,
              username: user.username,
              createdAt: new Date().toISOString()
            });
      
            const jobPost = await newJobPost.save();
      
            return jobPost;
        },
        async deleteJobPost(_, { postId }, context) {
            const user = checkAuth(context);
      
            try {
              const jobPost = await JobPost.findById(postId);
              if (user.username === jobPost.username) {
                await jobPost.delete();
                return 'Post deleted successfully';
              } else {
                throw new AuthenticationError('Action not allowed');
              }
            } catch (err) {
              throw new Error(err);
            }
        }
    }
}