import { useState } from 'react';
import EmptyState from './EmptyState';
import Header from './header';
import ProfileSheet from './ProfileSheet';
import SearchBar from './SearchBar';

const dummyUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format';

export default function Home() {
  const [profileOpen, setProfileOpen] = useState(false);

    return (
      <>
        <Header dummyUrl={dummyUrl} onOpen={() => setProfileOpen(true)}/>
        <SearchBar />
        <EmptyState />
        <ProfileSheet
          imageUrl={dummyUrl}
          onClose={() => setProfileOpen(false)}
          visible={profileOpen}
        />
      </>
    );
}


