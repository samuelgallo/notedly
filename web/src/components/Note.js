import React from 'react';
import { useQuery } from '@apollo/client';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import styled from 'styled-components';

import NoteUser from './NoteUser';
import { IS_LOGGED_IN } from '../gql/query';

// Styles
const StyledNote = styled.article`
  max-width: 100%;
  margin: 0;
  /* border-bottom: 1px solid #b7b7b7;
  margin-bottom: 15px; */
`;
const MetaData = styled.div`
  @media (min-width: 500px) {
    display: flex;
    align-items: top;
  }
`;

const MetaInfo = styled.div`
  padding-right: 1rem;
`;

const UserActions = styled.div`
  margin-left: auto;
`;

const Note = ({ note }) => {
  const { loading, error, data } = useQuery(IS_LOGGED_IN);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <StyledNote>
      <MetaData>
        <MetaInfo>
          <img
            src={note.author.avatar}
            alt={note.author.username}
            height="50px"
          />
        </MetaInfo>
        <MetaInfo>
          <em>by </em> {note.author.username} <br />
          {format(note.createdAt, 'MM/DD/YYYY')}
        </MetaInfo>
        {data.isLoggedIn ? (
          <UserActions>
            <NoteUser note={note} />
          </UserActions>
        ) : (
          <UserActions>
            <em>Favorites: {note.favoriteCount}</em>
          </UserActions>
        )}
      </MetaData>
      <ReactMarkdown source={note.content} />
    </StyledNote>
  );
};

export default Note;
