import React from 'react';
import { useMutation, useQuery } from '@apollo/client';

// import the NoteForm component
import NoteForm from '../components/NoteForm';
import { GET_NOTE, GET_ME } from '../gql/query';
import { EDIT_NOTE } from '../gql/mutation';

const EditNote = props => {
  // store the id found in the url as a variable
  const id = props.match.params.id;
  // define our note query
  const {
    loading: noteLoading,
    error: noteError,
    data: noteData
  } = useQuery(GET_NOTE, { variables: { id } });
  const { loading: userLoading, error: userError, data: userData } = useQuery(
    GET_ME
  );
  // define our mutation
  const [editNote] = useMutation(EDIT_NOTE, {
    variables: {
      id
    },
    onCompleted: () => {
      props.history.push(`/note/${id}`);
    }
  });

  // if the data is loading, display a loading message
  if (noteLoading || userLoading) return 'Loading...';
  // if there is an error fetching the data, display an error message
  if (noteError || userError) return <p>Error!</p>;
  // if the current user and the author of the note do not match
  if (userData.me.id !== noteData.note.author.id) {
    return <p>You do not have access to edit this note</p>;
  }

  // pass the data and mutation to the form components
  return <NoteForm content={noteData.note.content} action={editNote} />;
};

export default EditNote;

//db.getCollection("notes").update({ author: null }, { $set: { "author": ObjectId("6272d0d1d7f145d422094952") } })
