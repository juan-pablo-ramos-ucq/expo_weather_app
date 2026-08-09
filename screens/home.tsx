import { useContext, useState } from 'react';
import EmptyState from '../components/EmptyState';
import Header from '../components/header';
import ProfileSheet from '../components/ProfileSheet';
import SearchBar from '../components/SearchBar';
import { UserContext } from '../contexts/UserContext';

const dummyUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format';

export default function Home() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useContext(UserContext);

    return (
      <>
        <Header imgUrl={user?.photo ? user?.photo : dummyUrl} onOpen={() => setProfileOpen(true)}/>
        <SearchBar />
        <EmptyState />
        <ProfileSheet
          user={user}
          onClose={() => setProfileOpen(false)}
          visible={profileOpen}
        />
      </>
    );
}


