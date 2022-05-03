import React from 'react';
import { Link } from 'react-router-dom';
import Note from './Note';
import styled from 'styled-components';

const NoteWrapper = styled.div`
  max-width: 100%;
  margin: 0 auto;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #f5f4f0;
`;

const NoteFeed = ({ notes }) => {
  return (
    <div>
      {notes.map(note => (
        <NoteWrapper key={note.id}>
          <Note note={note} />
          <Link to={`note/${note.id}`}>Read more</Link>
        </NoteWrapper>
      ))}
    </div>
  );
};

export default NoteFeed;
