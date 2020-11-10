import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/graphql';
import MyPopup from '../util/MyPopup';

function DeleteButton({ postId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation =  DELETE_POST_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      data.getJobPosts = data.getJobPosts.filter((p) => p.id !== postId);
      console.log(data);
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      if (callback) callback();
    },
    variables: {
      postId
    }
  });
  return (
    <>
      <MyPopup content={'Delete post'}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deleteJobPost(postId: $postId)
  }
`;


export default DeleteButton;